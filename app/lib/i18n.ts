export const locales = ['zh', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'zh'

export function getLocaleFromPath(pathname: string): Locale {
  const locale = pathname.split('/')[1] as Locale
  return locales.includes(locale) ? locale : defaultLocale
}

export function getLocalizedPath(
  path: string,
  locale: Locale
): string {
  return \`/\${locale}\${path\`
}

export function getServerLocale(locale: string): string {
  return locale === 'zh' ? 'zh-CN' : 'en-US'
}
