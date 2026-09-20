import type { Metadata } from 'next'
import { Instrument_Sans, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { routing } from '@/i18n/routing'
import '../globals.css'

const instrumentSans = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

// Build time'da tr ve en için ayrı statik sayfalar üretir.
// Bu olmadan [locale] dinamik segment olarak kalır ve SSR'a döner.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })
  return {
    title: { template: '%s', default: t('home_title') },
    description: t('home_desc'),
  }
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>) {
  const { locale } = await params

  // Geçersiz locale gelirse 404 göster (örn: /fr/about)
  if (!routing.locales.includes(locale as 'tr' | 'en')) {
    notFound()
  }

  // Server'dan tüm çeviri mesajlarını alıp NextIntlClientProvider'a iletiyoruz.
  // Bu sayede Client Component'lar da (Navbar, ContactForm) çevirilere erişebilir.
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${instrumentSans.variable} ${playfair.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
