'use client'

import Link from 'next/link'
import { Rocket, Menu, X } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useState, useCallback } from 'react'
import type { NavigationItem } from '@nextjs-ctf-demo/contentful-bff'

export function Header({
  navItems,
  lang,
}: {
  navItems: NavigationItem[]
  lang: string
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Use useCallback to create stable callback references
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  return (
    <header className="sticky top-0 z-50 sticky-header-safe glass" role="banner">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between" aria-label="Main navigation">
        <Link
          href={`/${lang}`}
          className="font-bold text-xl flex items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 hover:opacity-80 transition-opacity"
          aria-label="Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Rocket className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <span className="hidden md:inline bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-poppins">
            Demo Company
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-6 items-center">
          {navItems.map((item) => (
            <li key={item.sys.id}>
              <Link
                href={item.fields.linkTo.replace('[lang]', lang)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:scale-105 rounded-lg px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                {item.fields.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen ? (
        <div className="md:hidden glass border-t border-gray-200 dark:border-gray-700 animate-fadeInUp">
          <ul className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <li key={item.sys.id}>
                <Link
                  href={item.fields.linkTo.replace('[lang]', lang)}
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 rounded-lg px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  onClick={toggleMobileMenu}
                >
                  {item.fields.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  )
}
