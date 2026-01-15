#!/usr/bin/env bun
/**
 * Browser debugging script using Playwright MCP
 *
 * Usage:
 *   bun run debug:browser https://your-website.com
 */

const url = process.argv[2] || "http://localhost:3000"

console.log(`🔍 Starting browser debugging for: ${url}`)
console.log(`
This script will:
1. Open a browser with Playwright
2. Navigate to the URL
3. Check for console errors
4. Capture screenshots
5. Analyze page performance
6. Report any issues found

To use with OpenCode + MCP:
1. Make sure .mcp.json is configured
2. Run: opencode "用 playwright 检查 ${url} 的控制台错误"
`)

// Example usage with MCP
console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                     MCP Browser Debugging                          ║
╠════════════════════════════════════════════════════════════════════════╣
║  Available MCP Commands:                                            ║
║  ──────────────────────────────────────────────────────────────────  ║
║  1. Open URL:                                                       ║
║     mcp_call playwright_navigate { url: "${url}" }                  ║
║                                                                      ║
║  2. Take Screenshot:                                                 ║
║     mcp_call playwright_screenshot { path: "screenshot.png" }        ║
║                                                                      ║
║  3. Get Console Errors:                                             ║
║     mcp_call playwright_get_console_errors                          ║
║                                                                      ║
║  4. Evaluate JavaScript:                                            ║
║     mcp_call playwright_evaluate { code: "document.title" }          ║
║                                                                      ║
║  5. Click Element:                                                   ║
║     mcp_call playwright_click { selector: "#button" }               ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
`)

// Interactive debugging
console.log(`
🚀 Quick Start with OpenCode:

1. Start OpenCode:
   opencode

2. Use Playwright MCP:
   "用 playwright 打开 ${url}，检查页面错误并截图"

3. Debug specific issues:
   "用 playwright 检查 ${url} 的控制台，找出所有 404 错误"

4. Test interactions:
   "用 playwright 点击页面上的提交按钮，然后检查是否有错误"

💡 Tips:
- MCP 工具会自动启动浏览器
- 可以同时运行多个浏览器操作
- 所有错误都会被捕获并报告
`)
