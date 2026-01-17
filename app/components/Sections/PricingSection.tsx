"use client"

import { useQuery } from '@tanstack/react-query'
import { renderRichText } from '@nextjs-ctf-demo/contentful-bff/rich-text'
import type { Section } from '@nextjs-ctf-demo/contentful-bff'
import { Check, X } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function PricingSection({
  section,
  lang,
}: {
  section: Section
  lang?: string
}) {
  const t = useTranslations('pricing')

  const { data: pricingPlans, isLoading, error } = useQuery({
    queryKey: ['pricing', lang],
    queryFn: async () => {
      const { getPricingPlans } = await import('@nextjs-ctf-demo/contentful-bff')
      const { getContentfulLocale } = await import('@/app/i18n/locale')
      const locale = getContentfulLocale(lang || 'en')
      return getPricingPlans(locale)
    },
  })

  if (isLoading) return <div className="py-24 px-4">{t('loading')}</div>
  if (error) return <div className="py-24 px-4 text-red-600">{t('error')}</div>
  if (!pricingPlans || pricingPlans.length === 0) return null

  return (
    <section className="py-24 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-poppins">
            {section.fields.heading || t('title')}
          </h2>
          <div className="prose prose-lg max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
            {renderRichText(section.fields.description)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.sys.id}
              className={`glass-card p-8 relative flex flex-col ${plan.fields.popular ? 'md:-mt-4 md:mb-4 border-2 border-blue-500 ring-4 ring-blue-500/10' : ''}`}
            >
              {plan.fields.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-max">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg uppercase tracking-wider">
                    {t('mostPopular')}
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-poppins">
                  {plan.fields.name}
                </h3>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 font-poppins">
                    {plan.fields.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    {plan.fields.period}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  {plan.fields.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.fields.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-blue-500 flex-shrink-0" aria-hidden="true" />
                    ) : (
                      <X className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                    )}
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/${lang}/contact`}
                className={`w-full py-4 rounded-xl font-bold text-center block transition-all duration-300 ${plan.fields.popular
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:shadow-blue-500/20 active:scale-95'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95'
                  }`}
              >
                {plan.fields.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
