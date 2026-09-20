'use client'
import { useLocale } from 'next-intl'
import { usePathname, Link } from '@/i18n/navigation'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <div className="flex items-center border border-border rounded-full overflow-hidden font-mono text-xs select-none">
      <Link
        href={pathname}
        locale="tr"
        aria-label="Türkçe"
        className={`px-2.5 py-1 transition-colors duration-200 ${
          locale === 'tr'
            ? 'bg-accent text-white'
            : 'text-muted hover:bg-zinc-50 hover:text-foreground'
        }`}
      >
        TR
      </Link>
      <span className="w-px h-3 bg-border" />
      <Link
        href={pathname}
        locale="en"
        aria-label="English"
        className={`px-2.5 py-1 transition-colors duration-200 ${
          locale === 'en'
            ? 'bg-accent text-white'
            : 'text-muted hover:bg-zinc-50 hover:text-foreground'
        }`}
      >
        EN
      </Link>
    </div>
  )
}
