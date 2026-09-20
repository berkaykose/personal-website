'use client'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function ErrorBoundary({
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  const t = useTranslations('error')

  return (
    <div className="max-w-3xl mx-auto px-6 py-32 md:py-40 text-center">
      <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--neon-orange)] mb-6">
        {t('label')}
      </div>
      <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.15] text-foreground mb-6">
        {t('title')}
      </h1>
      <p className="text-base md:text-lg text-muted mb-10">{t('description')}</p>
      <div className="flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex items-center gap-1 bg-accent text-white text-sm font-medium px-6 py-2.5 rounded-md hover:opacity-90 active:opacity-80 transition-opacity"
        >
          {t('retry')}
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-foreground transition-colors duration-200"
        >
          {t('back_home')} →
        </Link>
      </div>
    </div>
  )
}
