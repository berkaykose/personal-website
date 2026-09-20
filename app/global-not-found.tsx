// Root layout [locale] gibi dinamik bir segmentin altında (next-intl i18n kurulumu).
// Next.js dokümantasyonuna göre bu durumda eşleşmeyen route'lar için normal
// not-found.tsx yeterli olmuyor; bu dosya routing seviyesinde, layout'tan
// bağımsız çalışıyor — bu yüzden global stilleri/fontları kendisi import ediyor.
import type { Metadata } from 'next'
import Link from 'next/link'
import { Instrument_Sans, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const instrumentSans = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  title: '404 — Berkay Köse',
  description: 'The page you are looking for does not exist.',
}

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${playfair.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <main className="flex-1">
          <div className="max-w-3xl mx-auto px-6 py-32 md:py-40 text-center">
            <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--neon-orange)] mb-6">
              404 / LOST
            </div>
            <h1 className="font-display text-7xl md:text-9xl font-bold leading-none text-foreground mb-6">
              404
            </h1>
            <p className="text-base md:text-lg text-muted mb-1">
              Looks like this route doesn&apos;t exist.
            </p>
            <p className="text-base md:text-lg text-muted mb-10">
              Görünüşe göre bu sayfa mevcut değil.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:opacity-80 transition-opacity"
            >
              Back home →
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
