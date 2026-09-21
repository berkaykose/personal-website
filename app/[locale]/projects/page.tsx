import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { projects, type Project, type ProjectStatus } from '@/data/projects'
import FadeIn from '@/components/FadeIn'
import ProjectScreenshot from '@/components/ProjectScreenshot'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const [t, tProjects] = await Promise.all([
    getTranslations({ locale, namespace: 'metadata' }),
    getTranslations({ locale, namespace: 'projects' }),
  ])
  return buildMetadata({
    locale,
    path: '/projects',
    title: t('projects_title'),
    description: tProjects('subtitle'),
  })
}

const featuredSpecs: { id: string; category: 'frontend' | 'backend' }[] = [
  { id: 'portfolio', category: 'frontend' },
  { id: 'toast-notification-builder', category: 'frontend' },
]

const statusColor: Record<ProjectStatus, string> = {
  completed: 'text-accent',
  'in-progress': 'text-[var(--neon-orange)]',
  planned: 'text-muted',
}

function statusLabel(
  project: Project,
  t: (key: 'status_planned' | 'status_in_progress' | 'status_completed') => string
) {
  if (project.status === 'planned') return t('status_planned')
  if (project.status === 'in-progress') return t('status_in_progress')
  return t('status_completed')
}

function Placeholder({ letter }: { letter: string }) {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(107, 117, 51, 0.18) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center font-display text-6xl font-bold text-accent/25 select-none"
      >
        {letter}
      </span>
    </>
  )
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, tHome] = await Promise.all([getTranslations('projects'), getTranslations('home')])

  const loc = locale as 'tr' | 'en'

  const featured = featuredSpecs
    .map((spec) => {
      const project = projects.find((p) => p.id === spec.id)
      return project ? { project, category: spec.category } : null
    })
    .filter((entry): entry is { project: Project; category: 'frontend' | 'backend' } => entry !== null)

  const featuredIds = new Set(featured.map((entry) => entry.project.id))
  const archive = projects
    .filter((p) => !featuredIds.has(p.id))
    .sort((a, b) => {
      if (a.status === 'planned' && b.status !== 'planned') return 1
      if (b.status === 'planned' && a.status !== 'planned') return -1
      return b.year - a.year
    })

  return (
    <div className="max-w-5xl mx-auto px-6">
      <FadeIn>
        <section className="py-24 md:py-28">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--neon-orange)] mb-6">
                {t('label')}
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.15] mb-6">
                {t('title')}
              </h1>
              <p className="text-lg text-muted max-w-lg">{t('subtitle')}</p>
            </div>
            <span className="font-mono text-xs text-zinc-400 shrink-0 mt-8">
              {t('count', { count: projects.length })}
            </span>
          </div>
        </section>
      </FadeIn>

      {featured.map(({ project, category }, index) => {
        const title = project.title[loc] ?? project.title.tr
        const description = project.description[loc] ?? project.description.tr
        const stack = project.tags.join(' · ')
        const href = project.live ?? project.github
        const categoryLabel = (category === 'frontend' ? tHome('frontend_label') : tHome('backend_label')).toUpperCase()
        const reversed = index % 2 === 1

        return (
          <FadeIn key={project.id} delay={100 + index * 50}>
            <section className="border-t border-border py-16 md:py-20">
              <div className="flex items-baseline justify-between mb-6">
                <span className="font-mono text-[11px] tracking-[0.1em] text-accent">
                  {t('item_label')} {String(index + 1).padStart(2, '0')} / {categoryLabel}
                </span>
                <span className={`font-mono text-xs uppercase tracking-wide ${statusColor[project.status]}`}>
                  {statusLabel(project, t)}
                </span>
              </div>

              <h2 className="font-display text-3xl md:text-4xl font-bold mb-10">{title}</h2>

              <div className={`flex flex-col md:flex-row gap-10 md:gap-16 items-center ${reversed ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1 w-full">
                  <p className="text-base md:text-lg text-zinc-600 leading-relaxed mb-6 max-w-md">
                    {description}
                  </p>
                  <p className="font-mono text-xs text-muted mb-8">{stack}</p>
                  {href && (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:opacity-80 transition-opacity"
                    >
                      {tHome('view_project')} ↗
                    </a>
                  )}
                </div>

                <div className="flex-1 w-full">
                  <div className="relative aspect-video rounded-md overflow-hidden bg-accent-light transition-transform duration-300 hover:scale-[1.02]">
                    {project.screenshot ? (
                      <ProjectScreenshot src={project.screenshot} alt={title} />
                    ) : (
                      <Placeholder letter={title.charAt(0)} />
                    )}
                  </div>
                </div>
              </div>
            </section>
          </FadeIn>
        )
      })}

      {archive.length > 0 && (
        <FadeIn delay={100 + featured.length * 50}>
          <section className="border-t border-border py-16">
            <h2 className="font-mono text-xs text-muted tracking-widest uppercase mb-8">
              {t('archive_label')}
            </h2>
            <div className="divide-y divide-border border-t border-b border-border">
              {archive.map((project, index) => {
                const title = project.title[loc] ?? project.title.tr
                const href = project.live ?? project.github
                const stack = project.tags.slice(0, 2).join(' · ')
                const number = String(featured.length + index + 1).padStart(2, '0')

                const row = (
                  <div className="flex items-center gap-4 sm:gap-6 py-5">
                    <span className="font-mono text-xs text-zinc-400 w-6 shrink-0">{number}</span>
                    <span className="flex-1 font-medium group-hover:text-accent transition-colors duration-200">
                      {title}
                    </span>
                    <span className="hidden sm:inline font-mono text-xs text-zinc-500 shrink-0 w-40">
                      {stack}
                    </span>
                    <span
                      className={`font-mono text-xs shrink-0 w-24 sm:w-28 text-right uppercase tracking-wide ${statusColor[project.status]}`}
                    >
                      {statusLabel(project, t)}
                    </span>
                    {href && <span className="text-accent shrink-0">→</span>}
                  </div>
                )

                return href ? (
                  <a
                    key={project.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    {row}
                  </a>
                ) : (
                  <div key={project.id}>{row}</div>
                )
              })}
            </div>
          </section>
        </FadeIn>
      )}
    </div>
  )
}
