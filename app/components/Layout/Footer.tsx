import type { GlobalSettings } from '@nextjs-ctf-demo/contentful-bff'

export function Footer({
  settings,
  lang,
}: {
  settings: GlobalSettings | null
  lang: string
}) {
  return (
    <footer className="border-t bg-gray-50" role="contentinfo">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {settings?.fields.companyName}
            </h3>
            <p className="text-gray-600 mb-4">
              {settings?.fields.tagline}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span aria-hidden="true">📧</span>
                <a href={`mailto:${settings?.fields.email}`} className="hover:text-blue-600 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
                  {settings?.fields.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span aria-hidden="true">📱</span>
                <a href={`tel:${settings?.fields.phone}`} className="hover:text-blue-600 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
                  {settings?.fields.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span aria-hidden="true">📍</span>
                <span>{settings?.fields.address}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                <li>
                  <a href={`/${lang}`} className="text-gray-600 hover:text-blue-600 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
                    Home
                  </a>
                </li>
                <li>
                  <a href={`/${lang}/about`} className="text-gray-600 hover:text-blue-600 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
                    About
                  </a>
                </li>
                <li>
                  <a href={`/${lang}/faq`} className="text-gray-600 hover:text-blue-600 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
                    FAQ
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-4">
              {settings?.fields.footerText || 'Thank you for visiting our website.'}
            </p>
            <p className="text-xs text-gray-500">
              &copy; 2025 Demo Company. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
