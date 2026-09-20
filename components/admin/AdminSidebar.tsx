'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/admin/actions'

const navItems = [{ href: '/admin/articles', label: 'Articles' }]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 border-r border-border min-h-screen flex flex-col justify-between py-8 px-6">
      <div>
        <Link
          href="/admin/articles"
          className="font-mono text-sm font-semibold tracking-widest text-foreground"
        >
          BERKAYKÖSE
        </Link>
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mt-1 mb-8">
          Admin
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                  active
                    ? 'bg-accent-light text-accent font-medium'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <span className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-zinc-300 cursor-default select-none">
            Projects
            <span className="font-mono text-[9px] tracking-wider uppercase text-zinc-300">
              Soon
            </span>
          </span>
        </nav>
      </div>

      <form action={logoutAction}>
        <button
          type="submit"
          className="text-sm text-muted hover:text-foreground transition-colors duration-200"
        >
          Sign out
        </button>
      </form>
    </aside>
  )
}
