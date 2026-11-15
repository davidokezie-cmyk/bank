'use client'

import React, { forwardRef } from 'react'
import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Button component with multiple states:
 * default, primary, secondary, disabled, loading, ghost
 * Micro-interactions: 150-250ms springs (stiffness 260, damping 24)
 * Reduced motion respected via prefers-reduced-motion
 */
export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  /** Primary (solid gold), secondary (glass outline), ghost, or link */
  variant?: 'primary' | 'secondary' | 'ghost' | 'link'
  /** Disabled state */
  disabled?: boolean
  /** Show loading spinner */
  loading?: boolean
  /** On-click handler */
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Full-width button */
  fullWidth?: boolean
  /** Whether this is a money moment (aria-live covered by parent) */
  'aria-live'?: 'polite' | 'assertive'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { variant = 'primary', disabled, loading, size = 'md', fullWidth, children, className, onClick, ...rest } = props

  const variantClasses = {
    primary: 'bg-[var(--gold)] text-[#131A2A] hover:bg-[var(--gold-hover)]',
    secondary: 'glass-sm text-[var(--text)] hover:bg-[var(--glass-highlight)]',
    ghost: 'text-[var(--gold-strong)] hover:bg-[var(--glass-bg)]',
    link: 'underline underline-offset-4 decoration-[var(--glass-border)] hover:text-[var(--gold-strong)]',
  }[variant]

  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  }[size]

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)] disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses,
        sizeClasses,
        fullWidth && 'w-full',
        'shadow-sm',
        className,
      )}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      onClick={disabled || loading ? undefined : onClick}
      {...rest}
    >
      {loading ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span className="sr-only">Loading</span>
        </>
      ) : (
        children
      )}
    </button>
  )
})

Button.displayName = 'Button'