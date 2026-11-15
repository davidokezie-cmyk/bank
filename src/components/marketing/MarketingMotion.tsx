'use client'

import { gsap } from 'gsap'
import { useLayoutEffect, useRef } from 'react'

/**
 * Homepage motion choreography only; the rest of the app uses CSS
 * transitions and the shared motion tokens.
 *
 * Hero elements animate once on load with GSAP. `[data-reveal]` sections use a
 * staggered load-time CSS transition so content is never scroll-gated and is
 * fully visible if JavaScript or GSAP never runs. Everything is skipped when
 * the visitor prefers reduced motion.
 */
export function MarketingMotion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return

    const root = scope.current
    if (!root) return

    const ctx = gsap.context(() => {
      gsap.from('[data-hero]', {
        y: 28,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      })
    }, scope)

    const revealables = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    revealables.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index * 70, 350)}ms`
      element.classList.add('reveal-pending')
    })

    const frame = window.requestAnimationFrame(() => {
      revealables.forEach((element) => element.classList.add('is-revealed'))
    })

    return () => {
      window.cancelAnimationFrame(frame)
      revealables.forEach((element) => {
        element.style.transitionDelay = ''
      })
      ctx.revert()
    }
  }, [])

  return <div ref={scope}>{children}</div>
}
