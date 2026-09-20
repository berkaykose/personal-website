import Link from 'next/link'
import { fetchAllArticles } from '@/lib/admin/api'
import { requireAdminUser } from '@/lib/admin/session'
import type { AdminArticle, Locale } from '@/lib/admin/types'

// Her istekte backend'den taze veri çekiyor — statik prerender edilmemeli.
export const dynamic = 'force-dynamic'

function displayTitle(article: AdminArticle) {
  return article.translations.en?.title || article.translations.tr?.title || 'Untitled'
}

function StatusBadge({ locale, article }: { locale: Locale; article: AdminArticle }) {
  const translation = article.translations[locale]
  const label = locale.toUpperCase()

  if (!translation) {
    return (
      <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-300">
        {label} · —
      </span>
    )
  }

  return (
    <span
      className={`font-mono text-[10px] tracking-wider uppercase ${
        translation.status === 'published' ? 'text-accent' : 'text-[var(--neon-orange)]'
      }`}
    >
      {label} · {translation.status}
    </span>
  )
}

export default async function AdminArticlesPage() {
  await requireAdminUser()
  const articles = await fetchAllArticles()
  const sorted = [...articles].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-1 bg-accent text-white text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-90 active:opacity-80 transition-opacity"
        >
          New Article
        </Link>
      </div>

      <div className="divide-y divide-border border-t border-b border-border">
        {sorted.map((article) => (
          <Link
            key={article.id}
            href={`/admin/articles/${article.id}/edit`}
            className="group flex items-center justify-between gap-6 py-5"
          >
            <div className="min-w-0">
              <p className="font-medium group-hover:text-accent transition-colors duration-200 truncate">
                {displayTitle(article)}
              </p>
              <div className="flex items-center gap-4 mt-1.5">
                <StatusBadge locale="en" article={article} />
                <StatusBadge locale="tr" article={article} />
              </div>
            </div>
            <span className="font-mono text-xs text-zinc-400 shrink-0">
              {new Date(article.updatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </Link>
        ))}

        {sorted.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">No articles yet.</p>
        )}
      </div>
    </div>
  )
}
