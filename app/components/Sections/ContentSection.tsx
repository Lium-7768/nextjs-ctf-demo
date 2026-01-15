import { renderRichText } from '@nextjs-ctf-demo/contentful-bff/rich-text'
import type { Section } from '@nextjs-ctf-demo/contentful-bff'

export function ContentSection({
  section,
}: {
  section: Section
}) {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            {section.fields.heading}
          </h2>
          <div className="prose prose-lg text-gray-700">
            {renderRichText(section.fields.description)}
          </div>
        </div>
      </div>
    </section>
  )
}
