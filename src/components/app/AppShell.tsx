'use client'

import { usePathname } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { initTheme } from '@/lib/theme'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'

const publicPaths = new Set([
  '/',
  '/marketing',
  '/login',
  '/sign-up',
  '/auth/login',
  '/auth/sign-up',
  '/onboarding',
  '/dev/kobo',
])

function ShellLayout({
  showNavigation,
  pathname,
  children,
}: {
  showNavigation: boolean
  pathname: string
  children: React.ReactNode
}) {
  return (
    <>
      {showNavigation && (
        <div className="hidden lg:block">
          <Sidebar pathname={pathname} />
        </div>
      )}
      <div
        className={
          showNavigation
            ? 'flex min-h-screen min-w-0 flex-1 flex-col pb-24 lg:ml-64 lg:pb-0'
            : 'flex min-h-screen min-w-0 flex-1 flex-col'
        }
      >
        <div key={pathname} className="flex flex-1 flex-col animate-fade-in">
          {children}
        </div>
      </div>
      {showNavigation && (
        <div className="lg:hidden">
          <BottomNav pathname={pathname} />
        </div>
      )}
    </>
  )
}

function ShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/'
  const showNavigation = !publicPaths.has(pathname)

  useEffect(() => {
    initTheme()
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return (
    <ShellLayout showNavigation={showNavigation} pathname={pathname}>
      {children}
    </ShellLayout>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <ShellLayout showNavigation={false} pathname="fallback">
          {children}
        </ShellLayout>
      }
    >
      <ShellContent>{children}</ShellContent>
    </Suspense>
  )
}
