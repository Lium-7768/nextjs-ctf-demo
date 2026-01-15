import { getPageBySlug } from '@nextjs-ctf-demo/contentful-bff'
import { notFound } from 'next/navigation'
import { HomeTemplate, PageTemplate } from '@/app/components/Templates'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  // 在 build 时生成所有页面的静态路径
  return [
    { slug: [] }, // 主页
  ]
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>
}) {
  const { lang, slug = [] } = await params
  const locale = lang === 'zh' ? 'zh-CN' : 'en-US'

  // 将 slug 数组转换为路径字符串
  const slugPath = slug.join('/')

  // 从 Contentful 获取页面
  const page = await getPageBySlug(slugPath, locale)

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
