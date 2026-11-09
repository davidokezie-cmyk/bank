import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Card component with multiple states:
 * default, elevated, with header, with footer, disabled
 * Uses CSS variables for colors (ink, surface, raised, border)
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Elevated shadow */
  elevated?: boolean
  /** With header section */
  hasHeader?: boolean
  /** With footer section */
  hasFooter?: boolean
  /** Footer content */
  children: React.ReactNode
  /** Additional className */
  className?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const { elevated = false, hasHeader, hasFooter, className, children, ...rest } = props

  const elevationClasses = {
    true: 'shadow-lg', // raised token
    false: 'shadow-sm', // shadow-sm token
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-md border border-border bg-surface/50 backdrop-blur-sm',
        elevated && elevationClasses.true,
        !elevated && elevationClasses.false,
        'overflow-hidden',
        className,
      )}
      {...rest}
    >
      {hasHeader && <div className="p-6 border-b border-border">{children}</div>}
      {/* Header would be passed separately in practice */}
      {hasFooter && <div className="p-6 border-t border-border">{children}</div>}
      {/* Footer would be passed separately in practice */}
      {!hasHeader && !hasFooter && <div className="p-6">{children}</div>}
    </div>
  )
})

Card.displayName = 'Card'