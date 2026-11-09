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

// Demo mode class is set by middleware based on cookie / Clerk keys
// The data-demo attribute is available for client-side use
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Note: demo session state is managed by middleware (src/middleware.ts)
  // data-demo attribute is set by the middleware for client access
  
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} h-full antialiased`
        // darkMode is controlled via class on html element by middleware
      }
      // data-demo will be set by middleware based on Clerk keys / cookie
    >
      <body className="min-h-full flex flex-col relative z-0">
        {children}
      </body>
    </html>
  )
}