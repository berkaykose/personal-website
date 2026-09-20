import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Cookie'siz, stateless client — sitemap.ts gibi next/headers'ın güvenilir
// şekilde kullanılamayabileceği bağlamlar için. Session/auth gerektirmeyen,
// RLS'in public policy'leriyle korunan okumalarda kullanılır.
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
