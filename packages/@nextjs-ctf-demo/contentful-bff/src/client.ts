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
    slug: { 'zh-CN': string; 'en-US': string }
    title: { 'zh-CN': string; 'en-US': string }
    metaTitle: { 'zh-CN': string; 'en-US': string }
    metaDescription: { 'zh-CN': string; 'en-US': string }
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
    heading: { 'zh-CN': string; 'en-US': string }
    description: any
    order: number
    featuredImage?: {
      fields: {
        file: { url: string }
        title: { 'zh-CN': string; 'en-US': string }
      }
    }
  }
}

export interface NavigationItem {
  sys: { id: string }
  fields: {
    label: { 'zh-CN': string; 'en-US': string }
    linkTo: string
    order: number
    parent?: { sys: { id: string } }
  }
}

export interface GlobalSettings {
  sys: { id: string }
  fields: {
    companyName: { 'zh-CN': string; 'en-US': string }
    tagline: { 'zh-CN': string; 'en-US': string }
    logo?: {
      fields: { file: { url: string } }
    }
    email: string
    phone: string
    address: { 'zh-CN': string; 'en-US': string }
    socialLinks: { label: string; url: string }[]
    footerText: { 'zh-CN': string; 'en-US': string }
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
