import { HeroSection, ContentSection, FeaturesSection, TestimonialsSection, CTASection } from '@/app/components/Sections'
import type { Page } from '@nextjs-ctf-demo/contentful-bff'

export function PageTemplate({
  page,
  lang,
}: {
  page: Page
  lang: string
}) {
  const firstSectionType = page.fields.sections?.[0]?.fields.type
  const hasHero = firstSectionType === 'hero'

  return (
    <div>
      {!hasHero && (
        <div className="bg-white dark:bg-gray-900 py-20">
          <div className="container mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-8">
              {page.fields.title}
            </h1>
          </div>
        </div>
      )}

      {page.fields.sections?.map((section) => {
        const SectionComponent = getSectionComponent(section.fields.type)
        return <SectionComponent key={section.sys.id} section={section} lang={lang} />
      })}
    </div>
  )
}

function getSectionComponent(type: string) {
  switch (type) {
    case 'hero':
      return HeroSection
    case 'content':
      return ContentSection
    case 'features':
      return FeaturesSection
    case 'testimonials':
      return TestimonialsSection
    case 'cta':
      return CTASection
    default:
      return ContentSection
  }
}
