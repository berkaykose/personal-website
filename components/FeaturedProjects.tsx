import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { projects } from '@/data/projects'
import ProjectScreenshot from '@/components/ProjectScreenshot'

interface Props {
  locale: string
}

export default function FeaturedProjects({ locale }: Props) {
  const t = useTranslations('home')
  const featured = projects.filter((p) => p.featured)

  return (
    <section className="pb-28 border-t border-border pt-16">
      <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--neon-orange)] mb-4">
        {t('projects_label')}
      </div>
      <h2 className="font-display text-3xl font-bold text-foreground mb-10">
        {t('featured_title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featured.map((project) => {
          const title = project.title[locale as 'tr' | 'en'] ?? project.title.tr
          const oneLiner = project.oneLiner?.[locale as 'tr' | 'en'] ?? project.oneLiner?.tr
          const stack = project.tags.join(' · ')
          const href = project.live ?? project.github ?? '/projects'
          const isExternal = href.startsWith('http')

          return (
            <article
              key={project.id}
              className="border border-border rounded-lg overflow-hidden hover:border-accent/40 transition-colors duration-200 group"
            >
              <div className="relative aspect-video bg-accent-light overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                {project.screenshot ? (
                  <ProjectScreenshot src={project.screenshot} alt={title} />
                ) : (
                  <>
                    {/* Gerçek bir ekran görüntüsü yok — yer tutucu: baş harf + nokta deseni */}
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
                      {title.charAt(0)}
                    </span>
                  </>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold group-hover:text-accent transition-colors duration-200 mb-2">
                  {title}
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed mb-3">{oneLiner}</p>
                <p className="font-mono text-xs text-muted mb-5">{stack}</p>

                {isExternal ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:opacity-80 transition-opacity"
                  >
                    {t('view_project')} ↗
                  </a>
                ) : (
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:opacity-80 transition-opacity"
                  >
                    {t('view_project')} →
                  </Link>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
