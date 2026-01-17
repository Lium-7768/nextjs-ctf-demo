import { getPageBySlug } from '@nextjs-ctf-demo/contentful-bff'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { HomeTemplate, PageTemplate } from '@/app/components/Templates'
import { routing, type Locale } from '@/app/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }))
}

export default async function LangPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  // Enable static rendering
  setRequestLocale(lang)

  const { getContentfulLocale } = await import('@/app/i18n/locale')
  const contentfulLocale = getContentfulLocale(lang)

  // 从 Contentful 获取主页 (slug = '')
  const page = await getPageBySlug('', contentfulLocale)

  if (!page) {
    notFound()
  }

  // 根据模板类型选择渲染器
  const template = page.fields.template || 'default'

  switch (template) {
    case 'home':
      return <HomeTemplate page={page} lang={lang} />
    case 'default':
    case 'products':
    case 'news':
    default:
      return <PageTemplate page={page} lang={lang} />
  }
}
