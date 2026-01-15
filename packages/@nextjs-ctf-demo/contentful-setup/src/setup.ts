import contentfulManagement from 'contentful-management'
import { contentTypes } from './content-types'

const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID

if (!MANAGEMENT_TOKEN) {
  throw new Error('CONTENTFUL_MANAGEMENT_TOKEN is required')
}

if (!SPACE_ID) {
  throw new Error('CONTENTFUL_SPACE_ID is required')
}

export async function setupContentful() {
  console.log('🚀 Setting up Contentful Content Types...')
  
  const client = contentfulManagement.createClient({
    accessToken: MANAGEMENT_TOKEN,
  })
  
  const space = await client.getSpace(SPACE_ID)
  const environment = await space.getEnvironment('master')
  
  // 创建每个 Content Type
  for (const [key, contentType] of Object.entries(contentTypes)) {
    console.log(`\n📝 Creating ${contentType.name}...`)
    await createContentType(environment, contentType)
  }
  
  console.log('\n✅ Content Types setup completed!')
}

async function createContentType(environment: any, definition: any) {
  try {
    // 创建 Content Type
    const contentType = await environment.createContentType({
      name: definition.name,
      description: definition.description,
      displayField: definition.displayField,
    })
    
    console.log(`  ✓ Created "${definition.name}"`)
    
    // 创建字段
    for (const field of definition.fields) {
      await contentType.createField({
        id: field.id,
        name: field.name,
        type: field.type,
        localized: field.localized,
        required: field.required || false,
        validations: field.validations,
        defaultValue: field.defaultValue,
        items: field.items,
        linkType: field.linkType,
      })
      
      console.log(`    ✓ Added field: ${field.name}`)
    }
    
    // 发布 Content Type
    await contentType.update()
    
    console.log(`  ✓ Published "${definition.name}"`)
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      console.log(`  ⚠️  "${definition.name}" already exists, skipping...`)
    } else {
      console.error(`  ❌ Error creating "${definition.name}":`, error.message)
    }
  }
}
