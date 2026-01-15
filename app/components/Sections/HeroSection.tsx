import { renderRichText } from '@nextjs-ctf-demo/contentful-bff/rich-text'
import type { Section } from '@nextjs-ctf-demo/contentful-bff'

export function HeroSection({
  section,
  lang,
}: {
  section: Section
  lang: string
}) {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          {section.fields.heading}
        </h1>
        <div className="prose max-w-3xl mx-auto text-gray-700 text-lg break-words">
          {renderRichText(section.fields.description)}
        </div>
      </div>
    </section>
  )
}
