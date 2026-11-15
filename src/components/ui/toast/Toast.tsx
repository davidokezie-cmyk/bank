'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastProps {
  type: ToastType
  message: string
  duration?: number
  closable?: boolean
  onDismiss?: () => void
}

const toastEventName = 'buy-build:toast'

export function ToastViewport() {
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)

  useEffect(() => {
    const handleToast = (event: Event) => {
      const detail = (event as CustomEvent<string | { type?: ToastType; message?: string }>).detail
      if (typeof detail === 'string') {
        setToast({ type: 'success', message: detail })
      } else if (detail && typeof detail.message === 'string') {
        setToast({ type: detail.type ?? 'info', message: detail.message })
      }
    }

    window.addEventListener(toastEventName, handleToast)
    return () => window.removeEventListener(toastEventName, handleToast)
  }, [])

  if (!toast) return null
  return (
    <Toast
      type={toast.type}
      message={toast.message}
      onDismiss={() => setToast(null)}
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
      container: 'border-[var(--green-growth)] bg-[var(--green-growth)]/10',
      icon: <CheckCircle className="h-4 w-4 flex-none text-[var(--green-growth)]" aria-hidden="true" />,
      title: 'Success',
    },
    error: {
      container: 'border-[var(--alert-coral)] bg-[var(--alert-coral)]/10',
      icon: <AlertCircle className="h-4 w-4 flex-none text-[var(--alert-coral)]" aria-hidden="true" />,
      title: 'Error',
    },
    info: {
      container: 'border-[var(--glass-border)] bg-[var(--glass-bg)]',
      icon: <Info className="h-4 w-4 flex-none text-[var(--gold-strong)]" aria-hidden="true" />,
      title: 'Info',
    },
  }[type]

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        'fixed bottom-20 right-4 z-50 flex max-w-xs items-start gap-3 rounded-2xl border p-4 shadow-[var(--shadow-glass-lg)] backdrop-blur',
        'left-4 sm:left-auto',
        'lg:bottom-4',
        styles.container,
      )}
    >
      {styles.icon}
      <p className="flex-1 text-sm font-medium text-[var(--text)]">{message}</p>
      {closable && (
        <button
          type="button"
          onClick={onDismiss}
          className="flex-none rounded-md p-1 text-[var(--muted)] transition-colors hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

export function triggerToast(message: string, type: ToastType = 'success') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(toastEventName, { detail: { message, type } }))
  }
}

export function triggerMoneyConfirmation(message: string) {
  triggerToast(message, 'success')
}
