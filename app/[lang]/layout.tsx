import { getNavigationItems, getGlobalSettings } from '@nextjs-ctf-demo/contentful-bff'
import { Header } from '@/components/Layout/Header'
import { Footer } from '@/components/Layout/Footer'
import type { Metadata } from 'next'
import { getServerLocale } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: string }
}): Promise<Metadata> {
  const locale = getServerLocale(lang)
  const settings = await getGlobalSettings(locale)
  
  return {
    title: settings?.fields.companyName[locale] || 'Demo',
    description: settings?.fields.tagline[locale],
  }
}

export default async function LangLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const locale = getServerLocale(lang)
  const [navItems, settings] = await Promise.all([
    getNavigationItems(locale),
    getGlobalSettings(locale),
  ])
  
  return (
    <html lang={lang}>
      <body className="antialiased">
        <Header navItems={navItems} lang={lang} />
        <main>{children}</main>
        <Footer settings={settings} lang={lang} />
      </body>
    </html>
  )
}
