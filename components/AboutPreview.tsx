import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'

export default function AboutPreview() {
  const t = useTranslations('home')

  return (
    <section className="pb-28 border-t border-border pt-16">
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-y-10 md:gap-x-[10%] items-start">
        <div className="md:pt-10">
          <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--neon-orange)] mb-4">
            {t('about_label')}
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-5">
            {t('beyond_code_title')}
          </h2>
          <p className="text-base text-zinc-600 leading-relaxed mb-5 max-w-md">
            {t('beyond_code_body')}
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:opacity-80 transition-opacity"
          >
            {t('more_about_me')} →
          </Link>
        </div>

        <div className="relative md:-translate-x-4 md:translate-y-6">
          {/* Fotoğrafın arkasındaki dekoratif katman: yumuşak haki halo,
              nokta deseni, ince kavisli çizgi ve küçük kod satırı */}
          <div
            aria-hidden="true"
            className="absolute -inset-5 md:-inset-8 rounded-full bg-accent-light/70"
          />
          <div
            aria-hidden="true"
            className="absolute -top-3 -left-3 w-20 h-20"
            style={{
              backgroundImage: 'radial-gradient(rgba(107, 117, 51, 0.3) 1.5px, transparent 1.5px)',
              backgroundSize: '9px 9px',
            }}
          />
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M -15 65 Q 50 105 115 25" stroke="rgba(107, 117, 51, 0.4)" strokeWidth="0.4" fill="none" />
          </svg>
          <div
            aria-hidden="true"
            className="absolute -top-6 right-2 font-mono text-[11px] text-accent/70 tracking-tight whitespace-nowrap"
          >
            const engineer = {'{ curious: true }'};
          </div>

          <div
            className="relative aspect-[4/5] overflow-hidden"
            style={{ borderRadius: '68% 32% 56% 44% / 48% 62% 38% 52%' }}
          >
            <Image
              src="/berkay-kose-illustration.png"
              alt="Berkay Köse"
              fill
              sizes="(min-width: 768px) 36vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
