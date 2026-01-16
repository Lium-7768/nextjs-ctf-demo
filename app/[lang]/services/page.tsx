import { getPageBySlug } from '@nextjs-ctf-demo/contentful-bff'
import { ServicesSection } from '@/app/components/Sections'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  
  const page = await getPageBySlug('services', lang)
  
  if (!page) {
    notFound()
  }
  
  return (
    <main className="min-h-screen">
      <ServicesSection 
        section={page.fields.sections[0]} 
        lang={lang} 
      />
    </main>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  
  const page = await getPageBySlug('services', lang)
  
  if (!page) {
    return {}
  }
  
  return {
    title: page.fields.metaTitle || page.fields.title,
    description: page.fields.metaDescription,
  }
}
