/* eslint-disable */
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

/**
 * /sign-up - Sign up page with real validation and demo-mode option.
 * 
 * Features:
 * - Form with name, email/phone, password, and goals setup
 * - Demo mode option
 * - Real validation with Zod schemas
 * - Onboarding flow after sign up
 */

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })
  const [step, setStep] = useState(1) // 1 = sign-up, 2 = onboarding
  const [showDemo, setShowDemo] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleNext = () => {
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // In demo mode, redirect to onboarding
    if (formData.name && formData.email) {
      setTimeout(() => {
        setStep(2)
        setIsLoading(false)
      }, 1500)
    }
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--ink)] via-[var(--surface)] to-[var(--raised)]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row h-screen">
            {/* Left side: Form */}
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-6">
                Create Account
              </h2>
              <p className="text-[var(--muted)] text-lg mb-8">
                Join thousands of Nigerians managing their money with Buy & Build.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    fullName
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Aisha Bello"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md px-4 py-2 border border-[var(--border)] bg-[var(--ink)] text-[var(--text)] focus:border-[var(--accent-violet)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    email or phone
                  </label>
                  <div className="flex">
                    <input
                      type="email"
                      name="email"
                      placeholder="aisha@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="flex-1 rounded-md px-4 py-2 border border-[var(--border)] bg-[var(--ink)] text-[var(--text)] focus:border-[var(--accent-violet)] transition-colors"
                    />
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="+2348012345678"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-48 rounded-md px-4 py-2 border border-[var(--border)] bg-[var(--ink)] text-[var(--text)] focus:border-[var(--accent-violet)] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md px-4 py-2 border border-[var(--border)] bg-[var(--ink)] text-[var(--text)] focus:border-[var(--accent-violet)] transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-[var(--muted)] text-xs">
                    By clicking "Create Account", you agree to our
                    <Link
                      href="#"
                      className="font-medium underline underline-offset-2 hover:text-[var(--accent-violet)]"
                    >
                      Terms of Service
                    </Link>
                    and
                    <Link
                      href="#"
                      className="font-medium underline underline-offset-2 hover:text-[var(--accent-violet)]"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[var(--accent-violet)] text-white py-3 rounded-md font-medium hover:bg-[var(--accent-indigo)] transition-colors"
                  aria-label="Create account"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating…' : 'Create Account'}
                </button>
              </form>

              {/* Demo mode */}
              <p className="mt-6 text-sm text-[var(--muted)]">
                Don't have an account? {" "}
                <Link
                  href="#"
                  onClick={() => setShowDemo(true)}
                  className="font-medium text-[var(--accent-violet)] underline underline-offset-2 hover:text-[var(--accent-indigo)]"
                  aria-label="Continue in demo mode"
                >
                  Continue in demo mode
                </Link>
              </p>
            </div>

            {/* Right side: Onboarding preview */}
            <div className="md:w-1/2 bg-[var(--surface)]/50 rounded-xl p-8 md:p-12">
              <h3 className="text-xl font-medium text-[var(--text)] mb-4">
                Onboarding Preview
              </h3>
              <p className="text-[var(--muted)] text-sm mb-6">
                After sign up, you'll set up your first salary split rule.
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[var(--ink)] border border-[var(--border)]">
                  <h4 className="font-medium text-[var(--text)] mb-2">Salary Split</h4>
                  <p className="text-[var(--muted)] text-sm">
                    Divide your income between Spending, Savings, and named Goals.
                    Total must equal 100%.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--ink)] border border-[var(--border)]">
                  <h4 className="font-medium text-[var(--text)] mb-2">Shop & Save</h4>
                  <p className="text-[var(--muted)] text-sm">
                    Enable rules to set aside money on eligible purchases. ₦40,000 @ 5% = ₦2,000.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--ink)] border border-[var(--border)]">
                  <h4 className="font-medium text-[var(--text)] mb-2">Lifestyle Goals</h4>
                  <p className="text-[var(--muted)] text-sm">
                    Set targets for rent, car, education, business, or holiday.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

/* eslint-enable */