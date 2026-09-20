import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import NotFoundContent from '@/components/NotFoundContent'

// Geçerli bir locale altında (örn. /tr/rastgele-yol) eşleşmeyen tüm alt yollar
// buraya düşer. [slug]/page.tsx'teki gibi notFound() yerine içeriği doğrudan
// render ediyoruz — böylece Navbar/Footer ve doğru dil korunuyor
// (bkz. app/[locale]/writing/[slug]/page.tsx'teki aynı çözüm).
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  return { title: t('not_found_title') }
}

export default function CatchAll() {
  return <NotFoundContent />
}
