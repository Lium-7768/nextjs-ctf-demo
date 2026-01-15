/**
 * Default Configuration for AI Code Review
 *
 * This file defines the default configuration for the code review system.
 * Environment variables can override these values.
 */

module.exports = {
  // Compression Configuration
  compression: {
    // Maximum tokens for the compressed PR content
    maxTokens: parseInt(process.env.PR_MAX_TOKENS) || 8000,

    // Language priority (higher priority = processed first)
    languagePriority: (process.env.PR_LANGUAGE_PRIORITY || 'ts,tsx,js,jsx,py,go,rs').split(','),

    // Maximum number of files to include
    maxFiles: parseInt(process.env.PR_MAX_FILES) || 15,

    // File patterns to exclude from review
    excludePatterns: (process.env.PR_EXCLUDE_PATTERNS || 'node_modules,dist,build,.next,coverage,*.min.js,*.min.css,package-lock.json,yarn.lock,bun.lock,*.log,.env').split(','),
  },

  // AI Provider Configuration
  ai: {
    // AI provider: anthropic, gemini, glm
    provider: process.env.AI_PROVIDER || 'anthropic',

    // Model configurations
    model: {
      anthropic: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
      gemini: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
      glm: process.env.GLM_MODEL || 'glm-4-flash'
    },

    // API keys (from environment)
    apiKey: {
      anthropic: process.env.ANTHROPIC_API_KEY,
      gemini: process.env.GEMINI_API_KEY,
      glm: process.env.GLM_API_KEY
    },

    // Max tokens for AI response
    maxResponseTokens: parseInt(process.env.AI_MAX_RESPONSE_TOKENS) || 4000,

    // Temperature (0-1)
    temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.3,
  },

  // Review Configuration
  review: {
    // Enabled review categories (empty = all categories from config)
    enabledCategories: (process.env.PR_REVIEW_CATEGORIES || '').split(',').filter(Boolean),

    // Path to custom categories config (optional)
    customCategoriesPath: process.env.PR_CUSTOM_CATEGORIES_PATH,

    // Minimum severity level to report: critical, error, warning, info
    minSeverity: process.env.PR_MIN_SEVERITY || 'info',

    // Whether to include positive feedback
    includePositive: process.env.PR_INCLUDE_POSITIVE !== 'false',

    // Whether to suggest tests for new code
    suggestTests: process.env.PR_SUGGEST_TESTS !== 'false',
  },

  // Tool Configuration
  tools: {
    // Available tools
    enabled: (process.env.PR_ENABLED_TOOLS || 'review,describe,improve').split(','),

    // Default tool when none specified
    default: process.env.PR_DEFAULT_TOOL || 'review',
  },

  // Output Configuration
  output: {
    // Whether to include token usage in output
    includeTokenStats: process.env.PR_INCLUDE_TOKEN_STATS !== 'false',

    // Whether to include compression stats
    includeCompressionStats: process.env.PR_INCLUDE_COMPRESSION_STATS !== 'false',

    // Output format: markdown, json
    format: process.env.PR_OUTPUT_FORMAT || 'markdown',
  },

  // GitHub Configuration
  github: {
    // Token from environment
    token: process.env.GITHUB_TOKEN,

    // Repository info
    owner: process.env.REPO_OWNER,
    repo: process.env.REPO_NAME,

    // PR number
    prNumber: parseInt(process.env.PR_NUMBER),

    // Whether to post review as comment (true) or just output (false)
    postComment: process.env.PR_POST_COMMENT !== 'false',

    // Whether to create a review (with APPROVE/REQUEST_CHANGES/COMMENT)
    createReview: process.env.PR_CREATE_REVIEW === 'true',

    // Review event when auto-reviewing: APPROVE, REQUEST_CHANGES, COMMENT
    defaultReviewEvent: process.env.PR_DEFAULT_REVIEW_EVENT || 'COMMENT',
  }
};

/**
 * Validate configuration
 * @returns {Object} Validation result
 */
module.exports.validate = function(config) {
  const errors = [];
  const warnings = [];

  // Check AI provider
  if (!['anthropic', 'gemini', 'glm'].includes(config.ai.provider)) {
    errors.push(`Invalid AI provider: ${config.ai.provider}`);
  }

  // Check API key for selected provider
  const apiKey = config.ai.apiKey[config.ai.provider];
  if (!apiKey) {
    errors.push(`Missing API key for provider: ${config.ai.provider}`);
  }

  // Check GitHub configuration
  if (!config.github.token) {
    errors.push('Missing GITHUB_TOKEN environment variable');
  }

  if (!config.github.owner || !config.github.repo) {
    warnings.push('REPO_OWNER and REPO_NAME not set, will attempt to detect from GitHub context');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};
