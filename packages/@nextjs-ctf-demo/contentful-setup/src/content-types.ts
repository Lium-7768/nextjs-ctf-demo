export const contentTypes = {
  page: {
    name: 'Page',
    description: 'Website pages with sections',
    fields: [
      {
        id: 'slug',
        name: 'Slug',
        type: 'Symbol',
        localized: true,
        required: true,
        validations: [
          {
            unique: true,
          },
        ],
      },
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        localized: true,
        required: true,
      },
      {
        id: 'metaTitle',
        name: 'Meta Title',
        type: 'Symbol',
        localized: true,
      },
      {
        id: 'metaDescription',
        name: 'Meta Description',
        type: 'Text',
        localized: true,
      },
      {
        id: 'sections',
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
      },
      {
        id: 'template',
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
      },
      {
        id: 'parentPage',
        name: 'Parent Page',
        type: 'Link',
        localized: false,
        linkType: 'Entry',
        validations: [
          {
            linkContentType: ['page'],
          },
        ],
      },
      {
        id: 'publishedAt',
        name: 'Published At',
        type: 'Date',
        localized: false,
      },
    ],
    displayField: 'title',
  },

  section: {
    name: 'Section',
    description: 'Page content sections',
    fields: [
      {
        id: 'type',
        name: 'Type',
        type: 'Symbol',
        localized: false,
        required: true,
        validations: [
          {
            in: ['hero', 'content', 'features', 'testimonials', 'cta'],
          },
        ],
      },
      {
        id: 'heading',
        name: 'Heading',
        type: 'Symbol',
        localized: true,
      },
      {
        id: 'description',
        name: 'Description',
        type: 'RichText',
        localized: true,
      },
      {
        id: 'order',
        name: 'Order',
        type: 'Integer',
        localized: false,
      },
      {
        id: 'featuredImage',
        name: 'Featured Image',
        type: 'Link',
        localized: true,
        linkType: 'Asset',
      },
    ],
    displayField: 'heading',
  },

  navigationItem: {
    name: 'Navigation Item',
    description: 'Website navigation menu items',
    fields: [
      {
        id: 'label',
        name: 'Label',
        type: 'Symbol',
        localized: true,
        required: true,
      },
      {
        id: 'linkTo',
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
      },
      {
        id: 'order',
        name: 'Order',
        type: 'Integer',
        localized: false,
      },
      {
        id: 'parent',
        name: 'Parent Menu Item',
        type: 'Link',
        localized: false,
        linkType: 'Entry',
        validations: [
          {
            linkContentType: ['navigationItem'],
          },
        ],
      },
    ],
    displayField: 'label',
  },

  globalSettings: {
    name: 'Global Settings',
    description: 'Website-wide settings',
    fields: [
      {
        id: 'companyName',
        name: 'Company Name',
        type: 'Symbol',
        localized: true,
        required: true,
      },
      {
        id: 'tagline',
        name: 'Tagline',
        type: 'Symbol',
        localized: true,
      },
      {
        id: 'logo',
        name: 'Logo',
        type: 'Link',
        localized: true,
        linkType: 'Asset',
      },
      {
        id: 'email',
        name: 'Email',
        type: 'Symbol',
        localized: false,
      },
      {
        id: 'phone',
        name: 'Phone',
        type: 'Symbol',
        localized: false,
      },
      {
        id: 'address',
        name: 'Address',
        type: 'Text',
        localized: true,
      },
      {
        id: 'socialLinks',
        name: 'Social Links',
        type: 'Array',
        localized: false,
        items: {
          type: 'Link',
          linkType: 'Entry',
          validations: [
            {
              linkContentType: ['socialLink'],
            },
          ],
        },
      },
      {
        id: 'footerText',
        name: 'Footer Text',
        type: 'Text',
        localized: true,
      },
    ],
    displayField: 'companyName',
  },

  faq: {
    name: 'FAQ',
    description: 'Frequently Asked Questions',
    fields: [
      {
        id: 'question',
        name: 'Question',
        type: 'Symbol',
        localized: true,
        required: true,
      },
      {
        id: 'answer',
        name: 'Answer',
        type: 'RichText',
        localized: true,
        required: true,
      },
      {
        id: 'category',
        name: 'Category',
        type: 'Symbol',
        localized: false,
        validations: [
          {
            in: ['general', 'product', 'service', 'billing'],
          },
        ],
      },
      {
        id: 'order',
        name: 'Order',
        type: 'Integer',
        localized: false,
      },
    ],
    displayField: 'question',
  },

  socialLink: {
    name: 'Social Link',
    description: 'Social media link',
    fields: [
      {
        id: 'label',
        name: 'Label',
        type: 'Symbol',
        localized: true,
        required: true,
      },
      {
        id: 'url',
        name: 'URL',
        type: 'Symbol',
        localized: false,
        required: true,
        validations: [
          {
            regexp: {
              pattern: '^https?:\\/\\/.+',
            },
          },
        ],
      },
      {
        id: 'icon',
        name: 'Icon',
        type: 'Symbol',
        localized: false,
      },
    ],
    displayField: 'label',
  },
}
