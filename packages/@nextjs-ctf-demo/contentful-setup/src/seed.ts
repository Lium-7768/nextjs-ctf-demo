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
      heading: { 'en-US': 'Building the Future' },
      description: {
        'en-US': await documentToRichText('Innovation meets excellence. We are committed to delivering cutting-edge solutions that transform businesses worldwide.'),
      },
      order: { 'en-US': 1 },
    },
  })

  const contentSection = await environment.createEntry('section', {
    fields: {
      type: { 'en-US': 'content' },
      heading: { 'en-US': 'Our Story' },
      description: {
        'en-US': await documentToRichText('Founded in 2020, we are a team of passionate developers, designers, and strategists working together to create exceptional digital experiences.'),
      },
      order: { 'en-US': 2 },
    },
  })

  console.log('  ✓ Created hero and content sections')

  // 立即发布 sections，使它们可以被 pages 引用
  await heroSection.publish()
  await contentSection.publish()
  console.log('  ✓ Published sections')

  // 2. 创建 Pages
  console.log('\n📝 Creating Pages...')

  const homePage = await environment.createEntry('page', {
    fields: {
      slug: { 'en-US': '' },
      title: { 'en-US': 'Home' },
      metaTitle: { 'en-US': 'Home | Demo Company' },
      metaDescription: { 'en-US': 'Welcome to our company website' },
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
      slug: { 'en-US': 'about' },
      title: { 'en-US': 'About Us' },
      metaTitle: { 'en-US': 'About Us | Demo Company' },
      metaDescription: { 'en-US': 'Learn more about our company' },
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
      label: { 'en-US': 'Home' },
      linkTo: { 'en-US': '/[lang]/' },
      order: { 'en-US': 1 },
    },
  })

  const aboutNav = await environment.createEntry('navigationItem', {
    fields: {
      label: { 'en-US': 'About' },
      linkTo: { 'en-US': '/[lang]/about' },
      order: { 'en-US': 2 },
    },
  })

  console.log('  ✓ Created navigation items')

  // 4. 创建全局设置
  console.log('\n📝 Creating Global Settings...')

  const globalSettings = await environment.createEntry('globalSettings', {
    fields: {
      companyName: { 'en-US': 'Demo Company' },
      tagline: { 'en-US': 'Innovation Meets Excellence' },
      email: { 'en-US': 'info@demo.com' },
      phone: { 'en-US': '+1 234 567 890' },
      address: { 'en-US': '123 Main St, New York, NY 10001' },
    },
  })

  console.log('  ✓ Created global settings')

  // 5. 创建 FAQ
  console.log('\n📝 Creating FAQs...')

  const faq1 = await environment.createEntry('faq', {
    fields: {
      question: { 'en-US': 'What services do you offer?' },
      answer: {
        'en-US': await documentToRichText('We offer a wide range of services including web development, mobile app development, and digital strategy consulting.'),
      },
      category: { 'en-US': 'general' },
      order: { 'en-US': 1 },
    },
  })

  const faq2 = await environment.createEntry('faq', {
    fields: {
      question: { 'en-US': 'How can I contact you?' },
      answer: {
        'en-US': await documentToRichText('You can reach us via email at info@demo.com or call us at +1 234 567 890. We typically respond within 24 hours.'),
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

// Run if called directly
seedContentful().catch(console.error)
