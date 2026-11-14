import type { Metadata } from 'next'
import Link from 'next/link'
import { KoboProcedural } from '@/components/three/KoboProcedural'
import { MarketingMotion } from '@/components/marketing/MarketingMotion'
import { ShopSaveCalculator } from '@/components/marketing/ShopSaveCalculator'

export const metadata: Metadata = {
  title: 'Buy & Build — Buy What You Love. Build Wealth As You Live.',
  description:
    'Salary splits, Shop & Save, lifestyle goals, and joint savings for Nigeria. A demo-mode prototype where no real money moves.',
}

const steps = [
  {
    number: '01',
    title: 'Salary Split',
    body: 'Divide income between Spending, Savings, and named Goals. Totals must equal exactly 100%, so every naira has a job.',
  },
  {
    number: '02',
    title: 'Shop & Save',
    body: 'When you make an eligible purchase, a fixed amount, percentage, or round-up is set aside as a separate contribution — only after you opt in.',
  },
  {
    number: '03',
    title: 'Lifestyle Goals',
    body: 'Rent, a car, education, a business, or a holiday. Each goal gets a target, progress, and a deadline you can see.',
  },
] as const

const faqs = [
  {
    question: 'Does this app handle real money?',
    answer:
      'No. This is a high-fidelity demo-mode prototype. Balances, transfers, contributions, and investments are simulated. No real funds are moved, stored, or held.',
  },
  {
    question: 'Can I use a real BVN or NIN?',
    answer:
      'No. Do not enter real BVN, NIN, card numbers, or passwords. The prototype only validates NUBAN-shaped account numbers (10 digits) and Nigerian phone numbers (+234).',
  },
  {
    question: 'Is Shop & Save a discount?',
    answer:
      'No. It is a separate contribution that you explicitly opt into. You can pause, change, or turn it off at any time, and every contribution is itemised.',
  },
  {
    question: 'How does joint savings work?',
    answer:
      'Two or more people save toward one shared goal in a savings-only pot. Every member accepts the terms individually, roles are visible, and withdrawals follow an approval rule with a 72-hour expiry.',
  },
] as const

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--ink)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)]/70 bg-[var(--ink)]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--gold)] text-sm font-black text-[#0B0A14]">
              B
            </span>
            Buy &amp; Build
          </Link>
          <nav aria-label="Account" className="flex items-center gap-2 text-sm">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-[var(--accent-indigo)] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#4F46E5]"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <MarketingMotion>
        <div>
          <section className="relative overflow-hidden surface-glow">
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:pb-24 lg:pt-20">
              <div>
                <p
                  data-hero
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--gold)]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--green-growth)]" />
                  Demo mode — no real money moves
                </p>
                <h1
                  data-hero
                  className="mt-5 text-balance text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
                >
                  Buy What You Love.
                  <span className="mt-2 block bg-gradient-to-r from-[var(--gold)] via-[#ffd479] to-[var(--gold)] bg-clip-text text-transparent">
                    Build Wealth As You Live.
                  </span>
                </h1>
                <p data-hero className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">
                  A lifestyle money-management app for the Nigerian market. Split your salary, save on the things you
                  already buy, and grow toward the life you actually want.
                </p>
                <div data-hero className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/sign-up"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--accent-indigo)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#4F46E5]"
                  >
                    Start in demo mode
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--border)] px-6 py-3 font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface)]"
                  >
                    Explore the app
                  </Link>
                </div>
                <dl data-hero className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-[var(--border)] pt-6">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Salary split</dt>
                    <dd className="money mt-1 text-xl font-semibold">100%</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Shop &amp; Save</dt>
                    <dd className="money mt-1 text-xl font-semibold text-[var(--green-growth)]">₦2,000</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">Joint pots</dt>
                    <dd className="mt-1 text-xl font-semibold">Up to 10</dd>
                  </div>
                </dl>
              </div>

              <div data-hero className="relative mx-auto w-full max-w-md">
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/80 p-6 shadow-2xl backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Wealth overview</p>
                      <p className="money mt-1 text-2xl font-semibold">₦75,000</p>
                    </div>
                    <span className="rounded-full bg-[var(--green-growth)]/15 px-3 py-1 text-xs font-semibold text-[var(--green-growth)]">
                      On track
                    </span>
                  </div>
                  <KoboProcedural progress={0.45} />
                  <div className="mt-4 space-y-3">
                    {[
                      ['Rent goal', '40%', 'bg-[var(--gold)]'],
                      ['Emergency fund', '65%', 'bg-[var(--green-growth)]'],
                      ['Holiday', '20%', 'bg-[var(--accent-violet)]'],
                    ].map(([label, value, color]) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs text-[var(--muted)]">
                          <span>{label}</span>
                          <span className="money">{value}</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--raised)]">
                          <div className={`h-full rounded-full ${color}`} style={{ width: value }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-y border-[var(--border)] bg-[var(--surface)] py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <div data-reveal className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">How it works</p>
                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Three moves, one clear picture.</h2>
                <p className="mt-3 text-[var(--muted)]">
                  Buying what you love and building wealth are not opposites. Buy &amp; Build makes the trade-offs
                  visible instead of hiding them.
                </p>
              </div>

              <ol data-reveal className="mt-10 grid gap-5 md:grid-cols-3">
                {steps.map((step) => (
                  <li
                    key={step.number}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--raised)] p-6 transition-transform duration-200 hover:-translate-y-1"
                  >
                    <span className="money text-sm font-bold text-[var(--gold)]">{step.number}</span>
                    <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{step.body}</p>
                  </li>
                ))}
              </ol>

              <div data-reveal className="mt-12">
                <ShopSaveCalculator />
              </div>
            </div>
          </section>

          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div data-reveal>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">Joint Savings</p>
                  <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Save together, stay in control.</h2>
                  <p className="mt-3 max-w-xl text-[var(--muted)]">
                    Two or more people save toward one shared goal — rent, a wedding, a trip, a family project, or an
                    ajo/esusu-style pot. Every member keeps their own account and their own choices.
                  </p>
                  <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    {[
                      ['Savings only', 'No investing inside a pot'],
                      ['Max 10 members', 'Roles always visible'],
                      ['72-hour votes', 'Withdrawal requests expire'],
                      ['Proportional refunds', 'Exact amount shown first'],
                    ].map(([term, detail]) => (
                      <div key={term} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                        <dt className="font-semibold">{term}</dt>
                        <dd className="mt-1 text-[var(--muted)]">{detail}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div data-reveal className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">Lagos Rent Fund</h3>
                      <p className="text-sm text-[var(--muted)]">Shared rent goal · Majority approves</p>
                    </div>
                    <span className="rounded-full bg-[var(--raised)] px-3 py-1 text-xs">3/10 members</span>
                  </div>
                  <p className="money mt-6 text-3xl font-semibold">₦75,000</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">of ₦250,000 · 30% funded</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--raised)]">
                    <div className="h-full w-[30%] rounded-full bg-[var(--gold)]" />
                  </div>
                  <ul className="mt-6 space-y-3 text-sm">
                    {[
                      ['You', 'Owner', '₦40,000'],
                      ['Aisha', 'Member', '₦25,000'],
                      ['Tunde', 'Member', '₦10,000'],
                    ].map(([name, role, amount]) => (
                      <li key={name} className="flex items-center justify-between rounded-xl bg-[var(--raised)] px-4 py-3">
                        <span>
                          <span className="font-medium">{name}</span>
                          <span className="ml-2 text-xs text-[var(--muted)]">{role}</span>
                        </span>
                        <span className="money font-semibold">{amount}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
                    Members see pot activity, never each other&apos;s balances or non-pot transactions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="border-y border-[var(--border)] bg-[var(--surface)] py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <div data-reveal className="grid gap-8 lg:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">Trust</p>
                  <h2 className="mt-3 text-3xl font-bold">Technology layer. Regulated partners.</h2>
                  <p className="mt-3 text-[var(--muted)]">
                    Buy &amp; Build is the experience layer. At a real launch, licensed banks, payment providers, and
                    investment operators would provide the regulated financial services. We never use customer funds
                    as working capital.
                  </p>
                  <Link
                    href="/how-money-is-handled"
                    className="mt-6 inline-flex min-h-11 items-center rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold transition-colors hover:bg-[var(--raised)]"
                  >
                    How your money is handled
                  </Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['Explicit opt-in', 'Purchase-linked contributions never happen silently.'],
                    ['Savings ≠ investments', 'Always separate, visually and in the copy.'],
                    ['No guaranteed returns', 'Investment value can go down. Capital is at risk.'],
                    ['Data minimisation', 'No BVN, NIN, card numbers, or passwords.'],
                  ].map(([title, detail]) => (
                    <div key={title} className="rounded-2xl border border-[var(--border)] bg-[var(--raised)] p-5">
                      <h3 className="font-semibold">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-4xl px-5 sm:px-8">
              <div data-reveal>
                <h2 className="text-3xl font-bold sm:text-4xl">Frequently asked questions</h2>
                <div className="mt-8 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                  {faqs.map((faq) => (
                    <details key={faq.question} className="group px-5 py-4">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium marker:hidden">
                        {faq.question}
                        <span className="grid h-6 w-6 flex-none place-items-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-transform group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="px-5 pb-20 sm:px-8">
            <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[var(--border)] brand-gradient px-6 py-12 text-center sm:px-10 sm:py-16">
              <h2 className="text-balance text-3xl font-bold sm:text-4xl">Ready to build your wealth?</h2>
              <p className="mx-auto mt-3 max-w-2xl text-white/85">
                Start with a salary split you can change any time. Everything here runs in demo mode — no real money
                moves, and no sensitive details are collected.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/sign-up"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-[#2b1a63] transition-transform hover:-translate-y-0.5"
                >
                  Create a demo profile
                </Link>
                <Link
                  href="/login"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Log in
                </Link>
              </div>
            </div>
          </section>
        </div>
      </MarketingMotion>

      <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>Buy &amp; Build · Buy What You Love. Build Wealth As You Live.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/how-money-is-handled" className="hover:text-[var(--text)]">
              How your money is handled
            </Link>
            <Link href="/settings" className="hover:text-[var(--text)]">
              Privacy
            </Link>
            <span className="text-[var(--gold)]">Demo mode</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
