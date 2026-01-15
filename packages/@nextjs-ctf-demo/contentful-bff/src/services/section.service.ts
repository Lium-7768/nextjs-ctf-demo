import { contentfulClient, type Section } from '../client'

export async function getSections(sectionIds?: string[], locale?: string): Promise<Section[]> {
  try {
    const query: any = {
      content_type: 'section',
      order: ['fields.order'],
    }
    
    if (sectionIds && sectionIds.length > 0) {
      query['sys.id[in]'] = sectionIds
    }
    
    if (locale) {
      query.locale = locale
    }

    const entries = await contentfulClient.getEntries<any>(query)

    return entries.items as unknown as Section[]
  } catch (error) {
    console.error('Error fetching sections:', error)
    return []
  }
}
