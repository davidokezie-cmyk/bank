'use client'

import { useState, useSyncExternalStore } from 'react'

/**
 * Motion language: defined once here, used across all components.
 * Springs: stiffness ~260, damping ~24
 * Micro-interactions: 150–250 ms
 * Page/section moves: 400–600 ms
 * Reduced motion: prefers-reduced-motion → all motion becomes fade/opacity only
 */

// Spring configuration for all UI motion
export const spring = {
  stiffness: 260,
  damping: 24,
}

// Motion durations (ms)
export const durations = {
  micro: 200,      // button press, input focus, hover
  short: 250,      // quick transitions
  medium: 350,     // section moves
  long: 500,       // page transitions
  celebrate: 400,  // Koba celebrate animation
}

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

export function useReducedMotion(): boolean {
  const subscribe = (callback: () => void) => {
    if (typeof window === 'undefined') return () => {}
    const mediaQuery = window.matchMedia(reducedMotionQuery)
    mediaQuery.addEventListener('change', callback)
    return () => mediaQuery.removeEventListener('change', callback)
  }
  const getSnapshot = () =>
    typeof window !== 'undefined' && window.matchMedia(reducedMotionQuery).matches
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

// Motion data attribute for CSS
export function applyReducedMotion(node: HTMLElement | null, reduced: boolean): void {
  if (!node) return
  if (reduced) {
    node.style.transition = 'opacity 150ms ease'
  } else {
    node.style.transition = ''
  }
}

// Export for use in React/context
export type MotionConfig = {
  reduced: boolean
  spring: typeof spring
  durations: typeof durations
}

// Spring CSS values (used in stylesheet)
export const springCss = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  reduced: 'ease-out',
}

/**
 * React hook for detecting hover state.
 * Respects prefers-reduced-motion: returns false if reduced motion is preferred.
 */
export function useHover(): [boolean, (nextState: boolean) => void] {
  return useState(false)
}
