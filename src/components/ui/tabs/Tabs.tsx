'use client'

import React, { forwardRef, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Currently selected tab value */
  value: string
  /** Called with the newly selected tab value */
  onValueChange: (value: string) => void
  /** Tab buttons; each child must carry a `value` prop */
  children: React.ReactNode
}

type TabChildProps = {
  value: string
  role?: string
  'aria-selected'?: boolean
  tabIndex?: number
  className?: string
  onClick?: () => void
}

export const Tab = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }>(
  function Tab({ value, className, ...rest }, ref) {
    return <button ref={ref} type="button" data-tab-value={value} className={className} {...rest} />
  },
)
Tab.displayName = 'Tab'

/**
 * Accessible tabs: role="tablist", arrow-key navigation, roving tabindex.
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>((props, ref) => {
  const { value, onValueChange, children, className, ...rest } = props
  const listRef = useRef<HTMLDivElement>(null)

  const values = React.Children.toArray(children)
    .filter(React.isValidElement)
    .map((child) => (child.props as { value?: string }).value)
    .filter((item): item is string => typeof item === 'string')

  function moveFocus(direction: 1 | -1) {
    const current = values.indexOf(value)
    if (current === -1 || values.length === 0) return
    const next = (current + direction + values.length) % values.length
    onValueChange(values[next])
    listRef.current
      ?.querySelector<HTMLButtonElement>(`[data-tab-value="${CSS.escape(values[next])}"]`)
      ?.focus()
  }

  return (
    <div ref={ref} className={cn('w-full', className)} {...rest}>
      <div
        ref={listRef}
        role="tablist"
        className="flex gap-1 border-b border-[var(--border)]"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault()
            moveFocus(1)
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault()
            moveFocus(-1)
          }
        }}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement<TabChildProps>(child)) return child
          const isActive = child.props.value === value
          return React.cloneElement(child, {
            role: 'tab',
            'aria-selected': isActive,
            tabIndex: isActive ? 0 : -1,
            className: cn(
              '-mb-px min-h-11 border-b-2 border-transparent px-4 text-sm font-medium text-[var(--muted)] transition-colors',
              'hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]',
              isActive && 'border-[var(--gold)] text-[var(--gold-strong)]',
            ),
            onClick: () => onValueChange(child.props.value),
          })
        })}
      </div>
    </div>
  )
})

Tabs.displayName = 'Tabs'
