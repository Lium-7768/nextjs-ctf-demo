import { renderRichText } from "@nextjs-ctf-demo/contentful-bff/rich-text";
import type { Section } from "@nextjs-ctf-demo/contentful-bff";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

// Hoist static JSX elements to avoid recreation on every render
const versionBadge = (
  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fadeInUp">
    <Sparkles
      className="w-4 h-4 text-blue-600 dark:text-blue-400"
      aria-hidden="true"
    />
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
      Next.js 16 + React 19
    </span>
  </div>
);

const animatedBackgroundElements = (
  <>
    <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
    <div
      className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-400 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-1000"
    />
  </>
);

export function HeroSection({
  section,
  lang,
}: {
  section: Section;
  lang: string;
}) {
  const tHero = useTranslations('hero')
  const tStats = useTranslations('stats')

  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 -z-10" />

      {/* Animated Background Elements */}
      {animatedBackgroundElements}

      <div className="container mx-auto relative text-center md:text-left">
        {/* Version Badge */}
        <div className="flex justify-center md:justify-start">
          {versionBadge}
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight animate-fadeInUp animation-delay-100"
        >
          <span className="gradient-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            {section.fields.heading.split(" ")[0]}
          </span>
          <br />
          {section.fields.heading.split(" ").slice(1).join(" ")}
        </h1>

        <div
          className="prose prose-lg max-w-3xl mx-auto md:mx-0 text-gray-600 dark:text-gray-400 mb-10 leading-relaxed animate-fadeInUp animation-delay-200"
        >
          {renderRichText(section.fields.description)}
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center animate-fadeInUp animation-delay-300"
        >
          <Link
            href={`/${lang}/contact`}
            className="w-full sm:w-auto glass-button-cta text-white font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:shadow-orange-500/30"
          >
            {tHero('getStarted')}
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
          <Link
            href={`/${lang}/about`}
            className="w-full sm:w-auto glass-button text-white font-semibold px-8 py-4 rounded-xl shadow-lg cursor-pointer flex justify-center items-center hover:shadow-blue-500/30"
          >
            {tHero('learnMore')}
          </Link>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-20 animate-fadeInUp animation-delay-400"
        >
          {[
            { label: tStats("users"), value: "10K+" },
            { label: tStats("projects"), value: "500+" },
            { label: tStats("countries"), value: "50+" },
            { label: tStats("satisfaction"), value: "98%" },
          ].map((stat, index) => (
            <div key={index} className="glass-card p-6 text-center group hover:border-blue-500/50 transition-colors">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 font-poppins group-hover:scale-110 transition-transform">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
