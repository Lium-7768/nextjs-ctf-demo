# Contentful Setup

这个包包含了设置和种子 Contentful 的脚本。

## 前置要求

1. Contentful 空间 ID
2. Contentful 管理 Token (Management API token)

获取这些信息：
1. 访问 [Contentful Dashboard](https://be.contentful.com/login)
2. 进入你的空间设置
3. 获取 Space ID
4. 进入 Settings > API keys > Content management tokens
5. 创建新的管理 Token

## 环境变量

在项目根目录的 `.env.local` 文件中添加：

```env
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_delivery_access_token_here
CONTENTFUL_MANAGEMENT_TOKEN=your_management_token_here
```

## 使用方法

### 1. 设置 Content Types

运行此命令会自动创建所有 Content Types：

```bash
npm run setup-contentful
```

这将创建以下 Content Types：
- Page - 网站页面
- Section - 页面区块
- Feature - 功能特性
- Service - 服务项目
- Testimonial - 用户评价
- PricingPlan - 定价方案
- FAQEntry - 常见问题
- NavigationItem - 导航菜单
- GlobalSettings - 全局设置
- SocialLink - 社交媒体链接

### 2. 种子数据

运行此命令会填充 Contentful 中的演示数据：

```bash
npm run seed-contentful
```

这将创建：
- 6 个 Features
- 6 个 Services
- 3 个 Testimonials
- 3 个 Pricing Plans
- 6 个 FAQ Entries
- 7 个 Sections (Hero, Features, Services, Testimonials, Pricing, FAQ, CTA)
- 4 个 Pages (Home, Services, Pricing, FAQ)
- 4 个 Navigation Items
- 1 个 Global Settings

## 数据结构

### Page
```json
{
  "fields": {
    "slug": "",
    "title": "Home",
    "metaTitle": "Home | Demo",
    "metaDescription": "Description",
    "sections": [Section],
    "template": "home",
    "publishedAt": "2025-01-16T00:00:00Z"
  }
}
```

### Section
```json
{
  "fields": {
    "type": "hero",
    "heading": "Welcome",
    "description": RichText,
    "order": 1,
    "features": [Feature],
    "services": [Service],
    "testimonials": [Testimonial],
    "pricingPlans": [PricingPlan],
    "faqs": [FAQEntry]
  }
}
```

### Feature / Service / Testimonial / PricingPlan / FAQEntry
每个都有 `order` 字段用于排序。

## 故障排除

### 错误：Content Type already exists
如果 Content Type 已存在，脚本会自动跳过。这是正常的。

### 错误：Invalid token
确保你使用的是 Management Token，而不是 Delivery Token。

### 权限问题
确保你的 Management Token 有以下权限：
- Content Model: Read and write
- Content Management: Read and write
