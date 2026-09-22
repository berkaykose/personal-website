import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { fetchPublishedArticles } from '@/lib/posts/api'
import { formatPostDate } from '@/lib/formatDate'
import { formatArticleCategory } from '@/lib/posts/categories'

interface Props {
  locale: string
}

export default async function BlogPreview({ locale }: Props) {
  const tHome = await getTranslations('home')
  const latest = (await fetchPublishedArticles(locale)).slice(0, 3)

  if (latest.length === 0) return null

  return (
    <section className="pb-28 border-t border-border pt-16">
      <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--neon-orange)] mb-4">
        {tHome('writing_label')}
      </div>
      <h2 className="font-display text-3xl font-bold text-foreground mb-10">
        {tHome('writing_title')}
      </h2>

      <div className="divide-y divide-border border-t border-b border-border mb-8">
        {latest.map((article) => {
          const categoryLabel = formatArticleCategory(article.category, locale)

          return (
            <Link
              key={article.slug}
              href={`/writing/${article.slug}`}
              className="group flex items-center justify-between gap-6 py-6"
            >
              <div>
                <div className="font-mono text-xs text-muted tracking-wide uppercase mb-2">
                  {formatPostDate(article.publishedAt, locale)}
                  <span className="mx-3 text-zinc-300">·</span>
                  {categoryLabel}
                </div>
                <h3 className="text-lg font-semibold group-hover:text-accent transition-colors duration-200">
                  {article.title}
                </h3>
              </div>
              <span className="shrink-0 text-accent group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </Link>
          )
        })}
      </div>

      <div className="text-right">
        <Link
          href="/writing"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:opacity-80 transition-opacity"
        >
          {tHome('view_all_writing')} →
        </Link>
      </div>
    </section>
  )
}
