/* eslint-disable @next/next/no-img-import */
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
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
}

export const Sheet = forwardRef<HTMLDivElement, SheetProps>(props => {
  const { open, onOpenChange, side = 'right', title, footer, closeOnEscape = true, className, children } = props
  const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const translateX = side === 'right' ? 'var(--sheet-width, 320px)' : 'calc(100% - var(--sheet-width, 320px))'

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sheet-title"
      className=cn(
        'fixed inset-0 z-50 flex items-end',
        side === 'right'
          ? 'right-0 top-0 w-[var(--sheet-width,320px)] h-full transition-all duration-300 ease-out transform'
          : 'left-0 top-0 w-[var(--sheet-width,320px)] h-full transition-all duration-300 ease-out transform',
        isReduced && 'transition-none duration-150 ease-0 transform',
        side === 'right'
          ? 'transform: translateX(0)'
          : 'transform: translateX(calc(-100% + var(--sheet-width, 320px)))',
        ...(isReduced && {
          transition: 'opacity 150ms ease',
          transform: 'translateX(0)',
        }),
        className,
      ),
      onClickOutside={!closeOnEscape ? undefined : (e: MouseEvent) => {
        const target = e.target as HTMLElement
        if (target.closest('.sheet-wrapper') === null) {
          onOpenChange(false)
        }
      }}
      style={{ '--sheet-width': '320px' }}
    >
      <div className="sheet-wrapper relative flex flex-col w-full max-w-none bg-surface p-4 shadow-lg" 
           onClick={(e) => e.stopPropagation()}>
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
      </div>
    </motion.div>
  )
})

Sheet.displayName = 'Sheet'