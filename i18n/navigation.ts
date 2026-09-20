// next-intl'in Link, usePathname, useRouter gibi navigasyon araçlarını
// locale-aware versiyonlarıyla sarar. Bu sayede <Link href="/about"> yazdığında
// otomatik olarak /tr/about veya /en/about'a gider.
import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

export const { Link, usePathname, useRouter, redirect } = createNavigation(routing)
