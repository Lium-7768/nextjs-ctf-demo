'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

export function LanguageSwitcher() {
  const params = useParams()
  const pathname = usePathname()
  const currentLang = params.lang || 'zh'

  // Preserve current path when switching language
  const getPathWithoutLang = () => {
    if (!pathname) return ''
    // Remove /en or /zh from the beginning of the path
    return pathname.replace(/^\/(en|zh)(\/.*)?$/, '$2')
  }

  const targetLang = currentLang === 'zh' ? 'en' : 'zh'
  const targetPath = getPathWithoutLang()

  return (
    <div className="flex gap-2">
      <Link
        href={`/${targetLang}${targetPath}`}
        className="px-3 py-1 border rounded-md hover:bg-gray-100 transition-colors text-sm font-medium rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        aria-label={currentLang === 'zh' ? 'Switch to English' : '切换到中文'}
      >
        {currentLang === 'zh' ? 'EN' : '中'}
      </Link>
    </div>
  )
}
