import type { Metadata } from "next"
import { inter, sora } from "../font"
import { AppShell } from "@/components/app/AppShell"
import "./globals.css"

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
      className={`${sora.variable} ${inter.variable} h-full antialiased`}
      data-theme="light"
    >
      <body className="min-h-full flex flex-col relative z-0 bg-[var(--ink)] text-[var(--text)]">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  )
}