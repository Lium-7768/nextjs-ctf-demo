import { renderRichText } from '@nextjs-ctf-demo/contentful-bff/rich-text'
import type { Section } from '@nextjs-ctf-demo/contentful-bff'

export function TestimonialsSection({
  section,
  locale,
}: {
  section: Section
  locale: string
}) {
  return (
    <section className="py-20 px-4 bg-blue-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          {section.fields.heading[locale]}
        </h2>
        <div className="prose max-w-4xl mx-auto">
          {renderRichText(section.fields.description)}
        </div>
      </div>
    </section>
  )
}
