import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const base = 'http://localhost:3000'
const routes = [
  '/', '/marketing', '/login', '/sign-up', '/auth/login', '/auth/sign-up',
  '/onboarding', '/dashboard', '/goals', '/save', '/joint', '/joint/new',
  '/joint/lagos-rent', '/invites', '/send', '/withdraw', '/activity',
  '/cards', '/coach', '/settings', '/profile', '/how-money-is-handled', '/dev/kobo',
  '/nonexistent-route',
]

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

mkdirSync('audit', { recursive: true })

const browser = await chromium.launch()
const failures = []
const consoleIssues = []

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 2,
    isMobile: viewport.name === 'mobile',
    hasTouch: viewport.name === 'mobile',
  })

  for (const theme of ['dark', 'light']) {
    const page = await context.newPage()
    await page.addInitScript((t) => {
      try { window.localStorage.setItem('buy-build:theme', t) } catch {}
    }, theme)

    for (const route of routes) {
      const label = route === '/' ? 'home' : route.slice(1).replaceAll('/', '_')
      const file = join('audit', `${viewport.name}-${theme}-${label}.png`)
      const problems = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') problems.push(`console.error: ${msg.text().slice(0, 240)}`)
        if (msg.type() === 'warning') problems.push(`console.warn: ${msg.text().slice(0, 240)}`)
      })
      page.on('pageerror', (err) => problems.push(`pageerror: ${String(err).slice(0, 240)}`))
      try {
        const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 60_000 })
        await page.waitForTimeout(600)
        const status = response?.status()
        if (status !== 200 && route !== '/nonexistent-route') {
          failures.push(`${viewport.name} ${theme} ${route} -> HTTP ${status}`)
        }
        if (route === '/nonexistent-route' && status !== 404) {
          failures.push(`${viewport.name} ${theme} /nonexistent-route -> HTTP ${status} (expected 404)`)
        }
        // crude overflow check: document wider than viewport
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
        if (overflow > 2) problems.push(`horizontal overflow: ${overflow}px`)
        await page.screenshot({ path: file, fullPage: viewport.name === 'desktop' })
      } catch (err) {
        failures.push(`${viewport.name} ${theme} ${route} -> ${String(err).slice(0, 200)}`)
      }
      if (problems.length) consoleIssues.push({ route: `${viewport.name}/${theme}${route}`, problems })
      page.removeAllListeners('console')
      page.removeAllListeners('pageerror')
    }
    await page.close()
  }
  await context.close()
}

await browser.close()

console.log('FAILURES (' + failures.length + ')')
for (const f of failures) console.log(' -', f)
console.log('CONSOLE ISSUES (' + consoleIssues.length + ')')
for (const item of consoleIssues) {
  console.log(' ', item.route)
  for (const p of [...new Set(item.problems)]) console.log('    ', p)
}
