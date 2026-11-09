import { KoboProcedural } from './KoboProcedural'

export interface KoboFallbackProps {
  mood?: 'idle' | 'wave' | 'celebrate' | 'thinking'
  reducedMotion?: boolean
}

export function KoboFallback({
  mood = 'idle',
  reducedMotion = false,
}: KoboFallbackProps) {
  return (
    <div aria-live="polite">
      <KoboProcedural reducedMotion={reducedMotion} />
      <p className="text-center text-sm text-muted">Kobo in {mood} mood</p>
    </div>
  )
}
