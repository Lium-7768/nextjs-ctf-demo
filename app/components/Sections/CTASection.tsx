import { renderRichText } from '@nextjs-ctf-demo/contentful-bff/rich-text'
import type { Section } from '@nextjs-ctf-demo/contentful-bff'
import Link from 'next/link'

export function CTASection({
  section,
  locale,
}: {
  section: Section
  locale: string
}) {
  const currentLang = locale === 'zh' ? 'zh' : 'en'
  
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-green-400 to-green-600">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-8">
          {section.fields.heading[locale]}
        </h2>
        <div className="prose prose max-w-3xl mx-auto text-white mb-8">
          {renderRichText(section.fields.description)}
        </div>
        <Link
          href={`/\${currentLang}/contact`}
          className="inline-block px-8 py-4 bg-white text-green-700 font-bold rounded-lg hover:bg-green-50 transition-colors"
        >
          {locale === 'zh-CN' ? '联系我们' : 'Contact Us'}
        </Link>
      </div>
    </section>
  )
}
