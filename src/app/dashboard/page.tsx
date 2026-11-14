'use client'

import Link from 'next/link'
import {
  ArrowDownToLine,
  ArrowRight,
  Brain,
  CreditCard,
  PiggyBank,
  Send,
  Target,
  Users,
} from 'lucide-react'
import { KoboProcedural } from '@/components/three/KoboProcedural'
import { useReducedMotion } from '@/lib/motion'
import { formatKobo, nairaToKobo } from '@/lib/money'
import { calculateAvailableToSpend, SalarySplitRule } from '@/lib/salary-split'
import { useDemoStorage } from '@/lib/useDemoStorage'
import { defaultInvites, defaultPots, defaultSalarySplit, type DemoInvite, type DemoPot } from '@/lib/demo-data'

type Goal = {
  id: string
  name: string
  category: string
  targetKobo: number
  currentKobo: number
  deadline?: string
}


type ActivityItem = {
  id: string
  title: string
  description: string
  amountKobo?: number
  createdAt: string
}


const quickActions = [
  { href: '/save', label: 'Save & allocate', detail: 'Salary split and Shop & Save', Icon: PiggyBank, tone: 'violet' },
  { href: '/goals', label: 'Lifestyle goals', detail: 'Rent, car, school, holiday', Icon: Target, tone: 'gold' },
  { href: '/joint', label: 'Joint Savings', detail: 'Save together, stay in control', Icon: Users, tone: 'green' },
  { href: '/send', label: 'Send money', detail: 'Review before you confirm', Icon: Send, tone: 'violet' },
  { href: '/withdraw', label: 'Withdraw', detail: 'Pot requests and votes', Icon: ArrowDownToLine, tone: 'coral' },
  { href: '/coach', label: 'Money coach', detail: 'Practical, judgment-free prompts', Icon: Brain, tone: 'gold' },
] as const

const toneClasses: Record<string, string> = {
  violet: 'bg-[var(--accent-violet)]/15 text-[var(--accent-violet)]',
  gold: 'bg-[var(--gold)]/15 text-[var(--gold)]',
  green: 'bg-[var(--green-growth)]/15 text-[var(--green-growth)]',
  coral: 'bg-[var(--alert-coral)]/15 text-[var(--alert-coral)]',
}

export default function Dashboard() {
  const reducedMotion = useReducedMotion()
  const { value: split } = useDemoStorage('buy-build:salary-split', defaultSalarySplit)
  const { value: goals } = useDemoStorage<Goal[]>('buy-build:goals', [])
  const { value: pots } = useDemoStorage<DemoPot[]>('buy-build:pots', defaultPots)
  const { value: invites } = useDemoStorage<DemoInvite[]>('buy-build:invites', defaultInvites)
  const { value: activity } = useDemoStorage<ActivityItem[]>('buy-build:activity', [])
  const { value: profile } = useDemoStorage('buy-build:profile', { displayName: 'Demo member' })

  const rules: SalarySplitRule[] = [
    { id: 'spending', category: 'spending', allocationPercentage: split.spending, isActive: true },
    { id: 'savings', category: 'savings', allocationPercentage: split.savings, isActive: true },
    { id: 'goal', category: 'goal', allocationPercentage: split.goal, isActive: true, goalId: 'lifestyle-goal' },
  ]
  const allocations = calculateAvailableToSpend(split.salaryNaira || 0, rules)
  const goalAllocation = Object.values(allocations.goalAllocations).reduce((sum, item) => sum + item, 0)
  const totalAllocated = allocations.availableSpend + allocations.availableSave + goalAllocation

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentKobo, 0)
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetKobo, 0)
  const goalProgress = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0
  const potTotal = pots.reduce((sum, pot) => sum + pot.balanceKobo, 0)
  const potTarget = pots.reduce((sum, pot) => sum + pot.targetKobo, 0)
  const koboProgress = totalTarget > 0 ? totalSaved / totalTarget : 0
  const recent = activity.slice(0, 4)
  const pendingInvites = invites.filter((invite) => invite.status === 'pending').length

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">Overview</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back, {profile.displayName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Spending, savings, goals, and joint pots — all in one place, with savings and investments kept separate.
          </p>
        </div>
        <p className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--raised)] px-3 py-1.5 text-xs font-medium text-[var(--gold)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--green-growth)]" />
          Demo mode — no real money moves
        </p>
      </header>

      {split.spending + split.savings + split.goal !== 100 && (
        <div
          role="status"
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--alert-coral)]/40 bg-[var(--alert-coral)]/10 px-4 py-3 text-sm"
        >
          <span>Your salary split totals {split.spending + split.savings + split.goal}%. It must equal exactly 100%.</span>
          <Link href="/save" className="font-semibold text-[var(--alert-coral)] underline underline-offset-4">
            Fix split
          </Link>
        </div>
      )}

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-raised)] sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--muted)]">Monthly income</p>
              <p className="money mt-1 text-3xl font-semibold sm:text-4xl">{formatKobo(nairaToKobo(split.salaryNaira || 0))}</p>
            </div>
            <Link href="/save" className="text-sm font-semibold text-[var(--accent-violet)] hover:underline">
              Edit split
            </Link>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-[var(--raised)]">
            <div className="flex h-full">
              <div className="h-full bg-[var(--accent-violet)]" style={{ width: `${split.spending}%` }} />
              <div className="h-full bg-[var(--green-growth)]" style={{ width: `${split.savings}%` }} />
              <div className="h-full bg-[var(--gold)]" style={{ width: `${split.goal}%` }} />
            </div>
          </div>

          <dl className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <span className="h-2 w-2 rounded-full bg-[var(--accent-violet)]" /> Available to spend
              </dt>
              <dd className="money mt-1 text-lg font-semibold">{formatKobo(allocations.availableSpend)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <span className="h-2 w-2 rounded-full bg-[var(--green-growth)]" /> Savings
              </dt>
              <dd className="money mt-1 text-lg font-semibold text-[var(--green-growth)]">{formatKobo(allocations.availableSave)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <span className="h-2 w-2 rounded-full bg-[var(--gold)]" /> Lifestyle goals
              </dt>
              <dd className="money mt-1 text-lg font-semibold text-[var(--gold)]">{formatKobo(goalAllocation)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-[var(--muted)]">
            Allocated this month: {formatKobo(totalAllocated)} of {formatKobo(nairaToKobo(split.salaryNaira || 0))}.
          </p>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <KoboProcedural progress={koboProgress} reducedMotion={reducedMotion} />
          <p className="mt-2 text-center text-sm text-[var(--muted)]">
            {goals.length > 0
              ? `${goalProgress}% of your goal targets reached.`
              : 'Kobo is ready to stack your first goal blocks.'}
          </p>
        </div>
      </section>

      <section aria-labelledby="quick-actions" className="mt-8">
        <div className="flex items-center justify-between">
          <h2 id="quick-actions" className="text-lg font-semibold">Quick actions</h2>
          <Link href="/activity" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">
            View activity
          </Link>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map(({ href, label, detail, Icon, tone }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex h-full items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--accent-violet)]/60 hover:bg-[var(--raised)]"
              >
                <span className={`grid h-11 w-11 flex-none place-items-center rounded-xl ${toneClasses[tone]}`}>
                  <Icon aria-hidden="true" size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1 font-medium">
                    {label}
                    <ArrowRight
                      aria-hidden="true"
                      size={15}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </span>
                  <span className="mt-0.5 block text-sm text-[var(--muted)]">{detail}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section aria-labelledby="goals-heading" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 id="goals-heading" className="text-lg font-semibold">Lifestyle goals</h2>
            <Link href="/goals" className="text-sm font-semibold text-[var(--accent-violet)] hover:underline">
              Manage
            </Link>
          </div>

          {goals.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-[var(--border)] p-6 text-center">
              <p className="font-medium">Your next milestone starts here.</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Create a goal for rent, a car, education, or a holiday.</p>
              <Link
                href="/goals"
                className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[var(--accent-indigo)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4F46E5]"
              >
                Add your first goal
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--muted)]">Overall progress</span>
                  <span className="money font-semibold">{goalProgress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--raised)]">
                  <div className="h-full rounded-full bg-[var(--gold)]" style={{ width: `${goalProgress}%` }} />
                </div>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {formatKobo(totalSaved)} saved of {formatKobo(totalTarget)}
                </p>
              </div>
              <ul className="mt-5 space-y-3">
                {goals.slice(0, 4).map((goal) => {
                  const progress = goal.targetKobo > 0 ? Math.min(100, Math.round((goal.currentKobo / goal.targetKobo) * 100)) : 0
                  return (
                    <li key={goal.id} className="rounded-xl border border-[var(--border)] bg-[var(--raised)] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{goal.name}</p>
                          <p className="text-xs capitalize text-[var(--muted)]">
                            {goal.category}
                            {goal.deadline ? ` · due ${goal.deadline}` : ''}
                          </p>
                        </div>
                        <p className="money text-right text-sm font-semibold">
                          {formatKobo(goal.currentKobo)}
                          <span className="block text-xs font-normal text-[var(--muted)]">of {formatKobo(goal.targetKobo)}</span>
                        </p>
                      </div>
                      <div
                        className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--ink)]"
                        role="progressbar"
                        aria-label={`${goal.name} progress`}
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div className="h-full rounded-full bg-[var(--gold)]" style={{ width: `${progress}%` }} />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </section>

        <div className="space-y-6">
          <section aria-labelledby="pots-heading" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 id="pots-heading" className="text-lg font-semibold">Joint pots</h2>
              <Link href="/joint" className="text-sm font-semibold text-[var(--accent-violet)] hover:underline">
                Open
              </Link>
            </div>
            {pots.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-[var(--border)] p-5 text-sm">
                <p className="font-medium">No pots yet.</p>
                <p className="mt-1 text-[var(--muted)]">Save toward a shared goal with people you trust.</p>
                <Link href="/joint/new" className="mt-3 inline-block font-semibold text-[var(--accent-violet)] hover:underline">
                  Create a pot
                </Link>
              </div>
            ) : (
              <>
                <p className="money mt-4 text-2xl font-semibold">{formatKobo(potTotal)}</p>
                <p className="text-xs text-[var(--muted)]">across {pots.length} {pots.length === 1 ? 'pot' : 'pots'} · of {formatKobo(potTarget)}</p>
                <ul className="mt-4 space-y-2">
                  {pots.slice(0, 3).map((pot) => (
                    <li key={pot.id}>
                      <Link
                        href={`/joint/${pot.id}`}
                        className="flex items-center justify-between rounded-xl bg-[var(--raised)] px-3 py-2.5 text-sm transition-colors hover:bg-[var(--ink)]"
                      >
                        <span className="min-w-0 truncate font-medium">{pot.name}</span>
                        <span className="money ml-3 flex-none">{formatKobo(pot.balanceKobo)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section aria-labelledby="invites-heading" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <h2 id="invites-heading" className="text-lg font-semibold">Invites &amp; votes</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {pendingInvites > 0
                ? `You have ${pendingInvites} pending ${pendingInvites === 1 ? 'invitation' : 'invitations'} and no pending withdrawal votes.`
                : 'No pending invitations or withdrawal votes.'}
            </p>
            <Link
              href="/invites"
              className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[var(--raised)]"
            >
              {pendingInvites > 0 ? 'Review invitations' : 'View invitations'}
            </Link>
          </section>
        </div>
      </div>

      <section aria-labelledby="activity-heading" className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 id="activity-heading" className="text-lg font-semibold">Recent activity</h2>
          <Link href="/activity" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">
            See all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-[var(--border)] p-5 text-sm text-[var(--muted)]">
            No activity yet. Confirmed demo actions will appear here.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--border)]">
            {recent.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="font-medium">{item.title}</p>
                  <p className="truncate text-sm text-[var(--muted)]">{item.description}</p>
                  <time className="text-xs text-[var(--muted)]" dateTime={item.createdAt}>
                    {new Date(item.createdAt).toLocaleString('en-NG')}
                  </time>
                </div>
                {item.amountKobo !== undefined && (
                  <p className="money font-semibold">{formatKobo(item.amountKobo)}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href="/cards" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 hover:bg-[var(--surface)]">
          <CreditCard aria-hidden="true" size={16} /> Cards
        </Link>
        <Link href="/how-money-is-handled" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 hover:bg-[var(--surface)]">
          How your money is handled
        </Link>
      </div>
    </div>
  )
}
