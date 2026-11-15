import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-strong)]">404 — Page not found</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--text)]">That page isn&apos;t in the app.</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">
        The link may be old or mistyped. Everything else still works in demo mode — no real money moves.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/dashboard"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--gold)] px-6 py-3 text-sm font-semibold text-[#131A2A] transition-colors hover:bg-[var(--gold-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        >
          Go to dashboard
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition-colors hover:bg-[var(--glass-highlight)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
