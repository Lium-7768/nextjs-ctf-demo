import { renderRichText } from '@nextjs-ctf-demo/contentful-bff/rich-text'
import type { Section } from '@nextjs-ctf-demo/contentful-bff'

export function FeaturesSection({
  section,
  lang,
}: {
  section: Section
  lang: string
}) {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
          {section.fields.heading}
        </h2>
        <div className="prose prose max-w-4xl mx-auto text-gray-700 dark:text-gray-300 break-words">
          {renderRichText(section.fields.description)}
        </div>
      </div>
    </section>
  )
}
