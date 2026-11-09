'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ToastProps {
  type: 'success' | 'error' | 'info'
  message: string
  duration?: number
  closable?: boolean
  onDismiss?: () => void
}

const toastEventName = 'buy-build:toast'

export function ToastViewport() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleToast = (event: Event) => {
      const toastEvent = event as CustomEvent<string>
      setMessage(toastEvent.detail)
    }

    window.addEventListener(toastEventName, handleToast)
    return () => window.removeEventListener(toastEventName, handleToast)
  }, [])

  if (!message) return null
  return (
    <Toast
      type="success"
      message={message}
      onDismiss={() => setMessage('')}
    />
  )
}

export function Toast({
  type,
  message,
  duration = 4000,
  closable = true,
  onDismiss,
}: ToastProps) {
  useEffect(() => {
    if (!duration) return
    const timeout = window.setTimeout(() => onDismiss?.(), duration)
    return () => window.clearTimeout(timeout)
  }, [duration, onDismiss])

  const styles = {
    success: {
      bg: 'bg-green-growth/10',
      border: 'border-green-growth',
      icon: <CheckCircle className="h-4 w-4 text-green-growth" />,
      title: 'Success',
    },
    error: {
      bg: 'bg-alert-coral/10',
      border: 'border-alert-coral',
      icon: <AlertCircle className="h-4 w-4 text-alert-coral" />,
      title: 'Error',
    },
    info: {
      bg: 'bg-accent-violet/10',
      border: 'border-accent-violet',
      icon: null,
      title: 'Info',
    },
  }[type]

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        'fixed bottom-4 right-4 z-50 flex max-w-xs items-start gap-3 rounded-lg border p-4 shadow-lg',
        styles.bg,
        styles.border,
      )}
    >
      {styles.icon}
      <p className="flex-1 font-medium">{styles.title}: {message}</p>
      {closable && (
        <button
          type="button"
          onClick={onDismiss}
          className="rounded p-1 transition-colors hover:bg-current/10"
          aria-label="Dismiss toast"
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  )
}

export function triggerMoneyConfirmation(message: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(toastEventName, { detail: message }))
  }
}
