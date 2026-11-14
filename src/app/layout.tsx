import type { Metadata, Viewport } from 'next'
import { AppShell } from '@/components/app/AppShell'
import { inter, sora } from '../font'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Buy & Build — Buy What You Love. Build Wealth As You Live.',
    template: '%s · Buy & Build',
  },
  description:
    'A lifestyle money-management app for Nigeria: salary splits, Shop & Save, lifestyle goals, joint savings, and partner-powered investing. Demo mode — no real money moves.',
  applicationName: 'Buy & Build',
  keywords: ['Nigeria', 'savings', 'goals', 'joint savings', 'personal finance', 'fintech'],
  openGraph: {
    title: 'Buy & Build',
    description: 'Buy What You Love. Build Wealth As You Live.',
    type: 'website',
    locale: 'en_NG',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0B0A14' },
    { media: '(prefers-color-scheme: light)', color: '#F7F5FB' },
  ],
  width: 'device-width',
  initialScale: 1,
}

const themeScript = `(function(){try{var t=localStorage.getItem('buy-build:theme');var l=t==='light';var r=document.documentElement;r.classList.toggle('light',l);r.classList.toggle('dark',!l);r.dataset.theme=l?'light':'dark';r.style.colorScheme=l?'light':'dark';}catch(e){}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} dark h-full antialiased`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="relative z-0 flex min-h-full flex-col bg-[var(--ink)] font-ui text-[var(--text)]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--gold)] focus:px-4 focus:py-2 focus:font-semibold focus:text-[#0B0A14]"
        >
          Skip to content
        </a>
        <AppShell>
          <main id="main-content" className="flex flex-1 flex-col">
            {children}
          </main>
        </AppShell>
      </body>
    </html>
  )
}
