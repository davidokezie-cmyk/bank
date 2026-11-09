/**
 * Route protection middleware for Buy & Build.
 * 
 * - If no Clerk keys: sets demo-mode cookie, every protected route works offline
 * - If Clerk keys exist: clears demo cookie, lets Clerk handle auth
 * - Public routes: (marketing)/*, (auth)/* , /
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Clerk keys: optional. If not set, demo mode activates.
const CLERK_PUBLIC_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

// Demo cookie name
const DEMO_COOKIE = 'demo-mode'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // Skip middleware for api routes and static assets
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/images')) {
    return NextResponse.next()
  }

  // If no Clerk keys are configured, force demo mode with cookie
  if (!CLERK_PUBLIC_KEY) {
    const response = NextResponse.next()
    // Set demo cookie if not already set
    if (!request.cookies.get(DEMO_COOKIE)) {
      response.cookies.set(DEMO_COOKIE, 'true', {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
      })
    }
    return response
  }

  // Clerk keys exist - clear demo cookie, let Clerk handle auth
  const response = NextResponse.next()
  response.cookies.set(DEMO_COOKIE, 'false', {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  return response
}