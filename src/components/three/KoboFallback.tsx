import { KoboProcedural } from './KoboProcedural'

export interface KoboFallbackProps {
  mood?: 'idle' | 'wave' | 'celebrate' | 'thinking'
  reducedMotion?: boolean
}

export function KoboFallback({
  reducedMotion = false,
}: KoboFallbackProps) {
  return (
    <div aria-live="polite">
      <KoboProcedural reducedMotion={reducedMotion} />
    </div>
  )
}
