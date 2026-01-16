import { createClient, type ContentfulClientApi } from 'contentful'

const space = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

export const contentfulClient: ContentfulClientApi<undefined> = createClient({
  space: space || '',
  accessToken: accessToken || '',
  host: 'cdn.contentful.com',
})

export interface Page {
  sys: { id: string; createdAt: string; updatedAt: string }
  fields: {
    slug: string
    title: string
    metaTitle: string
    metaDescription: string
    sections: Section[]
    template: 'default' | 'home' | 'products' | 'news'
    parentPage?: { sys: { id: string } }
    publishedAt: string
  }
}

export interface Section {
  sys: { id: string }
  fields: {
    type: 'hero' | 'content' | 'features' | 'testimonials' | 'cta' | 'services' | 'pricing' | 'faq'
    heading: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Contentful RichText type is complex
    description: any
    order: number
    featuredImage?: {
      fields: {
        file: { url: string }
        title: string
      }
    }
    features?: Feature[]
    services?: Service[]
    testimonials?: Testimonial[]
    pricingPlans?: PricingPlan[]
    faqs?: FAQEntry[]
  }
}

export interface Feature {
  sys: { id: string }
  fields: {
    icon: string
    title: string
    description: string
    order: number
  }
}

export interface Service {
  sys: { id: string }
  fields: {
    icon: string
    title: string
    description: string
    price: string
    features: string[]
    order: number
  }
}

export interface Testimonial {
  sys: { id: string }
  fields: {
    name: string
    role: string
    quote: string
    rating: number
    order: number
  }
}

export interface PricingPlan {
  sys: { id: string }
  fields: {
    name: string
    price: string
    period: string
    description: string
    features: Array<{ name: string; included: boolean }>
    cta: string
    popular: boolean
    order: number
  }
}

export interface FAQEntry {
  sys: { id: string }
  fields: {
    question: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Contentful RichText type is complex
    answer: any
    category: string
    order: number
  }
}

export interface NavigationItem {
  sys: { id: string }
  fields: {
    label: string
    linkTo: string
    order: number
    parent?: { sys: { id: string } }
  }
}

export interface GlobalSettings {
  sys: { id: string }
  fields: {
    companyName: string
    tagline: string
    logo?: {
      fields: { file: { url: string } }
    }
    email: string
    phone: string
    address: string
    socialLinks: { label: string; url: string }[]
    footerText?: string
  }
}

export type FAQ = FAQEntry
