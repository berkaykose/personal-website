import type { RenderableBlock } from '@/components/ContentBlockRenderer'

export type PostCategory = string

export interface PublicArticle {
  slug: string
  title: string
  excerpt: string
  content: RenderableBlock[]
  category: PostCategory
  publishedAt: string
  readTimeMinutes: number
}
