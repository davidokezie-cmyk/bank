'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

/**
 * Sheet component - modal sidebar that slides in from side.
 * States: open, closed
 * Used for: joint pot management, filters, settings sheets
 * Reduced motion: fade transition only
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
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex"
      onClick={() => onOpenChange(false)}
      onKeyDown={(event) => {
        if (closeOnEscape && event.key === 'Escape') onOpenChange(false)
      }}
    >
      <section
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'sheet-title' : undefined}
        className={cn(
          'relative flex h-full w-[min(320px,100%)] flex-col bg-surface p-4 shadow-lg',
          side === 'right' ? 'ml-auto' : 'mr-auto',
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 id="sheet-title" className="text-lg font-medium">
              {title}
            </h3>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 rounded hover:bg-surface/30 transition-colors"
              aria-label="Close sheet"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {children}

        {footer && (
          <div className="mt-4 pt-4 border-t border-border">{footer}</div>
        )}
      </section>
    </div>
  )
})

Sheet.displayName = 'Sheet'