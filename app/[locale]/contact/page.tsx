import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import FadeIn from '@/components/FadeIn'
import ContactForm from '@/components/ContactForm'
import { siteConfig } from '@/data/site'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const [t, tContact] = await Promise.all([
    getTranslations({ locale, namespace: 'metadata' }),
    getTranslations({ locale, namespace: 'contact' }),
  ])
  return buildMetadata({
    locale,
    path: '/contact',
    title: t('contact_title'),
    description: tContact('subtitle'),
  })
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, tf] = await Promise.all([getTranslations('contact'), getTranslations('footer')])

  const contactLinks = [
    { label: 'GitHub', href: siteConfig.github, mono: 'github.com/berkaykose' },
    { label: 'LinkedIn', href: siteConfig.linkedin, mono: 'linkedin.com/in/berkaykse' },
    { label: tf('email'), href: `mailto:${siteConfig.email}`, mono: siteConfig.email },
  ]

  return (
    <div className="max-w-5xl mx-auto px-6">
      <FadeIn>
        <section className="py-24 md:py-28">
          <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--neon-orange)] mb-6">
            {t('label')}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.15] mb-6">
            {t('title')}
          </h1>
          <p className="text-lg text-muted max-w-lg">{t('subtitle')}</p>
        </section>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 border-t border-border py-16">
          <div>
            <h2 className="font-mono text-xs font-medium text-zinc-600 tracking-widest uppercase mb-8">
              {t('get_in_touch')}
            </h2>
            <div className="divide-y divide-border border-t border-b border-border">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className="group flex items-baseline justify-between gap-4 py-5"
                >
                  <span className="font-mono text-xs tracking-widest uppercase text-muted">
                    {link.label}
                  </span>
                  <span className="flex items-center gap-2 font-mono text-xs text-foreground group-hover:text-accent transition-colors duration-200">
                    {link.mono}
                    <span className="text-muted group-hover:text-accent group-hover:translate-x-1 transition-all duration-200">
                      ↗
                    </span>
                  </span>
                </a>
              ))}
              <div className="flex items-baseline justify-between gap-4 py-5">
                <span className="font-mono text-xs tracking-widest uppercase text-muted">
                  {t('location_label')}
                </span>
                <span className="font-mono text-xs text-foreground">{t('location')}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-mono text-xs font-medium text-zinc-600 tracking-widest uppercase mb-8">
              {t('form_label')}
            </h2>
            <ContactForm />
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
