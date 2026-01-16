import { useQuery } from '@tanstack/react-query'
import { renderRichText } from '@nextjs-ctf-demo/contentful-bff/rich-text'
import type { Section } from '@nextjs-ctf-demo/contentful-bff'
import { Check, X } from 'lucide-react'
import Link from 'next/link'

export function PricingSection({
  section,
  lang,
}: {
    section: Section
    lang?: string
  }) {
  const { data: pricingPlans, isLoading, error } = useQuery({
    queryKey: ['pricing', lang],
    queryFn: async () => {
      const { getPricingPlans } = await import('@nextjs-ctf-demo/contentful-bff')
      return getPricingPlans(lang || 'zh')
    },
  })

  if (isLoading) return <div className="py-24 px-4">Loading pricing...</div>
  if (error) return <div className="py-24 px-4 text-red-600">Error loading pricing</div>
  if (!pricingPlans || pricingPlans.length === 0) return null

  return (
    <section className="py-24 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-poppins">
            {section.fields.heading || 'Pricing Plans'}
          </h2>
          <div className="prose prose-lg max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
            {renderRichText(section.fields.description)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.sys.id}
              className={`glass-card p-8 relative ${plan.fields.popular ? 'md:-mt-4 md:mb-4 border-2 border-blue-500' : ''}`}
            >
              {plan.fields.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold px-6 py-2 rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-poppins">
                  {plan.fields.name}
                </h3>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl font-bold text-gray-900 dark:text-gray-100 font-poppins">
                    {plan.fields.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {plan.fields.period}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {plan.fields.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.fields.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" aria-hidden="true" />
                    ) : (
                      <X className="w-5 h-5 text-red-500 flex-shrink-0" aria-hidden="true" />
                    )}
                    {feature.name}
                  </li>
                ))}
              </ul>

              <Link
                href={`/${lang}/contact`}
                className={`w-full py-4 rounded-xl font-semibold text-center block transition-all duration-300 ${
                  plan.fields.popular
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:scale-105 cursor-pointer'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer'
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
