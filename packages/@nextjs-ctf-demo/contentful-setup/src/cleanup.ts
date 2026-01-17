import contentfulManagement from 'contentful-management'

const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID

if (!MANAGEMENT_TOKEN) {
  throw new Error('CONTENTFUL_MANAGEMENT_TOKEN is required')
}

if (!SPACE_ID) {
  throw new Error('CONTENTFUL_SPACE_ID is required')
}

async function cleanupContentful() {
  console.log('🧹 Cleaning up existing Content Types...')

  const client = contentfulManagement.createClient({
    accessToken: MANAGEMENT_TOKEN!,
  })

  const space = await client.getSpace(SPACE_ID!)
  const environment = await space.getEnvironment('master')

  // Content Type IDs to delete
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
        // Unpublish first
        await contentType.unpublish()
        console.log(`  ✓ Unpublished "${id}"`)
        
        // Delete
        await contentType.delete()
        console.log(`  ✓ Deleted "${id}"`)
      }
    } catch (error: any) {
      if (error.message && error.message.includes('not found')) {
        console.log(`  ⚠️  "${id}" not found, skipping...`)
      } else {
        console.error(`  ❌ Error deleting "${id}":`, error.message)
      }
    }
  }

  console.log('\n✅ Cleanup completed!')
}

// Run if called directly
cleanupContentful().catch(console.error)
