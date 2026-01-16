import { renderRichText } from "@nextjs-ctf-demo/contentful-bff/rich-text";
import type { Section } from "@nextjs-ctf-demo/contentful-bff";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

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
      className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-400 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
      style={{ animationDelay: "1s" }}
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
  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 -z-10" />

      {/* Animated Background Elements */}
      {animatedBackgroundElements}

      <div className="container mx-auto relative">
        {/* Version Badge */}
        {versionBadge}

        <h1
          className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight animate-fadeInUp"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="gradient-text">
            {section.fields.heading.split(" ")[0]}
          </span>
          <br />
          {section.fields.heading.split(" ").slice(1).join(" ")}
        </h1>

        <div
          className="prose prose-lg max-w-3xl mx-auto text-gray-600 dark:text-gray-400 mb-10 leading-relaxed animate-fadeInUp"
          style={{ animationDelay: "0.2s" }}
        >
          {renderRichText(section.fields.description)}
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href={`/${lang}/contact`}
            className="glass-button-cta text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-2 shadow-lg cursor-pointer"
          >
            Get Started
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
          <Link
            href={`/${lang}/about`}
            className="glass-button text-white font-semibold px-8 py-4 rounded-xl shadow-lg cursor-pointer"
          >
            Learn More
          </Link>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-fadeInUp"
          style={{ animationDelay: "0.4s" }}
        >
          {[
            { label: "Users", value: "10K+" },
            { label: "Projects", value: "500+" },
            { label: "Countries", value: "50+" },
            { label: "Satisfaction", value: "98%" },
          ].map((stat, index) => (
            <div key={index} className="glass-card p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 font-poppins">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
