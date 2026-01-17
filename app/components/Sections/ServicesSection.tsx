'use client'

import { useQuery } from '@tanstack/react-query'
import { renderRichText } from '@nextjs-ctf-demo/contentful-bff/rich-text'
import type { Section } from '@nextjs-ctf-demo/contentful-bff'
import { Code2, Database, Globe, Smartphone, Shield, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'

const serviceIcons = {
  'code2': Code2,
  'database': Database,
  'globe': Globe,
  'smartphone': Smartphone,
  'shield': Shield,
  'zap': Zap,
} as const

export function ServicesSection({
  section,
  lang,
}: {
  section: Section
  lang?: string
}) {
  const t = useTranslations('services')

  const { data: services, isLoading, error } = useQuery({
    queryKey: ['services', lang],
    queryFn: async () => {
      const { getServices } = await import('@nextjs-ctf-demo/contentful-bff')
      const { getContentfulLocale } = await import('@/app/i18n/locale')
      const locale = getContentfulLocale(lang || 'en')
      return getServices(locale)
    },
  })

  if (isLoading) return <div className="py-24 px-4">{t('loading')}</div>
  if (error) return <div className="py-24 px-4 text-red-600">{t('error')}</div>
  if (!services || services.length === 0) return null

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-indigo-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-poppins">
            {section.fields.heading || t('title')}
          </h2>
          <div className="prose prose-lg max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
            {renderRichText(section.fields.description)}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service) => {
            const Icon = serviceIcons[service.fields.icon as keyof typeof serviceIcons] || Code2
            return (
              <div key={service.sys.id} className="glass-card p-8 hover:scale-[1.02] cursor-pointer group hover:border-blue-500/30 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-xl">
                  <Icon className="w-8 h-8 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-poppins">
                  {service.fields.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-sm sm:text-base">
                  {service.fields.description}
                </p>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6 font-poppins">
                  {service.fields.price}
                </div>
                <ul className="space-y-3">
                  {service.fields.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
