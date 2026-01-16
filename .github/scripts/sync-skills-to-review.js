const fs = require('fs');
const path = require('path');
const { SkillToReviewConverter } = require('./lib/skill-to-review-converter');

/**
 * Sync React Best Practices skill rules to code review config
 */
function syncSkillsToReview() {
  console.log('🔄 Syncing React Best Practices skills to code review config...\n');

  const skillsDir = path.join(process.cwd(), '.claude/skills/react-best-practices/rules');
  const configPath = path.join(process.cwd(), '.github/scripts/config/review-categories.json');
  const backupPath = configPath + '.backup';

  // Check if skills directory exists
  if (!fs.existsSync(skillsDir)) {
    console.error(`❌ Skills directory not found: ${skillsDir}`);
    process.exit(1);
  }

  // Backup existing config
  if (fs.existsSync(configPath)) {
    fs.copyFileSync(configPath, backupPath);
    console.log(`✅ Backed up existing config to: ${backupPath}`);
  }

  // Read existing config to preserve system_prompt
  let existingSystemPrompt = '';
  if (fs.existsSync(configPath)) {
    const existingConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    existingSystemPrompt = existingConfig.system_prompt || '';
  }

  // Convert skills to review categories
  const converter = new SkillToReviewConverter(skillsDir);
  const categories = converter.convertAll();

  console.log(`\n📋 Found ${categories.length} skill rules:`);
  categories.forEach(cat => {
    console.log(`   - [${cat.severity.toUpperCase()}] ${cat.name} (${cat.id})`);
  });

  // Build new config
  const newConfig = {
    review: {
      categories: [
        // Keep core categories
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
        ...categories
      ]
    },
    system_prompt: existingSystemPrompt || fs.readFileSync(path.join(__dirname, './config/review-categories.json'), 'utf8').match(/"system_prompt":\s*"([^"]+)"/)?.[1] || getDefaultSystemPrompt()
  };

  // Write new config
  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2) + '\n');

  console.log(`\n✅ Generated ${categories.length} review categories`);
  console.log(`📝 Config written to: ${configPath}`);
  console.log(`\n💡 Run 'npm run dev' or trigger a code review to test the new categories.`);
}

function getDefaultSystemPrompt() {
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

// Run if called directly
if (require.main === module) {
  syncSkillsToReview();
}

module.exports = { syncSkillsToReview };
