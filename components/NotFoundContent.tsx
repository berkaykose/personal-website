import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function NotFoundContent() {
  const t = await getTranslations('not_found')

  return (
    <div className="max-w-3xl mx-auto px-6 py-32 md:py-40 text-center">
      <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--neon-orange)] mb-6">
        {t('label')}
      </div>
      <h1 className="font-display text-7xl md:text-9xl font-bold leading-none text-foreground mb-6">
        404
      </h1>
      <p className="text-base md:text-lg text-muted mb-10">{t('description')}</p>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:opacity-80 transition-opacity"
      >
        {t('back_home')} →
      </Link>
    </div>
  )
}
