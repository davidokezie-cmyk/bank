/* eslint-disable @next/next/no-img-import */
import { cn } from '@/lib/utils'
import { useRef, useState } from 'react'

/**
 * Input component with states:
 * default, error, success, focused, disabled
 * Labelled inputs with aria-describedby for error messages
 * Tabular numerals for money inputs
 */
export interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  /** Input label */
  label?: string
  /** Error message */
  errorMessage?: string
  /** Whether input is focused */
  focused?: boolean
  /** Whether input is disabled */
  disabled?: boolean
  /** Auto-focus on mount */
  autoFocus?: boolean
  /** Input type */
  type?: string
  /** Placeholder text */
  placeholder?: string
  /** Input name */
  name?: string
  /** Whether to apply tabular numeral formatting */
  money?: boolean
  /** Id of described element (for aria-describedby) */
  describedBy?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(props => {
  const {
    label,
    errorMessage,
    focused,
    disabled = false,
    autoFocus = false,
    type = 'text',
    placeholder,
    name,
    money = false,
    describedBy,
    className,
    ...rest
  } = props

  const [isFocused, setIsFocused] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const baseClasses = cn(
    'w-full rounded-md border border-border bg-transparent px-3 py-2 text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    disabled && 'opacity-50 cursor-not-allowed',
    money && 'font-numeric',
  )

  const inputClasses = cn(
    'peer placeholder:text-muted/40 disabled:cursor-not-placeholder',
    {
      'bg-surface/50': !disabled,
      'border-border': true,
      'focus:ring-accent-violet': isFocused || focused,
    },
  )

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={ref.current?.id || 'input'}
          className=cn(
            'block text-sm font-medium text-primary hover:text-accent-violet',
            isFocused && 'text-accent-violet',
          )
        >
          {label}
        </label>
      )}

      <input
        ref={ref}
        id={ref.current?.id || undefined}
        name={name}
        type={type}
        placeholder={placeholder}
        className=cn(baseClasses, inputClasses)
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        aria-describedby={describedBy}
        {...rest}
      />

      {errorMessage && (
        <p
          role="alert"
          aria-live="polite"
          className=cn(
            'text-alert-coral text-xs mt-1',
            isFocused && 'text-alert-coral',
          )
          id={describedBy || undefined}
        >
          {errorMessage}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'