import { getNavigationItems, getGlobalSettings } from '@nextjs-ctf-demo/contentful-bff'
import { Header } from '@/app/components/Layout/Header'
import { Footer } from '@/app/components/Layout/Footer'

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
      <Header navItems={navItems} lang={lang} />
      <main>{children}</main>
      <Footer settings={settings} lang={lang} />
    </>
  )
}
