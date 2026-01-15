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
  return (
    <header className="border-b bg-white sticky top-0 z-50" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between" aria-label="Main navigation">
        <Link
          href={`/${lang}`}
          className="font-bold text-xl flex items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          aria-label="Home"
        >
          <span>🚀</span>
          <span className="hidden md:inline">Demo Company</span>
        </Link>

        <ul className="flex gap-6">
          {navItems.map((item) => (
            <li key={item.sys.id}>
              <Link
                href={item.fields.linkTo.replace('[lang]', lang)}
                className="text-gray-700 hover:text-blue-600 transition-colors rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                {item.fields.label}
              </Link>
            </li>
          ))}
        </ul>

        <LanguageSwitcher />
      </nav>
    </header>
  )
}
