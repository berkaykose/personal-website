import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import FadeIn from '@/components/FadeIn'
import ExperienceTimeline from '@/components/ExperienceTimeline'
import { experience } from '@/data/experience'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const [t, tAbout] = await Promise.all([
    getTranslations({ locale, namespace: 'metadata' }),
    getTranslations({ locale, namespace: 'about' }),
  ])
  return buildMetadata({
    locale,
    path: '/about',
    title: t('about_title'),
    description: tAbout('s1_p1'),
  })
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('about')

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* 01 / ABOUT */}
      <FadeIn>
        <section className="py-24 md:py-28 md:flex md:items-center md:gap-16">
          <div className="flex-1 max-w-xl">
            <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--neon-orange)] mb-6">
              {t('s1_label')}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.15] mb-8">
              {t('s1_title')}
            </h1>
            <div className="space-y-5 text-base md:text-lg text-zinc-600 leading-relaxed">
              <p>{t('s1_p1')}</p>
              <p>{t('s1_p2')}</p>
            </div>
          </div>

          <div className="relative w-full max-w-sm mx-auto md:mx-0 md:w-[42%] shrink-0 mt-12 md:mt-0">
            <div
              aria-hidden="true"
              className="absolute -inset-5 md:-inset-8 rounded-full bg-accent-light/60"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-3 -right-3 w-16 h-16"
              style={{
                backgroundImage: 'radial-gradient(rgba(107, 117, 51, 0.3) 1.5px, transparent 1.5px)',
                backgroundSize: '9px 9px',
              }}
            />
            <div
              className="relative aspect-[4/5] overflow-hidden"
              style={{ borderRadius: '55% 45% 40% 60% / 45% 55% 45% 55%' }}
            >
              <Image
                src="/berkay-kose-illustration.png"
                alt="Berkay Köse"
                fill
                sizes="(min-width: 768px) 36vw, 70vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>
      </FadeIn>

      {/* 02 / JOURNEY */}
      <FadeIn delay={100}>
        <section className="border-t border-border pt-16 pb-20">
          <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--neon-orange)] mb-4">
            {t('s2_label')}
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">{t('s2_title')}</h2>
          <div className="space-y-5 text-base md:text-lg text-zinc-600 leading-relaxed max-w-xl">
            <p>{t('s2_p1')}</p>
            <p>{t('s2_p2')}</p>
            <p>{t('s2_p3')}</p>
          </div>

          <div className="max-w-xl my-10 pl-6 border-l-2 border-accent">
            <p className="font-display text-2xl md:text-3xl text-foreground leading-snug">
              {t('s2_pullquote')}
            </p>
          </div>

          <p className="max-w-xl text-base md:text-lg text-zinc-600 leading-relaxed mb-14">
            {t('s2_p4')}
          </p>

          <div className="font-mono text-[11px] tracking-[0.1em] text-accent mb-6">
            {t('s2_experience_label')}
          </div>
          <ExperienceTimeline entries={experience} locale={locale as 'tr' | 'en'} />
        </section>
      </FadeIn>

      {/* 03 / APPROACH */}
      <FadeIn delay={150}>
        <section className="border-t border-border pt-16 pb-20">
          <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--neon-orange)] mb-4">
            {t('s3_label')}
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">{t('s3_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            <div>
              <div className="font-mono text-[11px] tracking-[0.1em] text-accent mb-3">{t('s3_col1_label')}</div>
              <p className="text-base md:text-lg text-zinc-700 leading-relaxed">{t('s3_col1_desc')}</p>
            </div>
            <div>
              <div className="font-mono text-[11px] tracking-[0.1em] text-accent mb-3">{t('s3_col2_label')}</div>
              <p className="text-base md:text-lg text-zinc-700 leading-relaxed">{t('s3_col2_desc')}</p>
            </div>
            <div>
              <div className="font-mono text-[11px] tracking-[0.1em] text-accent mb-3">{t('s3_col3_label')}</div>
              <p className="text-base md:text-lg text-zinc-700 leading-relaxed">{t('s3_col3_desc')}</p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* 04 / TOOLBOX */}
      <FadeIn delay={200}>
        <section className="border-t border-border pt-16 pb-20">
          <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--neon-orange)] mb-4">
            {t('s4_label')}
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-12">
            {t('s4_title_line1')}
            <br />
            {t('s4_title_line2')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
            <div>
              <h3 className="text-sm font-semibold mb-2">{t('s4_group1_label')}</h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-3">{t('s4_group1_intro')}</p>
              <p className="font-mono text-xs text-zinc-600 leading-relaxed">{t('s4_group1_items')}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">{t('s4_group2_label')}</h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-3">{t('s4_group2_intro')}</p>
              <p className="font-mono text-xs text-zinc-600 leading-relaxed">{t('s4_group2_items')}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">{t('s4_group3_label')}</h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-3">{t('s4_group3_intro')}</p>
              <p className="font-mono text-xs text-zinc-600 leading-relaxed">{t('s4_group3_items')}</p>
            </div>
          </div>
          <p className="text-sm text-muted italic max-w-xl">{t('s4_footnote')}</p>
        </section>
      </FadeIn>

      {/* 05 / BEYOND CODE */}
      <FadeIn delay={250}>
        <section className="border-t border-border pt-16 pb-20">
          <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--neon-orange)] mb-4">
            {t('s5_label')}
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">{t('s5_title')}</h2>
          <div className="space-y-5 text-base md:text-lg text-zinc-600 leading-relaxed max-w-xl">
            <p>{t('s5_p1')}</p>
            <p>{t('s5_p2')}</p>
          </div>
        </section>
      </FadeIn>

      {/* 06 / NOW */}
      <FadeIn delay={300}>
        <section className="border-t border-border pt-16 pb-24">
          <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--neon-orange)] mb-4">
            {t('s6_label')}
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">{t('s6_title')}</h2>
          <div className="space-y-5 text-base md:text-lg text-zinc-600 leading-relaxed max-w-xl">
            <p>{t('s6_p1')}</p>
            <p>{t('s6_p2')}</p>
          </div>
        </section>
      </FadeIn>
    </div>
  )
}
