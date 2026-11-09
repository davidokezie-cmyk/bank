/* eslint-disable @next/next/no-img-import */
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { CheckCircle, AlertCircle } from 'lucide-react'

/**
 * Toast component - temporary notification with aria-live.
 * States: success, error, info
 * Auto-dismiss after timeout
 * Money moments (save, contribute, send) announce via aria-live
 */
export interface ToastProps {
  /** Toast type */
  type: 'success' | 'error' | 'info'
  /** Message */
  message: string
  /** Time in ms before auto-dismiss (default: 4000) */
  duration?: number
  /** Whether to show close button */
  closable?: boolean
  /** Callback on dismiss */
  onDismiss?: () => void
}

type ToastData = {
  id: string
  type: ToastProps['type']
  message: string
  timeout: NodeJS.Timeout
}

const toastIdPrefix = 'toast-'
let toastCounter = 0

const toastContainerRef = React.createRef<HTMLDivElement>()

export const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastData[]>([])

  const show = (props: Omit<ToastProps, 'duration' | 'onDismiss'>) => {
    const id = `${toastIdPrefix}${++toastCounter}`
    const duration = props.duration ?? 4000
    const timeout = setTimeout(() => {
      setToasts(toasts.filter(t => t.id !== id))
      if (props.onDismiss) props.onDismiss()
    }, duration)

    setToasts(prev => [...prev, { id, type: props.type, message: props.message, timeout }])
    return id
  }

  const dismiss = (id: string) => {
    clearTimeout(toasts.find(t => t.id === id)?.timeout)
    setToasts(toasts.filter(t => t.id !== id))
    if (onDismiss) onDismiss()
  }

  return { toasts, show, dismiss }
}

export const Toast = ({ type, message, duration, closable = true, onDismiss }: ToastProps) => {
  const { show, dismiss, toasts } = useToast()

  // Show the toast immediately
  const id = show({ type, message, onDismiss: () => dismiss(id) })

  if (typeof window === 'undefined') return null

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
      ref={toastContainerRef}
      className=cn(
        'fixed bottom-4 right-4 z-50 flex items-center gap-3',
        'transform transition-transform duration-300',
        'animate-in fade-in-0',
        'data-[state=closed]:animate-out fade-out-0',
        'data-[state=closed]:duration-300',
      )
    >
      <div
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        className=cn(
          'p-4 rounded-lg max-w-xs w-full',
          'shadow-lg',
          styles!.bg,
          styles!.border,
          'border',
          'flex items-start gap-3',
        )
      >
        {styles!.icon && <div className="flex-shrink-0">{styles!.icon}</div>}
        <div className="flex-1 min-w-0">
          <p className="font-medium">{styles!.title}: {message}</p>
        </div>
        {closable && (
          <button
            onClick={() => dismiss(id)}
            className="ml-2 rounded hover:bg-current/10 p-1 transition-colors"
            aria-label="Dismiss toast"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </button>
        )}
      </div>
    </div>
  )
}

/**
 * Manual toast trigger - used by components to show money-moment confirmations.
 * Call: triggerMoneyConfirmation('₦2,000 saved')
 */
export const triggerMoneyConfirmation = (message: string) => {
  const { show } = useToast()
  show({
    type: 'success',
    message,
    duration: 5000,
    closable: true,
  })
}

Toast.displayName = 'Toast'