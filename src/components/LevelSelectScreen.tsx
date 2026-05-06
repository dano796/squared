import { useGameStore } from '../store/gameStore'
import { LEVELS } from '../data/levels'

function StarDisplay({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map(i => (
        <span key={i} className="text-sm" style={{ color: i <= count ? '#fbbf24' : '#1e3a8a' }}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function LevelSelectScreen() {
  const setScreen = useGameStore(s => s.setScreen)
  const startLevel = useGameStore(s => s.startLevel)
  const levelStars = useGameStore(s => s.levelStars)
  const unlockedLevels = useGameStore(s => s.unlockedLevels)

  return (
    <div
      className="fixed inset-0 flex flex-col bg-navy screen-enter"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0d1a3a 0%, #0a0a1a 60%)' }}
    >
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* Header */}
      <div className="relative z-10 flex items-center px-4 pt-6 pb-4 border-b border-blue-900">
        <button
          className="font-body text-blue-400 text-xs mr-4 active:opacity-60"
          onClick={() => setScreen('home')}
        >
          ← BACK
        </button>
        <h2 className="font-display font-bold text-lg text-white tracking-widest flex-1 text-center neon-blue">
          SELECT LEVEL
        </h2>
        <div className="w-16" />
      </div>

      {/* Level grid */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {LEVELS.map((level, idx) => {
            const unlocked = unlockedLevels.includes(idx)
            const stars = levelStars[idx] ?? 0
            const completed = stars > 0

            return (
              <button
                key={level.id}
                disabled={!unlocked}
                onClick={() => unlocked && startLevel(idx)}
                className="relative rounded-sm border transition-all duration-150 active:scale-95 text-left p-4"
                style={{
                  background: unlocked
                    ? completed
                      ? 'linear-gradient(135deg, #1a2e1a 0%, #0d1a0d 100%)'
                      : 'linear-gradient(135deg, #0d1a33 0%, #0a0a1a 100%)'
                    : 'rgba(10,10,26,0.5)',
                  borderColor: unlocked
                    ? completed ? '#22c55e66' : '#3b82f666'
                    : '#1e3a8a33',
                  boxShadow: unlocked
                    ? completed
                      ? '0 0 15px rgba(34,197,94,0.15)'
                      : '0 0 15px rgba(59,130,246,0.15)'
                    : 'none',
                }}
              >
                {/* Level number */}
                <div
                  className="font-display font-black text-3xl mb-1"
                  style={{
                    color: unlocked ? '#fff' : '#1e3a8a',
                    textShadow: unlocked ? '0 0 10px rgba(59,130,246,0.5)' : 'none',
                  }}
                >
                  {String(level.id).padStart(2, '0')}
                </div>

                {/* Level name */}
                <div
                  className="font-body text-xs mb-2 truncate"
                  style={{ color: unlocked ? '#93c5fd' : '#1e3a8a' }}
                >
                  {level.name}
                </div>

                {/* Stars or lock */}
                {unlocked ? (
                  <StarDisplay count={stars} />
                ) : (
                  <div className="text-blue-900 text-lg">🔒</div>
                )}

                {/* Optimal moves badge */}
                {unlocked && (
                  <div className="absolute top-2 right-2 font-body text-xs text-blue-600">
                    ★{level.optimalMoves}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
