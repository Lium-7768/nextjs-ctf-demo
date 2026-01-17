import contentfulManagement from 'contentful-management'

const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID

if (!MANAGEMENT_TOKEN) {
  throw new Error('CONTENTFUL_MANAGEMENT_TOKEN is required')
}

if (!SPACE_ID) {
  throw new Error('CONTENTFUL_SPACE_ID is required')
}

async function activateContentTypes() {
  console.log('🔄 Activating Content Types...')

  const client = contentfulManagement.createClient({
    accessToken: MANAGEMENT_TOKEN!,
  })

  const space = await client.getSpace(SPACE_ID!)
  const environment = await space.getEnvironment('master')

  const contentTypeIds = [
    'page',
    'section',
    'feature',
    'service',
    'testimonial',
    'pricingPlan',
    'faqEntry',
    'navigationItem',
    'globalSettings',
    'socialLink',
  ]

  for (const id of contentTypeIds) {
    try {
      const contentType = await environment.getContentType(id)
      if (contentType) {
        console.log(`  📋 Found "${id}" - Display Field: ${contentType.displayField}`)
        
        // Ensure displayField is set
        if (!contentType.displayField) {
          contentType.displayField = 'title'
          await contentType.update()
          console.log(`  ✓ Set displayField to "title"`)
        }
        
        // Publish again to ensure activation
        await contentType.publish()
        console.log(`  ✓ Published "${id}"`)
      }
    } catch (error: any) {
      console.error(`  ❌ Error with "${id}":`, error.message)
    }
  }

  console.log('\n✅ Activation completed!')
}

// Run if called directly
activateContentTypes().catch(console.error)
