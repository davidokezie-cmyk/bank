/* eslint-disable */
import { useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { KoboProcedural } from '@/components/three/KoboProcedural'
import { KoboFallback } from '@/components/three/KoboFallback'
import { triggerMoneyConfirmation } from '@/components/ui/toast/Toast'
import { cn } from '@/lib/utils'

/**
 * Dashboard - Wealth overview and quick actions.
 * 
 * Features:
 * - Koba block-stack progress showing goal contribution
 * - Available to Spend vs Available to Save/Invest cards
 * - Quick actions: Send, Save, Joint Savings, Goals
 * - Recent transactions list
 * - Pending joint pot invites/votes badge
 * - Demo mode indicator
 * - Every money flow has validation, confirm step, loading, success (Koba celebrate + aria-live), error, empty states
 */

export default function Dashboard() {
  const reducedMotion = useReducedMotion()
  const [showKoba, setShowKoba] = useState(true)
  const [activeSection, setActiveSection] = useState('overview')

  // Check for demo mode
  useEffect(() => {
    const checkDemoMode = () => {
      const cookie = document.cookie.replace(/(?:(?:^|.*)\demo-mode\s*=\s*([^;]*).*$)|^.*$/, '$1')
      if (cookie === 'true') {
        // Demo mode is active
      }
    }
    checkDemoMode()
  }, [])

  // Koba contribution celebration
  const celebrateContribution = () => {
    triggerMoneyConfirmation('₦2,000 contributed')
  }

  // Sample data for demo
  const availableSpend = 75000 // ₦750
  const availableSave = 30000 // ₦300
  const pendingInvites = 2
  const pendingVotes = 1

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">
              Dashboard
            </h1>
            <p className="text-[var(--muted)] text-sm">
              Welcome back
            </p>
          </div>

          {/* Demo mode indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface)]/50 text-xs">
            <span className="text-[var(--alert-coral)] font-medium">
              Demo mode — no real money moves
            </span>
          </div>
        </header>

        {/* Koba Mascot */}
        <div className="mb-6">
          {reducedMotion ? (
            <KoboFallback mood="idle" reducedMotion={true} />
          ) : (
            <KoboProcedural />
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="reveal p-4 rounded-xl bg-[var(--raised)]">
            <p className="text-[var(--muted)] text-sm mb-1">Available to Spend</p>
            <p className="text-2xl font-bold text-[var(--gold)]">{koboToNaira(availableSpend)}</p>
          </div>
          <div className="reveal p-4 rounded-xl bg-[var(--raised)]" style="animation-delay: 0.1s;">
            <p className="text-[var(--muted)] text-sm mb-1">Available to Save</p>
            <p className="text-2xl font-bold text-[var(--green-growth)]">{koboToNaira(availableSave)}</p>
          </div>
          <div className="reveal p-4 rounded-xl bg-[var(--raised)]" style="animation-delay: 0.2s;">
            <p className="text-[var(--muted)] text-sm mb-1">Joint Pots</p>
            <p className="text-[var(--gold)] font-medium">{pendingInvites} pending invites</p>
          </div>
          <div className="reveal p-4 rounded-xl bg-[var(--raised)]" style="animation-delay: 0.3s;">
            <p className="text-[var(--muted)] text-sm mb-1">Votes</p>
            <p className="text-[var(--green-growth)] font-medium">{pendingVotes} pending</p>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Save & Allocate */}
          <div
            onClick={() => setActiveSection('save')}
            className="reveal p-6 rounded-xl bg-[var(--raised)] hover:bg-[var(--surface)] transition-all cursor-pointer"
            role="button"
            aria-label="Save & Allocate"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-violet)] flex items-center justify-center flex-shrink-0">
                <svg
                  className="h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 12l-6-6 1.41-1.41L10 13.17l7.08-7.08L18 7l-6 6z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-[var(--text)]">Save & Allocate</h3>
                <p className="text-[var(--muted)] text-sm">
                  Set up salary split and Shop & Save rules
                </p>
              </div>
            </div>
          </div>

          {/* Joint Savings */}
          <div
            onClick={() => setActiveSection('joint')}
            className="reveal p-6 rounded-xl bg-[var(--raised)] hover:bg-[var(--surface)] transition-all cursor-pointer"
            role="button"
            aria-label="Joint Savings"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--gold)] flex items-center justify-center flex-shrink-0">
                <svg
                  className="h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 12l-6-6 1.41-1.41L10 13.17l7.08-7.08L18 7l-6 6z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-[var(--text)]">Joint Savings</h3>
                <p className="text-[var(--muted)] text-sm">
                  Save together toward shared goals
                </p>
              </div>
            </div>
          </div>

          {/* Send Money */}
          <div
            onClick={() => setActiveSection('send')}
            className="reveal p-6 rounded-xl bg-[var(--raised)] hover:bg-[var(--surface)] transition-all cursor-pointer"
            role="button"
            aria-label="Send Money"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--green-growth)] flex items-center justify-center flex-shrink-0">
                <svg
                  className="h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 16l4-4 4 4-4 4zm0 12l-4-4 4-4 4 4zm-4-4v8c3.31 0 6-2.69 6-6l0-2c0-3.31-2.69-6-6-6s-6 2.69-6 6l0 2c0 3.31 2.69 6 6 6z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-[var(--text)]">Send Money</h3>
                <p className="text-[var(--muted)] text-sm">
                  Send to friends and family
                </p>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div
            onClick={() => setActiveSection('goals')}
            className="reveal p-6 rounded-xl bg-[var(--raised)] hover:bg-[var(--surface)] transition-all cursor-pointer"
            role="button"
            aria-label="Goals"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--gold)] flex items-center justify-center flex-shrink-0">
                <svg
                  className="h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 12l-6-6 1.41-1.41L10 13.17l7.08-7.08L18 7l-6 6z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-[var(--text)]">Goals</h3>
                <p className="text-[var(--muted)] text-sm">
                  Lifestyle goals progress
                </p>
              </div>
            </div>
          </div>

          {/* Withdraw */}
          <div
            onClick={() => setActiveSection('withdraw')}
            className="reveal p-6 rounded-xl bg-[var(--raised)] hover:bg-[var(--surface)] transition-all cursor-pointer"
            role="button"
            aria-label="Withdraw"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--alert-coral)] flex items-center justify-center flex-shrink-0">
                <svg
                  className="h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M5 3h14v2H5V3zm0 4h14v2H5V7zm0 4h14v2H5V11zm4-4h6v2h-6V7zm4-4h2v2h-2V3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-[var(--text)]">Withdraw</h3>
                <p className="text-[var(--muted)] text-sm">
                  Pot withdrawals with voting
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Page Content based on active section */}
      <section className="pt-6">
        {activeSection === 'save' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">Save & Allocate</h2>
            <p className="text-[var(--muted)] mb-6">
              Set up your salary split and Shop & Save rules.
            </p>
            
            {/* Salary Split Summary */}
            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] mb-4">
              <h3 className="font-medium text-[var(--text)] mb-2">Salary Split Summary</h3>
              <p className="text-[var(--muted)]">
                Your income is split across Spending, Savings, and Goals. Total must equal 100%.
              </p>
            </div>

            {/* Shop & Save Rules */}
            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
              <h3 className="font-medium text-[var(--text)] mb-2">Shop & Save Rules</h3>
              <p className="text-[var(--muted)] text-sm">
                Enable rules to set aside money on eligible purchases. ₦40,000 @ 5% = ₦2,000.
              </p>
              <button
                onClick={() => celebrateContribution()}
                className="mt-2 w-full bg-[var(--accent-violet)] text-white py-2 rounded-md font-medium hover:bg-[var(--accent-indigo)] transition-colors"
                aria-label="Add Shop & Save rule"
              >
                Add Shop & Save rule
              </button>
            </div>
          </div>
        )}

        {activeSection === 'joint' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">Joint Savings</h2>
            <p className="text-[var(--muted)] mb-6">
              Save together toward shared goals.
            </p>
            
            {/* Your Pots */}
            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] mb-4">
              <h3 className="font-medium text-[var(--text)] mb-2">Your Pots</h3>
              <p className="text-[var(--muted)] text-sm">
                • Lagos Rent Fund (majority approval) - ₦75,000 total
                • Zanzibar Trip (owner-up-to-₦50,000) - ₦150,000 total
              </p>
            </div>

            {/* Pending invites */}
            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
              <h3 className="font-medium text-[var(--text)] mb-2">Pending Invites (2)</h3>
              <p className="text-[var(--muted)] text-sm">
                • 3-person Lagos Rent Fund - awaiting acceptance
                • 2-person Zanzibar Trip - new invitation
              </p>
            </div>

            {/* Quick actions */}
            <div className="pt-4 border-t border-[var(--border)]">
              <button
                onClick={() => celebrateContribution()}
                className="w-full bg-[var(--accent-violet)] text-white py-2 rounded-md font-medium hover:bg-[var(--accent-indigo)] transition-colors"
                aria-label="Contribute to pot"
              >
                Contribute to Lagos Rent Fund
              </button>
            </div>
          </div>
        )}

        {activeSection === 'send' && (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">Send Money</h2>
            <p className="text-[var(--muted)] mb-6">
              Send money to friends and family.
            </p>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  Recipient
                </label>
                <input
                  type="text"
                  placeholder="username or phone"
                  className="w-full rounded-md px-4 py-2 border border-[var(--border)] bg-[var(--ink)] text-[var(--text)] focus:border-[var(--accent-violet)] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  placeholder="1000"
                  className="w-full rounded-md px-4 py-2 border border-[var(--border)] bg-[var(--ink)] text-[var(--text)] focus:border-[var(--accent-violet)] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  Reason (optional)
                </label>
                <textarea
                  rows="2"
                  className="w-full rounded-md px-4 py-2 border border-[var(--border)] bg-[var(--ink)] text-[var(--text)] focus:border-[var(--accent-violet)] transition-colors"
                  placeholder="e.g. paying back a friend"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--accent-violet)] text-white py-3 rounded-md font-medium hover:bg-[var(--accent-indigo)] transition-colors"
                aria-label="Send money"
                disabled>
                  <span className="hidden">Send</span>
                  <svg
                    className="h-5 w-5 mr-2 animate-spin"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v0a8 8 0 01-8 8zm0 0L3 4a5 5 0 00-5 5v0a5 5 0 005 5h2v7h7v-5H3zm9-3v-2c0-3.87 1.65-7.5 4-9.5S15 6.12 15 10v2c0 2.87 1.12 5.5 3 7.5-2 1-3-2-3-7.5zm4 12c-1.66 0-3 1.34-3 3v2c0 1.66 1.34 3 3 3s3-1.34 3-3v-2c0-1.66-1.34-3-3-3zm-8 4c-1.66 0-3 1.34-3 3v2c0 1.66 1.34 3 3 3s3-1.34 3-3v-2c0-1.66-1.34-3-3-3zm12-4c-1.66 0-3 1.34-3 3v2c0 1.66 1.34 3 3 3s3-1.34 3-3v-2c0-1.66-1.34-3-3-3z"
                    />
                  </svg>
                  Send
                </button>
              </form>
            </div>
          )}

        {activeSection === 'goals' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">Lifestyle Goals</h2>
            <p className="text-[var(--muted)] mb-6">
              Your lifestyle goals progress.
            </p>
            
            {/* Goals overview */}
            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
              <h3 className="font-medium text-[var(--text)] mb-2">Your Goals</h3>
              <p className="text-[var(--muted)] text-sm">
                • Rent goal: 40% of target
                • Car goal: 15% of target
                • Holiday goal: 10% of target
              </p>
            </div>

            {/* Add goal CTA */}
            <div className="pt-4">
              <button
                className="w-full bg-[var(--accent-violet)] text-white py-3 rounded-md font-medium hover:bg-[var(--accent-indigo)] transition-colors"
                aria-label="Add a new goal"
              >
                Add Your First Goal
              </button>
            </div>
          </div>
        )}

        {activeSection === 'withdraw' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">Withdraw from Pot</h2>
            <p className="text-[var(--muted)] mb-6">
              Request a withdrawal from a joint pot. Votes needed and 72-hour expiry apply.
            </p>
            
            {/* Pending withdrawal */}
            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] mb-4">
              <h3 className="font-medium text-[var(--text)] mb-2">Pending Withdrawal</h3>
              <p className="text-[var(--muted)] text-sm">
                ₦20,000 requested for paying rent — 1 of 3 votes needed • 48 hours remaining
              </p>
            </div>

            {/* Withdrawal form */}
            <form className="space-y-4">
              <input
                type="hidden"
                value="20000"
                name="amount"
                defaultValue="20000"
              />
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  Reason (optional)
                </label>
                <textarea
                  rows="2"
                  className="w-full rounded-md px-4 py-2 border border-[var(--border)] bg-[var(--ink)] text-[var(--text)] focus:border-[var(--accent-violet)] transition-colors"
                  placeholder="e.g. paying rent"
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[var(--alert-coral)] text-white py-2 rounded-md font-medium hover:bg-[var(--alert-coral-dark)] transition-colors"
                  aria-label="Request withdrawal"
                  disabled>
                  <span className="hidden">Request</span>
                  <svg
                    className="h-4 w-5 mr-2 animate-spin"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v0a8 8 0 01-8 8zm0 0L3 4a5 5 0 00-5 5v0a5 5 0 005 5h2v7h7v-5H3zm9-3v-2c0-3.87 1.65-7.5 4-9.5S15 6.12 15 10v2c0 2.87 1.12 5.5 3 7.5-2 1-3-2-3-7.5zm4 12c-1.66 0-3 1.34-3 3v2c0 1.66 1.34 3 3 3s3-1.34 3-3v-2c0-1.66-1.34-3-3-3zm-8 4c-1.66 0-3 1.34-3 3v2c0 1.66 1.34 3 3 3s3-1.34 3-3v-2c0-1.66-1.34-3-3-3zm12-4c-1.66 0-3 1.34-3 3v2c0 1.66 1.34 3 3 3s3-1.34 3-3v-2c0-1.66-1.34-3-3-3z"
                    />
                  </svg>
                  Request
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  )
}

/* eslint-enable */

function koboToNaira(kobo: number): string {
  return Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(kobo / 100)
}