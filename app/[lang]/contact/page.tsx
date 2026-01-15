import { getPageBySlug } from '@nextjs-ctf-demo/contentful-bff'
import { getServerLocale } from '@/lib/i18n'
import { PageTemplate } from '@/components/Templates'
import { notFound } from 'next/navigation'

export default async function ContactPage({
  params: { lang },
}: {
  params: { lang: string }
}) {
  const locale = getServerLocale(lang)
  const page = await getPageBySlug('contact', locale)
  if (!page) {
    notFound()
  }
  return <PageTemplate page={page} locale={locale} />
}
