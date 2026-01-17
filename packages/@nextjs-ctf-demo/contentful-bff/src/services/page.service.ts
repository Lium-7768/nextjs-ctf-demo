import { contentfulClient, type Page } from '../client'

export async function getPageBySlug(slug: string, locale: string): Promise<Page | null> {
  try {
    // 对于空 slug（主页），查询所有页面然后在客户端过滤
    if (slug === '') {
      const entries = await contentfulClient.getEntries({
        content_type: 'page',
        locale: locale,
        limit: 100,
        include: 5,
      })
      // 查找 slug 为空的页面
      return (entries.items.find(page => !page.fields.slug || page.fields.slug === '') || null) as unknown as Page | null
    }

    // 对于非空 slug，使用标准查询
    const query: Record<string, unknown> = {
      content_type: 'page',
      locale: locale,
      limit: 1,
      include: 5,
    }
    query['fields.slug'] = slug

    const entries = await contentfulClient.getEntries(query)

    return (entries.items[0] || null) as unknown as Page | null
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}

export async function getAllPages(locale: string): Promise<Page[]> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'page',
      locale: locale,
      order: ['fields.publishedAt'],
    })

    return entries.items as unknown as Page[]
  } catch (error) {
    console.error('Error fetching pages:', error)
    return []
  }
}
