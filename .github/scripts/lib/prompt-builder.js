const fs = require('fs');
const path = require('path');

/**
 * Prompt Builder
 *
 * Builds structured prompts for AI code review.
 * Uses configuration-driven category system.
 */
class PromptBuilder {
  constructor(configPath = null) {
    // Load review categories configuration
    this.configPath = configPath || path.join(__dirname, '../config/review-categories.json');
    this.config = this.loadConfig();
  }

  /**
   * Load review categories from JSON config
   * @returns {Object} Configuration object
   */
  loadConfig() {
    try {
      const configContent = fs.readFileSync(this.configPath, 'utf-8');
      return JSON.parse(configContent);
    } catch (error) {
      console.warn(`Failed to load config from ${this.configPath}, using defaults`);
      return this.getDefaultConfig();
    }
  }

  /**
   * Get default configuration
   * @returns {Object} Default config
   */
  getDefaultConfig() {
    return {
      review: {
        categories: [
          {
            id: 'security',
            name: '安全审查',
            description: '检查安全漏洞和潜在风险',
            severity: 'critical',
            prompt_template: '从安全角度审查代码'
          },
          {
            id: 'code_quality',
            name: '代码质量',
            description: '检查代码质量和最佳实践',
            severity: 'info',
            prompt_template: '从代码质量角度审查代码'
          }
        ]
      },
      system_prompt: '你是一个专业的代码审查 AI 助手。'
    };
  }

  /**
   * Get system prompt
   * @returns {string} System prompt
   */
  getSystemPrompt() {
    return this.config.system_prompt || this.getDefaultConfig().system_prompt;
  }

  /**
   * Build review prompt
   * @param {Object} compressedPR - Compressed PR data from PRCompressor
   * @param {Object} options - Options
   * @returns {Object} Prompt object with system and user prompts
   */
  buildReviewPrompt(compressedPR, options = {}) {
    const categories = options.categories || this.config.review.categories;
    const enabledCategories = options.enabledCategories
      ? categories.filter(c => options.enabledCategories.includes(c.id))
      : categories;

    return {
      system: this.getSystemPrompt(),
      user: this.buildUserPrompt(compressedPR, enabledCategories)
    };
  }

  /**
   * Build user prompt
   * @param {Object} compressedPR - Compressed PR data
   * @param {Array} categories - Review categories
   * @returns {string} User prompt
   */
  buildUserPrompt(compressedPR, categories) {
    let prompt = '';

    // PR Information
    prompt += this.formatPRInfo(compressedPR);

    // Review Categories
    prompt += this.formatCategories(categories);

    // Code Changes
    prompt += this.formatCodeChanges(compressedPR);

    // Review Guidelines
    prompt += this.formatReviewGuidelines(categories);

    return prompt;
  }

  /**
   * Format PR information section
   * @param {Object} prData - PR data
   * @returns {string} Formatted section
   */
  formatPRInfo(prData) {
    let section = '# Pull Request 信息\n\n';
    section += `**标题**: ${prData.title || '无标题'}\n\n`;
    section += `**分支**: ${prData.headBranch || '?'} → ${prData.baseBranch || '?'}\n\n`;

    if (prData.description) {
      section += `**描述**:\n${prData.description}\n\n`;
    }

    if (prData.stats) {
      section += '**统计**:\n';
      section += `- 文件数: ${prData.stats.compressedFiles}/${prData.stats.totalFiles} (压缩后/总数)\n`;
      section += `- 新增行: ${prData.stats.includedAdditions}/${prData.stats.totalAdditions}\n`;
      section += `- 删除行: ${prData.stats.includedDeletions}/${prData.stats.totalDeletions}\n\n`;
    }

    if (prData.compressionInfo) {
      section += `*注: 由于内容较多，本次审查包含了 ${prData.compressionInfo.compressionRatio} 的文件变更*\n\n`;
    }

    section += '---\n\n';
    return section;
  }

  /**
   * Format review categories section
   * @param {Array} categories - Review categories
   * @returns {string} Formatted section
   */
  formatCategories(categories) {
    let section = '# 审查维度\n\n';

    categories.forEach(cat => {
      const emoji = this.getSeverityEmoji(cat.severity);
      section += `## ${emoji} ${cat.name}\n`;
      section += `${cat.description}\n\n`;
    });

    section += '---\n\n';
    return section;
  }

  /**
   * Get emoji for severity level
   * @param {string} severity - Severity level
   * @returns {string} Emoji
   */
  getSeverityEmoji(severity) {
    const emojis = {
      critical: '🔒',
      error: '🐛',
      warning: '⚠️',
      info: 'ℹ️',
      suggestion: '💡'
    };
    return emojis[severity] || '📋';
  }

  /**
   * Format code changes section
   * @param {Object} compressedPR - Compressed PR data
   * @returns {string} Formatted section
   */
  formatCodeChanges(compressedPR) {
    let section = '# 代码变更\n\n';

    if (!compressedPR.files || compressedPR.files.length === 0) {
      section += '没有文件变更需要审查。\n\n';
      return section;
    }

    compressedPR.files.forEach((file, index) => {
      section += `## ${index + 1}. ${file.filename}\n\n`;
      section += `**状态**: ${file.status} | **变更**: ${file.changes} 行 (${file.additions}+/${file.deletions}-)\n\n`;

      if (file.isSummary) {
        section += `*注: 此文件内容较多，显示部分内容 (共 ${file.originalLines} 行)*\n\n`;
      }

      section += '```diff\n';
      section += file.patch || '(无变更)';
      section += '\n```\n\n';
    });

    return section;
  }

  /**
   * Format review guidelines
   * @param {Array} categories - Review categories
   * @returns {string} Formatted section
   */
  formatReviewGuidelines(categories) {
    let section = '---\n\n# 审查要求\n\n';
    section += '**重要**: 请严格按照以下格式输出，每个问题必须包含代码对比示例。\n\n';
    section += '```markdown\n';
    section += '## 发现的问题 (共 N 个)\n\n';
    section += '### [严重级别] 问题标题\n';
    section += '- **位置**: `src/file.ts:42`\n';
    section += '- **问题**: [具体描述问题]\n\n';
    section += '**❌ 错误代码**:\n';
    section += '```tsx\n';
    section += '[从 diff 中提取的问题代码]\n';
    section += '```\n\n';
    section += '**✅ 正确代码**:\n';
    section += '```tsx\n';
    section += '[修复后的代码，可直接复制使用]\n';
    section += '```\n\n';
    section += '**理由**: [解释为什么这样是最佳实践，引用相关文档]\n\n';
    section += '---\n\n';
    section += '## 总体建议\n';
    section += '[整体性的架构或流程建议]\n';
    section += '```\n\n';

    section += '**审查重点**:\n';
    categories.forEach(cat => {
      section += `- **${cat.name}**: ${cat.description}\n`;
    });

    section += '\n**注意**: 不要输出"优点"部分，只输出问题。';

    return section;
  }

  /**
   * Build prompt for /describe tool
   * @param {Object} compressedPR - Compressed PR data
   * @returns {Object} Prompt object
   */
  buildDescribePrompt(compressedPR) {
    return {
      system: '你是一个专业的技术文档撰写助手。擅长理解代码变更并生成清晰的 PR 描述。',
      user: this.buildDescribeUserPrompt(compressedPR)
    };
  }

  /**
   * Build user prompt for /describe
   * @param {Object} compressedPR - Compressed PR data
   * @returns {string} User prompt
   */
  buildDescribeUserPrompt(compressedPR) {
    let prompt = '# 任务\n\n';
    prompt += '请为以下 Pull Request 生成一个清晰的描述。包括：\n';
    prompt += '1. 简洁的标题（如果需要改进）\n';
    prompt += '2. 变更摘要（1-2句话）\n';
    prompt += '3. 主要变更点（列出关键文件和改动）\n';
    prompt += '4. 建议的标签（如: bug, feature, refactor, docs 等）\n\n';

    prompt += '---\n\n';
    prompt += this.formatPRInfo(compressedPR);
    prompt += this.formatCodeChanges(compressedPR);

    prompt += '---\n\n# 输出格式\n\n';
    prompt += '```markdown\n';
    prompt += '## 建议标题\n';
    prompt += '[改进后的标题]\n\n';
    prompt += '## 变更摘要\n';
    prompt += '[1-2句话描述]\n\n';
    prompt += '## 主要变更\n';
    prompt += '- [关键变更1]\n';
    prompt += '- [关键变更2]\n\n';
    prompt += '## 建议标签\n';
    prompt += '`label1`, `label2`\n';
    prompt += '```\n';

    return prompt;
  }

  /**
   * Build prompt for /improve tool
   * @param {Object} compressedPR - Compressed PR data
   * @returns {Object} Prompt object
   */
  buildImprovePrompt(compressedPR) {
    return {
      system: '你是一个专业的代码审查和重构专家。擅长发现代码问题并提供具体的改进方案。',
      user: this.buildImproveUserPrompt(compressedPR)
    };
  }

  /**
   * Build user prompt for /improve
   * @param {Object} compressedPR - Compressed PR data
   * @returns {string} User prompt
   */
  buildImproveUserPrompt(compressedPR) {
    let prompt = '# 任务\n\n';
    prompt += '请为以下代码提供具体的改进方案。对于每个问题：\n';
    prompt += '1. 指出问题所在 (file:line)\n';
    prompt += '2. 说明为什么需要改进\n';
    prompt += '3. 提供改进后的代码示例\n\n';

    prompt += '---\n\n';
    prompt += this.formatPRInfo(compressedPR);
    prompt += this.formatCodeChanges(compressedPR);

    prompt += '---\n\n# 输出格式\n\n';
    prompt += '```markdown\n';
    prompt += '## 改进建议\n\n';
    prompt += '### 1. [问题类型]\n';
    prompt += '**位置**: `file:line`\n\n';
    prompt += '**问题**: [描述]\n\n';
    prompt += '**改进方案**:\n```typescript\n';
    prompt += '[改进后的代码]\n';
    prompt += '```\n\n';
    prompt += '```\n';

    return prompt;
  }
}

module.exports = { PromptBuilder };
