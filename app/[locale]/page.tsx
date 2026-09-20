import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import FadeIn from '@/components/FadeIn'
import MatrixRain from '@/components/MatrixRain'
import FeaturedProjects from '@/components/FeaturedProjects'
import BlogPreview from '@/components/BlogPreview'
import AboutPreview from '@/components/AboutPreview'

// BlogPreview artık Supabase'ten canlı veri okuyor (cookies() kullanımı zaten
// dinamik render'ı tetikliyor, ama diğer veri-okuyan sayfalarla tutarlılık için
// açıkça belirtiyoruz).
export const dynamic = 'force-dynamic'

export default function HomePage() {
  const t = useTranslations('home')
  const locale = useLocale()

  return (
    <>
      {/* Canvas fixed+z-0, içerik relative+z-10 → içerik üstte kalır */}
      <MatrixRain />

      {/* Kenar boşluklarında akan, çok soluk mono karakter şeritleri (MatrixRain'e göndermedir) */}
      <div
        aria-hidden="true"
        className="hidden md:block fixed top-24 left-12 z-0 font-mono text-[11px] tracking-[3px] text-accent/[0.18] pointer-events-none select-none [writing-mode:vertical-rl]"
      >
        <span className="fall-stream inline-block">BK · 6B7533</span>
      </div>
      <div
        aria-hidden="true"
        className="hidden md:block fixed top-64 right-12 z-0 font-mono text-[11px] tracking-[3px] text-accent/[0.18] pointer-events-none select-none [writing-mode:vertical-rl]"
      >
        <span className="fall-stream inline-block" style={{ animationDelay: '-9s' }}>DEV · 01</span>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
      <section className="relative min-h-[calc(100svh-4rem)] flex flex-col justify-center py-16">
        <div
          aria-hidden="true"
          className="hidden md:block absolute top-1/2 -translate-y-1/2 -right-16 font-display text-[220px] lg:text-[420px] font-extrabold leading-none text-transparent select-none pointer-events-none"
          style={{ WebkitTextStroke: '1px rgba(107, 117, 51, 0.12)' }}
        >
          BK
        </div>

        <FadeIn>
          <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--neon-orange)] mb-5">
            {t('intro_label')}
          </div>

          <div className="relative inline-block mb-[22px] px-0.5">
            <span className="absolute -top-2 -left-2 w-4 h-px bg-accent/45" />
            <span className="absolute -top-2 -left-2 w-px h-4 bg-accent/45" />
            <span className="absolute -top-2 -right-2 w-4 h-px bg-accent/45" />
            <span className="absolute -top-2 -right-2 w-px h-4 bg-accent/45" />
            <p className="font-mono text-[13px] tracking-[0.04em] flex items-center">
              <span className="text-zinc-400">~/berkaykose</span>&nbsp;<span className="text-accent">$ {t('eyebrow_command')}</span>
              <span className="blink-cursor inline-block w-[7px] h-[14px] ml-[3px] bg-accent align-text-bottom" />
            </p>
          </div>

          <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tight text-foreground mb-6 leading-[1.05]">
            Berkay<br />Köse
          </h1>
          <p className="font-mono text-sm text-muted mb-8 tracking-wide">
            {t('subtitle')}
          </p>
          <p className="text-base md:text-lg text-zinc-600 leading-relaxed max-w-lg mb-12">
            {t('bio')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="bg-accent text-white text-sm font-medium px-6 py-3 rounded-md hover:opacity-90 active:opacity-80 transition-opacity"
            >
              {t('cta_projects')}
            </Link>
            <Link
              href="/contact"
              className="border border-border text-sm font-medium px-6 py-3 rounded-md hover:border-accent hover:text-accent transition-colors duration-200"
            >
              {t('cta_contact')}
            </Link>
          </div>
        </FadeIn>

        <FadeIn className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-400">scroll</span>
          <div className="scroll-line w-px h-8 bg-gradient-to-b from-zinc-400 to-transparent" />
        </FadeIn>
      </section>

      <section className="pb-28 border-t border-border pt-16">
        <FadeIn delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h2 className="font-mono text-xs text-muted tracking-widest uppercase mb-4">
                {t('backend_label')}
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">{t('backend_desc')}</p>
            </div>
            <div>
              <h2 className="font-mono text-xs text-muted tracking-widest uppercase mb-4">
                {t('frontend_label')}
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">{t('frontend_desc')}</p>
            </div>
            <div>
              <h2 className="font-mono text-xs text-muted tracking-widest uppercase mb-4">
                {t('current_label')}
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">{t('current_desc')}</p>
            </div>
          </div>
        </FadeIn>
      </section>

      <FadeIn delay={150}>
        <FeaturedProjects locale={locale} />
      </FadeIn>

      <FadeIn delay={200}>
        <BlogPreview locale={locale} />
      </FadeIn>

      <FadeIn delay={250}>
        <AboutPreview />
      </FadeIn>
    </div>
    </>
  )
}
