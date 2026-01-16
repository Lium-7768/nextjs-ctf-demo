import { contentfulClient, type FAQ } from '../client'

export async function getFAQs(locale: string, category?: string): Promise<FAQ[]> {
  try {
    const query: Record<string, unknown> = {
      content_type: 'faq',
      locale: locale,
      order: ['fields.order'],
    }
    
    if (category) {
      query['fields.category'] = category
    }

    const entries = await contentfulClient.getEntries(query)

    return entries.items as unknown as FAQ[]
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return []
  }
}
