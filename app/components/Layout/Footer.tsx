import type { GlobalSettings } from '@nextjs-ctf-demo/contentful-bff'
import Link from 'next/link'
import { Mail, Phone, MapPin, Github, Twitter, Linkedin, Facebook } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Footer({
  settings,
  lang,
}: {
  settings: GlobalSettings | null
  lang: string
}) {
  const tNav = useTranslations('nav')
  const tCommon = useTranslations('common')
  const tFooter = useTranslations('footer')

  const socialIcons = {
    github: Github,
    twitter: Twitter,
    linkedin: Linkedin,
    facebook: Facebook,
  }

  const quickLinks = [
    { label: tNav('home'), href: `/${lang}` },
    { label: tNav('services'), href: `/${lang}/services` },
    { label: tNav('pricing'), href: `/${lang}/pricing` },
    { label: tNav('faq'), href: `/${lang}/faq` },
    { label: tNav('contact'), href: `/${lang}/contact` },
  ]

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" role="contentinfo">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Github className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-poppins">
                {settings?.fields.companyName}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {settings?.fields.tagline}
            </p>
            <div className="space-y-4">
              <a
                href={`mailto:${settings?.fields.email}`}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <span>{settings?.fields.email}</span>
              </a>
              <a
                href={`tel:${settings?.fields.phone}`}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <span>{settings?.fields.phone}</span>
              </a>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <span>{settings?.fields.address}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-100 font-poppins">
              {tFooter('quickLinks')}
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hover:pl-2 transition-all duration-300 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-100 font-poppins">
              {tFooter('followUs')}
            </h3>
            <div className="flex gap-4">
              {['github', 'twitter', 'linkedin', 'facebook'].map((social) => {
                const Icon = socialIcons[social as keyof typeof socialIcons] || Github
                return (
                  <a
                    key={social}
                    href="#"
                    className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white transition-all duration-300 hover:scale-110 cursor-pointer"
                    aria-label={social}
                  >
                    <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" aria-hidden="true" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-100 font-poppins">
              {tFooter('newsletter')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {tFooter('subscribeText')}
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={tCommon('enterEmail')}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                aria-label="Email address"
              />
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:scale-105 transition-transform cursor-pointer">
                {tCommon('subscribe')}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-16 pt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {settings?.fields.footerText || 'Thank you for visiting our website.'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} {settings?.fields.companyName}. {tFooter('copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
