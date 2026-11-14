'use client'

import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/lib/motion'
import {
  Activity,
  ArrowDownToLine,
  Brain,
  CreditCard,
  LayoutDashboard,
  PiggyBank,
  Send,
  Settings,
  ShieldCheck,
  Target,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const tabs = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/goals', label: 'Goals', Icon: Target },
  { href: '/save', label: 'Save', Icon: PiggyBank },
  { href: '/activity', label: 'Activity', Icon: Activity },
] as const

const moreItems = [
  { href: '/joint', label: 'Joint Savings', Icon: Users },
  { href: '/invites', label: 'Pot invitations', Icon: Users },
  { href: '/send', label: 'Send money', Icon: Send },
  { href: '/withdraw', label: 'Withdraw', Icon: ArrowDownToLine },
  { href: '/cards', label: 'Cards', Icon: CreditCard },
  { href: '/coach', label: 'Money coach', Icon: Brain },
  { href: '/settings', label: 'Settings', Icon: Settings },
  { href: '/profile', label: 'Profile', Icon: UserRound },
  { href: '/how-money-is-handled', label: 'How money is handled', Icon: ShieldCheck },
] as const

export function BottomNav({ pathname }: { pathname: string }) {
  const reducedMotion = useReducedMotion()
  const [moreOpen, setMoreOpen] = useState(false)
  const activeTab = pathname.split('/')[1] || 'dashboard'

  useEffect(() => {
    if (!moreOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMoreOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [moreOpen])

  return (
    <nav
      data-reduced-motion={reducedMotion}
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[var(--ink)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      {moreOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 bottom-16 -z-10 bg-black/50"
            onClick={() => setMoreOpen(false)}
          />
          <div
            id="mobile-more-menu"
            role="menu"
            aria-label="More destinations"
            className="absolute bottom-full right-2 mb-2 grid w-64 gap-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-2xl"
          >
            <div className="flex items-center justify-between px-2 pb-1 pt-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">More</p>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label="Close menu"
                className="rounded-md p-1 text-[var(--muted)] hover:text-[var(--text)]"
              >
                <X aria-hidden="true" size={16} />
              </button>
            </div>
            {moreItems.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                role="menuitem"
                onClick={() => setMoreOpen(false)}
                className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--text)] transition-colors hover:bg-[var(--raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
              >
                <Icon aria-hidden="true" size={17} className="text-[var(--muted)]" />
                {label}
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="flex items-stretch justify-around px-1 py-1.5">
        {tabs.map(({ href, label, Icon }) => {
          const active = activeTab === href.slice(1)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 py-1 text-[11px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]',
                active ? 'text-[var(--accent-violet)]' : 'text-[var(--muted)] hover:text-[var(--text)]',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon aria-hidden="true" size={20} />
              <span className="truncate">{label}</span>
            </Link>
          )
        })}
        <button
          type="button"
          onClick={() => setMoreOpen((open) => !open)}
          aria-expanded={moreOpen}
          aria-controls="mobile-more-menu"
          aria-haspopup="menu"
          className={cn(
            'flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 py-1 text-[11px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]',
            moreOpen ? 'text-[var(--accent-violet)]' : 'text-[var(--muted)] hover:text-[var(--text)]',
          )}
        >
          <span className="relative grid place-items-center">
            <span className="flex flex-col gap-0.5" aria-hidden="true">
              <span className="h-0.5 w-3.5 rounded-full bg-current" />
              <span className="h-0.5 w-3.5 rounded-full bg-current" />
              <span className="h-0.5 w-3.5 rounded-full bg-current" />
            </span>
            <span className="absolute -right-1.5 -top-1 h-1.5 w-1.5 rounded-full bg-[var(--alert-coral)]" aria-hidden="true" />
          </span>
          <span>More</span>
        </button>
      </div>
    </nav>
  )
}
