import Link from "next/link";

const balances = [
  { label: "Available to spend", amount: "₦84,750", note: "Ready for everyday life", tone: "spend" },
  { label: "Savings balance", amount: "₦52,300", note: "Kept separate from investments", tone: "save" },
];

const goals = [
  { name: "Lagos rent", saved: "₦720,000", target: "₦1,000,000", progress: 72, color: "gold" },
  { name: "A little getaway", saved: "₦180,000", target: "₦450,000", progress: 40, color: "violet" },
];

const activity = [
  { title: "Salary split", description: "Monthly allocation · Today", amount: "+₦25,000", kind: "positive" },
  { title: "Shop & Save", description: "Market purchase · Yesterday", amount: "+₦2,000 saved", kind: "positive" },
  { title: "Lagos Rent Fund", description: "Joint pot contribution · 2 days ago", amount: "₦15,000", kind: "neutral" },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.7">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.7">
      <path d="m4 16 5-5 4 3 7-8M14 6h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#0b0a14] text-[#f4f3ff]">
      <div className="mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[244px_minmax(0,1fr)]">
        <aside className="hidden border-r border-white/[0.07] bg-[#0f0d19] px-5 py-7 lg:flex lg:flex-col">
          <Link href="/" className="flex items-center gap-3" aria-label="Buy & Build home">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f7d07a,#8b5cf6)] shadow-[0_0_26px_rgba(244,182,73,0.2)]">
              <span className="h-5 w-5 rounded-full border-2 border-[#17111c]" />
            </span>
            <span>
              <span className="block text-xs font-bold uppercase tracking-[0.12em]">Buy & Build</span>
              <span className="mt-0.5 block text-[11px] text-[#a5a3c4]">Your money, your life</span>
            </span>
          </Link>

          <p className="mb-3 mt-12 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#77748f]">Workspace</p>
          <nav aria-label="App navigation" className="space-y-1">
            <a href="#overview" className="flex min-h-11 items-center gap-3 rounded-xl bg-[#211d38] px-3 text-sm font-medium text-white">
              <span aria-hidden="true" className="text-[#f7d07a]">◈</span> Overview
            </a>
            <a href="#goals" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-[#aaa7c1] transition hover:bg-white/5 hover:text-white">
              <span aria-hidden="true">◇</span> Goals
            </a>
            <a href="#activity" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-[#aaa7c1] transition hover:bg-white/5 hover:text-white">
              <span aria-hidden="true">↗</span> Activity
            </a>
          </nav>

          <div className="mt-auto rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-[#f7d07a]">
              <span className="h-2 w-2 rounded-full bg-[#f7d07a]" /> Demo space
            </div>
            <p className="mt-2 text-xs leading-5 text-[#aaa7c1]">Explore the experience with sample figures. No real money moves.</p>
            <Link href="/" className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-white hover:text-[#f7d07a]">
              Back to website <ArrowIcon />
            </Link>
          </div>
        </aside>

        <div className="min-w-0 px-4 pb-10 pt-5 sm:px-7 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#f7d07a]/20 bg-[#f7d07a]/[0.06] px-4 py-3">
              <p className="flex items-center gap-2 text-xs font-medium text-[#f6e5bb] sm:text-sm">
                <span className="h-2 w-2 rounded-full bg-[#f7d07a]" /> Demo mode — no real money moves
              </p>
              <span className="text-xs text-[#b9b5d8]">Sample account · Figures are illustrative</span>
            </div>

            <header id="overview" className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b8a1ff]">Monday, 9 November</p>
                <h1 className="mt-2 font-[var(--font-sora)] text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">Your money, in balance.</h1>
                <p className="mt-2 text-sm text-[#aaa7c1]">A clear view of today and the life you’re building.</p>
              </div>
              <Link href="/login" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white transition hover:border-[#8b5cf6]/50">
                Alex’s demo profile <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2c2548] text-xs text-[#f7d07a]">A</span>
              </Link>
            </header>

            <section aria-label="Money overview" className="grid gap-4 sm:grid-cols-2">
              {balances.map((balance) => (
                <article key={balance.label} className={`relative overflow-hidden rounded-[26px] border p-5 sm:p-6 ${balance.tone === "spend" ? "border-[#8b5cf6]/25 bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(22,20,39,0.94))]" : "border-[#2ed7a4]/20 bg-[linear-gradient(135deg,rgba(46,215,164,0.09),rgba(22,20,39,0.94))]"}`}>
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-[#c2bfd5]">{balance.label}</p>
                      <p className="money mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">{balance.amount}</p>
                      <p className="mt-2 text-xs text-[#aaa7c1]">{balance.note}</p>
                    </div>
                    <span className={`rounded-xl p-2.5 ${balance.tone === "spend" ? "bg-[#8b5cf6]/15 text-[#c5b5ff]" : "bg-[#2ed7a4]/10 text-[#7ce2c0]"}`}><TrendIcon /></span>
                  </div>
                </article>
              ))}
            </section>

            <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
              <div id="goals" className="rounded-[26px] border border-white/[0.08] bg-[#14121f] p-5 sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f7d07a]">Little by little</p>
                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">Your goals</h2>
                  </div>
                  <span className="text-xs text-[#aaa7c1]">Savings goals only</span>
                </div>
                <div className="mt-6 space-y-6">
                  {goals.map((goal) => (
                    <div key={goal.name}>
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-white">{goal.name}</p>
                          <p className="mt-1 text-xs text-[#aaa7c1]">{goal.saved} <span className="text-[#77748f]">of {goal.target}</span></p>
                        </div>
                        <span className="money text-sm font-semibold text-[#dedaf3]">{goal.progress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]" role="progressbar" aria-label={`${goal.name} progress`} aria-valuenow={goal.progress} aria-valuemin={0} aria-valuemax={100}>
                        <div className={`h-full rounded-full ${goal.color === "gold" ? "bg-[linear-gradient(90deg,#f5b83d,#f7d07a)]" : "bg-[linear-gradient(90deg,#8b5cf6,#b6a2ff)]"}`} style={{ width: `${goal.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 border-t border-white/[0.07] pt-4 text-xs leading-5 text-[#aaa7c1]">Savings and investments are shown separately. Investment values may change and are not guaranteed.</p>
              </div>

              <aside className="relative overflow-hidden rounded-[26px] border border-[#8b5cf6]/20 bg-[linear-gradient(155deg,#201a39,#151321_68%)] p-5 sm:p-6" aria-label="Kobo mascot and tip">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#8b5cf6]/15 blur-3xl" />
                <div className="relative flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f7d07a]">A note from Kobo</p>
                    <h2 className="mt-2 text-lg font-semibold">Small steps add up.</h2>
                  </div>
                  <div className="kobo-mini" aria-hidden="true"><span className="kobo-mini-eye left" /><span className="kobo-mini-eye right" /><span className="kobo-mini-smile" /></div>
                </div>
                <p className="relative mt-5 text-sm leading-6 text-[#c2bfd5]">Your Shop & Save example: a ₦40,000 purchase with your 5% rule would set aside ₦2,000 as a separate contribution.</p>
                <p className="relative mt-4 rounded-xl border border-white/[0.08] bg-black/10 px-3 py-2 text-xs leading-5 text-[#aaa7c1]">Only enable purchase-linked contributions with your explicit opt-in. You can pause or change a rule any time.</p>
              </aside>
            </section>

            <section id="activity" className="mt-6 rounded-[26px] border border-white/[0.08] bg-[#14121f] p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b8a1ff]">The latest</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">Recent activity</h2>
                </div>
                <span className="rounded-full border border-white/[0.08] px-3 py-1 text-[11px] text-[#aaa7c1]">Sample activity</span>
              </div>
              <ul className="divide-y divide-white/[0.07]">
                {activity.map((item) => (
                  <li key={item.title} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-2 last:pb-1">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm ${item.kind === "positive" ? "bg-[#2ed7a4]/10 text-[#7ce2c0]" : "bg-[#f7d07a]/10 text-[#f7d07a]"}`} aria-hidden="true">{item.kind === "positive" ? "↗" : "◈"}</span>
                      <div><p className="text-sm font-medium text-white">{item.title}</p><p className="mt-1 text-xs text-[#8f8ca6]">{item.description}</p></div>
                    </div>
                    <span className="money text-sm font-medium text-[#d8d5e8]">{item.amount}</span>
                  </li>
                ))}
              </ul>
            </section>

            <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-5 text-xs text-[#8f8ca6]">
              <span>Buy & Build is a demo experience. No real money moves.</span>
              <Link href="/" className="text-[#c2bfd5] hover:text-white">How your money is handled</Link>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
