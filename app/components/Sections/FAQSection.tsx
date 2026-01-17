'use client'

import { useQuery } from '@tanstack/react-query'
import { renderRichText } from '@nextjs-ctf-demo/contentful-bff/rich-text'
import type { Section } from '@nextjs-ctf-demo/contentful-bff'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { useState, useCallback } from 'react'

export function FAQSection({
  section,
  }: {
    section: Section
    lang?: string
  }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  
  const toggleFAQ = useCallback((index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }, [openIndex])

  const { data: faqs, isLoading, error } = useQuery({
    queryKey: ['faqs', section.sys.id],
    queryFn: async () => {
      const { getFAQs } = await import('@nextjs-ctf-demo/contentful-bff')
      // Get FAQs from section or fetch all
      if (section.fields.faqs && section.fields.faqs.length > 0) {
        return section.fields.faqs
      }
      return getFAQs('en')
    },
  })

  if (isLoading) return <div className="py-24 px-4">Loading FAQs...</div>
  if (error) return <div className="py-24 px-4 text-red-600">Error loading FAQs</div>
  if (!faqs || faqs.length === 0) return null

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Support Center
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-poppins">
            {section.fields.heading || 'Frequently Asked Questions'}
          </h2>
          <div className="prose prose-lg max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
            {renderRichText(section.fields.description)}
          </div>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.sys.id}
              className="glass-card overflow-hidden cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <button
                className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
                aria-expanded={openIndex === index}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 pr-4">
                  {faq.fields.question}
                </h3>
                <ChevronDown
                  className={`w-6 h-6 text-blue-600 dark:text-blue-400 transition-transform flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              <div
                className={`px-8 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 pb-6' : 'max-h-0'
                }`}
              >
                <div className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {renderRichText(faq.fields.answer)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
