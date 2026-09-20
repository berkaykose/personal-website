import type { RenderableBlock } from '@/components/ContentBlockRenderer'
import { estimateReadTime } from '@/lib/readTime'
import { createClient } from '@/lib/supabase/server'
import type { PostCategory, PublicArticle } from './types'

interface TranslationRow {
  slug: string
  title: string
  excerpt: string | null
  content: RenderableBlock[]
  published_at: string | null
  articles: { category: PostCategory; created_at: string } | null
}

function toPublicArticle(row: TranslationRow): PublicArticle {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? '',
    content: row.content,
    category: row.articles?.category ?? 'backend',
    publishedAt: row.published_at ?? row.articles?.created_at ?? new Date().toISOString(),
    readTimeMinutes: estimateReadTime(row.content),
  }
}

export async function fetchPublishedArticles(locale: string): Promise<PublicArticle[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('article_translations')
    .select('slug, title, excerpt, content, published_at, articles(category, created_at)')
    .eq('locale', locale)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as unknown as TranslationRow[]).map(toPublicArticle)
}

export async function fetchPublishedArticleBySlug(
  locale: string,
  slug: string
): Promise<PublicArticle | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('article_translations')
    .select('slug, title, excerpt, content, published_at, articles(category, created_at)')
    .eq('locale', locale)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return null
  return toPublicArticle(data as unknown as TranslationRow)
}
