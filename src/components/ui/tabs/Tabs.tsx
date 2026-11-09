import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Tabs component with states:
 * default, single, with indicator
 * Clickable tab items with selection state
 */
export interface TabsProps {
  /** Currently selected tab value */
  value: string
  /** On value change callback */
  onValueChange: (value: string) => void
  /** Tab items */
  children: React.ReactNode
  /** Whether to show indicator */
  showIndicator?: boolean
  /** Additional className */
  className?: string
}

interface TabChildProps extends React.HTMLAttributes<HTMLButtonElement> {
  value?: string
  selected?: boolean
  onValueChange?: (value: string) => void
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>((props, ref) => {
  const { value, onValueChange, children, showIndicator = true, className } = props

  return (
    <div ref={ref} className={cn(
      'w-full border-b border-border select-none',
      className,
    )}>
      <div className="flex space-x-1" role="tablist">
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement<TabChildProps>(child)) return child
          const childValue = child.props.value ?? `tab-${index}`
          const isActive = childValue === value
          
          return React.cloneElement(child, {
            value: childValue,
            onValueChange: (newValue: string) => onValueChange(newValue),
            selected: isActive,
            'aria-selected': isActive,
            role: 'tab',
            tabIndex: isActive ? 0 : -1,
            className: cn(
              'flex h-10 w-24 items-center justify-center rounded-md border border-border text-sm font-medium transition-colors',
              isActive && 'border-b-2 border-accent-violet text-accent-violet',
              !isActive && 'text-muted hover:text-primary',
              'cursor-pointer',
            ),
          })
        })}
      </div>
      {showIndicator && (
        <div className="h-0.5 bg-accent-violet bottom-0 left-1/2 -translate-x-1/2 transition-all duration-300 ease-out [&_]:bg-accent-violet">
          {/* Indicator width is set by active tab */}
        </div>
      )}
    </div>
  )
})

Tabs.displayName = 'Tabs'