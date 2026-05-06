import { useEffect, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { LEVELS } from '../data/levels'

function Star({ index, earned }: { index: number; earned: boolean }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200 + index * 250)
    return () => clearTimeout(t)
  }, [index])

  return (
    <span
      className="text-5xl"
      style={{
        display: 'inline-block',
        color: earned ? '#fbbf24' : '#1e3a8a',
        filter: earned ? 'drop-shadow(0 0 8px #f59e0b)' : 'none',
        animation: visible && earned ? 'star-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : undefined,
        opacity: visible ? 1 : 0,
        transform: visible ? undefined : 'scale(0)',
      }}
    >
      ★
    </span>
  )
}

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
}

export default function LevelCompleteScreen() {
  const { currentLevel, moves, time, levelStars, unlockedLevels, setScreen, startLevel } = useGameStore()
  const level = LEVELS[currentLevel]
  const stars = levelStars[currentLevel] ?? 0
  const hasNext = currentLevel + 1 < LEVELS.length

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-navy screen-enter"
      style={{ background: 'radial-gradient(ellipse at center, #0a1a0a 0%, #0a0a1a 70%)' }}
    >
      <div className="absolute inset-0 bg-grid opacity-10" />

      <div className="relative z-10 flex flex-col items-center gap-5 px-8 w-full max-w-sm">
        {/* Success header */}
        <div className="text-center">
          <div className="font-display font-black text-3xl text-green-400 tracking-widest mb-1"
            style={{ textShadow: '0 0 20px rgba(34,197,94,0.6)' }}>
            CLEARED!
          </div>
          <div className="font-body text-sm text-green-600 tracking-widest">
            {level?.name}
          </div>
        </div>

        {/* Stars */}
        <div className="flex gap-3 my-2">
          {[0, 1, 2].map(i => (
            <Star key={i} index={i} earned={i < stars} />
          ))}
        </div>

        {/* Stats */}
        <div className="w-full rounded-sm border border-green-900/50 p-4"
          style={{ background: 'rgba(5, 40, 5, 0.5)' }}>
          <div className="flex justify-between font-body text-sm mb-2">
            <span className="text-green-600">MOVES</span>
            <span className="text-white">{moves}</span>
          </div>
          <div className="flex justify-between font-body text-sm mb-2">
            <span className="text-green-600">TIME</span>
            <span className="text-white">{formatTime(time)}</span>
          </div>
          <div className="flex justify-between font-body text-sm border-t border-green-900/30 pt-2">
            <span className="text-green-600">OPTIMAL</span>
            <span className="text-yellow-400">★ {level?.optimalMoves}</span>
          </div>
        </div>

        {/* Buttons */}
        {hasNext && unlockedLevels.includes(currentLevel + 1) && (
          <button
            className="w-full py-4 font-display font-bold tracking-widest text-white rounded-sm border-2 border-green-600 active:scale-95 transition-transform"
            style={{
              background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
              boxShadow: '0 0 20px rgba(34,197,94,0.3), 0 4px 0 #052e16',
              letterSpacing: '0.2em',
            }}
            onClick={() => startLevel(currentLevel + 1)}
          >
            NEXT LEVEL →
          </button>
        )}

        <div className="flex gap-3 w-full">
          <button
            className="flex-1 py-3 font-display text-sm font-semibold tracking-widest text-blue-300 rounded-sm border border-blue-800 active:scale-95 transition-transform"
            style={{ background: 'rgba(30, 58, 138, 0.2)', letterSpacing: '0.2em' }}
            onClick={() => startLevel(currentLevel)}
          >
            RETRY
          </button>
          <button
            className="flex-1 py-3 font-display text-sm font-semibold tracking-widest text-blue-300 rounded-sm border border-blue-800 active:scale-95 transition-transform"
            style={{ background: 'rgba(30, 58, 138, 0.2)', letterSpacing: '0.15em' }}
            onClick={() => setScreen('levelSelect')}
          >
            LEVELS
          </button>
        </div>
      </div>
    </div>
  )
}
