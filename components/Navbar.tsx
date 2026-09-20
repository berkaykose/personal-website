'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '/about' as const, label: t('about') },
    { href: '/projects' as const, label: t('projects') },
    { href: '/writing' as const, label: t('writing') },
    { href: '/contact' as const, label: t('contact') },
  ]

  return (
    <header className="relative sticky top-0 z-50 bg-white/90 backdrop-blur-sm">
      <div className="navbar-neon-line" />
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-widest text-foreground hover:text-accent transition-colors duration-200"
        >
          BerkayKöse
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm transition-colors duration-200 ${
                    pathname === link.href
                      ? 'text-foreground font-medium'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <LanguageSwitcher />
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-muted hover:text-foreground transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={t('menu_toggle')}
          aria-expanded={isOpen}
        >
          <div className="w-5 flex flex-col gap-1.5">
            <span className={`block h-px bg-current transition-all duration-200 origin-center ${isOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-px bg-current transition-all duration-200 ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px bg-current transition-all duration-200 origin-center ${isOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </div>
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="max-w-5xl mx-auto px-6 py-6">
            <ul className="space-y-5 mb-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block text-sm transition-colors ${
                      pathname === link.href ? 'text-foreground font-medium' : 'text-muted hover:text-foreground'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  )
}
