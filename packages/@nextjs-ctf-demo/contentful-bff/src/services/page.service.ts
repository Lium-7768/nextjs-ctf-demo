import { contentfulClient, type Page } from '../client'

export async function getPageBySlug(slug: string, locale: string): Promise<Page | null> {
  try {
    const entries = await contentfulClient.getEntries<Page>({
      content_type: 'page',
      [`fields.slug[${locale}]`]: slug,
      locale: locale,
      limit: 1,
    })
    
    return entries.items[0] || null
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}

export async function getAllPages(locale: string): Promise<Page[]> {
  try {
    const entries = await contentfulClient.getEntries<Page>({
      content_type: 'page',
      locale: locale,
      order: 'fields.publishedAt',
    })
    
    return entries.items
  } catch (error) {
    console.error('Error fetching pages:', error)
    return []
  }
}
