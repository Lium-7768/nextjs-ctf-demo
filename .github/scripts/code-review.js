const { Octokit } = require('octokit');
const { Anthropic } = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { PRCompressor } = require('./lib/pr-compressor');
const { PromptBuilder } = require('./lib/prompt-builder');
const config = require('./config/default.config');

/**
 * AI Code Review Script with Inline Comments
 *
 * Creates real GitHub PR reviews with inline code comments.
 * Supports multiple AI providers: Anthropic Claude, Google Gemini, Zhipu GLM.
 */

// Initialize GitHub client
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

/**
 * Parse AI response to extract structured review comments
 * @param {string} content - AI response content
 * @returns {Object} Parsed review with inline comments
 */
function parseAIResponse(content) {
  const review = {
    body: '',
    comments: [],
    event: 'COMMENT'
  };

  const lines = content.split('\n');
  let currentSection = null;
  let currentIssue = null;
  let severityCount = { critical: 0, error: 0, warning: 0, info: 0 };
  let issueBody = '';
  let inCodeBlock = false;
  let currentCodeBlock = [];
  let codeBlockType = null; // 'bad' or 'good'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect sections
    if (line.startsWith('## ')) {
      currentSection = line.replace('## ', '').replace(/\s*\(共 \d+ 个\)/, '').trim();
      // Skip sections we don't need for inline comments
      if (currentSection.includes('总体建议') || currentSection.includes('优点') || currentSection.includes('审查摘要')) {
        currentSection = null;
      }
      continue;
    }

    // Skip if we're not in the issues section
    if (!currentSection || !currentSection.includes('发现的问题')) {
      continue;
    }

    // Detect code blocks
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        // Starting a code block
        inCodeBlock = true;
        currentCodeBlock = [];
        // Detect code block type from previous line
        if (i > 0 && lines[i - 1].includes('错误代码')) {
          codeBlockType = 'bad';
        } else if (i > 0 && lines[i - 1].includes('正确代码')) {
          codeBlockType = 'good';
        }
      } else {
        // Ending a code block
        inCodeBlock = false;
        const codeContent = currentCodeBlock.join('\n');
        if (currentIssue && codeBlockType) {
          if (codeBlockType === 'bad') {
            currentIssue.badCode = codeContent;
          } else if (codeBlockType === 'good') {
            currentIssue.goodCode = codeContent;
          }
        }
        currentCodeBlock = [];
        codeBlockType = null;
      }
      continue;
    }

    // Collect code block content
    if (inCodeBlock && currentIssue) {
      currentCodeBlock.push(line);
      continue;
    }

    // Detect issue headers
    const issueMatch = line.match(/###\s*\[?([^\]]+)\]?\s*(.+)/);
    if (issueMatch) {
      // Save previous issue if exists
      if (currentIssue && currentIssue.file) {
        review.comments.push(buildIssueComment(currentIssue));
      }

      const severity = mapSeverity(issueMatch[1].toLowerCase());
      currentIssue = {
        severity,
        title: issueMatch[2].trim(),
        file: null,
        line: null,
        body: '',
        problem: '',
        badCode: '',
        goodCode: '',
        reason: ''
      };
      severityCount[severity] = (severityCount[severity] || 0) + 1;
      continue;
    }

    // Detect issue properties
    if (currentIssue) {
      // Extract file:line position
      const fileLineMatch = line.match(/\*\*位置\**:\s*`?([^\s`:]+):(\d+)`?/);
      if (fileLineMatch) {
        currentIssue.file = fileLineMatch[1];
        currentIssue.line = parseInt(fileLineMatch[2], 10);
        continue;
      }

      // Extract problem description
      if (line.startsWith('- **问题**:') || line.startsWith('**问题**:')) {
        currentIssue.problem = line.replace(/^-?\s*\*\*问题\**:\s*/, '').trim();
        continue;
      }

      // Extract reasoning
      if (line.startsWith('**理由**:') || line.startsWith('**理由**:')) {
        currentIssue.reason = line.replace(/^\*\*理由\**:\s*/, '').trim();
        continue;
      }

      // Build the issue body (excluding specific fields we've extracted)
      if (!line.includes('**位置**') &&
          !line.includes('**问题**') &&
          !line.includes('**理由**') &&
          !line.includes('❌ 错误代码') &&
          !line.includes('✅ 正确代码') &&
          line.trim() !== '' &&
          !line.startsWith('---')) {
        if (issueBody) {
          issueBody += '\n' + line;
        } else {
          issueBody = line;
        }
        currentIssue.body = issueBody;
      }

      // End of issue when hitting separator
      if (line.startsWith('---') && currentIssue.file) {
        review.comments.push(buildIssueComment(currentIssue));
        currentIssue = null;
        issueBody = '';
      }
    }
  }

  // Don't forget the last issue
  if (currentIssue && currentIssue.file) {
    review.comments.push(buildIssueComment(currentIssue));
  }

  // Determine review event based on severity
  if (severityCount.critical > 0 || severityCount.error > 0) {
    review.event = 'REQUEST_CHANGES';
  } else {
    review.event = 'COMMENT';
  }

  // Build review body (only include 总体建议 section if exists)
  review.body = buildReviewBody(content);

  return review;
}

/**
 * Map severity string to standard value
 * @param {string} severity - Severity from AI
 * @returns {string} Mapped severity
 */
function mapSeverity(severity) {
  const mapping = {
    'critical': 'critical',
    'error': 'error',
    'warning': 'warning',
    'info': 'info',
    '严重': 'critical',
    '错误': 'error',
    '警告': 'warning',
    '信息': 'info'
  };
  return mapping[severity] || 'info';
}

/**
 * Build formatted issue comment
 * @param {Object} issue - Issue object
 * @returns {Object} Formatted comment
 */
function buildIssueComment(issue) {
  let body = `**${issue.title}**\n\n`;

  if (issue.problem) {
    body += `**问题**: ${issue.problem}\n\n`;
  }

  if (issue.badCode) {
    body += `**❌ 错误代码**:\n\`\`\`tsx\n${issue.badCode}\n\`\`\`\n\n`;
  }

  if (issue.goodCode) {
    body += `**✅ 正确代码**:\n\`\`\`tsx\n${issue.goodCode}\n\`\`\`\n\n`;
  }

  if (issue.reason) {
    body += `**理由**: ${issue.reason}`;
  }

  return {
    severity: issue.severity,
    title: issue.title,
    file: issue.file,
    line: issue.line,
    body: body.trim()
  };
}

/**
 * Build review body - only include 总体建议 section
 * @param {string} originalContent - Original AI content
 * @returns {string} Review body
 */
function buildReviewBody(originalContent) {
  const lines = originalContent.split('\n');
  const result = [];
  let inOverallSection = false;

  for (const line of lines) {
    // Look for 总体建议 section
    if (line.includes('总体建议')) {
      inOverallSection = true;
      result.push(line);
      continue;
    }

    if (inOverallSection) {
      result.push(line);
    }
  }

  // If no 总体建议 section, return a simple message
  if (result.length === 0) {
    return '🤖 **AI 代码审查已完成**\n\n请查看代码中的具体评论。';
  }

  return result.join('\n');
}

/**
 * Convert file:line to diff position
 * @param {string} filePath - File path
 * @param {number} lineNumber - Line number in the file
 * @param {Array} files - PR files with patches
 * @returns {Object|null} Position info with path, position, or null if not found
 */
function findPositionInDiff(filePath, lineNumber, files) {
  const file = files.find(f => f.filename === filePath);
  if (!file || !file.patch) return null;

  const patchLines = file.patch.split('\n');
  let currentLineInNewFile = 0;
  let position = 0;

  for (const patchLine of patchLines) {
    // Match hunk header: @@ -old_start,old_count +new_start,new_count @@
    const hunkMatch = patchLine.match(/^@@\s+-\d+(?:,\d+)?\s+\+(\d+)(?:,(\d+))?/);
    if (hunkMatch) {
      currentLineInNewFile = parseInt(hunkMatch[1], 10);
      // position continues counting from previous hunk
      continue;
    }

    // Increment position for each line in the diff
    position++;

    // Track new file lines
    if (patchLine.startsWith('+') && !patchLine.startsWith('++')) {
      currentLineInNewFile++;
      if (currentLineInNewFile === lineNumber) {
        return { path: filePath, position };
      }
    }

    // Track unchanged lines
    if (patchLine.startsWith(' ')) {
      currentLineInNewFile++;
      if (currentLineInNewFile === lineNumber) {
        return { path: filePath, position };
      }
    }
  }

  return null;
}

/**
 * Map line numbers to diff positions
 * @param {Array} comments - Comments with file:line references
 * @param {Array} files - PR files
 * @returns {Array} Comments with position info
 */
function mapCommentsToPositions(comments, files) {
  return comments
    .map(comment => {
      const posInfo = findPositionInDiff(comment.file, comment.line, files);
      if (!posInfo) {
        console.warn(`  ⚠️  Could not find position for ${comment.file}:${comment.line}`);
        return null;
      }

      return {
        path: comment.file,
        position: posInfo.position,
        body: `**[${comment.severity.toUpperCase()}]** ${comment.title}\n\n${comment.body || ''}`
      };
    })
    .filter(Boolean);
}

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
    headBranch: pr.head.ref,
    headSha: pr.head.sha
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
 * @param {string} systemPrompt - System prompt
 * @param {string} userPrompt - User prompt
 * @returns {Promise<Object>} Response with content and provider info
 */
async function reviewWithGemini(systemPrompt, userPrompt) {
  try {
    const genAI = new GoogleGenerativeAI(config.ai.apiKey.gemini);
    const model = genAI.getGenerativeModel({ model: config.ai.model.gemini });

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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
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
 * Create a PR review with inline comments
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number} prNumber - Pull request number
 * @param {Object} review - Review object with body, event, comments
 * @param {string} headSha - Head commit SHA
 */
async function createPRReview(owner, repo, prNumber, review, headSha) {
  // Map comments to diff positions
  console.log(`📍 Processing ${review.comments.length} inline comments...`);

  const inlineComments = mapCommentsToPositions(review.comments, review.files);

  console.log(`✅ Mapped ${inlineComments.length} comments to diff positions`);

  // Build review request body
  const reviewBody = {
    owner,
    repo,
    pull_number: prNumber,
    commit_id: headSha,
    body: `${review.body}\n\n---\n\n*This review was generated by ${review.providerInfo.provider}*`,
    event: review.event
  };

  // Add inline comments if we have any
  if (inlineComments.length > 0) {
    reviewBody.comments = inlineComments;
    console.log(`💬 Adding ${inlineComments.length} inline comments to review`);
  }

  // Create the review
  const result = await octokit.rest.pulls.createReview(reviewBody);

  console.log(`✅ PR review created with event: ${review.event}`);
  return result;
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

    // Parse AI response
    console.log(`📝 Parsing AI response...`);
    const parsedReview = parseAIResponse(content);
    parsedReview.providerInfo = { provider, providerUrl };
    parsedReview.files = compressedPR.files;

    console.log(`   Found ${parsedReview.comments.length} issues`);
    console.log(`   Review event: ${parsedReview.event}`);

    // Show summary
    if (parsedReview.comments.length > 0) {
      console.log(`   Issues by severity:`);
      const bySeverity = {};
      parsedReview.comments.forEach(c => {
        bySeverity[c.severity] = (bySeverity[c.severity] || 0) + 1;
      });
      Object.entries(bySeverity).forEach(([severity, count]) => {
        console.log(`     - ${severity}: ${count}`);
      });
    }

    // Create PR review with inline comments
    if (config.github.postComment) {
      // Only post review if there are actual issues or suggestions
      if (parsedReview.comments.length > 0 || parsedReview.body && !parsedReview.body.includes('请查看代码中的具体评论')) {
        await createPRReview(
          REPO_OWNER,
          REPO_NAME,
          parseInt(PR_NUMBER),
          parsedReview,
          prDetails.headSha
        );
      } else {
        console.log('✅ No issues found, skipping review post');
      }
    } else {
      // Dry run - just output
      console.log('\n' + '='.repeat(60));
      console.log('DRY RUN - Would create review:');
      console.log(`  Event: ${parsedReview.event}`);
      console.log(`  Body: ${parsedReview.body.substring(0, 100)}...`);
      console.log(`  Inline comments: ${parsedReview.comments.length}`);
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
