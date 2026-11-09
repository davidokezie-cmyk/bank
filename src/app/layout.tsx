import type { Metadata } from 'next'
import { AppShell } from '@/components/app/AppShell'
import { inter, sora } from '../font'
import './globals.css'

export const metadata: Metadata = {
  title: 'Buy & Build',
  description: 'Buy What You Love. Build Wealth As You Live.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} dark h-full antialiased`}
      data-theme="dark"
    >
      <body className="relative z-0 flex min-h-full flex-col bg-[var(--ink)] text-[var(--text)]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
