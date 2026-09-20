'use client'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { siteConfig } from '@/data/site'

export default function Footer() {
  const t = useTranslations('footer')
  const pathname = usePathname()
  const isContactPage = pathname === '/contact'

  return (
    <footer className="border-t border-border mt-auto">
      {!isContactPage && (
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-12">
          <p className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {t('cta_line1')}
          </p>
          <Link
            href="/contact"
            className="font-display text-3xl md:text-4xl font-bold text-accent hover:opacity-80 transition-opacity leading-tight inline-block"
          >
            {t('cta_line2')}
          </Link>
        </div>
      )}

      <div
        className={`max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 ${
          isContactPage ? 'py-8' : 'py-8 border-t border-border'
        }`}
      >
        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <div className="flex gap-6">
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-muted hover:text-foreground transition-colors duration-200">
            GitHub
          </a>
          <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-muted hover:text-foreground transition-colors duration-200">
            LinkedIn
          </a>
          <a href={`mailto:${siteConfig.email}`} className="font-mono text-xs text-muted hover:text-foreground transition-colors duration-200">
            {t('email')}
          </a>
        </div>
      </div>
    </footer>
  )
}
