import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  fetchPublishedAlternateSlug,
  fetchPublishedArticleBySlug,
  fetchPublishedArticles,
} from '@/lib/posts/api'
import { formatPostDate } from '@/lib/formatDate'
import { formatArticleCategory } from '@/lib/posts/categories'
import FadeIn from '@/components/FadeIn'
import NotFoundContent from '@/components/NotFoundContent'
import ContentBlockRenderer from '@/components/ContentBlockRenderer'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const article = await fetchPublishedArticleBySlug(locale, slug)
  if (!article) {
    const t = await getTranslations('metadata')
    return { title: t('not_found_title'), robots: { index: false } }
  }
  return buildMetadata({
    locale,
    path: `/writing/${slug}`,
    title: article.title,
    description: article.excerpt,
    // Her locale kendi slug'ına sahip olabilir (ArticleTranslation modeli) —
    // aynı slug'ın diğer locale'de var olduğunu varsaymak yanlış olur.
    skipLanguageAlternates: true,
  })
}

export default async function WritingPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [t, tNav, locale] = await Promise.all([
    getTranslations('writing'),
    getTranslations('nav'),
    getLocale(),
  ])

  const article = await fetchPublishedArticleBySlug(locale, slug)
  if (!article) {
    const alternateSlug = await fetchPublishedAlternateSlug(slug, locale)
    if (alternateSlug) redirect(`/writing/${alternateSlug}`)
    return <NotFoundContent />
  }

  const categoryLabel = formatArticleCategory(article.category, locale).toLocaleUpperCase(locale)

  const all = await fetchPublishedArticles(locale)
  const currentIndex = all.findIndex((a) => a.slug === slug)
  const nextArticle = all[(currentIndex + 1) % all.length]

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <FadeIn>
        <Link
          href="/writing"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors duration-200 mb-8"
        >
          ← {t('back')}
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[11px] tracking-[0.1em] text-[var(--neon-orange)]">
            {tNav('writing').toUpperCase()} / {categoryLabel}
          </span>
        </div>

        <div className="font-mono text-xs text-zinc-400 tracking-wide mb-6">
          {formatPostDate(article.publishedAt, locale)}
          <span className="mx-3 text-zinc-300">·</span>
          {article.readTimeMinutes} {t('min_read_label')}
        </div>

        <h1 className="font-display font-bold leading-[1.1] text-[clamp(2rem,4vw,3rem)] mb-6">
          {article.title}
        </h1>

        <p className="text-lg md:text-xl text-zinc-600 leading-relaxed max-w-2xl mb-14">
          {article.excerpt}
        </p>

        <div className="max-w-[720px]">
          <ContentBlockRenderer blocks={article.content} />
        </div>

        {nextArticle && (
          <div className="border-t border-border mt-16 pt-10">
            <p className="font-mono text-xs tracking-widest uppercase text-muted mb-4">
              {t('next_article_label')}
            </p>
            <Link
              href={`/writing/${nextArticle.slug}`}
              className="group inline-flex items-center gap-3 font-display text-2xl md:text-3xl font-bold leading-tight hover:text-accent transition-colors duration-200"
            >
              {nextArticle.title}
              <span className="shrink-0 text-accent group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </Link>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/writing"
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors duration-200"
          >
            {t('back_to_all')}
          </Link>
        </div>
      </FadeIn>
    </div>
  )
}
