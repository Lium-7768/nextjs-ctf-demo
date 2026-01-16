"use client";

import { useQuery } from "@tanstack/react-query";
import { renderRichText } from "@nextjs-ctf-demo/contentful-bff/rich-text";
import type { Section } from "@nextjs-ctf-demo/contentful-bff";
import { Zap, Shield, Users, Globe, Target, TrendingUp } from "lucide-react";

const featureIcons = {
  speed: Zap,
  security: Shield,
  team: Users,
  global: Globe,
  target: Target,
  growth: TrendingUp,
} as const;

export function FeaturesSection({
  section,
  lang,
}: {
  section: Section;
  lang?: string;
}) {
  const {
    data: features,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["features", lang],
    queryFn: async () => {
      const { getFeatures } = await import("@nextjs-ctf-demo/contentful-bff");
      return getFeatures(lang || "zh");
    },
  });

  if (isLoading) return <div className="py-24 px-4">Loading features...</div>;
  if (error)
    return (
      <div className="py-24 px-4 text-red-600">Error loading features</div>
    );
  if (!features || features.length === 0) return null;

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon =
              featureIcons[feature.fields.icon as keyof typeof featureIcons] ||
              Zap;
            return (
              <div
                key={feature.sys.id}
                className="glass-card p-8 hover:scale-105 cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Icon className="w-7 h-7 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-poppins">
                  {feature.fields.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.fields.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
