import { renderRichText } from '@nextjs-ctf-demo/contentful-bff/rich-text'
import type { Section } from '@nextjs-ctf-demo/contentful-bff'
import Link from 'next/link'

export function CTASection({
  section,
  lang,
}: {
  section: Section
  lang: string
}) {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-green-400 to-green-600">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-8">
          {section.fields.heading}
        </h2>
        <div className="prose prose-invert max-w-3xl mx-auto text-white mb-8">
          {renderRichText(section.fields.description)}
        </div>
        <Link
          href={`/${lang}/contact`}
          className="inline-block px-8 py-4 bg-white text-green-700 font-bold rounded-lg hover:bg-green-50 transition-colors rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
        >
          Contact Us
        </Link>
      </div>
    </section>
  )
}
