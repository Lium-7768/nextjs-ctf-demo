import { getNavigationItems, getGlobalSettings } from '@nextjs-ctf-demo/contentful-bff'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Header } from '@/app/components/Layout/Header'
import { Footer } from '@/app/components/Layout/Footer'
import { routing, type Locale } from '@/app/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  // Ensure that the incoming `lang` is valid
  if (!routing.locales.includes(lang as Locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(lang)

  const { getContentfulLocale } = await import('@/app/i18n/locale')
  const contentfulLocale = getContentfulLocale(lang)

  const [navItems, settings, messages] = await Promise.all([
    getNavigationItems(contentfulLocale),
    getGlobalSettings(contentfulLocale),
    getMessages(),
  ])

  return (
    <NextIntlClientProvider messages={messages}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:border-2 focus:border-blue-500 focus:rounded-md"
      >
        Skip to main content
      </a>
      <Header navItems={navItems} lang={lang} />
      <main id="main-content" className="main-content-scroll-margin">{children}</main>
      <Footer settings={settings} lang={lang} />
    </NextIntlClientProvider>
  )
}
