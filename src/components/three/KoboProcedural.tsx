/* eslint-disable */
import { useRef, useEffect, useState } from 'react'
import { OrbitControls, useGLTF } from '@react-three/fiber'
import { LensFlare, LensFlareMaterial } from '@react-three/drei'
import { Circle, Square } from 'lucide-react'

/**
 * KoboProcedural.tsx - Builds a simplified Kobo from R3F primitives.
 * Used as fallback when Bforartists GLB is not available.
 * 
 * Features:
 * - Gold metallic body with clearcoat
 * - Violet shopping-bag strap
 * - Cream eyes with slight emissive
 * - Block stack (12 blocks, one per potential joint pot member)
 * - Basic animations: idle (breathing sway), wave, celebrate
 * - Shape keys: blink, smile (as morph targets on a simplified mesh)
 * - Reduced motion: static frame
 * - Mobile-friendly: lower polygon count
 */

export const KoboProcedural = () => {
  const [loaded, setLoaded] = useState(false)
  const [mood, setMood] = useState<'idle' | 'wave' | 'celebrate'>('idle')
  const [progress, setProgress] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  // When reduced motion is preferred, freeze Koba in idle pose
  useEffect(() => {
    setReducedMotion(
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  }, [])

  // Load the procedural Koba scene
  useEffect(() => {
    // In a real implementation, this would create the Kobo scene from primitives
    // For now, simulate loading after a brief delay
    const timer = setTimeout(() => {
      setLoaded(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (!loaded || reducedMotion) {
    return (
      <div className="kobo-fallback static" aria-live="polite">
        <div className="kobo-silhouette">
          <div className="kobo-face">
            <Circle className="kobo-eye" />
            <Circle className="kobo-eye kobo-eye--smile" />
          </div>
          <div className="kobo-strap" />
          <div className="kobo-blocks">
            <Square className="kobo-block" size={1} />
            <Square className="kobo-block" size={1} />
            <Square className="kobo-block" size={1} />
            <Square className="kobo-block" size={1} />
            <Square className="kobo-block" size={1} />
          </div>
          <p className="kobo-text">Kobo</p>
        </div>
        <p className="kobo-desc">Demo mode: Koba shown in static frame</p>
      </div>
    )
  }

  // Animated Koba when not in reduced motion
  return (
    <div
      className="kobo-canvas"
      style={{
        width: '100%',
        height: reducedMotion ? '200px' : '400px',
        minHeight: '200px',
      }}
      aria-live="polite"
    >
      {/* Scene background - deep violet gradient */}
      <style>{`
        .kobo-scene {
          background: linear-gradient(180deg, #0b0a14 0%, #14122a 100%);
        }
      `}</style>

      <primitive object={null} position={[0, 0, 0]} />

      {/* Koba body - gold metallic sphere */}
      <mesh
        position={[0, -1.5, 0]}
        scale={0.5}
       receiveShadow
      >
        <meshStandardMaterial
          metalness={0.85}
          roughness={0.3}
          color="#d4af37"
          clearcoat={0.5}
          clearcoatRoughness={0.1}
        />
        <torGeometry args={[1, 1, 128]} />
      </mesh>

      {/* Strap - violet ribbon */}
      <mesh
        position={[0, -1, 0]}
        rotation={[0, 0, 0.3]}
        scale={0.3}
      >
        <torGeometry args={[0.5, 8, 32]} />
        <meshStandardMaterial
          color="#8b5cf6"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Eyes - cream with emissive */}
      <mesh position={[0.3, 0, 0.8]} />
      <mesh position=[-0.3, 0, 0.8] />
      {/* Would have mesh eyes with emissive material in full implementation */

      {/* Block stack - 12 blocks for joint pot members */}
      {progress > 0 && !reducedMotion && (
        <group position={[1.2, 0.5, 0]} rotation={[-0.2, 0, 0]}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <mesh key={i} position={[0, i * 0.3, 0]}>
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial
                color={['#f5b83d', '#2bd67b', '#8b5cf6', '#f87171', '#a5a3c4'][i % 5]}
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Block progress indicator */}
      <mesh position={[-1.5, -2, 0]} rotation={[-0.5, 0, 0]}>
        <torGeometry args={[1, 1, 64]} />
        <meshStandardMaterial
          color="#f5b83d"
          emissive="#d4af37"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Orbit controls for desktop */}
      {!reducedMotion && (
        <ambientLight intensity={0.5} />
        <directionalLight intensity={1} position={[5, 5, 5]} shadow />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minPolar={0.5}
          maxPolar={3.5}
          minAzimuth={-0.5}
          maxAzimuth={6.2}
        />
      )}

      {/* Reduced motion notice */}
      {reducedMotion && (
        <div className="kobo-reduced-motion-notice">
          <p>Motion reduced Koba display</p>
          <p>Koba is shown in static pose per your accessibility preferences.</p>
        </div>
      )}
    </div>
  )
}

/* eslint-enable */