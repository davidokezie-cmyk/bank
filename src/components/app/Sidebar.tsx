/* eslint-disable */
import { cn } from '@/lib/utils'
import { useEffect } from 'react'
import { useLocation, useNavigo } from '@navigo/navigo'
import { MotionConfig, useReducedMotion } from '@/lib/motion'

/**
 * Sidebar navigation component for the authenticated shell.
 * 
 * Features:
 * - Persistent left sidebar with icons + labels
 * - Animated active indicator via shared layoutId
 * - Profile + logout pinned at bottom
 * - Joint Savings has its own item with badge for pending invites/votes
 * - Reduced motion: fade-only transitions
 */

export const Sidebar = () => {
  const reducedMotion = useReducedMotion()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'goals' | 'save' | 'joint' | 'send' | 'withdraw' | 'activity' | 'cards' | 'coach' | 'settings' | 'profile'>('dashboard')
  const location = useLocation()

  // Determine active tab from location
  useEffect(() => {
    const path = location.pathname
    if (path.startsWith('/dashboard')) setActiveTab('dashboard')
    else if (path.startsWith('/goals')) setActiveTab('goals')
    else if (path.startsWith('/save')) setActiveTab('save')
    else if (path.startsWith('/joint')) setActiveTab('joint')
    else if (path.startsWith('/send')) setActiveTab('send')
    else if (path.startsWith('/withdraw')) setActiveTab('withdraw')
    else if (path.startsWith('/activity')) setActiveTab('activity')
    else if (path.startsWith('/cards')) setActiveTab('cards')
    else if (path.startsWith('/coach')) setActiveTab('coach')
    else if (path.startsWith('/settings')) setActiveTab('settings')
    else if (path.startsWith('/profile')) setActiveTab('profile')
    else setActiveTab('dashboard')
  }, [location.pathname])

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: 'Layout', exact: '/dashboard' },
    { key: 'goals', label: 'Goals', icon: 'Calendar', exact: '/goals' },
    { key: 'save', label: 'Save', icon: 'PiggyBank', exact: '/save' },
    { key: 'joint', label: 'Joint Savings', icon: 'Users', exact: '/joint', badge: 2 },
    { key: 'send', label: 'Send', icon: 'Send', exact: '/send' },
    { key: 'withdraw', label: 'Withdraw', icon: 'ArrowsCounterClockwise', exact: '/withdraw' },
    { key: 'activity', label: 'Activity', icon: 'History', exact: '/activity' },
    { key: 'cards', label: 'Cards', icon: 'CreditCard', exact: '/cards' },
    { key: 'coach', label: 'Coach', icon: 'LightBulb', exact: '/coach' },
    { key: 'settings', label: 'Settings', icon: 'Settings', exact: '/settings' },
    { key: 'profile', label: 'Profile', icon: 'User', exact: '/profile' },
  ]

  const isActive = (tab) => {
    if (tab.exact) {
      return activeTab === tab.key || location.pathname === tab.exact
    }
    return activeTab === tab.key
  }

  const badgeCount = (tab) => {
    if (tab.badge === 2) return 2 // pending invites/votes
    return 0
  }

  return (
    <nav className="sidebar fixed left-0 top-0 bottom-0 w-64 bg-[var(--ink)] border2 border-[var(--border)] shadow-2xl flex flex-col z-50">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--text)]">Buy & Build</h2>
        <button
          className="p-1 rounded-md hover:bg-[var(--surface)]/50 transition-colors"
          aria-label="Toggle navigation"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M3 12l2-2m2-2l2 2m-2-2l2-2m2 2l-2-2m2 2l2 2m-2-2l2 2m-2-2l-2-2" />
          </svg>
        </button>
      </div>

      <ul className="flex-1 space-y-1 px-2">
        {tabs.map((tab) => (
          <li
            key={tab.key}
            className={`group hover:bg-[var(--surface)]/50 transition-colors ${isActive(tab) && 'bg-[var(--surface)]'} accent-[var(--accent-violet)`}
            aria-current={isActive(tab) ? 'page' : 'false'}
          >
            <a
              href={`/${tab.key}`
            }
              className="flex flex-col items-center px-2 py-2 rounded-md text-[var(--muted)] text-sm group-hover:text-[var(--accent-violet)] transition-colors"
              aria-label={tab.label}
            >
              <svg
                className="h-5 w-5 mx-auto mb-1 stroke-[var(--muted)] group-hover:stroke-[var(--accent-violet)] transition-colors"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M3 12l2-2m2-2l2 2m-2-2l2-2m2 2l-2-2m2 2l2 2m-2-2l2 2m-2-2l-2-2" />
              </svg>
              <span className="hidden md:block text-xs">{tab.label}</span>
            </a>
            {badgeCount(tab) > 0 && (
              <span
                className="absolute -top-1 right-2 bg-[var(--alert-coral)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium"
              >
                {badgeCount(tab)}
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* Profile & Logout */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center text-[var(--muted)] font-medium">
            initials
          </div>
          <div>
            <p className="font-medium text-[var(--text)]">User Name</p>
            <p className="text-[var(--muted)] text-xs">member since 2024</p>
          </div>
        </div>

        <button
          className="w-full bg-transparent text-left text-[var(--muted)] text-sm hover:text-[var(--text)] transition-colors px-2 py-1 rounded-md"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

/* eslint-enable */