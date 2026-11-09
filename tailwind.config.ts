import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // or 'selector', based on preference
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        ink: 'var(--ink)',
        surface: 'var(--surface)',
        raised: 'var(--raised)',
        'border': 'var(--border)',
        inkLight: 'var(--ink-light)',
        surfaceLight: 'var(--surface-light)',
        raisedLight: 'var(--raised-light)',
        'border-light': 'var(--border-light)',
        accent: 'var(--accent-violet)',
        indigo: 'var(--accent-indigo)',
        gold: 'var(--gold)',
        'green-growth': 'var(--green-growth)',
        'alert-coral': 'var(--alert-coral)',
        'alert-coral-light': 'var(--alert-coral-light)',
        goldLight: 'var(--gold-light)',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config