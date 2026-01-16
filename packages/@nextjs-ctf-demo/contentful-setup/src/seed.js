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

async function objectToFeaturesArray(features: Array<{ name: string; included: boolean }>): Promise<any> {
  return features.map(f => ({
    nodeType: 'paragraph',
    data: {},
    content: [
      {
        nodeType: 'text',
        value: f.included ? '✓ ' : '✗ ',
        marks: [],
        data: {},
      },
      {
        nodeType: 'text',
        value: f.name,
        marks: [],
        data: {},
      },
    ],
  }))
}

export async function seedContentful() {
  console.log('🌱 Seeding Contentful with demo data...')

  const client = contentfulManagement.createClient({
    accessToken: MANAGEMENT_TOKEN!,
  })

  const space = await client.getSpace(SPACE_ID!)
  const environment = await space.getEnvironment('master')

  // ========== 1. Create Features ==========
  console.log('\n📝 Creating Features...')

  const features = []
  for (let i = 0; i < 6; i++) {
    const featureData = [
      { icon: 'zap', title: 'Lightning Fast', description: 'Built with Next.js 16 and Turbopack for blazing fast performance' },
      { icon: 'shield', title: 'Enterprise Security', description: 'Bank-grade security with end-to-end encryption' },
      { icon: 'users', title: 'Collaborative', description: 'Work together with your team in real-time' },
      { icon: 'globe', title: 'Global Scale', description: 'Deploy worldwide with our CDN infrastructure' },
      { icon: 'target', title: 'Precision Targeting', description: 'AI-powered analytics for better insights' },
      { icon: 'trendingUp', title: 'Scalable Growth', description: 'Easily scale from startup to enterprise' },
    ][i]

    const feature = await environment.createEntry('feature', {
      fields: {
        icon: { 'en-US': featureData.icon },
        title: { 'en-US': featureData.title },
        description: { 'en-US': featureData.description },
        order: { 'en-US': i + 1 },
      },
    })
    await feature.publish()
    features.push(feature)
  }

  console.log('  ✓ Created 6 features')

  // ========== 2. Create Services ==========
  console.log('\n📝 Creating Services...')

  const services = []
  const serviceData = [
    {
      icon: 'code2',
      title: 'Web Development',
      description: 'Custom web applications built with Next.js, React, and modern technologies.',
      price: 'Starting at $999',
      features: ['Responsive Design', 'SEO Optimized', 'Fast Performance', 'Secure Code'],
    },
    {
      icon: 'database',
      title: 'Backend Development',
      description: 'Robust API development with Node.js, Python, and cloud infrastructure.',
      price: 'Starting at $1,499',
      features: ['REST APIs', 'GraphQL', 'Database Design', 'Authentication'],
    },
    {
      icon: 'globe',
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile applications for iOS and Android.',
      price: 'Starting at $2,499',
      features: ['React Native', 'Flutter', 'Push Notifications', 'Offline Support'],
    },
    {
      icon: 'smartphone',
      title: 'UI/UX Design',
      description: 'Beautiful and intuitive interfaces designed for maximum user engagement.',
      price: 'Starting at $799',
      features: ['Wireframes', 'Prototypes', 'User Testing', 'Design Systems'],
    },
    {
      icon: 'shield',
      title: 'Security Audit',
      description: 'Comprehensive security analysis and vulnerability assessments.',
      price: 'Starting at $1,999',
      features: ['Penetration Testing', 'Code Review', 'Security Recommendations', 'Compliance'],
    },
    {
      icon: 'zap',
      title: 'Performance Optimization',
      description: 'Speed up your applications and improve user experience.',
      price: 'Starting at $599',
      features: ['Load Testing', 'Code Optimization', 'Caching Strategy', 'CDN Setup'],
    },
  ]

  for (let i = 0; i < serviceData.length; i++) {
    const service = await environment.createEntry('service', {
      fields: {
        icon: { 'en-US': serviceData[i].icon },
        title: { 'en-US': serviceData[i].title },
        description: { 'en-US': serviceData[i].description },
        price: { 'en-US': serviceData[i].price },
        features: { 'en-US': serviceData[i].features },
        order: { 'en-US': i + 1 },
      },
    })
    await service.publish()
    services.push(service)
  }

  console.log('  ✓ Created 6 services')

  // ========== 3. Create Testimonials ==========
  console.log('\n📝 Creating Testimonials...')

  const testimonials = []
  const testimonialData = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart',
      quote: 'This platform transformed our workflow completely. The speed and reliability are unmatched.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'CTO, InnovateCo',
      quote: 'Best investment we made this year. The team loves using it every day.',
      rating: 5,
    },
    {
      name: 'Emily Davis',
      role: 'Product Manager',
      quote: 'Incredible support and features. Highly recommend to any business.',
      rating: 5,
    },
  ]

  for (let i = 0; i < testimonialData.length; i++) {
    const testimonial = await environment.createEntry('testimonial', {
      fields: {
        name: { 'en-US': testimonialData[i].name },
        role: { 'en-US': testimonialData[i].role },
        quote: { 'en-US': testimonialData[i].quote },
        rating: { 'en-US': testimonialData[i].rating },
        order: { 'en-US': i + 1 },
      },
    })
    await testimonial.publish()
    testimonials.push(testimonial)
  }

  console.log('  ✓ Created 3 testimonials')

  // ========== 4. Create Pricing Plans ==========
  console.log('\n📝 Creating Pricing Plans...')

  const pricingPlans = []
  const pricingData = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'Forever',
      description: 'Perfect for trying out the platform',
      features: [
        { name: '5 Projects', included: true },
        { name: '10GB Storage', included: true },
        { name: 'Basic Support', included: true },
        { name: 'Community Access', included: true },
        { name: 'Custom Domain', included: false },
        { name: 'API Access', included: false },
        { name: 'Priority Support', included: false },
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$49',
      period: '/month',
      description: 'Best for growing businesses',
      features: [
        { name: 'Unlimited Projects', included: true },
        { name: '100GB Storage', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Community Access', included: true },
        { name: 'Custom Domain', included: true },
        { name: 'API Access', included: true },
        { name: 'Advanced Analytics', included: false },
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      description: 'For large organizations',
      features: [
        { name: 'Unlimited Projects', included: true },
        { name: '1TB Storage', included: true },
        { name: '24/7 Support', included: true },
        { name: 'Dedicated Account Manager', included: true },
        { name: 'Custom Domain', included: true },
        { name: 'Full API Access', included: true },
        { name: 'Advanced Analytics', included: true },
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

  for (let i = 0; i < pricingData.length; i++) {
    const plan = await environment.createEntry('pricingPlan', {
      fields: {
        name: { 'en-US': pricingData[i].name },
        price: { 'en-US': pricingData[i].price },
        period: { 'en-US': pricingData[i].period },
        description: { 'en-US': pricingData[i].description },
        features: { 'en-US': pricingData[i].features },
        cta: { 'en-US': pricingData[i].cta },
        popular: { 'en-US': pricingData[i].popular },
        order: { 'en-US': i + 1 },
      },
    })
    await plan.publish()
    pricingPlans.push(plan)
  }

  console.log('  ✓ Created 3 pricing plans')

  // ========== 5. Create FAQ Entries ==========
  console.log('\n📝 Creating FAQ Entries...')

  const faqEntries = []
  const faqData = [
    {
      question: 'What is Next.js CTF Demo?',
      answer: 'Next.js CTF Demo is a modern web application showcasing power of Next.js 16, React 19, and Contentful. It features a headless CMS integration, internationalization, and beautiful Glassmorphism UI design.',
      category: 'general',
    },
    {
      question: 'How do I get started?',
      answer: 'Simply sign up for a free account and you will have instant access to all our features. No credit card required. You can upgrade at any time when you need more resources.',
      category: 'general',
    },
    {
      question: 'What technologies are used?',
      answer: 'This project uses Next.js 16 with App Router, React 19, TypeScript, Tailwind CSS v4, Contentful CMS, TanStack Query for data fetching, and features internationalization support for Chinese and English.',
      category: 'product',
    },
    {
      question: 'Can I cancel my subscription?',
      answer: 'Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your access will continue until end of your billing period.',
      category: 'billing',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. If you are not satisfied with our service, contact support within 30 days for a full refund.',
      category: 'billing',
    },
    {
      question: 'How secure is my data?',
      answer: 'We use enterprise-grade security measures including end-to-end encryption, regular security audits, and compliance with GDPR and SOC 2 standards. Your data is always safe with us.',
      category: 'service',
    },
  ]

  for (let i = 0; i < faqData.length; i++) {
    const faq = await environment.createEntry('faqEntry', {
      fields: {
        question: { 'en-US': faqData[i].question },
        answer: { 'en-US': await documentToRichText(faqData[i].answer) },
        category: { 'en-US': faqData[i].category },
        order: { 'en-US': i + 1 },
      },
    })
    await faq.publish()
    faqEntries.push(faq)
  }

  console.log('  ✓ Created 6 FAQ entries')

  // ========== 6. Create Sections ==========
  console.log('\n📝 Creating Sections...')

  const heroSection = await environment.createEntry('section', {
    fields: {
      type: { 'en-US': 'hero' },
      heading: { 'en-US': 'Build Your Future' },
      description: {
        'en-US': await documentToRichText('Innovation meets excellence. We are committed to delivering cutting-edge solutions that transform businesses worldwide.'),
      },
      order: { 'en-US': 1 },
    },
  })
  await heroSection.publish()

  const featuresSection = await environment.createEntry('section', {
    fields: {
      type: { 'en-US': 'features' },
      heading: { 'en-US': 'Why Choose Us' },
      description: {
        'en-US': await documentToRichText('Our platform provides everything you need to succeed in the digital age.'),
      },
      features: { 'en-US': features.map(f => ({ sys: f.sys })) },
      order: { 'en-US': 2 },
    },
  })
  await featuresSection.publish()

  const servicesSection = await environment.createEntry('section', {
    fields: {
      type: { 'en-US': 'services' },
      heading: { 'en-US': 'Our Services' },
      description: {
        'en-US': await documentToRichText('Comprehensive solutions tailored to your business needs.'),
      },
      services: { 'en-US': services.map(s => ({ sys: s.sys })) },
      order: { 'en-US': 3 },
    },
  })
  await servicesSection.publish()

  const testimonialsSection = await environment.createEntry('section', {
    fields: {
      type: { 'en-US': 'testimonials' },
      heading: { 'en-US': 'What Our Clients Say' },
      description: {
        'en-US': await documentToRichText("Don't just take our word for it. Here's what our customers have to say."),
      },
      testimonials: { 'en-US': testimonials.map(t => ({ sys: t.sys })) },
      order: { 'en-US': 4 },
    },
  })
  await testimonialsSection.publish()

  const pricingSection = await environment.createEntry('section', {
    fields: {
      type: { 'en-US': 'pricing' },
      heading: { 'en-US': 'Simple, Transparent Pricing' },
      description: {
        'en-US': await documentToRichText('Choose the plan that works best for your needs. Upgrade or downgrade anytime.'),
      },
      pricingPlans: { 'en-US': pricingPlans.map(p => ({ sys: p.sys })) },
      order: { 'en-US': 5 },
    },
  })
  await pricingSection.publish()

  const faqSection = await environment.createEntry('section', {
    fields: {
      type: { 'en-US': 'faq' },
      heading: { 'en-US': 'Frequently Asked Questions' },
      description: {
        'en-US': await documentToRichText('Find answers to common questions about our platform and services.'),
      },
      faqs: { 'en-US': faqEntries.map(f => ({ sys: f.sys })) },
      order: { 'en-US': 6 },
    },
  })
  await faqSection.publish()

  const ctaSection = await environment.createEntry('section', {
    fields: {
      type: { 'en-US': 'cta' },
      heading: { 'en-US': 'Ready to Get Started?' },
      description: {
        'en-US': await documentToRichText('Join thousands of satisfied customers who have already transformed their business with us.'),
      },
      order: { 'en-US': 7 },
    },
  })
  await ctaSection.publish()

  console.log('  ✓ Created 7 sections')

  // ========== 7. Create Pages ==========
  console.log('\n📝 Creating Pages...')

  const homePage = await environment.createEntry('page', {
    fields: {
      slug: { 'en-US': '' },
      title: { 'en-US': 'Home' },
      metaTitle: { 'en-US': 'Home | Next.js CTF Demo' },
      metaDescription: { 'en-US': 'Next.js 16 + React 19 + Contentful + Glassmorphism UI' },
      sections: {
        'en-US': [
          { sys: { id: heroSection.sys.id, type: 'Link', linkType: 'Entry' } },
          { sys: { id: featuresSection.sys.id, type: 'Link', linkType: 'Entry' } },
          { sys: { id: testimonialsSection.sys.id, type: 'Link', linkType: 'Entry' } },
          { sys: { id: ctaSection.sys.id, type: 'Link', linkType: 'Entry' } },
        ],
      },
      template: { 'en-US': 'home' },
      publishedAt: { 'en-US': new Date().toISOString() },
    },
  })

  const servicesPage = await environment.createEntry('page', {
    fields: {
      slug: { 'en-US': 'services' },
      title: { 'en-US': 'Services' },
      metaTitle: { 'en-US': 'Services | Next.js CTF Demo' },
      metaDescription: { 'en-US': 'Comprehensive services for your business needs' },
      sections: {
        'en-US': [
          { sys: { id: servicesSection.sys.id, type: 'Link', linkType: 'Entry' } },
        ],
      },
      template: { 'en-US': 'default' },
      publishedAt: { 'en-US': new Date().toISOString() },
    },
  })

  const pricingPage = await environment.createEntry('page', {
    fields: {
      slug: { 'en-US': 'pricing' },
      title: { 'en-US': 'Pricing' },
      metaTitle: { 'en-US': 'Pricing | Next.js CTF Demo' },
      metaDescription: { 'en-US': 'Simple and transparent pricing for everyone' },
      sections: {
        'en-US': [
          { sys: { id: pricingSection.sys.id, type: 'Link', linkType: 'Entry' } },
          { sys: { id: ctaSection.sys.id, type: 'Link', linkType: 'Entry' } },
        ],
      },
      template: { 'en-US': 'default' },
      publishedAt: { 'en-US': new Date().toISOString() },
    },
  })

  const faqPage = await environment.createEntry('page', {
    fields: {
      slug: { 'en-US': 'faq' },
      title: { 'en-US': 'FAQ' },
      metaTitle: { 'en-US': 'FAQ | Next.js CTF Demo' },
      metaDescription: { 'en-US': 'Frequently asked questions about our platform' },
      sections: {
        'en-US': [
          { sys: { id: faqSection.sys.id, type: 'Link', linkType: 'Entry' } },
        ],
      },
      template: { 'en-US': 'default' },
      publishedAt: { 'en-US': new Date().toISOString() },
    },
  })

  console.log('  ✓ Created 4 pages (home, services, pricing, faq)')

  // ========== 8. Create Navigation ==========
  console.log('\n📝 Creating Navigation...')

  const navItems = []
  const navData = [
    { label: 'Home', linkTo: '/[lang]/', order: 1 },
    { label: 'Services', linkTo: '/[lang]/services', order: 2 },
    { label: 'Pricing', linkTo: '/[lang]/pricing', order:3 },
    { label: 'FAQ', linkTo: '/[lang]/faq', order: 4 },
  ]

  for (let i = 0; i < navData.length; i++) {
    const nav = await environment.createEntry('navigationItem', {
      fields: {
        label: { 'en-US': navData[i].label },
        linkTo: { 'en-US': navData[i].linkTo },
        order: { 'en-US': navData[i].order },
      },
    })
    await nav.publish()
    navItems.push(nav)
  }

  console.log('  ✓ Created 4 navigation items')

  // ========== 9. Create Global Settings ==========
  console.log('\n📝 Creating Global Settings...')

  const globalSettings = await environment.createEntry('globalSettings', {
    fields: {
      companyName: { 'en-US': 'Next.js CTF Demo' },
      tagline: { 'en-US': 'Innovation Meets Excellence' },
      email: { 'en-US': 'info@example.com' },
      phone: { 'en-US': '+1 234 567 890' },
      address: { 'en-US': '123 Main St, New York, NY 10001' },
      footerText: { 'en-US': 'Thank you for visiting our website. We are committed to delivering exceptional digital experiences.' },
    },
  })

  console.log('  ✓ Created global settings')

  // ========== 10. Publish everything ==========
  console.log('\n🚀 Publishing all entries...')

  await homePage.publish()
  await servicesPage.publish()
  await pricingPage.publish()
  await faqPage.publish()
  await globalSettings.publish()

  console.log('\n✅ Demo data seeded successfully!')
  console.log('\n📊 Summary:')
  console.log('  - 6 Features')
  console.log('  - 6 Services')
  console.log('  - 3 Testimonials')
  console.log(' - 3 Pricing Plans')
  console.log(' - 6 FAQ Entries')
  console.log(' - 7 Sections')
  console.log('  - 4 Pages')
  console.log('  - 4 Navigation Items')
  console.log('  - 1 Global Settings')
}

  // Run if called directly
seedContentful().catch(console.error)
}
