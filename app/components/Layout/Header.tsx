import Link from 'next/link'
import { LanguageSwitcher } from './LanguageSwitcher'
import type { NavigationItem } from '@nextjs-ctf-demo/contentful-bff'

export function Header({
  navItems,
  lang,
}: {
  navItems: NavigationItem[]
  lang: string
}) {
  const locale = lang === 'zh' ? 'zh-CN' : 'en-US'
  
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={`/\${lang}`} className="font-bold text-xl flex items-center gap-2">
          <span>🚀</span>
          <span className="hidden md:inline">Demo Company</span>
        </Link>
        
        <ul className="flex gap-6">
          {navItems.map((item) => (
            <li key={item.sys.id}>
              <Link
                href={item.fields.linkTo.replace('[lang]', lang)}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item.fields.label[locale]}
              </Link>
            </li>
          ))}
        </ul>
        
        <LanguageSwitcher />
      </nav>
    </header>
  )
}
