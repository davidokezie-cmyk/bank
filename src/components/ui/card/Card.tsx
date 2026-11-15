import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Surface container. Pass `header` / `footer` for structured chrome,
 * or plain children for a simple padded surface.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Elevated shadow */
  elevated?: boolean
  /** Optional header content (pre-styled chrome) */
  header?: React.ReactNode
  /** Optional footer content (pre-styled chrome) */
  footer?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const { elevated = false, header, footer, className, children, ...rest } = props

  return (
    <div
      ref={ref}
      className={cn(
        'glass overflow-hidden',
        elevated ? 'shadow-[var(--shadow-glass-lg)]' : undefined,
        className,
      )}
      {...rest}
    >
      {header && (
        <div className="border-b border-[var(--glass-border)] px-6 py-4 font-semibold text-[var(--text)]">{header}</div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="border-t border-[var(--glass-border)] px-6 py-4">{footer}</div>
      )}
    </div>
  )
})

Card.displayName = 'Card'
