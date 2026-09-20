import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

// Root layout [locale] gibi dinamik bir segmentin altında olduğu için
// (next-intl ile i18n kurulumu), eşleşmeyen route'lar için global-not-found gerekiyor.
const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  images: {
    // WebP'ye ek olarak AVIF de üretir — destekleyen tarayıcılarda genelde
    // %20-30 daha küçük dosya, next/image otomatik olarak Accept header'ına
    // göre en uygununu seçiyor.
    formats: ['image/avif', 'image/webp'],
  },
  poweredByHeader: false,
}

export default withNextIntl(nextConfig)
