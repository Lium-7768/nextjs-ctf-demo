import { getPageBySlug, getAllPages } from '@nextjs-ctf-demo/contentful-bff'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { HomeTemplate, PageTemplate } from '@/app/components/Templates'
import { routing } from '@/app/i18n/routing'

// Generate static params for all pages and locales
export async function generateStaticParams() {
  const pages = await getAllPages('en-US')
  const paths: { lang: string; slug: string[] }[] = []

  for (const locale of routing.locales) {
    for (const page of pages) {
      if (page.fields.slug) {
        paths.push({ lang: locale, slug: [page.fields.slug] })
      }
    }
  }

  return paths
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>
}) {
  const { lang, slug = [] } = await params

  // Enable static rendering
  setRequestLocale(lang)

  const { getContentfulLocale } = await import('@/app/i18n/locale')
  const contentfulLocale = getContentfulLocale(lang)

  // Convert slug array to path string
  const slugPath = slug.join('/')

  // Fetch page from Contentful
  const page = await getPageBySlug(slugPath, contentfulLocale)

  if (!page) {
    notFound()
  }

  // Select renderer based on template type
  const template = (page.fields.template || 'default') as string

  switch (template) {
    case 'home':
      return <HomeTemplate page={page} lang={lang} />
    case 'default':
    default:
      return <PageTemplate page={page} lang={lang} />
  }
}
