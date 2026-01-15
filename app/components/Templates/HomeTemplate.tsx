import { HeroSection, ContentSection } from '@/app/components/Sections'
import type { Page } from '@nextjs-ctf-demo/contentful-bff'

export function HomeTemplate({
  page,
  lang,
}: {
  page: Page
  lang: string
}) {
  return (
    <div>
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
    default:
      return ContentSection
  }
}
