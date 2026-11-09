'use client'

export interface KoboProceduralProps {
  progress?: number
  reducedMotion?: boolean
}

export function KoboProcedural({
  progress = 0,
  reducedMotion = false,
}: KoboProceduralProps) {
  const visibleBlocks = Math.max(0, Math.min(12, Math.round(progress * 12)))

  return (
    <div
      className="flex min-h-64 flex-col items-center justify-center gap-4"
      role="img"
      aria-label="Kobo, the Buy & Build gold coin mascot"
    >
      <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-gold bg-gradient-to-br from-amber-300 to-yellow-600 shadow-xl">
        <div className="flex gap-5">
          <span className="h-4 w-4 rounded-full bg-[var(--ink)]" />
          <span className="h-4 w-4 rounded-full bg-[var(--ink)]" />
        </div>
        <span className="absolute bottom-8 h-5 w-10 rounded-b-full border-b-4 border-[var(--ink)]" />
        <span className="absolute -right-2 top-7 h-24 w-5 rotate-12 rounded-full bg-accent-violet" />
      </div>
      <div className="flex min-h-6 flex-wrap justify-center gap-1" aria-hidden="true">
        {Array.from({ length: visibleBlocks }, (_, index) => (
          <span
            key={index}
            className="h-5 w-5 rounded-sm border border-white/30 bg-gold"
          />
        ))}
      </div>
      <p className="text-sm text-muted">
        {reducedMotion ? 'Kobo mascot (static)' : 'Kobo mascot'}
      </p>
    </div>
  )
}
