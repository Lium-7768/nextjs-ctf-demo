import { contentfulClient, type Feature, type Service, type Testimonial, type PricingPlan, type FAQEntry } from '../client'

// Fetch features
export async function getFeatures(locale: string): Promise<Feature[]> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'feature',
      locale: locale,
      order: ['fields.order'],
    })
    return entries.items as unknown as Feature[]
  } catch (error) {
    console.error('Error fetching features:', error)
    return []
  }
}

// Fetch services
export async function getServices(locale: string): Promise<Service[]> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'service',
      locale: locale,
      order: ['fields.order'],
    })
    return entries.items as unknown as Service[]
  } catch (error) {
    console.error('Error fetching services:', error)
    return []
  }
}

// Fetch testimonials
export async function getTestimonials(locale: string): Promise<Testimonial[]> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'testimonial',
      locale: locale,
      order: ['fields.order'],
    })
    return entries.items as unknown as Testimonial[]
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }
}

// Fetch pricing plans
export async function getPricingPlans(locale: string): Promise<PricingPlan[]> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'pricingPlan',
      locale: locale,
      order: ['fields.order'],
    })
    return entries.items as unknown as PricingPlan[]
  } catch (error) {
    console.error('Error fetching pricing plans:', error)
    return []
  }
}

// Fetch FAQs
export async function getFAQs(locale: string, category?: string): Promise<FAQEntry[]> {
  try {
    const query: Record<string, unknown> = {
      content_type: 'faqEntry',
      locale: locale,
      order: ['fields.order'],
    }
    
    if (category) {
      query['fields.category'] = category
    }

    const entries = await contentfulClient.getEntries(query)
    return entries.items as unknown as FAQEntry[]
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return []
  }
}
