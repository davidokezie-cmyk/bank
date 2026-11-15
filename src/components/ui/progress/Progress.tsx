import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Determinate progress bar.
 * Accessible: role="progressbar" with aria-valuenow/min/max.
 * Respects reduced motion (transition is disabled globally under prefers-reduced-motion).
 */
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Progress value 0-1 */
  value: number
  /** Visible label rendered above the bar */
  label?: string
  /** Bar colour token */
  color?: 'gold' | 'green-growth' | 'steel' | 'alert-coral'
  /** Show the percentage as text to the right of the label */
  showPercentage?: boolean
  /** Height of bar */
  height?: '2' | '4' | '8'
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>((props, ref) => {
  const { value, label, color = 'gold', showPercentage = true, height = '4', className, ...rest } = props

  const clamped = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0))
  const percentage = Math.round(clamped * 100)
  const barHeight = height === '2' ? 'h-2' : height === '8' ? 'h-8' : 'h-4'

  const fillClasses = {
    gold: 'bg-gold',
    'green-growth': 'bg-green-growth',
    steel: 'bg-steel',
    'alert-coral': 'bg-alert-coral',
  }[color]

  return (
    <div ref={ref} className={cn('w-full', className)} {...rest}>
      {(label || showPercentage) && (
        <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
          {label && <span className="text-muted">{label}</span>}
          {showPercentage && <span className="money text-muted">{percentage}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label ?? 'Progress'}
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn('relative w-full overflow-hidden rounded-full bg-raised', barHeight)}
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none', fillClasses)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
})

Progress.displayName = 'Progress'
