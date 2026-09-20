import { notFound } from 'next/navigation'
import ArticleEditor from '@/components/admin/ArticleEditor'
import { fetchArticleById } from '@/lib/admin/api'
import { requireAdminUser } from '@/lib/admin/session'

export const dynamic = 'force-dynamic'

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireAdminUser()
  const article = await fetchArticleById(id)
  if (!article) notFound()

  return <ArticleEditor mode="edit" article={article} />
}
