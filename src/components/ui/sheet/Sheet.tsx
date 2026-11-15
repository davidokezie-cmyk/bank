'use client'

import React, { forwardRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

/**
 * Modal side sheet. Escape and backdrop click close it.
 * Reduced motion: the global prefers-reduced-motion rule disables transitions.
 */
export interface SheetProps {
  /** Whether sheet is open */
  open: boolean
  /** On open change callback */
  onOpenChange: (open: boolean) => void
  /** Side to slide from: 'left' or 'right' */
  side?: 'left' | 'right'
  /** Header title */
  title?: string
  /** Footer actions */
  footer?: React.ReactNode
  /** Whether to close on escape */
  closeOnEscape?: boolean
  /** Additional className */
  className?: string
  children?: React.ReactNode
}

export const Sheet = forwardRef<HTMLDivElement, SheetProps>((props, ref) => {
  const { open, onOpenChange, side = 'right', title, footer, closeOnEscape = true, className, children } = props

  useEffect(() => {
    if (!open || !closeOnEscape) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, closeOnEscape, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close sheet"
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[2px]"
        onClick={() => onOpenChange(false)}
      />
      <section
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Panel'}
        className={cn(
          'absolute inset-y-0 flex w-[min(380px,100%)] flex-col border-[var(--glass-border)] bg-[var(--raised)] p-5 shadow-[var(--shadow-glass-lg)]',
          side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
          className,
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          {title && <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="ml-auto rounded-md p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--raised)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
            aria-label="Close sheet"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

        {footer && <div className="mt-4 border-t border-[var(--border)] pt-4">{footer}</div>}
      </section>
    </div>
  )
})

Sheet.displayName = 'Sheet'
