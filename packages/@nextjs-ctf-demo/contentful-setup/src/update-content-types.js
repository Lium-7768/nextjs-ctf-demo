import contentfulManagement from 'contentful-management'

const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID

if (!MANAGEMENT_TOKEN) {
  throw new Error('CONTENTFUL_MANAGEMENT_TOKEN is required')
}

if (!SPACE_ID) {
  throw new Error('CONTENTFUL_SPACE_ID is required')
}

const { migration } = contentfulManagement

async function updateContentTypes() {
  console.log('🔄 Updating Content Types with new fields...')

  const client = contentfulManagement.createClient({
    accessToken: MANAGEMENT_TOKEN!,
  })

  const space = await client.getSpace(SPACE_ID!)
  const environment = await space.getEnvironment('master')

  // Update Section Content Type - Add new array fields
  console.log('\n📝 Updating Section Content Type...')
  
  try {
    // Add features field
    await migration.createField('section', 'features', {
      name: 'Features',
      type: 'Array',
      localized: false,
      required: false,
      items: {
        type: 'Link',
        linkType: 'Entry',
        validations: [{ linkContentType: ['feature'] }],
      },
    })
    console.log('  ✓ Added "features" field to Section')

    // Add services field
    await migration.createField('section', 'services', {
      name: 'Services',
      type: 'Array',
      localized: false,
      required: false,
      items: {
        type: 'Link',
        linkType: 'Entry',
        validations: [{ linkContentType: ['service'] }],
      },
    })
    console.log('  ✓ Added "services" field to Section')

    // Add testimonials field
    await migration.createField('section', 'testimonials', {
      name: 'Testimonials',
      type: 'Array',
      localized: false,
      required: false,
      items: {
        type: 'Link',
        linkType: 'Entry',
        validations: [{ linkContentType: ['testimonial'] }],
      },
    })
    console.log('  ✓ Added "testimonials" field to Section')

    // Add pricingPlans field
    await migration.createField('section', 'pricingPlans', {
      name: 'Pricing Plans',
      type: 'Array',
      localized: false,
      required: false,
      items: {
        type: 'Link',
        linkType: 'Entry',
        validations: [{ linkContentType: ['pricingPlan'] }],
      },
    })
    console.log('  ✓ Added "pricingPlans" field to Section')

    // Add faqs field
    await migration.createField('section', 'faqs', {
      name: 'FAQs',
      type: 'Array',
      localized: false,
      required: false,
      items: {
        type: 'Link',
        linkType: 'Entry',
        validations: [{ linkContentType: ['faqEntry'] }],
      },
    })
    console.log('  ✓ Added "faqs" field to Section')

    // Update type validations to include new types
    await migrationChangeFieldType('section', 'type', {
      name: 'Type',
      type: 'Symbol',
      localized: false,
      required: true,
      validations: [
        { in: ['hero', 'content', 'features', 'testimonials', 'cta', 'services', 'pricing', 'faq'] },
      ],
    })
    console.log('  ✓ Updated "type" field in Section')

    console.log('\n✅ Section Content Type updated!')
  } catch (error) {
    if (error.message && error.message.includes('already exists')) {
      console.log('  ⚠️  Field might already exist, continuing...')
    } else {
      console.error('  ❌ Error updating Section Content Type:', error.message)
    }
  }

  console.log('\n🚀 Content Types update completed!')
}

// Run if called directly
updateContentTypes().catch(console.error)
