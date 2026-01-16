import { getNavigationItems, getGlobalSettings } from '@nextjs-ctf-demo/contentful-bff'
import { Header } from '@/app/components/Layout/Header'
import { Footer } from '@/app/components/Layout/Footer'
import { HtmlLang } from '@/app/components/Layout/HtmlLang'

export const dynamic = 'force-dynamic'

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang === 'zh' ? 'zh-CN' : 'en-US'
  const [navItems, settings] = await Promise.all([
    getNavigationItems(locale),
    getGlobalSettings(locale),
  ])

  return (
    <>
      <HtmlLang />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:border-2 focus:border-blue-500 focus:rounded-md"
      >
        Skip to main content
      </a>
      <Header navItems={navItems} lang={lang} />
      <main id="main-content" className="main-content-scroll-margin" style={{ display: 'none' }}>{children}</main>
      <Footer settings={settings} lang={lang}  />
    </>
  )
}
