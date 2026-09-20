import { createClient } from '@/lib/supabase/server'
import type {
  AdminArticle,
  AdminContentBlock,
  ArticleCategory,
  ArticleStatus,
  ArticleTranslation,
  Locale,
} from './types'

interface TranslationRow {
  locale: Locale
  title: string
  slug: string
  excerpt: string | null
  content: AdminContentBlock[]
  status: ArticleStatus
  published_at: string | null
}

interface ArticleRow {
  id: number
  category: ArticleCategory
  created_at: string
  updated_at: string
  article_translations: TranslationRow[]
}

function toAdminArticle(row: ArticleRow): AdminArticle {
  const translations: AdminArticle['translations'] = {}
  for (const t of row.article_translations) {
    translations[t.locale] = {
      locale: t.locale,
      title: t.title,
      slug: t.slug,
      excerpt: t.excerpt ?? '',
      content: t.content,
      status: t.status,
      publishedAt: t.published_at,
    }
  }
  return {
    id: String(row.id),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    category: row.category,
    translations,
  }
}

export async function fetchAllArticles(): Promise<AdminArticle[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .select('id, category, created_at, updated_at, article_translations(*)')

  if (error) throw new Error(error.message)
  return (data as ArticleRow[]).map(toAdminArticle)
}

export async function fetchArticleById(id: string): Promise<AdminArticle | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .select('id, category, created_at, updated_at, article_translations(*)')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return null
  return toAdminArticle(data as ArticleRow)
}

export async function createArticle(
  translation: ArticleTranslation,
  category: ArticleCategory
): Promise<AdminArticle> {
  const supabase = await createClient()

  const { data: article, error: articleError } = await supabase
    .from('articles')
    .insert({ category })
    .select('id')
    .single()
  if (articleError) throw new Error(articleError.message)

  const { error: translationError } = await supabase.from('article_translations').insert({
    article_id: article.id,
    locale: translation.locale,
    title: translation.title,
    slug: translation.slug,
    excerpt: translation.excerpt,
    content: translation.content,
    status: translation.status,
    published_at: translation.status === 'published' ? new Date().toISOString() : null,
  })
  if (translationError) throw new Error(translationError.message)

  const created = await fetchArticleById(String(article.id))
  if (!created) throw new Error('Article not found after creation.')
  return created
}

export async function updateArticle(
  id: string,
  translation: ArticleTranslation,
  category: ArticleCategory
): Promise<AdminArticle> {
  const supabase = await createClient()

  const { error: articleError } = await supabase.from('articles').update({ category }).eq('id', id)
  if (articleError) throw new Error(articleError.message)

  // Yayınlanma tarihi ilk yayınlandığı anda sabitlenir — sonraki taslak/yeniden
  // yayınlama döngülerinde üzerine yazılmaz (eski Spring Boot backend'deki
  // applyRequest() ile aynı davranış).
  const { data: existing } = await supabase
    .from('article_translations')
    .select('published_at')
    .eq('article_id', id)
    .eq('locale', translation.locale)
    .maybeSingle()

  const publishedAt: string | null =
    existing?.published_at ?? (translation.status === 'published' ? new Date().toISOString() : null)

  const { error: translationError } = await supabase.from('article_translations').upsert(
    {
      article_id: Number(id),
      locale: translation.locale,
      title: translation.title,
      slug: translation.slug,
      excerpt: translation.excerpt,
      content: translation.content,
      status: translation.status,
      published_at: publishedAt,
    },
    { onConflict: 'article_id,locale' }
  )
  if (translationError) throw new Error(translationError.message)

  const updated = await fetchArticleById(id)
  if (!updated) throw new Error('Article not found after update.')
  return updated
}

export async function deleteArticleById(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
