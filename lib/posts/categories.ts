import type { ArticleCategory } from '@/lib/admin/types'

export const ARTICLE_CATEGORY_SUGGESTIONS = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'full-stack', label: 'Full Stack' },
  { value: 'devops', label: 'DevOps' },
  { value: 'mobile-development', label: 'Mobile Development' },
  { value: 'artificial-intelligence', label: 'Artificial Intelligence' },
  { value: 'software-architecture', label: 'Software Architecture' },
  { value: 'career', label: 'Career' },
  { value: 'life-experiences', label: 'Life Experiences' },
] as const

const CATEGORY_LABELS: Record<string, { en: string; tr: string }> = {
  frontend: { en: 'Frontend', tr: 'Frontend' },
  backend: { en: 'Backend', tr: 'Backend' },
  'full-stack': { en: 'Full Stack', tr: 'Full Stack' },
  devops: { en: 'DevOps', tr: 'DevOps' },
  'mobile-development': { en: 'Mobile Development', tr: 'Mobil Geliştirme' },
  'artificial-intelligence': { en: 'Artificial Intelligence', tr: 'Yapay Zekâ' },
  'software-architecture': { en: 'Software Architecture', tr: 'Yazılım Mimarisi' },
  career: { en: 'Career', tr: 'Kariyer' },
  'life-experiences': { en: 'Life Experiences', tr: 'Hayat Tecrübeleri' },
}

const CATEGORY_ALIASES: Record<string, string> = {
  'full-stack': 'full-stack',
  'mobile-development': 'mobile-development',
  'artificial-intelligence': 'artificial-intelligence',
  'software-architecture': 'software-architecture',
  career: 'career',
  kariyer: 'career',
  'life-experiences': 'life-experiences',
  'hayat-tecrubeleri': 'life-experiences',
  // Values rendered by the previous dynamic translation lookup remain readable.
  'home-career-label': 'career',
}

function toCategoryKey(value: string): string {
  return value
    .toLocaleLowerCase('en')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function normalizeArticleCategory(category: string): ArticleCategory | null {
  const normalized = category.trim().replace(/\s+/g, ' ')
  if (normalized.length === 0 || normalized.length > 80) return null

  return CATEGORY_ALIASES[toCategoryKey(normalized)] ?? normalized
}

export function formatArticleCategory(category: string, locale: string): string {
  const key = CATEGORY_ALIASES[toCategoryKey(category)] ?? toCategoryKey(category)
  const labels = CATEGORY_LABELS[key]
  if (labels) return locale.startsWith('tr') ? labels.tr : labels.en

  return category.trim() || (locale.startsWith('tr') ? 'Kategorisiz' : 'Uncategorized')
}
