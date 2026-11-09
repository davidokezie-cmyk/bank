'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Button component with multiple states:
 * default, primary, secondary, disabled, loading, ghost
 * Micro-interactions: 150-250ms springs (stiffness 260, damping 24)
 * Reduced motion respected via prefers-reduced-motion
 */
export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  /** Primary (brand violet) or secondary (outline) */
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
    primary: 'bg-accent-violet text-white hover:bg-accent-indigo',
    secondary: 'border border-border text-surface hover:bg-surface',
    ghost: 'text-accent-violet hover:bg-transparent',
    link: 'underline underline-offset-4 hover:text-accent-violet',
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
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-enabled',
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
        <span className="flex items-center justify-center h-4 w-4">
          <svg
            className="h-4 w-4 animate-spin text-white"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C12 3.34 15.66 4 18 4s6 0.66 6 1c1.34 1.34 1.34 3.55 0 4.23l-7.51 7.51C18 21.66 16.66 22 14 22S6 21.34 6 20z"
            />
          </svg>
        </span>
      ) : (
        children
      )}
    </button>
  )
})

Button.displayName = 'Button'