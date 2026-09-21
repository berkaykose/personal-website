import { notFound } from 'next/navigation'
import ProjectEditor from '@/components/admin/ProjectEditor'
import { fetchProjectById } from '@/lib/admin/projects'
import { requireAdminUser } from '@/lib/admin/session'

export const dynamic = 'force-dynamic'

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireAdminUser()
  const project = await fetchProjectById(id)
  if (!project) notFound()

  return <ProjectEditor mode="edit" project={project} />
}
