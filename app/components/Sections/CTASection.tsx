import { renderRichText } from '@nextjs-ctf-demo/contentful-bff/rich-text'
import type { Section } from '@nextjs-ctf-demo/contentful-bff'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTASection({
  section,
  lang,
}: {
  section: Section
  lang: string
}) {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 -z-10" />

      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float animation-delay-1000" />

      <div className="container mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-8 animate-fadeInUp">
          <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
          <span className="text-sm font-medium text-white">
            Limited Time Offer
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 font-poppins animate-fadeInUp animation-delay-100">
          {section.fields.heading}
        </h2>

        <div className="prose prose-invert prose-xl max-w-3xl mx-auto text-orange-50 mb-12 animate-fadeInUp animation-delay-200">
          {renderRichText(section.fields.description)}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp animation-delay-300">
          <Link
            href={`/${lang}/contact`}
            className="glass-button text-white font-semibold px-10 py-5 rounded-xl flex items-center gap-3 shadow-2xl cursor-pointer"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
          <Link
            href={`/${lang}/demo`}
            className="bg-white text-orange-600 font-semibold px-10 py-5 rounded-xl hover:bg-orange-50 transition-colors shadow-2xl cursor-pointer"
          >
            Watch Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
