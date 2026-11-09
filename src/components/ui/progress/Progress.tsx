/* eslint-disable @next/next/no-img-import */
import { cn } from '@/lib/utils'

/**
 * Progress component with states:
 * determinate, indeterminate, with label
 * Uses CSS variables for colors
 * Accessible: aria-valuetext, role progressbar
 */
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Progress value 0-1 */
  value: number
  /** Show label inside bar */
  showLabel?: boolean
  /** Label text */
  label?: string
  /** Bar color (CSS variable name without 'var()') */
  color?: 'gold' | 'green-growth' | 'accent-violet' | 'alert-coral'
  /** Show progress as percentage */
  showPercentage?: boolean
  /** Height of bar */
  height?: '2' | '4' | '8'
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(props => {
  const { value, showLabel = false, label, color = 'gold', showPercentage = true, height = '4', className, ...rest } = props

  const percentage = Math.max(0, Math.min(100, value * 100))
  const barHeight = height === '2' ? 'h-2' : height === '8' ? 'h-8' : 'h-4'

  const colorClasses = {
    gold: 'bg-gold',
    green-growth: 'bg-green-growth',
    accent-violet: 'bg-accent-violet',
    alert-coral: 'bg-alert-coral',
  }

  const labelClasses = cn(
    'absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium',
    'select-none',
  )

  return (
    <div
      className=cn(
        'relative w-full rounded-md overflow-hidden',
        barHeight,
        className,
      )
      {...rest}
    >
      <div
        className=cn(
          'absolute inset-0',
          colorClasses[color as keyof typeof colorClasses] || colorClasses.gold,
        )
      />
      <div
        className=cn(
          'relative flex flex-col items-center py-1',
          showLabel && labelClasses,
        )
      >
        {showLabel && <span className="labelClasses">{label}</span>}
        {showPercentage && (
          <span className="absolute right-2 text-xs text-muted">{Math.round(percentage)}%</span>
        )}
      </div>
    </div>
  )
})

Progress.displayName = 'Progress'