import type { ExperienceEntry } from '@/data/experience'

interface Props {
  entries: ExperienceEntry[]
  locale: 'tr' | 'en'
}

export default function ExperienceTimeline({ entries, locale }: Props) {
  return (
    <div className="max-w-xl divide-y divide-border border-t border-b border-border">
      {entries.map((entry) => (
        <div key={entry.company} className="py-8">
          <span className="font-mono text-[11px] tracking-[0.1em] text-accent">
            {entry.period[locale] ?? entry.period.tr}
          </span>
          <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mt-2 mb-1">
            {entry.role[locale] ?? entry.role.tr}
          </h3>
          <p className="font-mono text-xs text-muted mb-4">
            {entry.company} · {entry.location[locale] ?? entry.location.tr}
          </p>
          <p className="text-base text-zinc-600 leading-relaxed">
            {entry.description[locale] ?? entry.description.tr}
          </p>
          {entry.tags && entry.tags.length > 0 && (
            <p className="font-mono text-xs text-muted mt-4">{entry.tags.join(' · ')}</p>
          )}
        </div>
      ))}
    </div>
  )
}
