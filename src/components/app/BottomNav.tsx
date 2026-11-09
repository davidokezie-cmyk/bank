'use client'

import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/lib/motion'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

/**
 * Bottom navigation bar for mobile and tablet.
 * 
 * Features:
 * - Bottom tab bar (Dashboard, Goals, Save, Activity, More)
 * - Sheet for Joint Savings, Send, Withdraw, Cards, Coach, Settings, Profile
 * - Pending invites/votes also show as a Dashboard card
 * - Reduced motion: fade-only transitions
 * - Active state with highlight
 */

export const BottomNav = () => {
  const reducedMotion = useReducedMotion()
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)
  const activeTab = (pathname ?? '/dashboard').split('/')[1] || 'dashboard'

  const tabs = [
    ['/dashboard', 'Dashboard'],
    ['/goals', 'Goals'],
    ['/save', 'Save'],
    ['/activity', 'Activity'],
  ] as const

  return (
    <nav data-reduced-motion={reducedMotion} aria-label="Main navigation" className="bottom-nav fixed bottom-0 left-0 right-0 bg-[var(--ink)] border-t border-[var(--border)] shadow-sm flex items-center justify-between px-3 py-2 z-50">
      <div className="flex w-full items-center justify-around">
          {tabs.map((tab) => (
            <Link
              key={tab[0]}
              href={tab[0]}
              className={cn(
                'flex min-h-11 flex-col items-center justify-center gap-1 rounded-md px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]',
                activeTab === tab[0].slice(1)
                  ? 'bg-[var(--surface)] text-[var(--accent-violet)]'
                  : 'text-[var(--muted)] hover:text-[var(--text)] transition-colors',
              )}
              aria-current={activeTab === tab[0].slice(1) ? 'page' : undefined}
            >
              {tab[1]}
            </Link>
          ))
          <button
            type="button"
            onClick={() => setMoreOpen((open) => !open)}
            aria-expanded={moreOpen}
            aria-controls="mobile-more-menu"
            className="flex min-h-11 flex-col items-center justify-center gap-1 rounded-md px-2 py-1 text-xs text-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          >
            More
          </button>
      </div>
      {moreOpen && (
          <div id="mobile-more-menu" className="absolute bottom-full right-2 mb-2 grid min-w-48 gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-xl">
            {[
              ['/joint', 'Joint Savings'],
              ['/invites', 'Pot invitations'],
              ['/send', 'Send'],
              ['/withdraw', 'Withdraw'],
              ['/cards', 'Cards'],
              ['/coach', 'Coach'],
              ['/settings', 'Settings'],
              ['/profile', 'Profile'],
              ['/how-money-is-handled', 'How your money is handled'],
            ].map(([href, label]) => (
              <Link key={href} href={href} onClick={() => setMoreOpen(false)} className="rounded-lg px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]">
                {label}
              </Link>
            ))}
          </div>
      )}
    </nav>
  )
}
