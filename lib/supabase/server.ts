import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Request-scoped server client — her Server Component/Action kendi cookies()
// çağrısına bağlı taze bir client oluşturmalı (module-level singleton OLMAZ,
// çünkü her request'in kendi session cookie'si var).
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component render'ından çağrılırsa cookie set edilemez —
            // middleware (proxy.ts) zaten session'ı refresh ediyor, burada
            // sessizce yutuyoruz. (bkz. resmi @supabase/ssr Next.js App Router pattern'i)
          }
        },
      },
    }
  )
}
