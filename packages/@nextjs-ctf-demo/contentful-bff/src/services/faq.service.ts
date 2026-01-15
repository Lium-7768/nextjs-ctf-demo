import { contentfulClient, type FAQ } from '../client'

export async function getFAQs(locale: string, category?: string): Promise<FAQ[]> {
  try {
    const query: any = {
      content_type: 'faq',
      locale: locale,
      order: 'fields.order',
    }
    
    if (category) {
      query['fields.category'] = category
    }
    
    const entries = await contentfulClient.getEntries<FAQ>(query)
    
    return entries.items
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return []
  }
}
