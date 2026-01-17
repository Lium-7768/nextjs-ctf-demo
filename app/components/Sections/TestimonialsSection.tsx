'use client'

import { useQuery } from '@tanstack/react-query'
import { renderRichText } from '@nextjs-ctf-demo/contentful-bff/rich-text'
import type { Section } from '@nextjs-ctf-demo/contentful-bff'
import { Star } from 'lucide-react'

export function TestimonialsSection({
  section,
}: {
    section: Section
    lang?: string
  }) {
  const { data: testimonials, isLoading, error } = useQuery({
    queryKey: ['testimonials', section.sys.id],
    queryFn: async () => {
      const { getTestimonials } = await import('@nextjs-ctf-demo/contentful-bff')
      return getTestimonials('en')
    },
  })

  if (isLoading) return <div className="py-24 px-4">Loading testimonials...</div>
  if (error) return <div className="py-24 px-4 text-red-600">Error loading testimonials</div>
  if (!testimonials || testimonials.length === 0) return null

  return (
    <section className="py-24 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-poppins">
            {section.fields.heading}
          </h2>
          <div className="prose prose-lg max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
            {renderRichText(section.fields.description)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.sys.id} className="glass-card p-8 hover:scale-105 transition-transform cursor-pointer">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.fields.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" aria-hidden="true" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                &ldquo;{testimonial.fields.quote}&rdquo;
              </p>
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100 font-poppins">
                  {testimonial.fields.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {testimonial.fields.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
