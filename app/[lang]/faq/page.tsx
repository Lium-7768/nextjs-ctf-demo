import { getPageBySlug, getFAQs } from '@nextjs-ctf-demo/contentful-bff'
import { getServerLocale } from '@/lib/i18n'
import { PageTemplate } from '@/components/Templates'
import type { FAQ } from '@nextjs-ctf-demo/contentful-bff'

export default async function FAQPage({
  params: { lang },
}: {
  params: { lang: string }
}) {
  const locale = getServerLocale(lang)
  const page = await getPageBySlug('faq', locale)
  const faqs = await getFAQs(locale)
  if (!page) {
    notFound()
  }
  return <PageTemplate page={page} locale={locale} />
}
