// Next.js 16'da middleware.ts'in yerini proxy.ts aldı.
// İki ayrı görevi var:
//  - /admin dışındaki her şey: next-intl locale routing (örn. "/" → "/tr")
//  - /admin altı: Supabase session refresh (resmi @supabase/ssr Next.js pattern'i) —
//    admin panelinin kendi i18n'i yok, next-intl handler'ından hiç geçmiyor.
import createMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

async function updateSupabaseSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Süresi dolmuş bir token varsa burada yenileniyor — Server Component'lardan
  // cookie set edilemediği için bu yenileme adımı yalnızca middleware'de olabilir.
  await supabase.auth.getUser()

  return response
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return updateSupabaseSession(request)
  }
  return intlMiddleware(request as Parameters<typeof intlMiddleware>[0])
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}
