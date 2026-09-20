import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'

export const SITE_URL = 'https://berkaykose.dev'
export const SITE_NAME = 'Berkay Köse'

interface BuildMetadataArgs {
  locale: string
  // Locale prefix'siz path, örn. '' (home), '/about', '/writing/some-slug'.
  path: string
  title: string
  description: string
  // CMS makaleleri gibi locale'e göre farklı slug'a sahip olabilen sayfalarda
  // true geç — aynı path'in diğer locale'de de var olduğunu varsaymak yanlış
  // bir hreflang linkine (yanlış/olmayan sayfa) yol açar.
  skipLanguageAlternates?: boolean
}

// Next.js, generateMetadata'nın döndürdüğü nested alanları (openGraph, twitter
// gibi) parent/child arasında deep-merge etmiyor — bir sayfa sadece title
// verirse siteName/type gibi parent alanları kaybolur. Bu yüzden her sayfa
// tam bir Metadata objesi üretmek için bu helper'ı kullanıyor.
export function buildMetadata({
  locale,
  path,
  title,
  description,
  skipLanguageAlternates,
}: BuildMetadataArgs): Metadata {
  const languages: Record<string, string> = { 'x-default': `${SITE_URL}/${routing.defaultLocale}${path}` }
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}${path}`
  }

  const url = `${SITE_URL}/${locale}${path}`
  // opengraph-image.tsx dosya convention'ı yalnızca aynı segment seviyesinde
  // (ana sayfa) otomatik uygulanıyor, alt route'lara miras kalmıyor — bu
  // yüzden her sayfa locale'e uygun görseli açıkça referans veriyor.
  const image = `${SITE_URL}/${locale}/opengraph-image`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      ...(skipLanguageAlternates ? {} : { languages }),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      type: 'website',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}
