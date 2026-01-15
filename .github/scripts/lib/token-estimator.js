/**
 * Token Estimator
 *
 * Estimates token counts for text content.
 * Uses a simple approximation: ~4 characters per token for English/Code.
 * For Chinese text, uses ~1.5 characters per token.
 */

class TokenEstimator {
  constructor() {
    // Average characters per token for different content types
    this.CHAR_PER_TOKEN = {
      code: 4,         // Code has more symbols, shorter tokens
      english: 4,      // English text
      chinese: 1.5,    // Chinese characters are denser
      mixed: 3         // Mixed content
    };
  }

  /**
   * Estimate token count for a string
   * @param {string} text - Text to estimate
   * @param {string} type - Content type: 'code', 'english', 'chinese', 'mixed'
   * @returns {number} Estimated token count
   */
  estimate(text, type = 'code') {
    if (!text) return 0;

    const charCount = text.length;
    const ratio = this.CHAR_PER_TOKEN[type] || this.CHAR_PER_TOKEN.code;

    return Math.ceil(charCount / ratio);
  }

  /**
   * Auto-detect content type and estimate tokens
   * @param {string} text - Text to analyze
   * @returns {number} Estimated token count
   */
  estimateAuto(text) {
    if (!text) return 0;

    // Detect if text has Chinese characters
    const hasChinese = /[\u4e00-\u9fa5]/.test(text);

    // Detect if text looks like code
    const looksLikeCode = /[\{\}\(\)\[\];=\+\-\*\/<>]/.test(text);

    if (hasChinese && looksLikeCode) {
      return this.estimate(text, 'mixed');
    } else if (hasChinese) {
      return this.estimate(text, 'chinese');
    } else if (looksLikeCode) {
      return this.estimate(text, 'code');
    } else {
      return this.estimate(text, 'english');
    }
  }

  /**
   * Estimate tokens for a file patch
   * @param {Object} file - File object with patch property
   * @returns {number} Estimated token count
   */
  estimateFilePatch(file) {
    if (!file.patch) return 0;

    // Add overhead for filename and metadata
    const metadataOverhead = this.estimateAuto(
      `## ${file.filename}\nStatus: ${file.status}\n`
    );

    const patchTokens = this.estimateAuto(file.patch);

    return metadataOverhead + patchTokens;
  }

  /**
   * Estimate tokens for multiple files
   * @param {Array} files - Array of file objects
   * @returns {number} Total estimated token count
   */
  estimateFiles(files) {
    return files.reduce((total, file) => {
      return total + this.estimateFilePatch(file);
    }, 0);
  }
}

module.exports = { TokenEstimator };
