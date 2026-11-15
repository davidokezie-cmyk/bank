import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Placeholder loading blocks. Reduced motion is handled by the global
 * prefers-reduced-motion rule in globals.css (animations collapse to 0.01ms).
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Skeleton shape preset */
  type?: 'portrait' | 'paragraph' | 'image' | 'avatar'
  /** Explicit width (any CSS length, e.g. '12rem' or '50%') */
  width?: string
  /** Explicit height (any CSS length) */
  height?: string
  /** Extra classes */
  className?: string
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>((props, ref) => {
  const { type = 'paragraph', width, height, className, style, ...rest } = props

  const shapeClasses = {
    portrait: 'h-40 w-32 rounded-2xl',
    paragraph: 'h-4 w-full max-w-md rounded-md',
    image: 'h-24 w-24 rounded-xl',
    avatar: 'h-12 w-12 rounded-full',
  }[type]

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-raised/70', shapeClasses, className)}
      style={{ width, height, ...style }}
      {...rest}
    />
  )
})

Skeleton.displayName = 'Skeleton'
