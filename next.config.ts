import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

// Root layout [locale] gibi dinamik bir segmentin altında olduğu için
// (next-intl ile i18n kurulumu), eşleşmeyen route'lar için global-not-found gerekiyor.
const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
}

export default withNextIntl(nextConfig)
