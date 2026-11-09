/* eslint-disable */
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { gsap } from 'gsap'

/**
 * Marketing Homepage - Buy & Build landing page.
 * 
 * Features:
 * - Hero section with Koba mascot and GSAP scroll sequence
 * - How it works: 3-step animation (Salary Split → Shop & Save → Goals)
 * - Interactive ₦40,000 @ 5% = ₦2,000 example
 * - Trust/partner model section with demo mode indicator
 * - Joint Savings "Save together, stay in control" block
 * - FAQ section
 * - CTA buttons
 * - GSAP-powered scroll sequences
 */

export default function Home() {
  useEffect(() => {
    // GSAP hero entrance animation
    gsap.from('.hero-title', {
      duration: 1,
      y: 40,
      opacity: 0,
      stagger: 0.2,
      ease: 'power3.out',
    })

    gsap.from('.hero-subtitle', {
      duration: 1,
      y: 30,
      opacity: 0,
      delay: 0.3,
      ease: 'power3.out',
    })

    gsap.from('.cta-button', {
      duration: 1,
      y: 40,
      opacity: 0,
      delay: 0.5,
      ease: 'power3.out',
    })

    // Scroll reveal animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.from(entry.target, {
            duration: 0.8,
            y: 20,
            opacity: 0,
            ease: 'power2.out',
          })
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    // Observe all sections with reveal class
    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[var(--ink)] via-[var(--surface)] to-[var(--raised)] min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent-violet)] transition-colors"
              aria-label="Log in to Buy & Build"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5 3h14v2H5V3zm0 4h14v2H5V7zm4 8h6v2h-6V15zm4-4h2v2h-2V11zm2 2h6v2h-6V13z" />
              </svg>
              Welcome
            </Link>
            <div className="hidden md:block">
              <a
                href="#features"
                className="text-[var(--muted)] hover:text-[var(--accent-violet)] transition-colors"
                aria-label="Scroll to features"
              >
                Learn more
              </a>
            </div>
          </div>

          <div className="mt-8 md:mt-0 pt-8 border-t border-border">
            <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--text)]">
              Buy What You Love.<br />
              <span className="italic">Build Wealth As You Live.</span>
            </h1>
          </div>

          {/* Subtitle and CTA */}
          <p className="hero-subtitle text-lg md:text-xl text-[var(--muted)] max-w-2xl mb-8">
            A lifestyle money-management app for the Nigerian market. Help your money work harder for the things you love.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/login"
              className="cta-button bg-[var(--accent-violet)] text-white px-6 py-3 rounded-md font-medium hover:bg-[var(--accent-indigo)] transition-colors"
              aria-label="Get started with Buy & Build"
            >
              Get Started
            </Link>
            <Link
              href="/sign-up"
              className="cta-button border border-[var(--border)] text-[var(--text)] px-6 py-3 rounded-md font-medium hover:bg-[var(--surface)] transition-colors"
              aria-label="Sign up for Buy & Build"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="features" className="py-16 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="feature-title text-3xl font-bold text-[var(--text)] mb-4">
              How It Works
            </h2>
            <p className="text-[var(--muted)] max-w-2xl">
              Three simple steps to buy what you love and build wealth as you live.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Salary Split */}
            <div className="reveal p-6 rounded-xl bg-[var(--raised)] transition-all hover:bg-[var(--surface)]">
              <div className="step-number text-4xl font-bold text-[var(--gold)]">1</div>
              <h3 className="mt-4 text-xl font-semibold text-[var(--text)]">Salary Split</h3>
              <p className="mt-2 text-[var(--muted)]">
                Divide your income between Spending, Savings, and named Goals. Totals must equal exactly 100%.
              </p>
            </div>

            {/* Step 2: Shop & Save */}
            <div className="reveal p-6 rounded-xl bg-[var(--raised)] transition-all hover:bg-[var(--surface)]" style="animation-delay: 0.1s;">
              <div className="step-number text-4xl font-bold text-[var(--gold)]">2</div>
              <h3 className="mt-4 text-xl font-semibold text-[var(--text)]">Shop & Save</h3>
              <p className="mt-2 text-[var(--muted)]">
                When you make an eligible purchase, a fixed amount, percentage, or round-up is set aside as a separate contribution. ₦40,000 @ 5% = ₦2,000.
              </p>
            </div>

            {/* Step 3: Lifestyle Goals */}
            <div className="reveal p-6 rounded-xl bg-[var(--raised)] transition-all hover:bg-[var(--surface)]" style="animation-delay: 0.2s;">
              <div className="step-number text-4xl font-bold text-[var(--gold)]">3</div>
              <h3 className="mt-4 text-xl font-semibold text-[var(--text)]">Lifestyle Goals</h3>
              <p className="mt-2 text-[var(--muted)]">
                Rent, car, education, business, holiday — each with target, progress, and deadline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Joint Savings Section */}
      <section className="py-16 bg-[var(--ink)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[var(--text)]">
                <span className="text-[var(--gold)]">Save</span> <span className="text-[var(--text)]">together</span>, <span className="text-[var(--text)]">stay</span> <span className="text-[var(--gold)]">in control</span>
              </h2>
              <p className="text-[var(--muted)] mt-2">
                Two or more users save together toward one shared goal — rent, wedding, trip, family project, or business fund.
              </p>
            </div>
            <div className="info-box bg-[var(--surface)] rounded-xl p-4">
              <p className="text-[var(--muted)] text-sm">
                Max 10 members • All members approve • Majority rule default • 72-hour withdrawal expiry
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Joint Pot Creation */}
            <div className="reveal p-6 rounded-xl bg-[var(--raised)] hover:bg-[var(--surface)] transition-all">
              <h3 className="text-xl font-medium text-[var(--gold)] mb-3">Create a Joint Pot</h3>
              <ul className="space-y-2 text-[var(--muted)]">
                <li>Name your pot (e.g., "Lagos Rent Fund")</li>
                <li>Set target amount & deadline</li>
                <li>Choose approval rule: all members, majority, or owner-up-to-₦X</li>
                <li>Invite members by username, phone, or email</li>
                <li>Members contribute with explicit opt-in</li>
              </ul>
            </div>

            {/* Joint Pot Progress */}
            <div className="reveal p-6 rounded-xl bg-[var(--raised)] hover:bg-[var(--surface)] transition-all" style="animation-delay: 0.1s;">
              <h3 className="text-xl font-medium text-[var(--gold)] mb-3">Track Progress</h3>
              <ul className="space-y-2 text-[var(--muted)]">
                <li>See who contributed, withdrawals, and votes</li>
                <li>Members see pot activity — never each other's non-pot data</li>
                <li>Milestones at 25/50/75/100% progress</li>
                <li>Leave flow shows exact proportional refund before confirming</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Partner Model Section */}
      <section className="py-16 bg-[var(--gradient-bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text)] mb-4">
                Trust & Partner Model
              </h2>
              <p className="text-[var(--muted)] mb-6">
                Buy & Build is a technology and customer-experience layer. Regulated partners (banks, payment providers, licensed investment operators) provide the real financial services. We mock every integration so a real provider can be swapped in later.
              </p>
              <ul className="space-y-3 text-[var(--muted)]">
                <li>
                  <span className="font-medium">Demo mode</span> — No real money moves. Visible "Demo mode — no real money moves" indicator on all money actions.
                </li>
                <li>
                  <span className="font-medium">Explicit opt-in</span> — Before any purchase-linked contribution is enabled.
                </li>
                <li>
                  <span className="font-medium">Savings only</span> — No investing inside joint pots (prototype limitation).
                </li>
                <li>
                  <span className="font-medium">Data minimisation</span> — No BVN, NIN, card numbers, or passwords collected in prototype.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[var(--gold)] mb-4">Partner-Powered Investments</h3>
              <p className="text-[var(--muted)] mb-6">
                Contributions can be directed to investment products through licensed partners. Label "Partner-powered" and clearly demo. Investment screens show a risk note and the difference between a savings balance and an investment value.
              </p>
              <ul className="space-y-3 text-[var(--muted)]">
                <li>Risk note displayed on all investment screens</li>
                <li>Savings and investments always visually and textually separate</li>
                <li>Fees and withdrawal conditions shown plainly (demo values acceptable)</li>
              </ul>
            </div>
          </div>

          {/* Demo Mode Indicator */}
          <div className="mt-8 p-6 rounded-xl bg-[var(--surface)]/50 border border-[var(--border)]">
            <p className="font-medium">Demo mode — no real money moves</p>
            <p className="text-xs text-[var(--muted)] mt-1">
              All financial actions in this prototype are simulated. No real funds are moved, stored, or held. This is a validation demo for partner integration.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[var(--text)] mb-8">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <div className="accordion-item">
              <button className="accordion-btn" aria-expanded="false">
                <h3 className="text-base font-medium text-[var(--text)]">
                  Is my money safe in this prototype?
                </h3>
                <svg className="accordion-icon w-4 h-4 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 3h14v2H5V3zm0 4h14v2H5V7zm0 4h14v2H5V11zm4-4h6v2h-6V7zm4-4h2v2h-2V3z" />
                </svg>
              </button>
              <div className="accordion-content hidden py-4 text-[var(--muted)]">
                <p>This is a high-fidelity demo-mode prototype. No real money moves, stores, or holds funds. Regulated partners would provide real financial services in a production launch.</p>
              </div>
            </div>

            <div className="accordion-item">
              <button className="accordion-btn" aria-expanded="false">
                <h3 className="text-base font-medium text-[var(--text)]">
                  Can I use real BVN or NIN?
                </h3>
                <svg className="accordion-icon w-4 h-4 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 3h14v2H5V3zm0 4h14v2H5V7zm0 4h14v2H5V11zm4-4h6v2h-6V7zm4-4h2v2h-2V3z" />
                </svg>
              </button>
              <div className="accordion-content hidden py-4 text-[var(--muted)]">
                <p>No. Do not collect or store real BVN, NIN, card numbers, or passwords in the prototype. Account numbers use NUBAN format (10 digits) validation only. Phone numbers use Nigerian format (+234).</p>
              </div>
            </div>

            <div className="accordion-item">
              <button className="accordion-btn" aria-expanded="false">
                <h3 className="text-base font-medium text-[var(--text)]">
                  Does this app handle real money?
                </h3>
                <svg className="accordion-icon w-4 h-4 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 3h14v2H5V3zm0 4h14v2H5V7zm0 4h14v2H5V11zm4-4h6v2h-6V7zm4-4h2v2h-2V3z" />
                </svg>
              </button>
              <div className="accordion-content hidden py-4 text-[var(--muted)]">
                <p>No. This is a demo-mode prototype. No real money moves, stores, or holds funds. All financial actions are simulated for partner validation purposes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-[var(--ink)] via-[var(--surface)] to-[var(--raised)]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">
              Ready to build your wealth?
            </h2>
            <p className="text-[var(--muted)] mb-8 max-w-2xl">
              Join thousands of Nigerians managing their money with Buy & Build. 
              <span className="font-semibold">Start saving today — it's free!</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/sign-up"
                className="cta-primary bg-[var(--accent-violet)] text-white px-8 py-4 rounded-md font-medium hover:bg-[var(--accent-indigo)] transition-colors"
                aria-label="Sign up for Buy & Build"
              >
                Sign Up Free
              </Link>
              <Link
                href="/login"
                className="cta-secondary border border-[var(--border)] text-[var(--text)] px-8 py-4 rounded-md font-medium hover:bg-[var(--surface)] transition-colors"
                aria-label="Log in to Buy & Build"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

/* eslint-enable */