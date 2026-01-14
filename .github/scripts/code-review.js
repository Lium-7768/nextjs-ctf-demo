const { Octokit } = require('octokit');
const { Anthropic } = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Configuration
const CONFIG = {
  maxFiles: 10,
  maxFileSize: 3000, // characters
  excludePatterns: [
    'node_modules',
    'dist',
    'build',
    '.next',
    'coverage',
    '*.min.js',
    '*.min.css',
    'package-lock.json',
    'yarn.lock',
    '*.log'
  ]
};

// Get AI provider from environment
const AI_PROVIDER = process.env.AI_PROVIDER || 'anthropic';

// Initialize GitHub client
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

/**
 * Get PR files and changes
 */
async function getPRFiles(owner, repo, prNumber) {
  const { data: files } = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: prNumber,
  });

  return files
    .filter(file => {
      const changes = file.patch || '';
      const isExcluded = CONFIG.excludePatterns.some(pattern =>
        file.filename.includes(pattern)
      );
      return !isExcluded && changes.length > 0;
    })
    .slice(0, CONFIG.maxFiles)
    .map(file => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
      patch: file.patch?.slice(0, CONFIG.maxFileSize) || ''
    }));
}

/**
 * Create review prompt
 */
function createReviewPrompt(files, prTitle, prDescription) {
  const filesSummary = files.map(f =>
    `## ${f.filename} (${f.status})
\`\`\`diff
${f.patch}
\`\`\``
  ).join('\n\n');

  return `You are a code reviewer. Review the following pull request changes.

PR Title: ${prTitle}
PR Description: ${prDescription || 'No description provided'}

# Files Changed
${filesSummary}

Please provide a structured code review with:
1. **Summary**: Brief overview of changes
2. **Issues**: Any bugs, security issues, or problems found (with file:line references)
3. **Suggestions**: Improvements or best practices recommendations
4. **Positive**: What was done well

Format your response in markdown with clear sections.`;
}

/**
 * Call Anthropic Claude API
 */
async function reviewWithClaude(prompt) {
  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    return {
      content: message.content[0].text,
      provider: 'Claude',
      providerUrl: 'https://www.anthropic.com/claude'
    };
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

/**
 * Call Google Gemini API
 */
async function reviewWithGemini(prompt) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      content: text,
      provider: 'Gemini',
      providerUrl: 'https://ai.google.dev/gemini-api'
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

/**
 * Call Zhipu GLM API
 */
async function reviewWithGLM(prompt) {
  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GLM_API_KEY}`
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GLM API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    return {
      content: content,
      provider: 'GLM',
      providerUrl: 'https://open.bigmodel.cn/'
    };
  } catch (error) {
    console.error('GLM API error:', error);
    throw error;
  }
}

/**
 * Route to appropriate AI provider
 */
async function getAIReview(prompt) {
  console.log(`🤖 Using AI provider: ${AI_PROVIDER}`);

  switch (AI_PROVIDER.toLowerCase()) {
    case 'anthropic':
    case 'claude':
      return await reviewWithClaude(prompt);
    case 'gemini':
    case 'google':
      return await reviewWithGemini(prompt);
    case 'glm':
    case 'zhipu':
      return await reviewWithGLM(prompt);
    default:
      throw new Error(`Unknown AI provider: ${AI_PROVIDER}. Supported providers: anthropic, gemini, glm`);
  }
}

/**
 * Post review comment to PR
 */
async function postReviewComment(owner, repo, prNumber, reviewBody, providerInfo) {
  const comment = `## 🤖 AI Code Review

${reviewBody}

---
*This review was generated by [${providerInfo.provider}](${providerInfo.providerUrl})*`;

  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: comment
  });

  console.log('✅ Review comment posted successfully');
}

/**
 * Main function
 */
async function main() {
  const { PR_NUMBER, REPO_OWNER, REPO_NAME } = process.env;

  if (!PR_NUMBER || !REPO_OWNER || !REPO_NAME) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
  }

  try {
    console.log(`🔍 Starting code review for PR #${PR_NUMBER}...`);

    // Get PR details
    const { data: pr } = await octokit.rest.pulls.get({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      pull_number: parseInt(PR_NUMBER),
    });

    console.log(`📝 PR: ${pr.title}`);
    console.log(`👤 Author: ${pr.user.login}`);
    console.log(`🌿 Branch: ${pr.head.ref} → ${pr.base.ref}`);

    // Get changed files
    const files = await getPRFiles(REPO_OWNER, REPO_NAME, parseInt(PR_NUMBER));
    console.log(`📁 Found ${files.length} files to review`);

    if (files.length === 0) {
      console.log('✅ No files to review');
      return;
    }

    // Create review prompt
    const prompt = createReviewPrompt(files, pr.title, pr.body);

    // Get AI review
    console.log(`🤖 Requesting AI review (${AI_PROVIDER})...`);
    const { content, provider, providerUrl } = await getAIReview(prompt);

    // Post review as comment
    await postReviewComment(REPO_OWNER, REPO_NAME, parseInt(PR_NUMBER), content, { provider, providerUrl });

    console.log('✅ Code review completed successfully');
  } catch (error) {
    console.error('❌ Error during code review:', error.message);
    process.exit(1);
  }
}

main();
