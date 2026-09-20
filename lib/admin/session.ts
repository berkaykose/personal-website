import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

// Dashboard layout'un route guard'ı — session yoksa login'e yönlendirir.
// Session cookie'sinin kendisi Supabase (@supabase/ssr) tarafından yönetiliyor;
// burada sadece "geçerli bir kullanıcı var mı" kontrolü yapılıyor.
export async function requireAdminUser(): Promise<User> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return user
}
