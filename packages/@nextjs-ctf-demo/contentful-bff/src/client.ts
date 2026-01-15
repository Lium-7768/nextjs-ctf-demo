import { createClient, type ContentfulClientApi } from 'contentful'

const space = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

export const contentfulClient: ContentfulClientApi<undefined> = createClient({
  space: space || '',
  accessToken: accessToken || '',
})

export interface Page {
  sys: { id: string; createdAt: string; updatedAt: string }
  fields: {
    slug: string  // Unfolded when locale is specified
    title: string  // Unfolded when locale is specified
    metaTitle: string  // Unfolded when locale is specified
    metaDescription: string  // Unfolded when locale is specified
    sections: Section[]
    template: 'default' | 'home' | 'products' | 'news'
    parentPage?: { sys: { id: string } }
    publishedAt: string
  }
}

export interface Section {
  sys: { id: string }
  fields: {
    type: 'hero' | 'content' | 'features' | 'testimonials' | 'cta'
    heading: string  // Unfolded when locale is specified
    description: any
    order: number
    featuredImage?: {
      fields: {
        file: { url: string }
        title: string  // Unfolded when locale is specified
      }
    }
  }
}

export interface NavigationItem {
  sys: { id: string }
  fields: {
    label: string  // Unfolded when locale is specified
    linkTo: string
    order: number
    parent?: { sys: { id: string } }
  }
}

export interface GlobalSettings {
  sys: { id: string }
  fields: {
    companyName: string  // Unfolded when locale is specified
    tagline: string  // Unfolded when locale is specified
    logo?: {
      fields: { file: { url: string } }
    }
    email: string
    phone: string
    address: string  // Unfolded when locale is specified
    socialLinks: { label: string; url: string }[]
    footerText?: string  // Unfolded when locale is specified
  }
}

export interface FAQ {
  sys: { id: string }
  fields: {
    question: { 'zh-CN': string; 'en-US': string }
    answer: any
    category: string
    order: number
  }
}
