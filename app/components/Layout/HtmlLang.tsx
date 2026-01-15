'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'

export function HtmlLang() {
  const params = useParams()
  const lang = params.lang || 'en'

  useEffect(() => {
    // Update document lang attribute when language changes
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en-US'
  }, [lang])

  return null
}
