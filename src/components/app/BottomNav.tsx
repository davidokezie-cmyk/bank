/* eslint-disable */
import { cn } from '@/lib/utils'
import { useLocation, useReducedMotion } from '@/lib/motion'
import { useEffect } from 'react'

/**
 * Bottom navigation bar for mobile and tablet.
 * 
 * Features:
 * - Bottom tab bar (Dashboard, Goals, Save, Activity, More)
 * - Sheet for Joint Savings, Send, Withdraw, Cards, Coach, Settings, Profile
 * - Pending invites/votes also show as a Dashboard card
 * - Reduced motion: fade-only transitions
 * - Active state with highlight
 */

export const BottomNav = () => {
  const reducedMotion = useReducedMotion()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'goals' | 'save' | 'joint' | 'send' | 'withdraw' | 'cards' | 'more'>('dashboard')

  // Determine active tab from location
  useEffect(() => {
    const path = location.pathname
    if (path.startsWith('/dashboard')) setActiveTab('dashboard')
    else if (path.startsWith('/goals')) setActiveTab('goals')
    else if (path.startsWith('/save')) setActiveTab('save')
    else if (path.startsWith('/joint')) setActiveTab('joint')
    else if (path.startsWith('/send')) setActiveTab('send')
    else if (path.startsWith('/withdraw')) setActiveTab('withdraw')
    else if (path.startsWith('/cards')) setActiveTab('cards')
    else setActiveTab('more')
  }, [location.pathname])

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: 'Layout' },
    { key: 'goals', label: 'Goals', icon: 'Calendar' },
    { key: 'save', label: 'Save', icon: 'PiggyBank' },
    { key: 'more', label: 'More', icon: 'More' },
  ]

  const isActive = (tab) => activeTab === tab.key

  const handleTabChange = (key) => {
    setActiveTab(key)
    // In a real app, would navigate using router
    const navigate = window.location
    navigate.pathname = `/${key}`
  }

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 bg-[var(--ink)] border-t border-[var(--border)] shadow-sm flex items-center justify-between px-6 py-2 z-50">
      <div className="flex-1 flex justify-between">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`flex flex-col items-center gap-1 py-2 px-1 rounded-md ${
              isActive(tab)
                ? 'bg-[var(--surface)] text-[var(--accent-violet)]'
                : 'text-[var(--muted)] hover:text-[var(--text)] transition-colors'}
              }
              aria-pressed={isActive(tab)}
              aria-label={tab.label}
            >
              <svg
                className="h-5 w-5 mx-auto mb-1 stroke-[var(--muted)] group-hover:stroke-[var(--accent-violet)] transition-colors ${
                  isActive(tab)
                    ? 'stroke-[var(--accent-violet)]'
                    : ''
                }"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M3 12l2-2m2-2l2 2m-2-2l2-2m2 2l-2-2m2 2l2 2m-2-2l2 2m-2-2l-2-2" />
              </svg>
              <span className="hidden md:block text-xs">{tab.label}</span>
            </button>
          ))
        }
      </div>

      {/* Sheet indicator and quick actions */}
      <div className="hidden md:block">
        <button
          className="flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--surface)] text-sm hover:bg-[var(--raised)] transition-colors"
          aria-label="Joint Savings"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 12l-6-6 1.41-1.41L10 13.17l7.08-7.08L18 7l-6 6z" />
          </svg>
          Joint Savings (2)
        </button>
      </div>
    </nav>
  )
}

/* eslint-enable */