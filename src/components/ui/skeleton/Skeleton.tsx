/* eslint-disable @next/next/no-img-import */
import { cn } from '@/lib/utils'

/**
 * Skeleton component with states:
 * portrait, paragraph, image, avatar
 * Used for empty states while loading
 * Respects prefers-reduced-motion
 */
export interface SkeletonProps {
  /** Skeleton type */
  type: 'portrait' | 'paragraph' | 'image' | 'avatar'
  /** Width of skeleton */
  width?: string
  /** Height of skeleton */
  height?: string
  /** Shimmer animation duration */
  duration?: number
  /** Additional className */
  className?: string
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(props => {
  const { type, width, height, duration = 1500, className } = props
  const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const baseClasses = cn(
    'rounded-md animate-pulse',
    'bg-surface/50',
  )

  const dimensions = {
    portrait: width ? `w-${width}` : 'w-16',
    paragraph: width ? `w-${width}` : 'w-full max-w-md',
    image: width ? `w-${width}` : 'w-24 h-24',
    avatar: 'w-12 h-12',
  }[type]

  const shimmerDuration = isReduced ? 0 : duration

  return (
    <div
      className=cn(
        baseClasses,
        dimensions,
        height && `h-${height}`,
        className,
      )
      style={{
        animationDuration: `${shimmerDuration}ms`,
      }}
    >
    </div>
  )
})

Skeleton.displayName = 'Skeleton'