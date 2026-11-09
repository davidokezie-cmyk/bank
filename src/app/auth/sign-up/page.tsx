'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()

  function createDemoProfile() {
    document.cookie = 'demo-mode=true; path=/; max-age=31536000; SameSite=Lax'
    router.push('/onboarding')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--ink)] px-4 py-10">
      <section className="w-full max-w-lg rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl sm:p-10">
        <Link href="/" className="text-sm font-semibold text-[var(--gold)]">Buy & Build</Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-violet)]">A demo workspace</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--text)]">Create your demo profile</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Explore the product without creating an account or sharing personal information. Your sample settings stay in this browser.</p>
        <div className="mt-7 rounded-2xl border border-[var(--border)] bg-[var(--raised)] p-4 text-sm leading-6">
          <p className="font-medium">Demo mode — no real money moves</p>
          <p className="mt-1 text-[var(--muted)]">No password, BVN, NIN, card number, or real bank details are collected.</p>
        </div>
        <button type="button" onClick={createDemoProfile} className="mt-6 min-h-12 w-full rounded-xl bg-[var(--accent-violet)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--accent-indigo)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]">
          Start setting up
        </button>
        <p className="mt-6 text-center text-sm text-[var(--muted)]">Already tried the demo? <Link href="/login" className="font-medium text-[var(--gold)] underline underline-offset-4">Continue</Link></p>
      </section>
    </main>
  )
}
