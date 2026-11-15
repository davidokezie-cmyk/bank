'use client'

import React, { forwardRef, useId, useState } from 'react'
import { cn } from '@/lib/utils'

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

export const Input = forwardRef<HTMLInputElement, InputProps>((props, forwardedRef) => {
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
  const generatedId = useId()
  const inputId = name ?? generatedId

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const baseClasses = cn(
    'w-full rounded-xl border border-[var(--border)] bg-[var(--ink)] px-3 py-3 text-[var(--text)] transition-colors placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:opacity-50 disabled:cursor-not-allowed',
    errorMessage && 'border-[var(--alert-coral)]',
    money && 'font-numeric tabular-nums',
    className,
  )

  const inputClasses = cn(
    'peer',
    {
      'focus:ring-[var(--ring)]': isFocused || focused,
    },
  )

  const errorId = errorMessage ? `${inputId}-error` : undefined
  const describedByIds = [describedBy, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium text-[var(--text)] transition-colors',
            isFocused && 'text-[var(--gold-strong)]',
          )}
        >
          {label}
        </label>
      )}

      <input
        ref={forwardedRef}
        id={inputId}
        name={name}
        type={type}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className={cn(baseClasses, inputClasses)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        aria-describedby={describedByIds}
        aria-invalid={errorMessage ? true : undefined}
        {...rest}
      />

      {errorMessage && (
        <p
          role="alert"
          aria-live="polite"
          className="mt-1 text-xs text-[var(--alert-coral)]"
          id={errorId}
        >
          {errorMessage}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'