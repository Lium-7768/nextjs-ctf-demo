'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

export function LanguageSwitcher() {
  const params = useParams()
  const currentLang = params.lang || 'zh'
  
  return (
    <div className="flex gap-2">
      <Link
        href={currentLang === 'zh' ? '/en' : '/zh'}
        className="px-3 py-1 border rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
        aria-label={currentLang === 'zh' ? 'Switch to English' : '切换到中文'}
      >
        {currentLang === 'zh' ? 'EN' : '中'}
      </Link>
    </div>
  )
}
