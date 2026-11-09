import { Inter } from 'next/font/inter'
import { Sora } from 'next/font/google'

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  fallback: 'system-ui',
})

const sora = Sora({
  weight: ['400', '500', '600', '700'],
  display: ['swap'],
})

export { inter, sora }
export type { InterFont, SoraFont }
export default { inter, sora }