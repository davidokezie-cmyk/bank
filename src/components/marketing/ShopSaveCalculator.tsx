'use client'

import { useId, useState } from 'react'
import { calculateContribution, type ShopSaveRule } from '@/lib/shop-save'
import { formatKobo, nairaToKobo } from '@/lib/money'

/**
 * Live example of the Shop & Save rule.
 * Canonical case: a ₦40,000 purchase at 5% sets aside a separate ₦2,000.
 * This is a preview only — nothing is deducted and no opt-in is implied.
 */
export function ShopSaveCalculator() {
  const [purchase, setPurchase] = useState('40000')
  const [percent, setPercent] = useState('5')
  const purchaseId = useId()
  const percentId = useId()

  const purchaseNaira = Number(purchase)
  const percentValue = Number(percent)
  const valid = Number.isFinite(purchaseNaira) && purchaseNaira > 0 && Number.isFinite(percentValue) && percentValue > 0

  const previewRule: ShopSaveRule = {
    id: 'shop-save-preview',
    ruleType: 'percentage',
    ruleValue: percentValue,
    isActive: true,
    isOptInEnabled: true,
    createdAt: 0,
    triggeredCount: 0,
  }
  const contributionKobo = valid
    ? calculateContribution(nairaToKobo(purchaseNaira), previewRule)?.contributionKobo ?? 0
    : 0

  return (
    <div className="grid gap-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">Try it</p>
        <h3 className="mt-2 text-2xl font-semibold">Your Shop &amp; Save preview</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
          A separate contribution is set aside when you opt in. It is not a discount and it never happens automatically.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label htmlFor={purchaseId} className="text-sm font-medium">
            Purchase amount (₦)
            <input
              id={purchaseId}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--ink)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent-violet)] focus:ring-2 focus:ring-[var(--accent-violet)]/30"
              type="number"
              min="1"
              step="1"
              inputMode="decimal"
              value={purchase}
              onChange={(event) => setPurchase(event.target.value)}
            />
          </label>
          <label htmlFor={percentId} className="text-sm font-medium">
            Contribution rule (%)
            <input
              id={percentId}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--ink)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent-violet)] focus:ring-2 focus:ring-[var(--accent-violet)]/30"
              type="number"
              min="1"
              max="100"
              step="0.5"
              inputMode="decimal"
              value={percent}
              onChange={(event) => setPercent(event.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--raised)] p-6 text-center lg:min-w-64">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Set aside separately</p>
        <p aria-live="polite" className="money mt-2 text-4xl font-semibold text-[var(--green-growth)]">
          {valid ? formatKobo(contributionKobo) : '—'}
        </p>
        <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
          {valid
            ? `${formatKobo(nairaToKobo(purchaseNaira))} purchase · ${percentValue}% rule`
            : 'Enter a purchase and a percentage above 0.'}
        </p>
        <p className="mt-4 rounded-lg bg-[var(--ink)] px-3 py-2 text-[11px] font-medium text-[var(--gold)]">
          Demo mode — no real money moves
        </p>
      </div>
    </div>
  )
}
