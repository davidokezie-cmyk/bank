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
  Target,
  UserRound,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const items = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/goals', label: 'Goals', Icon: Target },
  { href: '/save', label: 'Save', Icon: PiggyBank },
  { href: '/joint', label: 'Joint Savings', Icon: Users, badge: '1' },
  { href: '/send', label: 'Send', Icon: Send },
  { href: '/withdraw', label: 'Withdraw', Icon: ArrowDownToLine },
  { href: '/activity', label: 'Activity', Icon: Activity },
  { href: '/cards', label: 'Cards', Icon: CreditCard },
  { href: '/coach', label: 'Coach', Icon: Brain },
  { href: '/settings', label: 'Settings', Icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname() ?? ''
  const router = useRouter()

  function signOut() {
    document.cookie = 'demo-mode=; path=/; max-age=0; SameSite=Lax'
    router.push('/login')
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--border)] bg-[var(--ink)] px-3 py-5">
      <Link href="/dashboard" className="mb-7 px-3 text-lg font-bold text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]">
        Buy &amp; Build
      </Link>
      <nav aria-label="Main navigation" className="flex-1">
        <ul className="space-y-1">
          {items.map(({ href, label, Icon, badge }) => {
            const active = pathname === href || (href === '/joint' && pathname.startsWith('/joint/'))
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] ${active ? 'bg-[var(--surface)] text-[var(--text)]' : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]'}`}
                >
                  <Icon aria-hidden="true" size={18} />
                  <span className="flex-1">{label}</span>
                  {badge && <span aria-label="1 pending pot invitation" className="rounded-full bg-[var(--alert-coral)] px-2 py-0.5 text-xs font-semibold text-white">{badge}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="border-t border-[var(--border)] pt-4">
        <Link href="/profile" className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]">
          <UserRound aria-hidden="true" size={18} />
          <span>Demo member</span>
        </Link>
        <button type="button" onClick={signOut} className="mt-1 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]">
          <LogOut aria-hidden="true" size={18} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}
