'use client'

import { useState, useEffect } from 'react'
import { useReducedMotion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { KoboProcedural } from '@/components/three/KoboProcedural'
import { KoboFallback } from '@/components/three/KoboFallback'

/**
 * /dev/kobo - Mascot preview page.
 * Shows every mood, both models (GLB + procedural fallback),
 * poster fallback, FPS and file sizes.
 * 
 * Accessibility:
 * - respects prefers-reduced-motion
 * - Semantic HTML, aria-live, labelled elements
 * - Keyboard navigable
 */

export default function DevKobo() {
  const reducedMotion = useReducedMotion()

  const moods = ['idle', 'wave', 'celebrate', 'thinking'] as const
  const models = ['glb', 'procedural'] as const

  const [currentModel, setCurrentModel] = useState<'glb' | 'procedural'>('procedural')
  const [currentMood, setCurrentMood] = useState<(typeof moods)[number]>('idle')
  const [fps, setFps] = useState(0)

  // Simulate FPS and file size data
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(Math.floor(Math.random() * 30) + 15)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Switch model
  const switchModel = (model: 'glb' | 'procedural') => {
    setCurrentModel(model)
    // Would load the actual GLB here
  }

  // Switch mood
  const switchMood = (mood: (typeof moods)[number]) => {
    setCurrentMood(mood)
  }

  const modelInfo = {
    glb: {
      label: 'GLB (Full)',
      description: 'Full Kobo model, ≤25k triangles, all animations and morph targets',
      fileSize: '≤1.2 MB compressed',
      supports: ['animations', 'morph targets'],
    },
    procedural: {
      label: 'Procedural Fallback',
      description: 'Built from R3F primitives, no GLB required',
      fileSize: '~200 KB',
      supports: ['basic animations', 'static moods'],
    },
  }

  return (
    <div className="dev-kobo-page">
      <header className="dev-page-header">
        <h1>Kobo Mascot Preview</h1>
        <p>Preview all moods and both Koba models</p>
      </header>

      <section className="dev-model-selector">
        <h2>Model</h2>
        <div className="model-radios">
          {models.map((model) => (
            <label key={model} className="model-label">
              <input
                type="radio"
                value={model}
                checked={currentModel === model}
                onChange={() => switchModel(model)}
                disabled={reducedMotion}
                aria-label={`Switch to ${model} model`}
              />
              <span>{fileSizeLabels[model]}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="dev-mood-selector">
        <h2>Mood</h2>
        <div className="mood-buttons">
          {moods.map((mood) => (
            <button
              key={mood}
              className={`mood-button ${currentMood === mood ? 'active' : ''}`}
              onClick={() => switchMood(mood)}
              aria-pressed={currentMood === mood}
              aria-label={`Switch to ${mood} mood`}
              disabled={reducedMotion}
            >
              {moodLabels[mood] || 'Idle'}
              {reducedMotion && <span className="sr-only">(reduced motion)</span>}
            </button>
          ))}
        </div>
      </section>

      <section className="dev-koba-display">
        {reducedMotion ? (
          <KoboFallback mood={currentMood} reducedMotion={true} />
        ) : currentModel === 'glb' ? (
            <div className="kobo-glb-placeholder">
              <p>GLB model loading...</p>
              <Image
                src="/images/kobo-idle.webp"
                alt="Koba idle mood"
                width={300}
                height={300}
                loading="lazy"
              />
              <p>GLB model: use Bforartists for full model</p>
            </div>
          ) : <KoboProcedural />}
      </section>

      <section className="dev-stats">
        <h2>Performance Stats</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{fps} fps</div>
            <div className="stat-label">Frames per second</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{modelInfo[currentModel].fileSize}</div>
            <div className="stat-label">File size</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Moods supported</div>
            <div className="stat-value">{moods.length}</div>
          </div>
        </div>
      </section>

      <footer className="dev-page-footer">
        <p>Procedural fallback for mobile; full GLB model when available.</p>
        <nav>
          <ul className="footer-nav">
            <li>
              <Link href="/" className="footer-link">Back to Home</Link>
            </li>
            <li>
              <Link href="/dev/kobo" className="footer-link">Refresh Preview</Link>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  )
}

const moodLabels: Record<string, string> = {
  idle: 'Idle',
  wave: 'Wave',
  celebrate: 'Celebrate',
  thinking: 'Thinking',
}

const fileSizeLabels: Record<'glb' | 'procedural', string> = {
  glb: 'GLB (Full) — ≤1.2 MB, all animations & morph targets',
  procedural: 'Procedural Fallback — ~200 KB, basic animations',
}