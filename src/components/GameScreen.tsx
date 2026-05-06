import { useEffect, useRef, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'
import { LEVELS } from '../data/levels'
import GameBoard from './GameBoard'
import DPad from './DPad'
import type { Direction } from '../logic/blockLogic'

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function GameScreen() {
  const { currentLevel, moves, time, screen, moveBlock, resetLevel, setScreen, tickTime } = useGameStore()
  const level = LEVELS[currentLevel]
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (screen !== 'game') return
    timerRef.current = setInterval(tickTime, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [screen, tickTime])

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (screen !== 'game') return
    const map: Record<string, Direction> = {
      ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
      w: 'up', s: 'down', a: 'left', d: 'right',
    }
    const dir = map[e.key]
    if (dir) { e.preventDefault(); moveBlock(dir) }
  }, [screen, moveBlock])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  if (!level) return null

  return (
    <div className="fixed inset-0 flex flex-col screen-enter" style={{ background: '#060612' }}>
      {/* Header HUD */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-blue-900/40 flex-shrink-0">
        <button
          className="font-body text-xs text-blue-500 active:opacity-60 tracking-wider"
          onClick={() => setScreen('levelSelect')}
        >
          ← EXIT
        </button>
        <div className="flex flex-col items-center">
          <span className="font-display font-bold text-white text-sm tracking-wider">{level.name}</span>
          <span className="font-body text-xs text-blue-700 tracking-widest">
            LVL {String(level.id).padStart(2, '0')}
          </span>
        </div>
        <button
          className="font-body text-xs text-blue-500 active:opacity-60 tracking-wider"
          onClick={resetLevel}
        >
          RESET
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-center gap-8 py-2 border-b border-blue-900/20 flex-shrink-0">
        <div className="text-center">
          <div className="font-display text-lg font-bold text-white tabular-nums">{moves}</div>
          <div className="font-body text-xs text-blue-700 tracking-widest">MOVES</div>
        </div>
        <div className="w-px h-8 bg-blue-900/60" />
        <div className="text-center">
          <div className="font-display text-lg font-bold text-white tabular-nums">{formatTime(time)}</div>
          <div className="font-body text-xs text-blue-700 tracking-widest">TIME</div>
        </div>
        <div className="w-px h-8 bg-blue-900/60" />
        <div className="text-center">
          <div className="font-display text-lg font-bold text-yellow-500 tabular-nums">★{level.optimalMoves}</div>
          <div className="font-body text-xs text-blue-700 tracking-widest">BEST</div>
        </div>
      </div>

      {/* Canvas board — GameBoard handles its own sizing */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <GameBoard />
      </div>

      {/* D-Pad */}
      <div className="flex-shrink-0 flex items-center justify-center py-3 pb-5">
        <DPad onMove={moveBlock} />
      </div>
    </div>
  )
}
