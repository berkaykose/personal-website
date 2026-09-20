import { readFile } from 'node:fs/promises'
import { ImageResponse } from 'next/og'

export const alt = 'Berkay Köse — Software Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // fetch() Node runtime'da file:// URL'lerini desteklemiyor ("not implemented
  // yet") — fs.readFile bunu native destekliyor, ve new URL(..., import.meta.url)
  // pattern'i korunduğu için Next.js'in build tracer'ı font dosyasını yine
  // production bundle'ına dahil ediyor.
  const [playfair, instrumentSans] = await Promise.all([
    readFile(new URL('./og-fonts/PlayfairDisplay-Bold.woff', import.meta.url)),
    readFile(new URL('./og-fonts/InstrumentSans-Medium.woff', import.meta.url)),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          padding: '80px',
          backgroundColor: '#ffffff',
        }}
      >
        <div
          style={{
            fontFamily: 'Instrument Sans',
            fontSize: 20,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#ff6a00',
            marginBottom: 28,
            display: 'flex',
          }}
        >
          {locale === 'tr' ? 'YAZILIM MÜHENDİSİ' : 'SOFTWARE ENGINEER'}
        </div>
        <div
          style={{
            fontFamily: 'Playfair Display',
            fontWeight: 700,
            fontSize: 104,
            color: '#111111',
            lineHeight: 1.1,
            display: 'flex',
          }}
        >
          Berkay Köse
        </div>
        <div
          style={{
            fontFamily: 'Instrument Sans',
            fontSize: 30,
            color: '#5f6068',
            marginTop: 28,
            maxWidth: 820,
            display: 'flex',
          }}
        >
          {locale === 'tr'
            ? 'Frontend ve backend’de ölçeklenebilir web uygulamaları geliştiriyorum.'
            : 'I build scalable web applications across frontend and backend.'}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 10,
            backgroundColor: '#6b7533',
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Playfair Display', data: playfair, weight: 700, style: 'normal' },
        { name: 'Instrument Sans', data: instrumentSans, weight: 500, style: 'normal' },
      ],
    }
  )
}
