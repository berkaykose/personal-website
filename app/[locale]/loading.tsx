export default function Loading() {
  return (
    <div className="loading-container min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <span className="font-mono text-[11px] tracking-[0.1em] text-[var(--neon-orange)]">
          LOADING /
        </span>
        <span className="loading-bk font-display text-4xl font-bold text-foreground">
          BK
        </span>
        <span aria-hidden="true" className="loading-line" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  )
}
