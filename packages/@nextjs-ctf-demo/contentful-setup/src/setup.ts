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
    accessToken: MANAGEMENT_TOKEN!,
  })

  const space = await client.getSpace(SPACE_ID!)
  const environment = await space.getEnvironment('master')

  // 创建每个 Content Type
  for (const [key, contentType] of Object.entries(contentTypes)) {
    console.log(`\n📝 Creating ${contentType.name}...`)
    await createContentType(environment, contentType, key)
  }

  console.log('\n✅ Content Types setup completed!')
}

async function createContentType(environment: any, definition: any, contentTypeId: string) {
  try {
    // 创建 Content Type with ID (先不设置 displayField)
    const contentType = await environment.createContentTypeWithId(contentTypeId, {
      name: definition.name,
      description: definition.description,
    })

    console.log(`  ✓ Created "${definition.name}" (ID: ${contentTypeId})`)

    // 创建字段 - 使用 fields.push 而不是 createField
    for (const field of definition.fields) {
      contentType.fields.push({
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

    // 设置 displayField (字段创建后再设置)
    if (definition.displayField) {
      contentType.displayField = definition.displayField
    }

    // 发布 Content Type - 先 update，然后重新获取版本再 publish
    await contentType.update()

    // 获取更新后的 content type
    const updatedContentType = await environment.getContentType(contentTypeId)
    await updatedContentType.publish()

    console.log(`  ✓ Published "${definition.name}"`)
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      console.log(`  ⚠️  "${definition.name}" already exists, skipping...`)
    } else {
      console.error(`  ❌ Error creating "${definition.name}":`, error.message)
    }
  }
}

// Run if called directly
setupContentful().catch(console.error)
