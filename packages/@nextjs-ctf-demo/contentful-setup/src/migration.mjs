import {
  migrationCreateContentType,
  migrationCreateField,
  migrationChangeFieldType,
  migrationDeleteField,
} from 'contentful-migration'

export default async function (migration, { makeRequest }) {
  const { migration, actions } = migration

  // 1. Create Page Content Type
  const pageContentType = await migrationCreateContentType('page', {
    name: 'Page',
    description: 'Website pages with sections',
    displayField: 'title',
  })

  // Page fields
  await migrationCreateField('page', 'slug', {
    name: 'Slug',
    type: 'Symbol',
    localized: true,
    required: true,
  })

  await migrationCreateField('page', 'title', {
    name: 'Title',
    type: 'Symbol',
    localized: true,
    required: true,
  })

  await migrationCreateField('page', 'metaTitle', {
    name: 'Meta Title',
    type: 'Symbol',
    localized: true,
  })

  await migrationCreateField('page', 'metaDescription', {
    name: 'Meta Description',
    type: 'Text',
    localized: true,
  })

  await migrationCreateField('page', 'sections', {
    name: 'Sections',
    type: 'Array',
    localized: false,
    items: {
      type: 'Link',
      linkType: 'Entry',
      validations: [
        {
          linkContentType: ['section'],
        },
      ],
    },
  })

  await migrationCreateField('page', 'template', {
    name: 'Template',
    type: 'Symbol',
    localized: false,
    validations: [
      {
        in: ['default', 'home', 'products', 'news'],
      },
    ],
    defaultValue: {
      'en-US': 'default',
    },
  })

  await migrationCreateField('page', 'publishedAt', {
    name: 'Published At',
    type: 'Date',
    localized: false,
  })

  // 2. Create Section Content Type
  const sectionContentType = await migrationCreateContentType('section', {
    name: 'Section',
    description: 'Page content sections',
    displayField: 'heading',
  })

  await migrationCreateField('section', 'type', {
    name: 'Type',
    type: 'Symbol',
    localized: false,
    required: true,
    validations: [
      {
        in: ['hero', 'content', 'features', 'testimonials', 'cta'],
      },
    ],
  })

  await migrationCreateField('section', 'heading', {
    name: 'Heading',
    type: 'Symbol',
    localized: true,
  })

  await migrationCreateField('section', 'description', {
    name: 'Description',
    type: 'RichText',
    localized: true,
  })

  await migrationCreateField('section', 'order', {
    name: 'Order',
    type: 'Integer',
    localized: false,
  })

  await migrationCreateField('section', 'featuredImage', {
    name: 'Featured Image',
    type: 'Link',
    localized: true,
    linkType: 'Asset',
  })

  // 3. Create NavigationItem Content Type
  const navigationContentType = await migrationCreateContentType('navigationItem', {
    name: 'Navigation Item',
    description: 'Website navigation menu items',
    displayField: 'label',
  })

  await migrationCreateField('navigationItem', 'label', {
    name: 'Label',
    type: 'Symbol',
    localized: true,
    required: true,
  })

  await migrationCreateField('navigationItem', 'linkTo', {
    name: 'Link To',
    type: 'Symbol',
    localized: false,
    required: true,
    validations: [
      {
        regexp: {
          pattern: '^\\/.+',
        },
      },
    ],
  })

  await migrationCreateField('navigationItem', 'order', {
    name: 'Order',
    type: 'Integer',
    localized: false,
  })

  // 4. Create GlobalSettings Content Type
  const globalSettingsContentType = await migrationCreateContentType('globalSettings', {
    name: 'Global Settings',
    description: 'Website-wide settings',
    displayField: 'companyName',
  })

  await migrationCreateField('globalSettings', 'companyName', {
    name: 'Company Name',
    type: 'Symbol',
    localized: true,
    required: true,
  })

  await migrationCreateField('globalSettings', 'tagline', {
    name: 'Tagline',
    type: 'Symbol',
    localized: true,
  })

  await migrationCreateField('globalSettings', 'logo', {
    name: 'Logo',
    type: 'Link',
    localized: true,
    linkType: 'Asset',
  })

  await migrationCreateField('globalSettings', 'email', {
    name: 'Email',
    type: 'Symbol',
    localized: false,
  })

  await migrationCreateField('globalSettings', 'phone', {
    name: 'Phone',
    type: 'Symbol',
    localized: false,
  })

  await migrationCreateField('globalSettings', 'address', {
    name: 'Address',
    type: 'Text',
    localized: true,
  })

  await migrationCreateField('globalSettings', 'footerText', {
    name: 'Footer Text',
    type: 'Text',
    localized: true,
  })

  // 5. Create FAQ Content Type
  const faqContentType = await migrationCreateContentType('faq', {
    name: 'FAQ',
    description: 'Frequently Asked Questions',
    displayField: 'question',
  })

  await migrationCreateField('faq', 'question', {
    name: 'Question',
    type: 'Symbol',
    localized: true,
    required: true,
  })

  await migrationCreateField('faq', 'answer', {
    name: 'Answer',
    type: 'RichText',
    localized: true,
    required: true,
  })

  await migrationCreateField('faq', 'category', {
    name: 'Category',
    type: 'Symbol',
    localized: false,
    validations: [
      {
        in: ['general', 'product', 'service', 'billing'],
      },
    ],
  })

  await migrationCreateField('faq', 'order', {
    name: 'Order',
    type: 'Integer',
    localized: false,
  })
}
