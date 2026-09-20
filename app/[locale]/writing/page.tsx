import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { fetchPublishedArticles } from '@/lib/posts/api'
import { formatPostDate } from '@/lib/formatDate'
import FadeIn from '@/components/FadeIn'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const [t, tWriting, locale] = await Promise.all([
    getTranslations('metadata'),
    getTranslations('writing'),
    getLocale(),
  ])
  return buildMetadata({
    locale,
    path: '/writing',
    title: t('writing_title'),
    description: tWriting('subtitle'),
  })
}

export default async function WritingPage() {
  const [t, tHome, locale] = await Promise.all([
    getTranslations('writing'),
    getTranslations('home'),
    getLocale(),
  ])

  const articles = await fetchPublishedArticles(locale)

  return (
    <div className="max-w-5xl mx-auto px-6">
      <FadeIn>
        <section className="py-24 md:py-28">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--neon-orange)] mb-6">
                {t('label')}
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.15] mb-6">
                {t('heading')}
              </h1>
              <p className="text-lg text-muted max-w-lg">{t('subtitle')}</p>
            </div>
            <span className="font-mono text-xs text-zinc-400 shrink-0 mt-8">
              {t('count', { count: articles.length })}
            </span>
          </div>
        </section>
      </FadeIn>

      {articles.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted border-t border-border">{t('empty')}</p>
      ) : (
        <div className="border-t border-border">
          {articles.map((article, index) => {
            const categoryLabel = tHome(
              `${article.category}_label` as 'frontend_label' | 'backend_label'
            ).toUpperCase()

            return (
              <FadeIn key={article.slug} delay={index * 80}>
                <Link href={`/writing/${article.slug}`} className="group block border-b border-border py-10">
                  <div className="flex items-baseline justify-between gap-4 mb-5 font-mono text-xs text-zinc-400 tracking-wide">
                    <span className="flex items-baseline gap-3">
                      {formatPostDate(article.publishedAt, locale)}
                      <span className="text-zinc-300">·</span>
                      {categoryLabel}
                    </span>
                    <span className="shrink-0">
                      {article.readTimeMinutes} {t('min_read')}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-6 mb-4">
                    <h2 className="font-display font-bold leading-[1.1] text-[clamp(1.75rem,2.3vw,2.5rem)] max-w-2xl group-hover:text-accent transition-colors duration-200">
                      {article.title}
                    </h2>
                    <span className="shrink-0 text-accent mt-3 group-hover:translate-x-1 transition-transform duration-200">
                      →
                    </span>
                  </div>

                  <p className="text-sm text-muted leading-relaxed max-w-xl">{article.excerpt}</p>
                </Link>
              </FadeIn>
            )
          })}
        </div>
      )}
    </div>
  )
}
