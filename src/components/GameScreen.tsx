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

const statLabel: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 400,
  fontSize: '0.6rem',
  letterSpacing: '0.15em',
  color: '#4a4a70',
  textTransform: 'uppercase',
  marginTop: 2,
}

const statValue: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 700,
  fontSize: '1.1rem',
  color: '#e6e4f0',
  lineHeight: 1,
}

export default function GameScreen() {
  const { currentLevel, moves, time, screen, moveBlock, resetLevel, setScreen, tickTime, isAnimating, isFalling, isWinFalling } = useGameStore()
  const level = LEVELS[currentLevel]
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const bufferedMove = useRef<Direction | null>(null)
  const isBusyRef = useRef(false)
  isBusyRef.current = isAnimating || isFalling || isWinFalling

  useEffect(() => {
    if (!isAnimating && bufferedMove.current && screen === 'game') {
      const dir = bufferedMove.current
      bufferedMove.current = null
      moveBlock(dir)
    }
  }, [isAnimating, screen, moveBlock])

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
    if (!dir) return
    e.preventDefault()
    if (isBusyRef.current) {
      bufferedMove.current = dir
    } else {
      moveBlock(dir)
    }
  }, [screen, moveBlock])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  if (!level) return null

  return (
    <div className="fixed inset-0 flex flex-col screen-enter" style={{ background: '#0e0e14' }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px 10px',
        borderBottom: '1px solid #1a1a28',
        flexShrink: 0,
      }}>
        <button
          onClick={() => setScreen('levelSelect')}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            fontSize: '0.82rem',
            color: '#6b7cf8',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Exit
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '0.95rem',
            color: '#e6e4f0',
            letterSpacing: '0.04em',
          }}>
            {level.name}
          </div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 400,
            fontSize: '0.65rem',
            color: '#3a3a5e',
            letterSpacing: '0.1em',
          }}>
            Level {String(level.id).padStart(2, '0')}
          </div>
        </div>

        <button
          onClick={resetLevel}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            fontSize: '0.82rem',
            color: '#6b7cf8',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        padding: '10px 0',
        borderBottom: '1px solid #141420',
        flexShrink: 0,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={statValue}>{moves}</div>
          <div style={statLabel}>Moves</div>
        </div>
        <div style={{ width: 1, height: 28, background: '#1e1e30' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={statValue}>{formatTime(time)}</div>
          <div style={statLabel}>Time</div>
        </div>
        <div style={{ width: 1, height: 28, background: '#1e1e30' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ ...statValue, color: '#c9963a' }}>★ {level.optimalMoves}</div>
          <div style={statLabel}>Par</div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <GameBoard />
      </div>

      {/* D-Pad */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 28,
        paddingTop: 8,
      }}>
        <DPad onMove={(dir) => {
          if (isBusyRef.current) { bufferedMove.current = dir } else { moveBlock(dir) }
        }} />
      </div>
    </div>
  )
}
