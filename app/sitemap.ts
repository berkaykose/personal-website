import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { createPublicClient } from '@/lib/supabase/public'
import { SITE_URL } from '@/lib/seo'

const STATIC_PATHS = ['', '/about', '/projects', '/writing', '/contact']

interface TranslationRow {
  locale: string
  slug: string
  published_at: string | null
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  for (const path of STATIC_PATHS) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        changeFrequency: path === '' ? 'monthly' : 'yearly',
        priority: path === '' ? 1 : 0.6,
      })
    }
  }

  const supabase = createPublicClient()
  const { data } = await supabase
    .from('article_translations')
    .select('locale, slug, published_at')
    .eq('status', 'published')

  for (const row of (data ?? []) as TranslationRow[]) {
    entries.push({
      url: `${SITE_URL}/${row.locale}/writing/${row.slug}`,
      lastModified: row.published_at ?? undefined,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  return entries
}
