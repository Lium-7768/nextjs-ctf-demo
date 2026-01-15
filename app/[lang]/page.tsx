import { getPageBySlug } from '@nextjs-ctf-demo/contentful-bff'
import { getServerLocale } from '@/lib/i18n'
import { renderRichText } from '@nextjs-ctf-demo/contentful-bff/rich-text'

export default async function HomePage({
  params: { lang },
}: {
  params: { lang: string }
}) {
  const locale = getServerLocale(lang)
  const page = await getPageBySlug('', locale)
  
  if (!page) {
    notFound()
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        {page.fields.title[locale]}
      </h1>
      
      {page.fields.sections.map((section) => (
        <section key={section.sys.id} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {section.fields.heading[locale]}
          </h2>
          <div className="prose max-w-none">
            {renderRichText(section.fields.description)}
          </div>
        </section>
      ))}
    </div>
  )
}
