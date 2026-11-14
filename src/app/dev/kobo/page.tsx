'use client'

import Link from 'next/link'
import { KoboProcedural } from '@/components/three/KoboProcedural'
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
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">Developer preview</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Kobo mascot</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Moods, progress blocks, and the procedural fallback. This page works with no Bforartists install and no GLB
            assets present.
          </p>
        </div>
        <Link href="/dashboard" className="text-sm font-semibold text-[var(--accent-violet)] hover:underline">
          Back to app
        </Link>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {moods.map(({ mood, label, progress }) => (
          <article key={mood} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <KoboProcedural progress={progress} reducedMotion={reducedMotion} />
            <h2 className="mt-2 text-center font-semibold capitalize">{label}</h2>
            <p className="text-center text-xs text-[var(--muted)]">progress {Math.round(progress * 100)}%</p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-lg font-semibold">Asset status</h2>
        <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
          <li>
            <strong className="text-[var(--text)]">Procedural fallback:</strong> active. The app never depends on a
            downloaded GLB.
          </li>
          <li>
            <strong className="text-[var(--text)]">Full model:</strong> <code>public/models/kobo.glb</code> — pending
            Bforartists export.
          </li>
          <li>
            <strong className="text-[var(--text)]">Lite model:</strong> <code>public/models/kobo-lite.glb</code> — pending
            Bforartists export.
          </li>
          <li>
            <strong className="text-[var(--text)]">Poster fallback:</strong> <code>public/images/kobo-*.webp</code> —
            pending render.
          </li>
        </ul>
        <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
          The contract (animations, morph targets, nodes) lives in <code>src/lib/mascot-contract.ts</code> and is
          validated once the GLBs exist. Reduced motion is{' '}
          <strong className="text-[var(--text)]">{reducedMotion ? 'on' : 'off'}</strong>.
        </p>
      </section>
    </div>
  )
}
