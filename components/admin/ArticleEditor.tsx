'use client'
import { useState } from 'react'
import { deleteArticle, saveArticle } from '@/app/admin/actions'
import ContentBlockRenderer from '@/components/ContentBlockRenderer'
import type {
  AdminArticle,
  AdminContentBlock,
  ArticleCategory,
  ArticleStatus,
  ArticleTranslation,
  Locale,
} from '@/lib/admin/types'

interface Props {
  mode: 'create' | 'edit'
  article?: AdminArticle
}

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'tr', label: 'Türkçe' },
]

const CATEGORIES: { value: ArticleCategory; label: string }[] = [
  { value: 'backend', label: 'Backend' },
  { value: 'frontend', label: 'Frontend' },
]

function emptyTranslation(locale: Locale): ArticleTranslation {
  return { locale, title: '', slug: '', excerpt: '', content: [], status: 'draft', publishedAt: null }
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function blockDefaults(type: AdminContentBlock['type']): AdminContentBlock {
  if (type === 'heading') return { type: 'heading', text: '', marker: '' }
  if (type === 'quote') return { type: 'quote', text: '' }
  if (type === 'code') return { type: 'code', label: '', code: '' }
  return { type: 'paragraph', text: '' }
}

export default function ArticleEditor({ mode, article }: Props) {
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [category, setCategory] = useState<ArticleCategory>(article?.category ?? 'backend')
  const [translations, setTranslations] = useState<Record<Locale, ArticleTranslation>>({
    en: article?.translations.en ?? emptyTranslation('en'),
    tr: article?.translations.tr ?? emptyTranslation('tr'),
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const current = translations[activeLocale]

  function updateCurrent(patch: Partial<ArticleTranslation>) {
    setTranslations((prev) => ({ ...prev, [activeLocale]: { ...prev[activeLocale], ...patch } }))
  }

  function updateBlock(index: number, patch: Partial<AdminContentBlock>) {
    const content = current.content.map((block, i) =>
      i === index ? ({ ...block, ...patch } as AdminContentBlock) : block
    )
    updateCurrent({ content })
  }

  function addBlock(type: AdminContentBlock['type']) {
    updateCurrent({ content: [...current.content, blockDefaults(type)] })
  }

  function removeBlock(index: number) {
    updateCurrent({ content: current.content.filter((_, i) => i !== index) })
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= current.content.length) return
    const content = [...current.content]
    ;[content[index], content[target]] = [content[target], content[index]]
    updateCurrent({ content })
  }

  async function handleSave(status: ArticleStatus) {
    setIsSaving(true)
    setError(null)

    const finalCurrent: ArticleTranslation = {
      ...current,
      status,
      publishedAt: status === 'published' ? new Date().toISOString() : current.publishedAt,
    }
    const finalTranslations = { ...translations, [activeLocale]: finalCurrent }

    const payload: Partial<Record<Locale, ArticleTranslation>> = {}
    for (const { value } of LOCALES) {
      if (finalTranslations[value].title.trim()) payload[value] = finalTranslations[value]
    }

    // Başarılıysa saveArticle içeride redirect() ile sayfadan çıkar (bu satıra
    // hiç dönülmez); sadece hata durumunda normal şekilde geri döner.
    const result = await saveArticle(article?.id ?? null, category, payload)
    if (result?.error) {
      setError(result.error)
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!article) return
    if (!window.confirm('Delete this article? This cannot be undone.')) return
    setIsDeleting(true)
    await deleteArticle(article.id)
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">
          {mode === 'create' ? 'New Article' : 'Edit Article'}
        </h1>
        <div className="flex items-center gap-4">
          {mode === 'edit' && article && (
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="text-sm text-muted hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </button>
          )}
          <button
            type="button"
            disabled={isSaving || !current.title.trim()}
            onClick={() => handleSave('draft')}
            className="inline-flex items-center gap-1 border border-border text-sm font-medium px-5 py-2.5 rounded-md hover:border-accent hover:text-accent transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none"
          >
            Save draft
          </button>
          <button
            type="button"
            disabled={isSaving || !current.title.trim()}
            onClick={() => handleSave('published')}
            className="inline-flex items-center gap-1 bg-accent text-white text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-50 disabled:pointer-events-none"
          >
            Publish
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 -mt-4 mb-8">{error}</p>}

      <div className="flex gap-2 mb-10 border-b border-border">
        {LOCALES.map(({ value, label }) => {
          const t = translations[value]
          const active = activeLocale === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => setActiveLocale(value)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                active ? 'text-foreground' : 'text-muted hover:text-foreground'
              }`}
            >
              {label}
              <span
                className={`ml-2 font-mono text-[10px] tracking-wider uppercase ${
                  !t.title.trim()
                    ? 'text-zinc-300'
                    : t.status === 'published'
                      ? 'text-accent'
                      : 'text-[var(--neon-orange)]'
                }`}
              >
                {!t.title.trim() ? '—' : t.status}
              </span>
              {active && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-accent" />}
            </button>
          )
        })}
      </div>

      <div className="mb-10 max-w-xs">
        <label className="block font-mono text-xs tracking-widest uppercase text-muted mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ArticleCategory)}
          className="w-full px-4 py-3 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
        >
          {CATEGORIES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div>
            <label className="block font-mono text-xs tracking-widest uppercase text-muted mb-2">
              Title
            </label>
            <input
              value={current.title}
              onChange={(e) => {
                const title = e.target.value
                const shouldAutoSlug = !current.slug || current.slug === slugify(current.title)
                updateCurrent({ title, slug: shouldAutoSlug ? slugify(title) : current.slug })
              }}
              className="w-full px-4 py-3 text-sm border border-border rounded-md bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              placeholder="Article title"
            />
          </div>

          <div>
            <label className="block font-mono text-xs tracking-widest uppercase text-muted mb-2">
              Slug
            </label>
            <input
              value={current.slug}
              onChange={(e) => updateCurrent({ slug: slugify(e.target.value) })}
              className="w-full px-4 py-3 text-sm font-mono border border-border rounded-md bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              placeholder="article-slug"
            />
          </div>

          <div>
            <label className="block font-mono text-xs tracking-widest uppercase text-muted mb-2">
              Excerpt
            </label>
            <textarea
              value={current.excerpt}
              onChange={(e) => updateCurrent({ excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 text-sm border border-border rounded-md bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
              placeholder="One or two sentence summary shown in the listing"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block font-mono text-xs tracking-widest uppercase text-muted">
                Content
              </label>
              <div className="flex gap-2">
                {(['paragraph', 'heading', 'quote', 'code'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addBlock(type)}
                    className="font-mono text-[10px] tracking-wider uppercase text-muted hover:text-accent transition-colors duration-200"
                  >
                    + {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {current.content.length === 0 && (
                <p className="text-sm text-muted border border-dashed border-border rounded-md px-4 py-6 text-center">
                  No blocks yet — add a paragraph, heading, quote or code block above.
                </p>
              )}

              {current.content.map((block, index) => (
                <div key={index} className="border border-border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] tracking-wider uppercase text-accent">
                      {block.type}
                    </span>
                    <div className="flex items-center gap-3 text-muted">
                      <button
                        type="button"
                        onClick={() => moveBlock(index, -1)}
                        disabled={index === 0}
                        className="hover:text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none"
                        aria-label="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(index, 1)}
                        disabled={index === current.content.length - 1}
                        className="hover:text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none"
                        aria-label="Move down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(index)}
                        className="hover:text-red-600 transition-colors"
                        aria-label="Remove block"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {block.type === 'heading' && (
                    <div className="space-y-2">
                      <input
                        value={block.marker}
                        onChange={(e) => updateBlock(index, { marker: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                        placeholder="MARKER (e.g. FOUNDATION)"
                      />
                      <input
                        value={block.text}
                        onChange={(e) => updateBlock(index, { text: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                        placeholder="Heading text"
                      />
                    </div>
                  )}

                  {block.type === 'paragraph' && (
                    <textarea
                      value={block.text}
                      onChange={(e) => updateBlock(index, { text: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
                      placeholder="Paragraph text"
                    />
                  )}

                  {block.type === 'quote' && (
                    <textarea
                      value={block.text}
                      onChange={(e) => updateBlock(index, { text: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
                      placeholder="Quote text"
                    />
                  )}

                  {block.type === 'code' && (
                    <div className="space-y-2">
                      <input
                        value={block.label}
                        onChange={(e) => updateBlock(index, { label: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                        placeholder="LABEL (e.g. CSS / TOKENS)"
                      />
                      <textarea
                        value={block.code}
                        onChange={(e) => updateBlock(index, { code: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 text-sm font-mono border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
                        placeholder="Code"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="sticky top-10">
            <div className="font-mono text-xs tracking-widest uppercase text-muted mb-4">
              Preview
            </div>
            <div className="border border-border rounded-md p-8 bg-white max-h-[80vh] overflow-y-auto">
              <h1 className="font-display text-2xl font-bold mb-3">
                {current.title || 'Untitled article'}
              </h1>
              {current.excerpt && (
                <p className="text-base text-zinc-600 leading-relaxed mb-8">{current.excerpt}</p>
              )}
              <ContentBlockRenderer blocks={current.content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
