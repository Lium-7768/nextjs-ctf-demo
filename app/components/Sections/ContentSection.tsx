import { renderRichText } from '@nextjs-ctf-demo/contentful-bff/rich-text'
import type { Section } from '@nextjs-ctf-demo/contentful-bff'

export function ContentSection({
  section,
}: {
    section: Section
    lang?: string
  }) {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-indigo-950">
      <div className="container mx-auto">
        <div className="glass-card p-12 md:p-16 max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-8 font-poppins">
            {section.fields.heading}
          </h2>
          <div className="prose prose-xl max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
            {renderRichText(section.fields.description)}
          </div>
          </div>
      </div>
    </section>
  );
}
