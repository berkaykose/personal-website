import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import NotFoundContent from '@/components/NotFoundContent'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  return { title: t('not_found_title'), robots: { index: false } }
}

export default function NotFound() {
  return <NotFoundContent />
}
