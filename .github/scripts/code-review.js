const { Octokit } = require('octokit');
const { Anthropic } = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { PRCompressor } = require('./lib/pr-compressor');
const { PromptBuilder } = require('./lib/prompt-builder');
const config = require('./config/default.config');

/**
 * AI Code Review Script
 *
 * Automated PR code review with intelligent content compression.
 * Supports multiple AI providers: Anthropic Claude, Google Gemini, Zhipu GLM.
 */

// Initialize GitHub client
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

/**
 * Get PR files and changes from GitHub
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number} prNumber - Pull request number
 * @returns {Promise<Array>} Array of file objects
 */
async function getPRFiles(owner, repo, prNumber) {
  const { data: files } = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: prNumber,
  });

  return files.map(file => ({
    filename: file.filename,
    status: file.status,
    additions: file.additions,
    deletions: file.deletions,
    changes: file.changes,
    patch: file.patch || ''
  }));
}

/**
 * Get PR details from GitHub
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number} prNumber - Pull request number
 * @returns {Promise<Object>} PR details
 */
async function getPRDetails(owner, repo, prNumber) {
  const { data: pr } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });

  return {
    number: pr.number,
    title: pr.title,
    description: pr.body || '',
    author: pr.user.login,
    baseBranch: pr.base.ref,
    headBranch: pr.head.ref
  };
}

/**
 * Call Anthropic Claude API
 * @param {string} systemPrompt - System prompt
 * @param {string} userPrompt - User prompt
 * @returns {Promise<Object>} Response with content and provider info
 */
async function reviewWithClaude(systemPrompt, userPrompt) {
  try {
    const anthropic = new Anthropic({ apiKey: config.ai.apiKey.anthropic });
    const message = await anthropic.messages.create({
      model: config.ai.model.anthropic,
      max_tokens: config.ai.maxResponseTokens,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: userPrompt
      }],
      temperature: config.ai.temperature
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
 * @param {string} systemPrompt - System prompt (not supported by Gemini, prepended to user prompt)
 * @param {string} userPrompt - User prompt
 * @returns {Promise<Object>} Response with content and provider info
 */
async function reviewWithGemini(systemPrompt, userPrompt) {
  try {
    const genAI = new GoogleGenerativeAI(config.ai.apiKey.gemini);
    const model = genAI.getGenerativeModel({ model: config.ai.model.gemini });

    // Gemini doesn't support system prompts, prepend to user prompt
    const combinedPrompt = `${systemPrompt}\n\n${userPrompt}`;
    const result = await model.generateContent(combinedPrompt);
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
 * @param {string} systemPrompt - System prompt
 * @param {string} userPrompt - User prompt
 * @returns {Promise<Object>} Response with content and provider info
 */
async function reviewWithGLM(systemPrompt, userPrompt) {
  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.ai.apiKey.glm}`
      },
      body: JSON.stringify({
        model: config.ai.model.glm,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: config.ai.maxResponseTokens,
        temperature: config.ai.temperature
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
 * @param {string} systemPrompt - System prompt
 * @param {string} userPrompt - User prompt
 * @returns {Promise<Object>} Response with content and provider info
 */
async function getAIReview(systemPrompt, userPrompt) {
  const provider = config.ai.provider;
  console.log(`🤖 Using AI provider: ${provider}`);

  switch (provider.toLowerCase()) {
    case 'anthropic':
    case 'claude':
      return await reviewWithClaude(systemPrompt, userPrompt);
    case 'gemini':
    case 'google':
      return await reviewWithGemini(systemPrompt, userPrompt);
    case 'glm':
    case 'zhipu':
      return await reviewWithGLM(systemPrompt, userPrompt);
    default:
      throw new Error(`Unknown AI provider: ${provider}. Supported providers: anthropic, gemini, glm`);
  }
}

/**
 * Post review comment to PR
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number} prNumber - Pull request number
 * @param {string} reviewBody - Review content
 * @param {Object} providerInfo - Provider information
 * @param {Object} compressionInfo - Compression statistics
 */
async function postReviewComment(owner, repo, prNumber, reviewBody, providerInfo, compressionInfo = null) {
  let comment = `## 🤖 AI Code Review\n\n`;

  if (compressionInfo && config.output.includeCompressionStats) {
    comment += `> **压缩信息**: 包含 ${compressionInfo.compressedFileCount}/${compressionInfo.originalFileCount} 个文件 (${compressionInfo.compressionRatio})\n\n`;
    comment += `---\n\n`;
  }

  comment += `${reviewBody}\n\n`;

  if (config.output.includeTokenStats) {
    comment += `---\n\n`;
    comment += `*This review was generated by [${providerInfo.provider}](${providerInfo.providerUrl})*`;
  }

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
  // Validate configuration
  const validation = config.validate(config);
  if (!validation.valid) {
    console.error('❌ Configuration errors:');
    validation.errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  if (validation.warnings.length > 0) {
    console.warn('⚠️ Configuration warnings:');
    validation.warnings.forEach(warn => console.warn(`  - ${warn}`));
  }

  // Get environment variables
  const PR_NUMBER = process.env.PR_NUMBER || config.github.prNumber;
  const REPO_OWNER = process.env.REPO_OWNER || config.github.owner;
  const REPO_NAME = process.env.REPO_NAME || config.github.repo;

  if (!PR_NUMBER || !REPO_OWNER || !REPO_NAME) {
    console.error('❌ Missing required environment variables: PR_NUMBER, REPO_OWNER, REPO_NAME');
    process.exit(1);
  }

  try {
    console.log(`🔍 Starting code review for PR #${PR_NUMBER}...`);
    console.log(`   Repository: ${REPO_OWNER}/${REPO_NAME}`);

    // Get PR details
    const prDetails = await getPRDetails(REPO_OWNER, REPO_NAME, parseInt(PR_NUMBER));
    console.log(`📝 PR: ${prDetails.title}`);
    console.log(`👤 Author: ${prDetails.author}`);
    console.log(`🌿 Branch: ${prDetails.headBranch} → ${prDetails.baseBranch}`);

    // Get changed files
    const files = await getPRFiles(REPO_OWNER, REPO_NAME, parseInt(PR_NUMBER));
    console.log(`📁 Found ${files.length} files in PR`);

    if (files.length === 0) {
      console.log('✅ No files to review');
      return;
    }

    // Compress PR content using PRCompressor
    const compressor = new PRCompressor(config.compression);
    const compressedPR = compressor.compress({
      ...prDetails,
      files
    });

    // Build prompts using PromptBuilder
    const promptBuilder = new PromptBuilder();
    const prompts = promptBuilder.buildReviewPrompt(compressedPR, {
      enabledCategories: config.review.enabledCategories
    });

    // Get AI review
    console.log(`🤖 Requesting AI review (${config.ai.provider})...`);
    const { content, provider, providerUrl } = await getAIReview(prompts.system, prompts.user);

    // Post review as comment
    if (config.github.postComment) {
      await postReviewComment(
        REPO_OWNER,
        REPO_NAME,
        parseInt(PR_NUMBER),
        content,
        { provider, providerUrl },
        compressedPR.compressionInfo
      );
    } else {
      console.log('\n' + '='.repeat(60));
      console.log(content);
      console.log('='.repeat(60) + '\n');
    }

    console.log('✅ Code review completed successfully');
  } catch (error) {
    console.error('❌ Error during code review:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
