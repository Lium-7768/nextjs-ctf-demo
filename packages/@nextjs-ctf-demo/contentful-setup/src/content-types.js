export const contentTypes = {
  // ========== Pages ==========
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
        validations: [{ unique: true }],
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
          validations: [{ linkContentType: ['section'] }],
        },
      },
      {
        id: 'template',
        name: 'Template',
        type: 'Symbol',
        localized: false,
        validations: [{ in: ['default', 'home', 'products', 'news'] }],
        defaultValue: { 'en-US': 'default' },
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

  // ========== Sections ==========
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
        validations: [{ in: ['hero', 'content', 'features', 'testimonials', 'cta', 'services', 'pricing', 'faq'] }],
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

  // ========== Features ==========
  feature: {
    name: 'Feature',
    description: 'Feature items for features section',
    fields: [
      {
        id: 'icon',
        name: 'Icon Name',
        type: 'Symbol',
        localized: false,
        required: true,
      },
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        localized: true,
        required: true,
      },
      {
        id: 'description',
        name: 'Description',
        type: 'Text',
        localized: true,
        required: true,
      },
      {
        id: 'order',
        name: 'Order',
        type: 'Integer',
        localized: false,
      },
    ],
    displayField: 'title',
  },

  // ========== Services ==========
  service: {
    name: 'Service',
    description: 'Service items for services section',
    fields: [
      {
        id: 'icon',
        name: 'Icon Name',
        type: 'Symbol',
        localized: false,
        required: true,
      },
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        localized: true,
        required: true,
      },
      {
        id: 'description',
        name: 'Description',
        type: 'Text',
        localized: true,
        required: true,
      },
      {
        id: 'price',
        name: 'Price',
        type: 'Symbol',
        localized: true,
        required: true,
      },
      {
        id: 'features',
        name: 'Features List',
        type: 'Array',
        localized: true,
        items: { type: 'Symbol', localized: true },
        required: true,
      },
      {
        id: 'order',
        name: 'Order',
        type: 'Integer',
        localized: false,
      },
    ],
    displayField: 'title',
  },

  // ========== Testimonials ==========
  testimonial: {
    name: 'Testimonial',
    description: 'Customer testimonial items',
    fields: [
      {
        id: 'name',
        name: 'Customer Name',
        type: 'Symbol',
        localized: true,
        required: true,
      },
      {
        id: 'role',
        name: 'Role/Title',
        type: 'Symbol',
        localized: true,
        required: true,
      },
      {
        id: 'quote',
        name: 'Quote',
        type: 'Text',
        localized: true,
        required: true,
      },
      {
        id: 'rating',
        name: 'Rating (1-5)',
        type: 'Integer',
        localized: false,
        required: true,
        validations: [{ range: { min: 1, max: 5 } }],
      },
      {
        id: 'order',
        name: 'Order',
        type: 'Integer',
        localized: false,
      },
    ],
    displayField: 'name',
  },

  // ========== Pricing Plans ==========
  pricingPlan: {
    name: 'Pricing Plan',
    description: 'Pricing plan items',
    fields: [
      {
        id: 'name',
        name: 'Plan Name',
        type: 'Symbol',
        localized: true,
        required: true,
      },
      {
        id: 'price',
        name: 'Price',
        type: 'Symbol',
        localized: true,
        required: true,
      },
      {
        id: 'period',
        name: 'Billing Period',
        type: 'Symbol',
        localized: true,
        required: true,
      },
      {
        id: 'description',
        name: 'Description',
        type: 'Text',
        localized: true,
      },
      {
        id: 'features',
        name: 'Features List',
        type: 'Array',
        localized: true,
        items: { type: 'Object', localized: true },
        required: false,
      },
      {
        id: 'cta',
        name: 'CTA Button Text',
        type: 'Symbol',
        localized: true,
        required: true,
      },
      {
        id: 'popular',
        name: 'Most Popular',
        type: 'Boolean',
        localized: false,
        defaultValue: { 'en-US': false },
      },
      {
        id: 'order',
        name: 'Order',
        type: 'Integer',
        localized: false,
      },
    ],
    displayField: 'name',
  },

  // ========== FAQ Entries ==========
  faqEntry: {
    name: 'FAQ Entry',
    description: 'FAQ question and answer',
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
        validations: [{ in: ['general', 'product', 'service', 'billing'] }],
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

  // ========== Navigation Items ==========
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
        validations: [{ regexp: { pattern: '^\\/.+' } }],
      },
      {
        id: 'order',
        name: 'Order',
        type: 'Integer',
        localized: false,
      },
    ],
    displayField: 'label',
  },

  // ========== Global Settings ==========
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
        id: 'footerText',
        name: 'Footer Text',
        type: 'Text',
        localized: true,
      },
    ],
    displayField: 'companyName',
  },

  // ========== Social Links ==========
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
        required:好的！修复完成了。现在重新运行 setup：</think><tool_call>bash<arg_key>command</arg_key><arg_value>bun run packages/@nextjs-ctf-demo/contentful-setup/src/setup.ts 2>&1 | tail -50