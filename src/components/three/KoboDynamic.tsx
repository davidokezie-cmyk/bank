'use client'

import dynamic from 'next/dynamic'
import { useReducedMotion } from '@/lib/motion'
import { KoboFallback } from './KoboFallback'
import type { KoboProps } from './Kobo'

const Kobo = dynamic(() => import('./Kobo').then((module) => module.Kobo), {
  ssr: false,
  loading: () => <KoboFallback />,
})

/**
 * Client-side, SSR-free entry point for the 3D Kobo mascot.
 * Renders the animated GLB when WebGL works, the procedural poster otherwise.
 */
export function KoboDynamic(props: KoboProps) {
  const reducedMotion = useReducedMotion()
  return <Kobo {...props} reducedMotion={props.reducedMotion ?? reducedMotion} />
}
