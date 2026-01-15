import { getPageBySlug } from '@nextjs-ctf-demo/contentful-bff'
import { notFound } from 'next/navigation'
import { HomeTemplate, PageTemplate } from '@/app/components/Templates'

export const dynamic = 'force-dynamic'

export default async function LangPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang === 'zh' ? 'zh-CN' : 'en-US'

  // 从 Contentful 获取主页 (slug = '')
  const page = await getPageBySlug('', locale)

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
