'use client'

import { usePathname } from 'next/navigation'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'

const publicPaths = new Set(['/','/marketing','/login','/sign-up','/auth/login','/auth/sign-up','/onboarding','/dev/kobo'])

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/'
  const showNavigation = !publicPaths.has(pathname)

  return (
    <>
      {showNavigation && <div className="hidden lg:block"><Sidebar /></div>}
      <div className={showNavigation
        ? 'min-h-screen min-w-0 flex-1 pb-20 lg:ml-64 lg:pb-0'
        : 'min-h-screen min-w-0 flex-1'}
      >
        {children}
      </div>
      {showNavigation && <div className="lg:hidden"><BottomNav /></div>}
    </>
  )
}
