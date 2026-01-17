import { redirect } from 'next/navigation'
import { routing } from './i18n/routing'

// This page only renders when the app is built statically (output: 'export')
// It will redirect to the default locale
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`)
}
