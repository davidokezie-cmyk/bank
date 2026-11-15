'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Route error', error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--alert-coral)]">Something went wrong</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)]">This screen failed to load.</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">
        Your demo data is stored in this browser and was not affected. Try again, or head back to the dashboard.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--gold)] px-6 py-3 text-sm font-semibold text-[#131A2A] transition-colors hover:bg-[var(--gold-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        >
          Try again
        </button>
        <a
          href="/dashboard"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition-colors hover:bg-[var(--glass-highlight)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
        >
          Go to dashboard
        </a>
      </div>
    </div>
  )
}
