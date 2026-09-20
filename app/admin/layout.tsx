// /admin, [locale]'in dışında bir kardeş segment olduğu için (bkz.
// app/global-not-found.tsx / app/global-error.tsx ile aynı gerekçe),
// bu gerçek bir root layout — kendi <html>/<body>'sini ve fontlarını
// kendisi sağlıyor, [locale]/layout.tsx'ten hiçbir şey miras almıyor.
// Admin arayüzü tek kullanıcı (site sahibi) için olduğundan İngilizce/
// next-intl'siz, sabit metinlerle.
import type { Metadata } from 'next'
import { Instrument_Sans, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import '../globals.css'

const instrumentSans = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  title: 'Admin — Berkay Köse',
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${playfair.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground font-sans">{children}</body>
    </html>
  )
}
