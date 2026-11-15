'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { KoboFallback } from './KoboFallback'

export type KoboMood = 'idle' | 'wave' | 'celebrate' | 'thinking'

export interface KoboProps {
  /** Which looping mood clip to play */
  mood?: KoboMood
  /** 0..1 — how many of the twelve goal blocks are revealed */
  progress?: number
  /** Optional per-member tint for blocks (joint pots), up to 12 hex colours */
  memberColors?: string[]
  /** Freeze the mascot on a static frame and show no idle motion */
  reducedMotion?: boolean
  /** Render at reduced quality (used for the lite model on small screens) */
  className?: string
}

const FULL_MODEL = '/models/kobo.glb'
const LITE_MODEL = '/models/kobo-lite.glb'

useGLTF.preload(FULL_MODEL)
useGLTF.preload(LITE_MODEL)

const clipFor: Record<KoboMood, string> = {
  idle: 'Idle',
  wave: 'Wave',
  celebrate: 'Celebrate',
  thinking: 'Think',
}

function KoboModel({
  mood,
  progress,
  memberColors,
  reducedMotion,
  url,
}: Omit<KoboProps, 'className'> & { url: string }) {
  const group = useRef<THREE.Group>(null)
  const blinkTimer = useRef(2.5)
  const blinkPhase = useRef(0)

  const gltf = useGLTF(url)
  const { actions } = useAnimations(gltf.animations, group)

  const { bodyMesh, blocks } = useMemo(() => {
    const body: { mesh?: THREE.Mesh } = {}
    const blockMap = new Map<string, THREE.Mesh>()
    gltf.scene.traverse((node) => {
      if (node.name === 'Body' && node instanceof THREE.Mesh) body.mesh = node
      if (/^Block_\d\d$/.test(node.name) && node instanceof THREE.Mesh) {
        blockMap.set(node.name, node)
      }
    })
    const ordered = [...blockMap.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, mesh]) => mesh)
    return { bodyMesh: body.mesh, blocks: ordered }
  }, [gltf.scene])

  // Mutable handles for the imperative three.js layer (refs, not memo state)
  const rig = useRef<{
    blocks: THREE.Mesh[]
    bodyMesh?: THREE.Mesh
    head?: THREE.Object3D
    actions: Record<string, THREE.AnimationAction | null>
  }>({ blocks: [], actions: {} })

  useEffect(() => {
    rig.current = {
      blocks,
      bodyMesh,
      head: gltf.scene.getObjectByName('Head') ?? undefined,
      actions: actions as unknown as Record<string, THREE.AnimationAction | null>,
    }
  }, [blocks, bodyMesh, actions, gltf.scene])

  // Block visibility follows progress: Block_01..12 light up as the pot fills
  useEffect(() => {
    const visible = Math.max(0, Math.min(12, Math.round((progress ?? 0) * 12)))
    rig.current.blocks.forEach((mesh, index) => {
      mesh.visible = index < visible
    })
  }, [progress])

  // Member colours tint blocks left-to-right
  useEffect(() => {
    if (!memberColors || memberColors.length === 0) return
    rig.current.blocks.forEach((mesh, index) => {
      const colour = memberColors[index % memberColors.length]
      const material = mesh.material
      if (material && 'color' in material && material.color instanceof THREE.Color) {
        ;(material as THREE.MeshStandardMaterial).color.set(colour)
      }
    })
  }, [memberColors])

  // Entrance on mount (HopIn), then crossfade to the mood clip
  const prevMood = useRef<KoboMood | null>(null)
  useEffect(() => {
    const current = mood ?? 'idle'
    const { actions: clipActions } = rig.current
    const target = clipFor[current]
    const action = clipActions[target]

    if (prevMood.current === null) {
      const hop = clipActions['HopIn']
      if (hop) {
        hop.reset().setLoop(THREE.LoopOnce, 1)
        hop.clampWhenFinished = true
        hop.fadeIn(0.2).play()
      }
      const timeout = window.setTimeout(() => {
        clipActions[target]?.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.3).play()
      }, 1100)
      prevMood.current = current
      return () => window.clearTimeout(timeout)
    }

    if (prevMood.current === current) return
    const previous = clipActions[clipFor[prevMood.current]]
    previous?.fadeOut(0.25)
    action?.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.25).play()
    prevMood.current = current
  }, [mood, actions])

  // Gentle pointer follow for the head, plus an occasional blink
  useFrame((state, delta) => {
    if (reducedMotion) return
    const { head, bodyMesh: face } = rig.current
    if (head) {
      const targetY = state.pointer.x * 0.18
      const targetX = -state.pointer.y * 0.12
      head.rotation.y = THREE.MathUtils.damp(head.rotation.y, targetY, 4, delta)
      head.rotation.x = THREE.MathUtils.damp(head.rotation.x, targetX, 4, delta)
    }

    if (!face?.morphTargetDictionary) return
    const blinkIndex = face.morphTargetDictionary['blink']
    if (blinkIndex === undefined) return
    blinkTimer.current -= delta
    if (blinkPhase.current > 0) {
      blinkPhase.current -= delta
      const phase = blinkPhase.current / 0.18
      face.morphTargetInfluences![blinkIndex] = Math.sin(phase * Math.PI)
      if (blinkPhase.current <= 0) face.morphTargetInfluences![blinkIndex] = 0
    } else if (blinkTimer.current <= 0) {
      blinkTimer.current = 2.5 + Math.random() * 2.5
      blinkPhase.current = 0.18
    }
  })

  return (
    <group position={[-0.32, -0.08, 0]}>
      <primitive ref={group} object={gltf.scene} />
    </group>
  )
}

/**
 * Kobo, the Buy & Build mascot. An animated 3D gold coin rendered with
 * React Three Fiber. Falls back to the flat procedural poster when WebGL
 * is unavailable, the GLB fails to load, or the user prefers reduced motion.
 */
export function Kobo({
  mood = 'idle',
  progress = 0,
  memberColors,
  reducedMotion = false,
  className,
}: KoboProps) {
  const [isSmallScreen] = React.useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches,
  )
  const modelUrl = isSmallScreen ? LITE_MODEL : FULL_MODEL

  if (reducedMotion) {
    return <KoboFallback reducedMotion mood={mood} />
  }

  return (
    <KoboErrorBoundary fallback={<KoboFallback mood={mood} />}>
      <div className={className} style={{ minHeight: 0 }}>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [1.45, 1.1, 2.15], fov: 30 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%' }}
        >
          <hemisphereLight args={['#e8ecf3', '#101623', 1.15]} />
          <directionalLight position={[4, 6, 3]} intensity={1.6} color="#f2c06b" />
          <directionalLight position={[0, 2.5, 5]} intensity={1.1} color="#fff4d6" />
          <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#e8ecf3" />
          <React.Suspense fallback={null}>
            <KoboModel
              mood={mood}
              progress={progress}
              memberColors={memberColors}
              reducedMotion={false}
              url={modelUrl}
            />
          </React.Suspense>
        </Canvas>
      </div>
    </KoboErrorBoundary>
  )
}

class KoboErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    return this.state.hasError ? <>{this.props.fallback}</> : <>{this.props.children}</>
  }
}
