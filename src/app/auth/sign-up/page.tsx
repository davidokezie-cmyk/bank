'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { KoboDynamic } from '@/components/three/KoboDynamic'

export default function SignUpPage() {
  const router = useRouter()

  function createDemoProfile() {
    document.cookie = 'demo-mode=true; path=/; max-age=31536000; SameSite=Lax'
    router.push('/onboarding')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="glass-lg w-full max-w-lg p-6 sm:p-10">
        <KoboDynamic mood="celebrate" progress={0.45} className="mx-auto h-48 w-full" />
        <Link href="/" className="mt-4 inline-block text-sm font-semibold text-[var(--gold-strong)]">Buy & Build</Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-strong)]">A demo workspace</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--text)]">Create your demo profile</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Explore the product without creating an account or sharing personal information. Your sample settings stay in this browser.</p>
        <div className="mt-7 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-4 text-sm leading-6">
          <p className="font-medium">Demo mode — no real money moves</p>
          <p className="mt-1 text-[var(--muted)]">No password, BVN, NIN, card number, or real bank details are collected.</p>
        </div>
        <button type="button" onClick={createDemoProfile} className="mt-6 min-h-12 w-full rounded-xl bg-[var(--gold)] px-5 py-3 font-semibold text-[#131A2A] transition-colors hover:bg-[var(--gold-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
          Start setting up
        </button>
        <p className="mt-6 text-center text-sm text-[var(--muted)]">Already tried the demo? <Link href="/login" className="font-medium text-[var(--gold-strong)] underline underline-offset-4">Continue</Link></p>
      </section>
    </div>
  )
}
