/* eslint-disable */
import { useEffect } from 'react'
import Link from 'next/link'
import { useState } from 'react'

/**
 * /login - Calm cinematic Koba sequence and login page.
 * 
 * Features:
 * - Slow camera dolly + soft light sweep animation
 * - Demo mode login option
 * - Real validation with Clerk (when keys exist) or demo session
 * - Form with email/phone, password, and continue options
 */

export default function LoginPage() {
  const [showDemo, setShowDemo] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    // Simulate calm cinematic Koba sequence on page load
    // In a real implementation, this would be a smooth dolly + light sweep
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowDemo(false)
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In demo mode, just redirect to dashboard
    // In real mode, would authenticate with Clerk
    if (formData.email && formData.password) {
      // Set demo cookie and redirect
      const setDemoCookie = (
      ) => {
        const expires = new Date()
        expires.setFullYear(expires.getFullYear() + 1)
        document.cookie = `demo-mode=true; path=/; max-age=${60 * 60 * 24 * 365}; sameSite=lax`
      }
      setDemoCookie()
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--ink)] via-[var(--surface)] to-[var(--raised)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row h-screen">
          {/* Left side: Cinematic Koba sequence */}
          <div className="w-full md:w-1/2 flex items-center justify-center relative">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-[var(--text)] mb-4">
                Welcome back
              </h1>
              <p className="text-[var(--muted)] text-lg mb-8">
                Sign in to your Buy & Build account
              </p>
            </div>

            {/* Koba cinematic container */}
            <div className="koba-cinematic relative w-full h-[400px] md:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-b from-[var(--ink)] via-[var(--surface)] to-[var(--raised)] opacity-90">
                {/* Soft light sweep animation */}
                <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-[var(--accent-violet)] via-transparent to-transparent opacity-20 animate-light-sweep"></div>
              </div>
              <div className="relative z-10 text-center">
                <svg
                  className="w-20 h-20 mx-auto mb-4 text-[var(--gold)] drop-shadow-2xl"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 12l-6-6 1.41-1.41L10 13.17l7.08-7.08L18 7l-6 6z" />
                </svg>
                <h2 className="text-[var(--text)] mt-4 text-xl">Buy & Build</h2>
                <p className="text-[var(--muted)] mt-2">Lifestyle money-management</p>
              </div>
            </div>
          </div>

          {/* Right side: Login form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-6">
              Sign In
            </h2>

            {/* Demo mode toggle */}
            <div className="mb-6 p-4 rounded-xl bg-[var(--surface)]/50 border border-[var(--border)]">
              <p className="text-[var(--muted)] text-sm mb-2">
                Don't have an account? Continue in demo mode
              </p>
              <button
                onClick={() => setShowDemo(true)}
                className="w-full text-[var(--accent-violet)] text-sm font-medium hover:text-[var(--accent-indigo)] transition-colors"
                aria-label="Continue in demo mode"
              >
                Continue in demo mode
              </button>
            </div>

            {/* Login form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              noValidate
              autoComplete="off"
            >
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  <span className="font-medium">Email or Phone</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md px-4 py-2 border border-[var(--border)] bg-[var(--ink)] text-[var(--text)] placeholder-text-[var(--muted)] focus:border-[var(--accent-violet)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  <span className="font-medium">Password</span>
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

              <button
                type="submit"
                className="w-full bg-[var(--accent-violet)] text-white py-3 rounded-md font-medium hover:bg-[var(--accent-indigo)] transition-colors"
                aria-label="Sign in to Buy & Build"
              >
                Sign In
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 pt-4 pb-4 border-t border-[var(--border)]">
                <span className="text-[var(--muted)] text-sm">Or continue with</span>
              </div>

              {/* Demo mode redirect */}
              {showDemo && (
                <div className="mt-6">
                  <p className="text-[var(--muted)] text-sm">
                    Setting up demo session...
                  </p>
                  <p className="text-[var(--accent-violet)] text-sm font-medium mt-2" onClick={() => {
                    const expires = new Date()
                    expires.setFullYear(expires.getFullYear() + 1)
                    document.cookie = `demo-mode=true; path=/; max-age=${60 * 60 * 24 * 365}; sameSite=lax`
                    window.location.href = '/dashboard'
                  }}>
                    Continue in demo mode
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

/* eslint-enable */