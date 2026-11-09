import { NextResponse, type NextRequest } from 'next/server'

const demoCookie = 'demo-mode'

export function proxy(request: NextRequest) {
  const response = NextResponse.next()
  const publicPaths = new Set(['/','/login','/sign-up','/auth/login','/auth/sign-up','/dev/kobo'])

  if (
    !publicPaths.has(request.nextUrl.pathname)
    && !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    && !request.cookies.has(demoCookie)
  ) {
    response.cookies.set(demoCookie, 'true', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
