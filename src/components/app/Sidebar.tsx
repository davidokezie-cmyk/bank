'use client'

import {
  Activity,
  ArrowDownToLine,
  Brain,
  CreditCard,
  LayoutDashboard,
  LogOut,
  PiggyBank,
  Settings,
  Send,
  ShieldCheck,
  Target,
  UserRound,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { defaultInvites, type DemoInvite } from '@/lib/demo-data'
import { useDemoStorage } from '@/lib/useDemoStorage'

const items = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/goals', label: 'Goals', Icon: Target },
  { href: '/save', label: 'Save', Icon: PiggyBank },
  { href: '/joint', label: 'Joint Savings', Icon: Users },
  { href: '/send', label: 'Send', Icon: Send },
  { href: '/withdraw', label: 'Withdraw', Icon: ArrowDownToLine },
  { href: '/activity', label: 'Activity', Icon: Activity },
  { href: '/cards', label: 'Cards', Icon: CreditCard },
  { href: '/coach', label: 'Coach', Icon: Brain },
  { href: '/settings', label: 'Settings', Icon: Settings },
]

export function Sidebar({ pathname }: { pathname: string }) {
  const router = useRouter()
  const { value: invites } = useDemoStorage<DemoInvite[]>('buy-build:invites', defaultInvites)
  const pendingInvites = invites.filter((invite) => invite.status === 'pending').length

  function signOut() {
    document.cookie = 'demo-mode=; path=/; max-age=0; SameSite=Lax'
    router.push('/login')
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--border)] bg-[var(--ink)] px-3 py-5">
      <Link
        href="/dashboard"
        className="mb-6 flex items-center gap-2.5 rounded-xl px-2 py-1 text-lg font-bold tracking-tight text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--gold)] text-sm font-black text-[#0B0A14]">
          B
        </span>
        Buy &amp; Build
      </Link>

      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto no-scrollbar">
        <ul className="space-y-1">
          {items.map(({ href, label, Icon }) => {
            const active = pathname === href || (href === '/joint' && pathname.startsWith('/joint/'))
            const badge = href === '/joint' && pendingInvites > 0 ? String(pendingInvites) : undefined
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] ${
                    active
                      ? 'bg-[var(--surface)] font-medium text-[var(--text)]'
                      : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]'
                  }`}
                >
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-[var(--accent-violet)]"
                    />
                  )}
                  <Icon aria-hidden="true" size={18} className={active ? 'text-[var(--accent-violet)]' : ''} />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span
                      aria-label={`${badge} pending pot invitation`}
                      className="rounded-full bg-[var(--alert-coral)] px-2 py-0.5 text-[11px] font-semibold text-[#2A0A0A]"
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-4 space-y-1 border-t border-[var(--border)] pt-4">
        <Link
          href="/how-money-is-handled"
          className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
        >
          <ShieldCheck aria-hidden="true" size={18} />
          <span>How money is handled</span>
        </Link>
        <Link
          href="/profile"
          className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
        >
          <UserRound aria-hidden="true" size={18} />
          <span>Demo member</span>
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="mt-1 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
        >
          <LogOut aria-hidden="true" size={18} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}
