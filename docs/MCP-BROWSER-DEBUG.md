# MCP Browser Debugging Guide

This project is configured with **Playwright MCP** for browser automation and debugging.

## What is Playwright MCP?

Playwright MCP (Model Context Protocol) allows AI agents to:
- 🌐 Control browsers programmatically
- 🔍 Inspect page elements and console errors
- 📸 Take screenshots for visual debugging
- 🧪 Run automated tests
- 🐛 Debug JavaScript errors

## Configuration

MCP is configured in `.mcp.json`:

```json
{
  "mcp": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"]
    }
  }
}
```

## Usage with OpenCode

### Basic Browser Debugging

Start OpenCode and use natural language:

```bash
opencode
```

Then try these prompts:

#### Check Console Errors
```
用 playwright 打开 http://localhost:3000，检查控制台错误
```

#### Screenshot and Analyze
```
用 playwright 访问 http://localhost:3000/about，截图并分析页面
```

#### Test User Interactions
```
用 playwright 点击导航栏的"关于"按钮，然后检查是否有错误
```

#### Debug Specific Elements
```
用 playwright 检查页面上所有按钮是否可点击，报告不可点击的元素
```

### Available MCP Tools

| Tool | Description | Example |
|------|-------------|---------|
| `playwright_navigate` | Navigate to URL | `{ url: "https://example.com" }` |
| `playwright_screenshot` | Capture screenshot | `{ path: "screenshot.png" }` |
| `playwright_click` | Click element | `{ selector: "#button" }` |
| `playwright_fill` | Fill form field | `{ selector: "#input", value: "text" }` |
| `playwright_evaluate` | Run JavaScript | `{ code: "document.title" }` |
| `playwright_get_console_errors` | Get console errors | `{}` |
| `playwright_wait_for_selector` | Wait for element | `{ selector: ".loaded" }` |

## Common Debugging Scenarios

### 1. Check 404 Errors
```bash
opencode "用 playwright 检查 http://localhost:3000，找出所有 404 错误和失败的资源加载"
```

### 2. Test Form Submission
```bash
opencode "用 playwright 填写联系表单并提交，检查是否有验证错误"
```

### 3. Debug Navigation
```bash
opencode "用 playwright 测试网站的所有导航链接，报告损坏的链接"
```

### 4. Performance Check
```bash
opencode "用 playwright 分析页面加载性能，报告加载慢的资源"
```

### 5. Mobile Testing
```bash
opencode "用 playwright 在 iPhone 模式下测试网站响应式设计"
```

## Integration with oh-my-opencode

When using **ultrawork** mode, agents can leverage Playwright MCP for complex debugging tasks:

```bash
opencode "ulw: 调试网站的登录流程，找出所有问题并修复"
```

The agent will:
1. Navigate to login page
2. Fill in credentials
3. Submit form
4. Capture errors
5. Analyze issues
6. Suggest fixes
7. Repeat until fixed

## Quick Reference

### Quick Debug Command
```bash
bun run debug:browser https://your-website.com
```

### With OpenCode
```bash
# Start OpenCode
opencode

# In OpenCode session:
"用 playwright 调试 http://localhost:3000"
```

## Tips

1. **Screenshot First**: Always take a screenshot before debugging to see the current state
2. **Check Console**: Console errors often reveal the root cause
3. **Wait for Load**: Use `playwright_wait_for_selector` to ensure page is fully loaded
4. **Test Locally**: Test with `localhost:3000` before debugging production URLs
5. **Use Selectors**: Be specific with CSS selectors for better accuracy

## Troubleshooting

### MCP Not Loading
```bash
# Verify .mcp.json exists
cat .mcp.json

# Check OpenCode config
cat ~/.config/opencode/opencode.json | grep plugin
```

### Browser Not Starting
```bash
# Install Playwright browsers
npx playwright install chromium
```

### Permission Issues
```bash
# Ensure proper file permissions
chmod +x scripts/debug-browser.ts
```

## Related Tools

- **Puppeteer MCP**: Alternative browser automation
- **Selenium MCP**: For cross-browser testing
- **Browserbase MCP**: Cloud browser sessions

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [MCP Specification](https://modelcontextprotocol.io/)
- [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode)
