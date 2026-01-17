import { getPageBySlug } from '@nextjs-ctf-demo/contentful-bff'
import { PricingSection } from '@/app/components/Sections'
import { notFound } from 'next/navigation'

export default async function PricingPage({
  params,
}: {
  params: { lang: string }
}) {
  const page = await getPageBySlug('pricing', params.lang)
  
  if (!page) {
    notFound()
  }
  
  return (
    <main className="min-h-screen">
      <PricingSection 
        section={page.fields.sections[0]} 
        lang={params.lang} 
      />
    </main>
  )
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string }
}) {
  const page = await getPageBySlug('pricing', params.lang)
  
  if (!page) {
    return {}
  }
  
  return {
    title: page.fields.metaTitle || page.fields.title,
    description: page.fields.metaDescription,
  }
}
