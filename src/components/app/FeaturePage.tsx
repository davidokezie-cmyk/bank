'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { calculateAvailableToSpend, SalarySplitRule, validateSalarySplit } from '@/lib/salary-split'
import { calculateContribution, createShopSaveRule, ShopSaveRuleType } from '@/lib/shop-save'
import { createGoal, GoalCategory } from '@/lib/goals'
import { formatKobo, nairaToKobo } from '@/lib/money'
import { useDemoStorage } from '@/lib/useDemoStorage'

export type FeatureScreen =
  | 'goals' | 'save' | 'joint' | 'joint-new' | 'joint-detail' | 'invites'
  | 'send' | 'withdraw' | 'activity' | 'cards' | 'coach' | 'settings'
  | 'profile' | 'money-handling' | 'onboarding'

type GoalCard = {
  id: string
  name: string
  category: GoalCategory
  targetKobo: number
  currentKobo: number
  deadline: string
}

type ActivityItem = {
  id: string
  title: string
  description: string
  amountKobo?: number
  createdAt: string
}

const fieldClass = 'mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--ink)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent-violet)] focus:ring-2 focus:ring-[var(--accent-violet)]/30'
const labelClass = 'block text-sm font-medium text-[var(--text)]'
const buttonClass = 'inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--accent-violet)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--accent-indigo)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-50'
const panelClass = 'rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-lg'

function PageFrame({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">Buy & Build</p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{description}</p>
      </header>
      <p className="mb-5 inline-flex rounded-full border border-[var(--border)] bg-[var(--raised)] px-3 py-1.5 text-xs font-medium text-[var(--gold)]">
        Demo mode — no real money moves
      </p>
      {children}
    </div>
  )
}

function FormNotice({ error, success }: { error: string; success: string }) {
  if (!error && !success) return null
  return (
    <p role={error ? 'alert' : 'status'} aria-live="polite" className={`mt-4 rounded-xl p-3 text-sm ${error ? 'bg-[var(--alert-coral)]/10 text-[var(--alert-coral)]' : 'bg-[var(--green-growth)]/10 text-[var(--green-growth)]'}`}>
      {error || success}
    </p>
  )
}

function GoalsPage() {
  const { value: goals, setValue: setGoals, storageError } = useDemoStorage<GoalCard[]>('buy-build:goals', [])
  const [name, setName] = useState('')
  const [category, setCategory] = useState<GoalCategory>('rent')
  const [target, setTarget] = useState('')
  const [deadline, setDeadline] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function addGoal(event: FormEvent) {
    event.preventDefault()
    const targetNaira = Number(target)
    if (!name.trim() || !Number.isFinite(targetNaira) || targetNaira <= 0) {
      setError('Enter a goal name and a target greater than ₦0.')
      setSuccess('')
      return
    }
    if (deadline && new Date(`${deadline}T23:59:59`) < new Date()) {
      setError('Choose a future deadline or leave it blank.')
      setSuccess('')
      return
    }
    const goal = createGoal(name.trim(), category, targetNaira, deadline ? new Date(`${deadline}T23:59:59`) : null)
    setGoals((current) => [...current, {
      id: goal.id,
      name: goal.name,
      category: goal.category,
      targetKobo: goal.targetKobo,
      currentKobo: goal.currentKobo,
      deadline,
    }])
    setName('')
    setTarget('')
    setDeadline('')
    setError('')
    setSuccess(`${goal.name} goal created.`)
  }

  return (
    <PageFrame title="Lifestyle goals" description="Give the things you care about a target, a timeline, and visible progress. Savings stay separate from investments.">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,.7fr)]">
        <section className={panelClass} aria-labelledby="goals-title">
          <div className="mb-5 flex items-center justify-between">
            <h2 id="goals-title" className="text-lg font-semibold">Your goals</h2>
            <span className="text-sm text-[var(--muted)]">{goals.length} total</span>
          </div>
          {goals.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--border)] p-7 text-center">
              <p className="font-medium">Your next milestone starts here.</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Create a goal for rent, a car, education, a business, or a holiday.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {goals.map((goal) => {
                const progress = Math.min(100, Math.round(goal.currentKobo / goal.targetKobo * 100))
                return (
                  <li key={goal.id} className="rounded-xl border border-[var(--border)] bg-[var(--raised)] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div><h3 className="font-semibold">{goal.name}</h3><p className="text-xs capitalize text-[var(--muted)]">{goal.category}{goal.deadline ? ` · Due ${goal.deadline}` : ''}</p></div>
                      <p className="font-semibold tabular-nums">{formatKobo(goal.currentKobo)} <span className="text-xs font-normal text-[var(--muted)]">of {formatKobo(goal.targetKobo)}</span></p>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--ink)]" role="progressbar" aria-label={`${goal.name} progress`} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full rounded-full bg-[var(--gold)]" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="mt-2 text-right text-xs text-[var(--muted)]">{progress}% saved</p>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
        <form className={`${panelClass} space-y-4`} onSubmit={addGoal}>
          <h2 className="text-lg font-semibold">Create a goal</h2>
          <label className={labelClass}>Goal name<input className={fieldClass} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. New apartment" maxLength={60} required /></label>
          <label className={labelClass}>Category<select className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value as GoalCategory)}>{['rent','car','education','business','holiday'].map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</select></label>
          <label className={labelClass}>Target amount (₦)<input className={fieldClass} type="number" min="1" step="1" inputMode="decimal" value={target} onChange={(event) => setTarget(event.target.value)} placeholder="200000" required /></label>
          <label className={labelClass}>Deadline <span className="font-normal text-[var(--muted)]">(optional)</span><input className={fieldClass} type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} /></label>
          <button className={buttonClass} type="submit">Add goal</button>
          <FormNotice error={error || storageError || ''} success={success} />
        </form>
      </div>
    </PageFrame>
  )
}

function SavePage({ onboarding = false }: { onboarding?: boolean }) {
  const router = useRouter()
  const { value: splitDraft, setValue: setSplitDraft, ready: splitReady, storageError } = useDemoStorage<{
    salaryNaira: number
    spending: number
    savings: number
    goal: number
  }>('buy-build:salary-split', { salaryNaira: 200000, spending: 50, savings: 30, goal: 20 })
  const salary = String(splitDraft.salaryNaira)
  const { spending, savings, goal } = splitDraft
  const [ruleType, setRuleType] = useState<ShopSaveRuleType>('percentage')
  const [ruleValue, setRuleValue] = useState('5')
  const [optIn, setOptIn] = useState(false)
  const [purchase, setPurchase] = useState('40000')
  const [preview, setPreview] = useState<number | null>(null)
  const [splitMessage, setSplitMessage] = useState('')
  const [splitError, setSplitError] = useState('')

  const rules: SalarySplitRule[] = [
    { id: 'spending', category: 'spending', allocationPercentage: spending, isActive: true },
    { id: 'savings', category: 'savings', allocationPercentage: savings, isActive: true },
    { id: 'goal', category: 'goal', allocationPercentage: goal, isActive: true, goalId: 'lifestyle-goal' },
  ]
  const split = validateSalarySplit(Number(salary), rules)
  const allocations = calculateAvailableToSpend(Number(salary), rules)

  function saveSplit() {
    if (!split.valid) {
      setSplitError(split.errors.join(' '))
      setSplitMessage('')
      return
    }
    setSplitDraft({ salaryNaira: Number(salary), spending, savings, goal })
    setSplitError('')
    setSplitMessage('Your salary split was saved in this browser.')
    if (onboarding) router.push('/dashboard')
  }

  function previewContribution(event: FormEvent) {
    event.preventDefault()
    if (!optIn) {
      setPreview(null)
      return
    }
    const amount = Number(purchase)
    if (!Number.isFinite(amount) || amount <= 0) {
      setPreview(null)
      return
    }
    const enteredValue = Number(ruleValue)
    const rule = createShopSaveRule(ruleType, ruleType === 'fixed' ? nairaToKobo(enteredValue) : enteredValue, true)
    const result = calculateContribution(nairaToKobo(amount), rule)
    setPreview(result?.contributionKobo ?? 0)
  }

  return (
    <PageFrame title={onboarding ? 'Set up your salary split' : 'Save & allocate'} description="Decide where income goes, then opt in to a separate Shop & Save contribution rule. Your split must total exactly 100%.">
      <div className="grid gap-5 xl:grid-cols-2">
        <section className={panelClass}>
          <h2 className="text-lg font-semibold">Salary Split</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Allocation percentages must add up to exactly 100% before you save.</p>
          <label className={`${labelClass} mt-5`}>Monthly income (₦)<input className={fieldClass} type="number" min="1" value={salary} onChange={(event) => setSplitDraft((current) => ({ ...current, salaryNaira: Number(event.target.value) }))} /></label>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {([
              ['Spending', spending, setSpending],
              ['Savings', savings, setSavings],
              ['Goals', goal, setGoal],
            ] as const).map(([label, amount, key]) => (
              <label key={label} className={labelClass}>{label} (%)<input className={fieldClass} type="number" min="0" max="100" value={amount} onChange={(event) => setSplitDraft((current) => ({ ...current, [key]: Number(event.target.value) }))} /></label>
            ))}
          </div>
          <p className={`mt-4 font-medium ${split.valid ? 'text-[var(--green-growth)]' : 'text-[var(--alert-coral)]'}`} role="status">Total: {spending + savings + goal}% {split.valid ? '· Ready to save' : '· Adjust to exactly 100%'}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Allocation label="Available to spend" value={allocations.availableSpend} />
            <Allocation label="Savings" value={allocations.availableSave} />
            <Allocation label="Lifestyle goals" value={Object.values(allocations.goalAllocations).reduce((sum, item) => sum + item, 0)} />
          </div>
          {!split.valid && <p className="mt-3 text-sm text-[var(--alert-coral)]">{split.errors.join(' ')}</p>}
          <button className={`${buttonClass} mt-5`} type="button" disabled={!split.valid || !splitReady} onClick={saveSplit}>{onboarding ? 'Save split and continue' : 'Save salary split'}</button>
          <FormNotice error={splitError || storageError || ''} success={splitMessage} />
        </section>

        <section className={panelClass}>
          <h2 className="text-lg font-semibold">Shop & Save</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">This is an additional contribution, not a discount. Nothing is set aside until you explicitly opt in.</p>
          <form onSubmit={previewContribution} className="mt-5 space-y-4">
            <label className={labelClass}>Rule type<select className={fieldClass} value={ruleType} onChange={(event) => setRuleType(event.target.value as ShopSaveRuleType)}><option value="percentage">Percentage</option><option value="fixed">Fixed amount</option><option value="round_up">Round up to nearest ₦100</option></select></label>
            {ruleType !== 'round_up' && <label className={labelClass}>{ruleType === 'fixed' ? 'Contribution amount (₦)' : 'Purchase percentage (%)'}<input className={fieldClass} type="number" min="0.01" step="0.01" value={ruleValue} onChange={(event) => setRuleValue(event.target.value)} /></label>}
            <label className={labelClass}>Example purchase (₦)<input className={fieldClass} type="number" min="1" value={purchase} onChange={(event) => setPurchase(event.target.value)} /></label>
            <label className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--raised)] p-4 text-sm">
              <input className="mt-1 h-4 w-4 accent-[var(--accent-violet)]" type="checkbox" checked={optIn} onChange={(event) => setOptIn(event.target.checked)} />
              <span><strong>I opt in to this rule.</strong><span className="mt-1 block text-[var(--muted)]">I can pause, change, or turn it off at any time. Each contribution will be itemised.</span></span>
            </label>
            <button type="submit" className={buttonClass} disabled={!optIn}>Preview contribution</button>
            {preview !== null && <p className="rounded-xl bg-[var(--green-growth)]/10 p-4 text-sm text-[var(--green-growth)]" role="status">Separate contribution: <strong>{formatKobo(preview)}</strong>. This is a demo preview; no real money moves.</p>}
          </form>
        </section>
        <section className={`${panelClass} xl:col-span-2`}>
          <h2 className="text-lg font-semibold">Spend & Invest</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Partner-powered demo options. Investment values are separate from your savings balance.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[['Treasury bills','Lower risk'],['Fixed-income fund','Medium risk'],['Agriculture fund','Higher risk']].map(([name, risk]) => (
              <article key={name} className="rounded-xl border border-[var(--border)] bg-[var(--raised)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">Partner-powered · Demo</p>
                <h3 className="mt-2 font-semibold">{name}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{risk}</p>
                <p className="mt-3 text-xs leading-5 text-[var(--muted)]">Investment value can go up or down. Capital is at risk; returns are not guaranteed. Fees and withdrawal conditions would be shown before investing.</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-[var(--muted)]">Savings and investment values are shown separately. No investment transaction is available in this demo.</p>
        </section>
      </div>
    </PageFrame>
  )
}

function Allocation({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl bg-[var(--raised)] p-3"><p className="text-xs text-[var(--muted)]">{label}</p><p className="mt-1 font-semibold tabular-nums">{formatKobo(value)}</p></div>
}

function SendPage() {
  const { value: activity, setValue: setActivity } = useDemoStorage<ActivityItem[]>('buy-build:activity', [])
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [review, setReview] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function reviewTransfer(event: FormEvent) {
    event.preventDefault()
    if (!recipient.trim() || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setError('Enter a recipient and an amount greater than ₦0.')
      return
    }
    setError('')
    setReview(true)
  }

  function confirmTransfer() {
    const transfer: ActivityItem = {
      id: `send-${Date.now()}`,
      title: 'Demo transfer',
      description: `To ${recipient.trim()}${note.trim() ? ` · ${note.trim()}` : ''}`,
      amountKobo: nairaToKobo(Number(amount)),
      createdAt: new Date().toISOString(),
    }
    setActivity((current) => [transfer, ...current])
    setMessage(`Demo transfer of ${formatKobo(transfer.amountKobo ?? 0)} to ${recipient} completed. No real money moved.`)
    setReview(false)
    setRecipient('')
    setAmount('')
    setNote('')
  }

  return (
    <PageFrame title="Send money" description="Preview a person-to-person transfer with the demo payment provider. Review the recipient and amount before confirming.">
      <section className={`${panelClass} max-w-2xl`}>
        {!review ? (
          <form onSubmit={reviewTransfer} className="space-y-4">
            <label className={labelClass}>Recipient username, phone, or email<input className={fieldClass} autoComplete="off" value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="@aisha or +2348012345678" required /></label>
            <label className={labelClass}>Amount (₦)<input className={fieldClass} type="number" inputMode="decimal" min="1" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} required /></label>
            <label className={labelClass}>Note <span className="font-normal text-[var(--muted)]">(optional)</span><textarea className={fieldClass} maxLength={140} rows={3} value={note} onChange={(event) => setNote(event.target.value)} placeholder="What is this transfer for?" /></label>
            <button className={buttonClass} type="submit">Review transfer</button>
            <FormNotice error={error} success={message} />
          </form>
        ) : (
          <div>
            <h2 className="text-lg font-semibold">Review before confirming</h2>
            <dl className="my-5 space-y-3 rounded-xl bg-[var(--raised)] p-4 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-[var(--muted)]">Recipient</dt><dd className="break-all text-right">{recipient}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-[var(--muted)]">Amount</dt><dd className="font-semibold tabular-nums">{formatKobo(nairaToKobo(Number(amount)))}</dd></div>
              {note && <div><dt className="text-[var(--muted)]">Note</dt><dd>{note}</dd></div>}
            </dl>
            <p className="mb-5 text-xs text-[var(--gold)]">Demo mode — no real money moves.</p>
            <div className="flex flex-wrap gap-3"><button className={buttonClass} type="button" onClick={confirmTransfer}>Confirm demo transfer</button><button className="min-h-11 rounded-xl border border-[var(--border)] px-5 py-3" type="button" onClick={() => setReview(false)}>Edit details</button></div>
          </div>
        )}
      </section>
      {activity.length > 0 && <p className="mt-4 text-sm text-[var(--muted)]">Your demo transfer will appear in <Link className="underline" href="/activity">Activity</Link>.</p>}
    </PageFrame>
  )
}

function JointPage({ creating = false, detail = false }: { creating?: boolean; detail?: boolean }) {
  const pathname = usePathname() ?? ''
  const router = useRouter()
  const { value: pots, setValue: setPots } = useDemoStorage<Array<{id:string;name:string;goal:string;targetKobo:number;balanceKobo:number;rule:string;members:string[]}>>('buy-build:pots', [
    { id: 'lagos-rent', name: 'Lagos Rent Fund', goal: 'Shared rent goal', targetKobo: nairaToKobo(250000), balanceKobo: nairaToKobo(75000), rule: 'Majority approves', members: ['You','Aisha','Tunde'] },
    { id: 'family-trip', name: 'Family Trip', goal: 'Holiday savings', targetKobo: nairaToKobo(180000), balanceKobo: nairaToKobo(42000), rule: 'All members approve', members: ['You','Chioma'] },
  ])
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [target, setTarget] = useState('')
  const [deadline, setDeadline] = useState('')
  const [rule, setRule] = useState('majority')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const potId = pathname.split('/').filter(Boolean).at(-1) ?? ''
  const pot = pots.find((item) => item.id === potId)

  function createPot(event: FormEvent) {
    event.preventDefault()
    if (!consent || !name.trim() || !goal.trim() || Number(target) <= 0) {
      setError('Add the pot details and accept the terms before creating it.')
      return
    }
    const item = { id: `pot-${Date.now()}`, name: name.trim(), goal: goal.trim(), targetKobo: nairaToKobo(Number(target)), balanceKobo: 0, rule: rule === 'all' ? 'All members approve' : 'Majority approves', members: ['You'] }
    setPots((current) => [...current, item])
    router.push(`/joint/${item.id}`)
  }

  function contribute() {
    if (!pot) return
    const amountKobo = nairaToKobo(2000)
    setPots((current) => current.map((item) => item.id === pot.id ? { ...item, balanceKobo: item.balanceKobo + amountKobo } : item))
    setMessage('₦2,000 contribution recorded for you in demo mode.')
  }

  if (creating) {
    return (
      <PageFrame title="Create a joint pot" description="Create a savings-only goal with a clear approval rule. Every member contributes from their own account and accepts the terms individually.">
        <form onSubmit={createPot} className={`${panelClass} max-w-2xl space-y-4`}>
          <label className={labelClass}>Pot name<input className={fieldClass} value={name} onChange={(event) => setName(event.target.value)} maxLength={60} required /></label>
          <label className={labelClass}>Shared goal<input className={fieldClass} value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="e.g. Annual rent" maxLength={80} required /></label>
          <label className={labelClass}>Target (₦)<input className={fieldClass} type="number" min="1" value={target} onChange={(event) => setTarget(event.target.value)} required /></label>
          <label className={labelClass}>Deadline <span className="font-normal text-[var(--muted)]">(optional)</span><input className={fieldClass} type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} /></label>
          <label className={labelClass}>Withdrawal approval rule<select className={fieldClass} value={rule} onChange={(event) => setRule(event.target.value)}><option value="majority">Majority approves (default)</option><option value="all">All members approve</option></select></label>
          <p className="rounded-xl bg-[var(--raised)] p-4 text-sm leading-6 text-[var(--muted)]">Joint pots are savings only. Members can leave for a proportional refund; the owner starts closure and all members confirm. Fees and withdrawal conditions are shown before actions. A real launch requires a regulated partner to hold pooled funds and verify each member.</p>
          <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I understand this demo pot’s approval rule, proportional leave/close refund terms, fees, and demo-only status.</span></label>
          <button className={buttonClass} type="submit">Create demo pot</button>
          <FormNotice error={error} success="" />
        </form>
      </PageFrame>
    )
  }

  if (detail) {
    return (
      <PageFrame title={pot?.name ?? 'Joint pot'} description={pot?.goal ?? 'Shared savings pot'}>
        {pot ? (
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <section className={`${panelClass} space-y-5`}>
              <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm text-[var(--muted)]">Pot balance · savings only</p><p className="mt-1 text-3xl font-semibold tabular-nums">{formatKobo(pot.balanceKobo)}</p></div><p className="rounded-full bg-[var(--raised)] px-3 py-2 text-sm">{pot.rule}</p></div>
              <div><div className="mb-2 flex justify-between text-sm"><span>Progress</span><span>{Math.min(100, Math.round(pot.balanceKobo / pot.targetKobo * 100))}%</span></div><div className="h-2 overflow-hidden rounded-full bg-[var(--ink)]"><div className="h-full bg-[var(--gold)]" style={{ width: `${Math.min(100, pot.balanceKobo / pot.targetKobo * 100)}%` }} /></div><p className="mt-2 text-xs text-[var(--muted)]">Target {formatKobo(pot.targetKobo)}</p></div>
              <h2 className="text-lg font-semibold">Members and roles</h2><ul className="flex flex-wrap gap-2">{pot.members.map((member, index) => <li key={member} className="rounded-full border border-[var(--border)] px-3 py-2 text-sm">{member} · {index === 0 ? 'Owner' : 'Member'}</li>)}</ul>
              <div className="rounded-xl border border-[var(--border)] p-4"><h3 className="font-medium">Pot activity</h3><p className="mt-2 text-sm text-[var(--muted)]">Contributions and withdrawal votes are visible to members of this pot only. Other members’ balances, goals, and non-pot transactions stay private.</p></div>
              <FormNotice error="" success={message} />
            </section>
            <aside className={`${panelClass} h-fit space-y-4`}>
              <h2 className="text-lg font-semibold">Your contribution</h2>
              <p className="text-sm text-[var(--muted)]">Nobody is required to contribute. Each contribution comes from your own opted-in demo account.</p>
              <button className={buttonClass} type="button" onClick={contribute}>Add ₦2,000 demo contribution</button>
              <Link className="block rounded-xl border border-[var(--border)] px-4 py-3 text-sm" href="/withdraw">Propose a withdrawal</Link>
              <p className="text-xs text-[var(--muted)]">Demo fee: ₦0. Withdrawal requests expire after 72 hours and cannot exceed the pot balance.</p>
            </aside>
          </div>
        ) : <p className={panelClass}>This pot was not found in your demo workspace. <Link className="underline" href="/joint">Return to Joint Savings</Link>.</p>}
      </PageFrame>
    )
  }

  return (
    <PageFrame title="Joint Savings" description="Save together toward shared goals. Pots are savings-only, limited to 10 members, and each person controls their own contributions.">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-[var(--muted)]">Roles, contributions, and activity are shared only within each pot.</p><Link className={buttonClass} href="/joint/new">Create a pot</Link></div>
      <ul className="grid gap-4 lg:grid-cols-2">{pots.map((item) => (
        <li key={item.id} className={panelClass}>
          <Link href={`/joint/${item.id}`} className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]">
            <div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-semibold">{item.name}</h2><p className="text-sm text-[var(--muted)]">{item.goal}</p></div><span className="rounded-full bg-[var(--raised)] px-3 py-1 text-xs">{item.members.length}/10 members</span></div>
            <p className="mt-5 text-2xl font-semibold tabular-nums">{formatKobo(item.balanceKobo)}</p><p className="mt-1 text-xs text-[var(--muted)]">of {formatKobo(item.targetKobo)} · {item.rule}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--ink)]"><div className="h-full bg-[var(--gold)]" style={{ width: `${Math.min(100, item.balanceKobo / item.targetKobo * 100)}%` }} /></div>
          </Link>
        </li>
      ))}</ul>
      <p className="mt-6 text-xs leading-5 text-[var(--muted)]">Hypothesis to validate: joint savings can help people reach shared goals. Real launch requires a regulated partner to hold pooled funds and verify every member. No insurance or returns are implied.</p>
    </PageFrame>
  )
}

function InvitesPage() {
  const [status, setStatus] = useState<'pending' | 'accepted' | 'declined'>('pending')
  const [termsAccepted, setTermsAccepted] = useState(false)
  return (
    <PageFrame title="Pot invitations" description="Review the pot details and terms before accepting. You can decline without affecting your other goals or accounts.">
      {status === 'accepted' ? <p className={panelClass} role="status">Invitation accepted in demo mode. <Link className="underline" href="/joint/lagos-rent">Open Lagos Rent Fund</Link>.</p> : status === 'declined' ? <p className={panelClass} role="status">Invitation declined. No contribution was made. <Link className="underline" href="/joint">Return to Joint Savings</Link>.</p> : (
        <article className={`${panelClass} max-w-2xl`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">Invited by Aisha · expires in 6 days</p>
          <h2 className="mt-2 text-xl font-semibold">Lagos Rent Fund</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Shared rent goal · Majority approval · Member role · Savings only</p>
          <div className="my-5 space-y-2 rounded-xl bg-[var(--raised)] p-4 text-sm leading-6"><p>Your contributions are voluntary and itemised.</p><p>If you leave, your refund is proportional to your net contributions and the pot balance.</p><p>Owner starts closure; every member confirms. Demo withdrawal fee: ₦0.</p><p>A real launch needs a regulated partner to hold pooled funds and verify members. There are no guaranteed returns or insurance claims.</p></div>
          <label className="mb-5 flex items-start gap-3 text-sm"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} /><span>I accept the displayed pot terms and understand this is a demo.</span></label>
          <div className="flex flex-wrap gap-3"><button className={buttonClass} disabled={!termsAccepted} type="button" onClick={() => setStatus('accepted')}>Accept invitation</button><button type="button" className="min-h-11 rounded-xl border border-[var(--border)] px-5 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]" onClick={() => setStatus('declined')}>Decline</button></div>
        </article>
      )}
    </PageFrame>
  )
}

function WithdrawPage() {
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [destination, setDestination] = useState('owner_wallet')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  function request(event: FormEvent) {
    event.preventDefault()
    const amountValue = Number(amount)
    if (!Number.isFinite(amountValue) || amountValue <= 0 || amountValue > 75000) {
      setError('Enter an amount above ₦0 and no greater than the demo pot balance of ₦75,000.')
      setMessage('')
      return
    }
    setMessage(`Demo request for ${formatKobo(nairaToKobo(amountValue))} sent for member approval. It expires in 72 hours.`)
    setError('')
    setAmount('')
  }
  return (
    <PageFrame title="Withdraw from a pot" description="Request a withdrawal from a joint pot. Members see the amount, reason, destination, votes, and 72-hour expiry.">
      <form className={`${panelClass} max-w-2xl space-y-4`} onSubmit={request}>
        <p className="rounded-xl bg-[var(--raised)] p-4 text-sm">Lagos Rent Fund · Available demo balance: <strong>{formatKobo(nairaToKobo(75000))}</strong> · Demo fee: ₦0</p>
        <label className={labelClass}>Amount (₦)<input className={fieldClass} type="number" min="1" max="75000" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} required /></label>
        <label className={labelClass}>Reason<textarea className={fieldClass} rows={3} value={reason} onChange={(event) => setReason(event.target.value)} maxLength={240} placeholder="Why is this withdrawal needed?" required /></label>
        <label className={labelClass}>Destination<select className={fieldClass} value={destination} onChange={(event) => setDestination(event.target.value)}><option value="owner_wallet">My demo wallet</option><option value="member_wallet">Member demo wallet</option></select></label>
        <p className="text-xs leading-5 text-[var(--muted)]">A real payout would only happen after the selected approval rule is satisfied. This is a demo request; it does not move money.</p>
        <button className={buttonClass} type="submit">Submit demo request</button>
        <FormNotice error={error} success={message} />
      </form>
    </PageFrame>
  )
}

function ActivityPage() {
  const { value: activity, storageError } = useDemoStorage<ActivityItem[]>('buy-build:activity', [])
  return (
    <PageFrame title="Activity" description="A private, itemised record of your demo actions and contributions. Joint pot activity is visible only to pot members.">
      {storageError && <p role="alert" className="mb-4 text-sm text-[var(--alert-coral)]">{storageError}</p>}
      {activity.length === 0 ? <div className={panelClass}><h2 className="font-semibold">No personal activity yet</h2><p className="mt-2 text-sm text-[var(--muted)]">Your confirmed demo actions will be listed here.</p></div> : (
        <ul className={`${panelClass} divide-y divide-[var(--border)]`}>{activity.map((item) => <li key={item.id} className="flex flex-wrap justify-between gap-3 py-4 first:pt-0 last:pb-0"><div><h2 className="font-medium">{item.title}</h2><p className="text-sm text-[var(--muted)]">{item.description}</p><time className="text-xs text-[var(--muted)]">{new Date(item.createdAt).toLocaleString('en-NG')}</time></div>{item.amountKobo !== undefined && <p className="font-semibold tabular-nums">{formatKobo(item.amountKobo)}</p>}</li>)}</ul>
      )}
    </PageFrame>
  )
}

function InfoPage({ screen }: { screen: FeatureScreen }) {
  if (screen === 'cards') return <PageFrame title="Cards" description="Manage demo card controls. No real card details are collected or stored."><CardsPanel /></PageFrame>
  if (screen === 'coach') return <PageFrame title="Money coach" description="Practical, non-judgmental prompts to help you stay intentional with your money."><section className={`${panelClass} space-y-4`}>{[['Start with your priorities','Choose a salary split that reflects what matters to you. You can update it when your circumstances change.'],['Keep savings and investments separate','Review each balance on its own. Investment values may rise or fall; returns are never guaranteed.'],['Shop & Save stays optional','Purchase-linked contributions only happen after explicit opt-in, and you can pause the rule at any time.']].map(([title,body]) => <article key={title} className="rounded-xl bg-[var(--raised)] p-4"><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm leading-6 text-[var(--muted)]">{body}</p></article>)}</section></PageFrame>
  if (screen === 'profile') return <ProfilePage />
  if (screen === 'settings') return <PageFrame title="Settings & privacy" description="Control your preferences and understand what a real launch would require."><section className={`${panelClass} space-y-4`}><p>Demo mode is active. No bank, payment, or investment provider is connected.</p><ThemePreference /><Link className="block rounded-xl border border-[var(--border)] p-4 underline" href="/how-money-is-handled">How your money is handled</Link><p className="text-sm leading-6 text-[var(--muted)]">We minimise data, ask for consent before optional contributions, and avoid storing BVN, NIN, card numbers, or passwords. A production launch needs a documented retention and deletion process and legal review under Nigerian data-protection and financial regulations.</p><p className="text-sm text-[var(--muted)]">No sensitive identity or card information is requested in this demo.</p></section></PageFrame>
  return <PageFrame title="How your money is handled" description="Buy & Build is a technology and customer-experience layer. Regulated partners provide any real financial services."><section className={`${panelClass} max-w-3xl space-y-4 text-sm leading-6`}><p><strong>Demo mode — no real money moves.</strong> Balances, contributions, transfers, and investments in this prototype are examples only.</p><p>At a real launch, banks, payment providers, and licensed investment operators would provide the regulated financial services. Buy & Build would not use customer funds as working capital.</p><p>Savings and investments are separate. Investment value may go up or down; there are no guaranteed returns. Partner fees, risks, and withdrawal conditions must be shown before a real transaction.</p><p>Joint pots are savings-only. A real launch would need a regulated partner to hold pooled funds and verify every member. This prototype does not imply insurance or returns.</p><p>We do not collect real BVN, NIN, card numbers, or passwords here. A real launch requires data minimisation, clear consent, retention/deletion controls, and legal review under Nigerian data-protection and financial regulations.</p></section></PageFrame>
}

function ThemePreference() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [storageError, setStorageError] = useState('')

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem('buy-build:theme')
      if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme)
    } catch (error) {
      console.error('Could not read the theme preference', error)
      setStorageError('Your theme preference could not be loaded.')
    }
  }, [])

  function chooseTheme(nextTheme: 'dark' | 'light') {
    try {
      window.localStorage.setItem('buy-build:theme', nextTheme)
      setTheme(nextTheme)
      setStorageError('')
      document.documentElement.classList.toggle('light', nextTheme === 'light')
      document.documentElement.classList.toggle('dark', nextTheme === 'dark')
      document.documentElement.dataset.theme = nextTheme
    } catch (error) {
      console.error('Could not save the theme preference', error)
      setStorageError('Your theme preference could not be saved.')
    }
  }

  return (
    <fieldset className="rounded-xl border border-[var(--border)] p-4">
      <legend className="px-1 text-sm font-medium">Appearance</legend>
      <div className="mt-2 flex gap-2">
        {(['dark', 'light'] as const).map((option) => (
          <button key={option} type="button" aria-pressed={theme === option} onClick={() => chooseTheme(option)} className={`min-h-11 rounded-lg border px-4 py-2 text-sm capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] ${theme === option ? 'border-[var(--accent-violet)] bg-[var(--raised)]' : 'border-[var(--border)]'}`}>{option}</button>
        ))}
      </div>
      {storageError && <p role="alert" className="mt-2 text-sm text-[var(--alert-coral)]">{storageError}</p>}
    </fieldset>
  )
}

function CardsPanel() {
  const [locked, setLocked] = useState(false)
  return <section className={`${panelClass} max-w-xl`}><p className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">Demo card</p><p className="mt-4 text-2xl font-semibold">{locked ? 'Card paused' : 'Virtual card preview'}</p><p className="mt-2 text-sm text-[var(--muted)]">No card number, CVV, or payment credentials are stored in this prototype.</p><button className="mt-5 min-h-11 rounded-xl border border-[var(--border)] px-4 py-2" onClick={() => setLocked((value) => !value)} type="button">{locked ? 'Resume demo card' : 'Pause demo card'}</button></section>
}

function ProfilePage() {
  const { value: profile, setValue: setProfile, storageError } = useDemoStorage('buy-build:profile', { displayName: 'Demo member' })
  return <PageFrame title="Profile" description="Manage your demo profile. Do not enter sensitive identifiers or real passwords."><section className={`${panelClass} max-w-xl space-y-4`}><label className={labelClass}>Display name<input className={fieldClass} maxLength={60} value={profile.displayName} onChange={(event) => setProfile({ ...profile, displayName: event.target.value })} /></label><p className="text-xs text-[var(--muted)]">Your display name is saved automatically in this browser’s demo storage. No email address is needed.</p>{storageError && <p role="alert" className="text-sm text-[var(--alert-coral)]">{storageError}</p>}</section></PageFrame>
}

export function FeaturePage({ screen }: { screen: FeatureScreen }) {
  if (screen === 'goals') return <GoalsPage />
  if (screen === 'save' || screen === 'onboarding') return <SavePage onboarding={screen === 'onboarding'} />
  if (screen === 'joint') return <JointPage />
  if (screen === 'joint-new') return <JointPage creating />
  if (screen === 'joint-detail') return <JointPage detail />
  if (screen === 'invites') return <InvitesPage />
  if (screen === 'send') return <SendPage />
  if (screen === 'withdraw') return <WithdrawPage />
  if (screen === 'activity') return <ActivityPage />
  return <InfoPage screen={screen} />
}
