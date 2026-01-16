const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Convert React Best Practices skill rules to code review categories
 */
class SkillToReviewConverter {
  constructor(skillsDir) {
    this.skillsDir = skillsDir;
  }

  /**
   * Parse impact level to severity
   * @param {string} impact - Impact level (HIGH, MEDIUM, LOW)
   * @returns {string} Severity level
   */
  impactToSeverity(impact) {
    const mapping = {
      'HIGH': 'critical',
      'MEDIUM': 'warning',
      'LOW': 'info'
    };
    return mapping[impact] || 'info';
  }

  /**
   * Convert skill rule file to review category
   * @param {string} filePath - Path to skill rule file
   * @returns {Object|null} Review category object
   */
  convertSkillToCategory(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data, content: body } = matter(content);

      // Skip template and sections files
      if (filePath.includes('_template') || filePath.includes('_sections')) {
        return null;
      }

      // Generate category ID from filename
      const id = path.basename(filePath, '.md');

      // Extract title from frontmatter or content
      const title = data.title || this.extractTitle(body);

      // Generate description from content
      const description = this.generateDescription(body, data);

      // Generate prompt template
      const promptTemplate = this.generatePromptTemplate(body, data);

      return {
        id,
        name: title,
        description,
        severity: this.impactToSeverity(data.impact),
        prompt_template: promptTemplate,
        tags: data.tags || [],
        impact: data.impact || 'LOW',
        impact_description: data.impactDescription || ''
      };
    } catch (error) {
      console.error(`Error converting ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * Extract title from content
   * @param {string} content - File content
   * @returns {string} Title
   */
  extractTitle(content) {
    const match = content.match(/^##\s+(.+)$/m);
    return match ? match[1].trim() : 'Code Quality Check';
  }

  /**
   * Generate description from content
   * @param {string} body - File body content
   * @param {Object} frontmatter - Frontmatter data
   * @returns {string} Description
   */
  generateDescription(body, frontmatter) {
    // Extract the first paragraph after the title
    const lines = body.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('**')) {
        return trimmed;
      }
    }
    return frontmatter.tags?.join(', ') || 'Code quality check';
  }

  /**
   * Generate prompt template from skill rule content
   * @param {string} body - File body content
   * @param {Object} frontmatter - Frontmatter data
   * @returns {string} Prompt template
   */
  generatePromptTemplate(body, frontmatter) {
    let template = `**检查以下代码中的 ${frontmatter.title || '问题'}**:\n\n`;

    // Add impact if available
    if (frontmatter.impactDescription) {
      template += `**影响**: ${frontmatter.impactDescription}\n\n`;
    }

    // Extract key points from the content
    const incorrectMatch = body.match(/\*\*Incorrect[\s\S]*?\*\*Correct:/);
    const correctMatch = body.match(/\*\*Correct[\s\S]*?\*\*Why/);

    if (incorrectMatch) {
      const incorrectText = incorrectMatch[0]
        .replace(/\*\*Incorrect[\s\S]*?\n```[a-z]*\n/, '')
        .replace(/```\n\n\*\*Correct:/, '')
        .split('\n')
        .slice(0, 15)
        .join('\n');
      template += `**避免**:\n\`\`\`tsx\n${incorrectText}\n\`\`\`\n\n`;
    }

    if (correctMatch) {
      const correctText = correctMatch[0]
        .replace(/\*\*Correct[\s\S]*?\n```[a-z]*\n/, '')
        .replace(/```\n\n\*\*Why/, '')
        .split('\n')
        .slice(0, 10)
        .join('\n');
      template += `**推荐做法**:\n\`\`\`tsx\n${correctText}\n\`\`\`\n\n`;
    }

    template += `**关注点**:\n`;
    template += `- 查找 diff 中以 + 开头的新增行\n`;
    template += `- 识别违反最佳实践的代码模式\n`;
    template += `- 提供具体的修复建议\n\n`;

    template += `代码:\n{diff}`;

    return template;
  }

  /**
   * Convert all skill rules in directory
   * @returns {Array} Array of review categories
   */
  convertAll() {
    const files = fs.readdirSync(this.skillsDir)
      .filter(f => f.endsWith('.md') && !f.startsWith('_'))
      .map(f => path.join(this.skillsDir, f));

    const categories = files
      .map(filePath => this.convertSkillToCategory(filePath))
      .filter(Boolean);

    return categories;
  }

  /**
   * Generate review-categories.json config
   * @returns {Object} Complete config object
   */
  generateConfig() {
    const categories = this.convertAll();

    return {
      review: {
        categories: [
          // Keep existing core categories
          {
            id: 'security',
            name: '安全审查',
            description: '检查安全漏洞和潜在风险',
            severity: 'critical',
            prompt_template: '从安全角度审查以下代码变更：\n\n重点关注：\n- SQL 注入、XSS、CSRF 等常见漏洞\n- 敏感信息泄露（密钥、密码、token）\n- 权限检查和身份验证\n- 输入验证和数据清理\n- 不安全的依赖或 API 使用\n\n代码：\n{diff}'
          },
          {
            id: 'bugs',
            name: '潜在 Bug',
            description: '检查可能导致运行时错误的问题',
            severity: 'error',
            prompt_template: '从 Bug 识别角度审查以下代码：\n\n重点关注：\n- 空指针/未定义引用\n- 边界条件和异常处理\n- 竞态条件和并发问题\n- 内存泄漏和资源管理\n- 类型不匹配和转换错误\n\n代码：\n{diff}'
          },
          // Add all React best practices categories
          ...categories
        ]
      },
      system_prompt: fs.readFileSync(
        path.join(__dirname, '../../config/review-categories.json'),
        'utf8'
      ).match(/"system_prompt":\s*"([^"]+)"/)?.[1] || this.getDefaultSystemPrompt()
    };
  }

  /**
   * Get default system prompt
   * @returns {string} Default system prompt
   */
  getDefaultSystemPrompt() {
    return `你是一个严格的专业代码审查 AI 助手。

**项目类型**: 这是一个 Next.js 16 + React 19 项目，使用 TypeScript、Tailwind CSS 和 JSX/TSX。

**重要**:
- JSX 中的组件（如 \`<Icon />\`）是 React 标准用法，不是「在 HTML 中使用 JavaScript」
- 文件路径不要添加 src/ 前缀，直接使用 diff 中显示的路径（如 \`app/...\`）

**核心原则**：
1. 只指出真正的问题，不需要夸奖或表扬
2. 每个问题必须提供符合行业最佳实践的具体修复方案
3. 使用 file:line 格式精确引用问题代码
4. 用简洁的中文回复`;
  }
}

module.exports = { SkillToReviewConverter };
