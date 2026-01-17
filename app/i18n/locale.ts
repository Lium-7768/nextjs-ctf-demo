export const localeMap = {
  en: 'en-US',
  zh: 'zh-CN',
} as const;

export type LocaleKey = keyof typeof localeMap;

export function getContentfulLocale(lang: string): string {
  return localeMap[lang as LocaleKey] || localeMap.en;
}
