'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  function continueInDemo() {
    document.cookie = 'demo-mode=true; path=/; max-age=31536000; SameSite=Lax'
    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="glass-lg w-full max-w-lg p-6 sm:p-10">
        <Link href="/" className="text-sm font-semibold text-[var(--gold-strong)]">Buy & Build</Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-strong)]">Buy What You Love. Build Wealth As You Live.</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--text)]">Welcome back</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">This prototype runs in demo mode. No password, BVN, NIN, card number, or real bank details are collected.</p>
        <div className="mt-7 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-4">
          <p className="text-sm font-medium">Demo mode — no real money moves</p>
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">Explore the app with sample balances and local demo data.</p>
        </div>
        <button type="button" onClick={continueInDemo} className="mt-6 min-h-12 w-full rounded-xl bg-[var(--gold)] px-5 py-3 font-semibold text-[#131A2A] transition-colors hover:bg-[var(--gold-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
          Continue in demo mode
        </button>
        <p className="mt-6 text-center text-sm text-[var(--muted)]">New to Buy & Build? <Link href="/sign-up" className="font-medium text-[var(--gold-strong)] underline underline-offset-4">Create a demo profile</Link></p>
      </section>
    </div>
  )
}
