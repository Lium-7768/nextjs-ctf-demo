import contentfulManagement from 'contentful-management'

const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID

async function documentToRichText(text: string): Promise<any> {
  return {
    nodeType: 'document',
    data: {},
    content: [
      {
        nodeType: 'paragraph',
        data: {},
        content: [
          {
            nodeType: 'text',
            value: text,
            marks: [],
            data: {},
          },
        ],
      },
    ],
  }
}

export async function seedContentful() {
  console.log('🌱 Seeding Contentful with demo data...')
  
  const client = contentfulManagement.createClient({
    accessToken: MANAGEMENT_TOKEN!,
  })
  
  const space = await client.getSpace(SPACE_ID!)
  const environment = await space.getEnvironment('master')
  
  // 1. 创建 Sections
  console.log('\n📝 Creating Sections...')
  
  const heroSection = await environment.createEntry('section', {
    fields: {
      type: { 'en-US': 'hero' },
      heading: {
        'en-US': 'Building the Future',
        'zh-CN': '构建未来',
      },
      description: {
        'en-US': await documentToRichText('Innovation meets excellence. We are committed to delivering cutting-edge solutions that transform businesses worldwide.'),
        'zh-CN': await documentToRichText('创新与卓越的结合。我们致力于提供前沿解决方案，助力全球企业转型。'),
      },
      order: { 'en-US': 1 },
    },
  })
  
  const contentSection = await environment.createEntry('section', {
    fields: {
      type: { 'en-US': 'content' },
      heading: {
        'en-US': 'Our Story',
        'zh-CN': '我们的故事',
      },
      description: {
        'en-US': await documentToRichText('Founded in 2020, we are a team of passionate developers, designers, and strategists working together to create exceptional digital experiences.'),
        'zh-CN': await documentToRichText('成立于 2020 年，我们是一群充满激情的开发者、设计师和战略家，共同创造卓越的数字化体验。'),
      },
      order: { 'en-US': 2 },
    },
  })
  
  console.log('  ✓ Created hero and content sections')
  
  // 2. 创建 Pages
  console.log('\n📝 Creating Pages...')
  
  const homePage = await environment.createEntry('page', {
    fields: {
      slug: {
        'en-US': '',
        'zh-CN': '',
      },
      title: {
        'en-US': 'Home',
        'zh-CN': '首页',
      },
      metaTitle: {
        'en-US': 'Home | Demo Company',
        'zh-CN': '首页 | 演示公司',
      },
      metaDescription: {
        'en-US': 'Welcome to our company website',
        'zh-CN': '欢迎来到我们的公司网站',
      },
      sections: {
        'en-US': [
          { sys: { id: heroSection.sys.id, type: 'Link', linkType: 'Entry' } },
          { sys: { id: contentSection.sys.id, type: 'Link', linkType: 'Entry' } },
        ],
      },
      template: { 'en-US': 'home' },
      publishedAt: { 'en-US': new Date().toISOString() },
    },
  })
  
  const aboutPage = await environment.createEntry('page', {
    fields: {
      slug: {
        'en-US': 'about',
        'zh-CN': 'about',
      },
      title: {
        'en-US': 'About Us',
        'zh-CN': '关于我们',
      },
      metaTitle: {
        'en-US': 'About Us | Demo Company',
        'zh-CN': '关于我们 | 演示公司',
      },
      metaDescription: {
        'en-US': 'Learn more about our company',
        'zh-CN': '了解更多关于我们公司的信息',
      },
      sections: {
        'en-US': [
          { sys: { id: contentSection.sys.id, type: 'Link', linkType: 'Entry' } },
        ],
      },
      template: { 'en-US': 'default' },
      publishedAt: { 'en-US': new Date().toISOString() },
    },
  })
  
  console.log('  ✓ Created home and about pages')
  
  // 3. 创建导航
  console.log('\n📝 Creating Navigation...')
  
  const homeNav = await environment.createEntry('navigationItem', {
    fields: {
      label: {
        'en-US': 'Home',
        'zh-CN': '首页',
      },
      linkTo: { 'en-US': '/[lang]/' },
      order: { 'en-US': 1 },
    },
  })
  
  const aboutNav = await environment.createEntry('navigationItem', {
    fields: {
      label: {
        'en-US': 'About',
        'zh-CN': '关于',
      },
      linkTo: { 'en-US': '/[lang]/about' },
      order: { 'en-US': 2 },
    },
  })
  
  console.log('  ✓ Created navigation items')
  
  // 4. 创建全局设置
  console.log('\n📝 Creating Global Settings...')
  
  const globalSettings = await environment.createEntry('globalSettings', {
    fields: {
      companyName: {
        'en-US': 'Demo Company',
        'zh-CN': '演示公司',
      },
      tagline: {
        'en-US': 'Innovation Meets Excellence',
        'zh-CN': '创新与卓越的结合',
      },
      email: { 'en-US': 'info@demo.com' },
      phone: { 'en-US': '+1 234 567 890' },
      address: {
        'en-US': '123 Main St, New York, NY 10001',
        'zh-CN': '纽约市主街123号，邮编10001',
      },
    },
  })
  
  console.log('  ✓ Created global settings')
  
  // 5. 创建 FAQ
  console.log('\n📝 Creating FAQs...')
  
  const faq1 = await environment.createEntry('faq', {
    fields: {
      question: {
        'en-US': 'What services do you offer?',
        'zh-CN': '你们提供什么服务？',
      },
      answer: {
        'en-US': await documentToRichText('We offer a wide range of services including web development, mobile app development, and digital strategy consulting.'),
        'zh-CN': await documentToRichText('我们提供广泛的服务，包括网站开发、移动应用开发和数字战略咨询。'),
      },
      category: { 'en-US': 'general' },
      order: { 'en-US': 1 },
    },
  })
  
  const faq2 = await environment.createEntry('faq', {
    fields: {
      question: {
        'en-US': 'How can I contact you?',
        'zh-CN': '我如何联系你们？',
      },
      answer: {
        'en-US': await documentToRichText('You can reach us via email at info@demo.com or call us at +1 234 567 890. We typically respond within 24 hours.'),
        'zh-CN': await documentToRichText('您可以通过邮件 info@demo.com 或电话 +1 234 567 890 联系我们。我们通常在 24 小时内回复。'),
      },
      category: { 'en-US': 'general' },
      order: { 'en-US': 2 },
    },
  })
  
  console.log('  ✓ Created FAQs')
  
  // 发布所有内容
  console.log('\n🚀 Publishing entries...')
  
  await homePage.publish()
  await aboutPage.publish()
  await homeNav.publish()
  await aboutNav.publish()
  await globalSettings.publish()
  await faq1.publish()
  await faq2.publish()
  
  console.log('✅ Demo data seeded successfully!')
}
