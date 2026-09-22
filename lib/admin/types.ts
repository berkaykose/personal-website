import type { RenderableBlock } from '@/components/ContentBlockRenderer'

// CMS içeriği zaten tek dilde tutulacağı için (locale ayrımı ArticleTranslation
// satırında oluyor, blok seviyesinde değil), admin editörü doğrudan
// ContentBlockRenderer'ın tükettiği tek dilli blok tipini kullanır.
export type AdminContentBlock = RenderableBlock

export type Locale = 'en' | 'tr'

export type ArticleStatus = 'draft' | 'published'

// Categories are intentionally free-form. The admin editor offers common suggestions,
// but a post can also belong to a category such as "DevOps" or "Hayat Tecrübeleri".
export type ArticleCategory = string

export interface ArticleTranslation {
  locale: Locale
  title: string
  slug: string
  excerpt: string
  content: AdminContentBlock[]
  status: ArticleStatus
  publishedAt: string | null
}

export interface AdminArticle {
  id: string
  createdAt: string
  updatedAt: string
  // Locale'den bağımsız — makale hangi kategoride olursa olsun tüm çeviriler için ortak.
  category: ArticleCategory
  // Her locale bağımsız var olabilir/olmayabilir — örn. İngilizcesi yayında,
  // Türkçesi henüz taslak ya da hiç yazılmamış olabilir.
  translations: Partial<Record<Locale, ArticleTranslation>>
}
