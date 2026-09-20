// Root layout [locale] gibi dinamik bir segmentin altında (next-intl i18n kurulumu).
// error.tsx kendi segmentinin üstündeki layout'u sarmadığı için, [locale]/layout.tsx
// içinde atılan bir hatayı yakalamak için bu dosya gerekiyor — routing seviyesinde,
// layout'tan bağımsız çalışıyor, bu yüzden global stilleri/fontları kendisi import ediyor.
'use client'
import Link from 'next/link'
import { Instrument_Sans, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const instrumentSans = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${playfair.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <main className="flex-1">
          <div className="max-w-3xl mx-auto px-6 py-32 md:py-40 text-center">
            <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--neon-orange)] mb-6">
              ERROR
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.15] text-foreground mb-6">
              Something went wrong.
            </h1>
            <p className="text-base md:text-lg text-muted mb-1">
              An unexpected error occurred. You can try again or head back home.
            </p>
            <p className="text-base md:text-lg text-muted mb-10">
              Beklenmedik bir hata oluştu. Tekrar deneyebilir ya da ana sayfaya dönebilirsin.
            </p>
            <div className="flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => retry()}
                className="inline-flex items-center gap-1 bg-accent text-white text-sm font-medium px-6 py-2.5 rounded-md hover:opacity-90 active:opacity-80 transition-opacity"
              >
                Try again
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-foreground transition-colors duration-200"
              >
                Back home →
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
