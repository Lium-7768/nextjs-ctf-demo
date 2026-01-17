'use client'

import { useQuery } from '@tanstack/react-query'
import { renderRichText } from '@nextjs-ctf-demo/contentful-bff/rich-text'
import type { Section } from '@nextjs-ctf-demo/contentful-bff'
import { Star } from 'lucide-react'

export function TestimonialsSection({
  section,
  lang,
}: {
  section: Section
  lang?: string
}) {
  const { data: testimonials, isLoading, error } = useQuery({
    queryKey: ['testimonials', section.sys.id],
    queryFn: async () => {
      const { getTestimonials } = await import('@nextjs-ctf-demo/contentful-bff')
      const { getContentfulLocale } = await import('@/app/i18n/locale')
      const locale = getContentfulLocale(lang || 'en')
      return getTestimonials(locale)
    },
  })

  if (isLoading) return <div className="py-24 px-4">Loading testimonials...</div>
  if (error) return <div className="py-24 px-4 text-red-600">Error loading testimonials</div>
  if (!testimonials || testimonials.length === 0) return null

  return (
    <section className="py-24 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-poppins">
            {section.fields.heading}
          </h2>
          <div className="prose prose-lg max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
            {renderRichText(section.fields.description)}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.sys.id} className="glass-card p-8 hover:scale-[1.02] transition-all duration-300 cursor-pointer hover:border-blue-500/30">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.fields.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" aria-hidden="true" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed text-sm sm:text-base">
                &ldquo;{testimonial.fields.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-500 font-bold">
                  {testimonial.fields.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100 font-poppins">
                    {testimonial.fields.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.fields.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
