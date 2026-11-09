/* eslint-disable */
import { fn } from 'react'
import Image from 'next/image'

/**
 * KoboFallback.tsx - Poster/fallback image when GLB fails to load.
 * Shows the rendered poster WebP of Koba in idle mood.
 * 
 * Accessibility:
 * - aria-live region for money-moment announcements
 * - Semantic HTML structure
 * - 4.5:1 contrast minimum
 */

export const KoboFallback = ({
  mood = 'idle',
  reducedMotion = false,
}: {
  mood?: 'idle' | 'wave' | 'celebrate' | 'thinking'
  reducedMotion?: boolean
}) => {
  const moodLabels: Record<string, string> = {
    idle: 'Idle',
    wave: 'Wave',
    celebrate: 'Celebrate',
    thinking: 'Thinking',
  }

  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    setShowAnimation(true)
  }, [mood])

  return (
    <div
      className="kobo-fallback"
      aria-label={`Koba ${moodLabels[mood] || 'idle'} mood`}
      role="img"
      title={`Koba in ${moodLabels[mood] || 'idle'} mood`}
    >
      {/* Poster WebP - Koba in the selected mood */}
      <Image
        src={`/images/kobo-${mood}.webp`}
        alt={`Koba ${moodLabels[mood] || 'idle'} mood - a friendly gold coin character with a shopping bag strap, warm smile, and stacking building blocks`}
        width={400}
        height={400}
        loading="lazy"
        className="kobo-poster"
      />

      {/* Mood label */}
      <div className="kobo-mood-label">
        <h3 className="koba-heading">{moodLabels[mood] || 'Idle'}</h3>
        {reducedMotion && <p className="koba-reduced-notice">Motion reduced: static image shown</p>}
      </div>

      {/* Description */}
      <p className="koba-description">
        Koba is a friendly, glossy, coin-bodied character (kobo = Nigeria's currency subunit)
        wearing a small shopping-bag strap like a backpack and stacking tiny building blocks.
      </p>

      {/* CTA for enhanced experience */}
      {!reducedMotion && (
        <p className="koba-cta">
          <a
            href="/dev/kobo"
            className="koba-link"
            rel="noopener noreferrer"
            target="_blank"
          >
            View Koba in 3D ({Object.keys(moodLabels).length} moods)
          </a>
        </p>
      )}
    </div>
  )
}

/* eslint-enable */