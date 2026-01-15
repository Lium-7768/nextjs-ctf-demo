import { contentfulClient, type NavigationItem, type GlobalSettings } from '../client'

export async function getNavigationItems(locale: string): Promise<NavigationItem[]> {
  try {
    const entries = await contentfulClient.getEntries<any>({
      content_type: 'navigationItem',
      locale: locale,
      order: ['fields.order'],
    } as any)

    return entries.items as unknown as NavigationItem[]
  } catch (error) {
    console.error('Error fetching navigation:', error)
    return []
  }
}

export async function getGlobalSettings(locale: string): Promise<GlobalSettings | null> {
  try {
    const entries = await contentfulClient.getEntries<any>({
      content_type: 'globalSettings',
      locale: locale,
      limit: 1,
    })

    return (entries.items[0] || null) as unknown as GlobalSettings | null
  } catch (error) {
    console.error('Error fetching global settings:', error)
    return null
  }
}
