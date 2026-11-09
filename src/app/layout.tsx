/* eslint-disable */
import type { Metadata } from "next"
import { inter, sora } from 'next/font/google'
import "./globals.css"

// Sora: display face, Inter: UI body text
const sora = sora({
  weight: ['400', '500', '600', '700'],
  display: ['swap'],
})

const inter = inter({
  weight: ['400', '500', '600', '700'],
  fallback: 'system-ui',
})

export const metadata: Metadata = {
  title: 'Buy & Build',
  description: 'Buy What You Love. Build Wealth As You Live.',
}

// Demo mode class is set by middleware based on Clerk keys / cookie
// The data-demo attribute is available for client-side use

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} h-full antialiased data-theme="light"`
        // Theme (light/dark) controlled by meta attribute by middleware
      }
      data-theme="light"
    >
      <body className="min-h-full flex flex-col relative z-0">
        {/* Sidebar - visible on desktop (above 1024px) */}
        <sidebar-mobile />

        {/* Main content */}
        <main className="flex-1 ml-64 min-h-screen">
          {children}
        </main>

        {/* Bottom navigation - visible on mobile (below 1024px) */}
        <bottom-nav-mobile />
      </body>
    </html>
  )
}

/* eslint-enable */

// Mobile sidebar component - shown on screens below 1024px
function sidebarMobile() {
  // This would be rendered conditionally based on screen size
  // using CSS or a component that toggles visibility
  return null
}

// Mobile bottom nav component - shown on screens below 1024px
function bottomNavMobile() {
  // This would be rendered conditionally based on screen size
  return null
}