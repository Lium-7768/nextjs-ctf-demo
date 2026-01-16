import { renderRichText } from '@nextjs-ctf-demo/contentful-bff/rich-text'
import type { Section } from '@nextjs-ctf-demo/contentful-bff'

export function ContentSection({
  section,
  lang,
}: {
  section: Section
  lang: string
}) {
  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            {section.fields.heading}
          </h2>
          <div className="prose prose-lg text-gray-700 dark:text-gray-300 break-words">
            {renderRichText(section.fields.description)}
          </div>
        </div>
      </div>
    </section>
  )
}
