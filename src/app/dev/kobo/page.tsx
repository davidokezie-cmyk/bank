'use client'

import Link from 'next/link'
import { KoboDynamic } from '@/components/three/KoboDynamic'
import { KoboFallback } from '@/components/three/KoboFallback'
import { useReducedMotion } from '@/lib/motion'

const moods = [
  { mood: 'idle', label: 'Idle', progress: 0.25 },
  { mood: 'wave', label: 'Wave', progress: 0.5 },
  { mood: 'celebrate', label: 'Celebrate', progress: 1 },
  { mood: 'thinking', label: 'Thinking', progress: 0.75 },
] as const

export default function KoboPreviewPage() {
  const reducedMotion = useReducedMotion()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-strong)]">Developer preview</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Kobo mascot</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Moods, progress blocks, and the fallbacks. Works even if the GLB files are missing.
          </p>
        </div>
        <Link href="/dashboard" className="text-sm font-semibold text-[var(--gold-strong)] hover:underline">
          Back to app
        </Link>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {moods.map(({ mood, label, progress }) => (
          <article key={mood} className="glass-sm p-4">
            <KoboDynamic mood={mood} progress={progress} className="h-44 w-full" />
            <h2 className="mt-2 text-center font-semibold capitalize">{label}</h2>
            <p className="text-center text-xs text-[var(--muted)]">progress {Math.round(progress * 100)}%</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="glass-sm p-5">
          <h2 className="text-lg font-semibold">Procedural fallback</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Shown whenever WebGL is missing, the GLB fails to load, or reduced motion is on.</p>
          <div className="mt-3 flex justify-center">
            <KoboFallback mood="idle" />
          </div>
        </article>
        <article className="glass-sm p-5">
          <h2 className="text-lg font-semibold">Asset status</h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <li><strong className="text-[var(--text)]">Full model:</strong> <code>public/models/kobo.glb</code> — exported via Bforartists.</li>
            <li><strong className="text-[var(--text)]">Lite model:</strong> <code>public/models/kobo-lite.glb</code> — same export, phone-friendly.</li>
            <li><strong className="text-[var(--text)]">Poster renders:</strong> <code>public/images/kobo-*.webp</code> — pending Eevee render.</li>
          </ul>
          <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
            The contract (animations, morph targets, nodes) lives in <code>src/lib/mascot-contract.ts</code> and is
            enforced by <code>tests/mascot-contract.test.ts</code> against both GLBs. Reduced motion is{' '}
            <strong className="text-[var(--text)]">{reducedMotion ? 'on' : 'off'}</strong>.
          </p>
        </article>
      </section>
    </div>
  )
}
