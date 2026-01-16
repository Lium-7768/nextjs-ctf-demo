const { TokenEstimator } = require('./token-estimator');
const { minimatch } = require('minimatch');

/**
 * PR Compressor
 *
 * Intelligently compresses PR content to fit within token limits.
 * Uses language prioritization and token-aware file fitting.
 */
class PRCompressor {
  constructor(options = {}) {
    this.maxTokens = options.maxTokens || 8000;
    this.languagePriority = options.languagePriority || ['ts', 'tsx', 'js', 'jsx', 'py', 'go', 'rs'];
    this.excludePatterns = options.excludePatterns || [];
    this.includePatterns = options.includePatterns || [];
    this.maxFiles = options.maxFiles || 15;
    this.tokenEstimator = new TokenEstimator();
  }

  /**
   * Main compression method
   * @param {Object} prData - PR data object
   * @returns {Object} Compressed PR data
   */
  compress(prData) {
    console.log(`📊 Starting PR compression...`);
    console.log(`   - Max tokens: ${this.maxTokens}`);
    console.log(`   - Files before filtering: ${prData.files?.length || 0}`);

    // Step 1: Filter files
    const filteredFiles = this.filterFiles(prData.files || []);
    console.log(`   - Files after filtering: ${filteredFiles.length}`);

    // Step 2: Prioritize by language
    const prioritizedFiles = this.prioritizeFiles(filteredFiles);
    console.log(`   - Top 5 files by priority:`);
    prioritizedFiles.slice(0, 5).forEach(f => {
      console.log(`     - ${f.filename} (${this.getFileLanguage(f.filename)})`);
    });

    // Step 3: Fit to token limit
    const fittedFiles = this.fitToTokenLimit(prioritizedFiles);
    console.log(`   - Files after token fitting: ${fittedFiles.length}`);

    // Step 4: Enrich with context
    const enriched = this.enrichWithContext(fittedFiles, prData);

    // Estimate final token count
    const estimatedTokens = this.tokenEstimator.estimateFiles(enriched.files);
    console.log(`✅ Compression complete. Estimated tokens: ${estimatedTokens}`);

    return enriched;
  }

  /**
   * Filter files based on exclude patterns
   * @param {Array} files - Files to filter
   * @returns {Array} Filtered files
   */
  filterFiles(files) {
    return files.filter(file => {
      // If includePatterns is specified, only include matching files
      if (this.includePatterns.length > 0) {
        const isIncluded = this.includePatterns.some(pattern => {
          return this.globMatch(pattern, file.filename);
        });
        if (!isIncluded) return false;
      }

      // Check if file should be excluded
      const isExcluded = this.excludePatterns.some(pattern => {
        return this.globMatch(pattern, file.filename);
      });

      // Exclude files with no changes
      const hasChanges = file.patch && file.patch.length > 0;

      return !isExcluded && hasChanges;
    });
  }

  /**
   * Glob pattern matching using minimatch
   * @param {string} pattern - Glob pattern to match
   * @param {string} filename - File path to test
   * @returns {boolean} Whether the file matches the pattern
   */
  globMatch(pattern, filename) {
    try {
      return minimatch(filename, pattern);
    } catch (error) {
      console.warn(`Invalid glob pattern: ${pattern}`, error.message);
      return false;
    }
  }

  /**
   * Get file language from extension
   * @param {string} filename - File name
   * @returns {string} Language extension
   */
  getFileLanguage(filename) {
    const match = filename.match(/\.(\w+)$/);
    return match ? match[1].toLowerCase() : '';
  }

  /**
   * Get language priority score
   * @param {string} language - Language extension
   * @returns {number} Priority score (higher = more important)
   */
  getLanguagePriority(language) {
    const index = this.languagePriority.indexOf(language);
    // Return inverse index so higher priority = higher score
    return index >= 0 ? (this.languagePriority.length - index) : 0;
  }

  /**
   * Prioritize files by language and changes
   * @param {Array} files - Files to prioritize
   * @returns {Array} Prioritized files
   */
  prioritizeFiles(files) {
    return files
      .map(file => ({
        ...file,
        priority: this.calculateFilePriority(file)
      }))
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Calculate file priority score
   * @param {Object} file - File object
   * @returns {number} Priority score
   */
  calculateFilePriority(file) {
    const language = this.getFileLanguage(file.filename);
    const langPriority = this.getLanguagePriority(language);

    // Factor in number of changes (more changes = higher priority)
    const changeWeight = Math.min(file.changes / 100, 1) * 10;

    // Factor in additions vs deletions (additions are more important)
    const additionRatio = file.additions / (file.changes || 1);
    const additionWeight = additionRatio * 5;

    // Bonus for files in app/ directory (main application code)
    const appDirBonus = file.filename.startsWith('app/') ? 20 : 0;

    return langPriority + changeWeight + additionWeight + appDirBonus;
  }

  /**
   * Fit files to token limit using smart truncation
   * @param {Array} files - Prioritized files
   * @returns {Array} Files that fit within token limit
   */
  fitToTokenLimit(files) {
    const result = [];
    let usedTokens = 0;

    // Reserve tokens for PR metadata and system prompt
    const reservedTokens = 500;
    const availableTokens = this.maxTokens - reservedTokens;

    for (const file of files) {
      if (result.length >= this.maxFiles) {
        console.log(`   - Reached max files limit (${this.maxFiles})`);
        break;
      }

      const fileTokens = this.tokenEstimator.estimateFilePatch(file);
      const remainingTokens = availableTokens - usedTokens;

      if (remainingTokens <= 0) {
        console.log(`   - Reached token limit`);
        break;
      }

      if (fileTokens <= remainingTokens) {
        // File fits completely
        result.push(file);
        usedTokens += fileTokens;
      } else {
        // File is too large, create a summary
        console.log(`   - File too large (${fileTokens} tokens), creating summary`);
        const summary = this.summarizeFile(file, remainingTokens);
        if (summary) {
          result.push(summary);
        }
        break;
      }
    }

    return result;
  }

  /**
   * Create a summary for a large file
   * @param {Object} file - File object
   * @param {number} availableTokens - Available tokens for summary
   * @returns {Object|null} File summary object
   */
  summarizeFile(file, availableTokens) {
    // Estimate how many lines we can include
    const lines = file.patch.split('\n');
    const avgTokensPerLine = 5;
    const maxLines = Math.floor(availableTokens / avgTokensPerLine);

    if (maxLines < 10) {
      // Not enough space for even a minimal summary
      return null;
    }

    // Take first and last portions of the diff
    const firstLines = Math.ceil(maxLines * 0.4);
    const lastLines = Math.floor(maxLines * 0.4);

    const firstPart = lines.slice(0, firstLines).join('\n');
    const lastPart = lines.slice(-lastLines).join('\n');

    const summary = `${firstPart}\n\n... [${lines.length - firstLines - lastLines} lines omitted] ...\n\n${lastPart}`;

    return {
      ...file,
      patch: summary,
      isSummary: true,
      originalLines: lines.length
    };
  }

  /**
   * Enrich compressed files with context
   * @param {Array} files - Compressed files
   * @param {Object} prData - Original PR data
   * @returns {Object} Enriched PR data
   */
  enrichWithContext(files, prData) {
    // Calculate statistics
    const stats = {
      totalFiles: prData.files?.length || 0,
      compressedFiles: files.length,
      totalAdditions: prData.files?.reduce((sum, f) => sum + (f.additions || 0), 0) || 0,
      totalDeletions: prData.files?.reduce((sum, f) => sum + (f.deletions || 0), 0) || 0,
      includedAdditions: files.reduce((sum, f) => sum + (f.additions || 0), 0),
      includedDeletions: files.reduce((sum, f) => sum + (f.deletions || 0), 0)
    };

    return {
      title: prData.title || '',
      description: prData.description || '',
      number: prData.number,
      author: prData.author,
      baseBranch: prData.baseBranch,
      headBranch: prData.headBranch,
      files,
      stats,
      compressionInfo: {
        originalFileCount: stats.totalFiles,
        compressedFileCount: stats.compressedFiles,
        compressionRatio: stats.totalFiles > 0
          ? ((stats.compressedFiles / stats.totalFiles) * 100).toFixed(1) + '%'
          : '0%'
      }
    };
  }
}

module.exports = { PRCompressor };
