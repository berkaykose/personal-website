import Link from 'next/link'
import { moveProject } from '@/app/admin/actions'
import { fetchAllProjects, type AdminProject } from '@/lib/admin/projects'
import { requireAdminUser } from '@/lib/admin/session'

export const dynamic = 'force-dynamic'

function ProjectRow({ project, index, count }: { project: AdminProject; index: number; count: number }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex flex-col shrink-0">
          <form action={moveProject.bind(null, project.id, 'up')}>
            <button
              type="submit"
              disabled={index === 0}
              className="block text-muted hover:text-foreground transition-colors disabled:opacity-20 disabled:pointer-events-none text-xs leading-none px-1"
              aria-label="Move up"
            >
              ↑
            </button>
          </form>
          <form action={moveProject.bind(null, project.id, 'down')}>
            <button
              type="submit"
              disabled={index === count - 1}
              className="block text-muted hover:text-foreground transition-colors disabled:opacity-20 disabled:pointer-events-none text-xs leading-none px-1"
              aria-label="Move down"
            >
              ↓
            </button>
          </form>
        </div>
        <Link
          href={`/admin/projects/${project.id}/edit`}
          className="min-w-0 group flex items-baseline gap-3"
        >
          <span className="font-medium group-hover:text-accent transition-colors duration-200 truncate">
            {project.title.en}
          </span>
          <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-300 shrink-0">
            {project.category} · {project.year}
          </span>
        </Link>
      </div>
      <Link
        href={`/admin/projects/${project.id}/edit`}
        className="font-mono text-xs text-muted hover:text-accent transition-colors shrink-0"
      >
        Edit
      </Link>
    </div>
  )
}

export default async function AdminProjectsPage() {
  await requireAdminUser()
  const projects = await fetchAllProjects()
  const showcase = projects.filter((p) => p.placement === 'showcase')
  const archive = projects.filter((p) => p.placement === 'archive')

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-1 bg-accent text-white text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-90 active:opacity-80 transition-opacity"
        >
          New Project
        </Link>
      </div>

      <div className="mb-12">
        <h2 className="font-mono text-xs tracking-widest uppercase text-muted mb-2">
          Showcase · shown on /projects and the homepage
        </h2>
        <div className="divide-y divide-border border-t border-b border-border">
          {showcase.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} count={showcase.length} />
          ))}
          {showcase.length === 0 && (
            <p className="py-8 text-center text-sm text-muted">No showcase projects yet.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="font-mono text-xs tracking-widest uppercase text-muted mb-2">Archive</h2>
        <div className="divide-y divide-border border-t border-b border-border">
          {archive.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} count={archive.length} />
          ))}
          {archive.length === 0 && (
            <p className="py-8 text-center text-sm text-muted">No archive projects yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
