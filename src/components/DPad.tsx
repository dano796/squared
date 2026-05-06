import { useState } from 'react'
import type { Direction } from '../logic/blockLogic'

interface Props {
  onMove: (dir: Direction) => void
}

const DIRS: { dir: Direction; label: string; gridArea: string }[] = [
  { dir: 'up',    label: '▲', gridArea: '1 / 2' },
  { dir: 'left',  label: '◀', gridArea: '2 / 1' },
  { dir: 'right', label: '▶', gridArea: '2 / 3' },
  { dir: 'down',  label: '▼', gridArea: '3 / 2' },
]

export default function DPad({ onMove }: Props) {
  const [pressed, setPressed] = useState<Direction | null>(null)

  const handlePress = (dir: Direction) => {
    setPressed(dir)
    onMove(dir)
  }

  const handleRelease = () => setPressed(null)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 64px)',
        gridTemplateRows: 'repeat(3, 64px)',
        gap: 4,
      }}
    >
      {DIRS.map(({ dir, label, gridArea }) => (
        <button
          key={dir}
          className={`dpad-btn text-white text-xl ${pressed === dir ? 'pressed' : ''}`}
          style={{ gridArea }}
          onPointerDown={(e) => { e.preventDefault(); handlePress(dir) }}
          onPointerUp={handleRelease}
          onPointerLeave={handleRelease}
        >
          {label}
        </button>
      ))}

      {/* Center dot */}
      <div
        className="rounded-sm"
        style={{
          gridArea: '2 / 2',
          background: 'rgba(30, 58, 138, 0.4)',
          border: '1px solid rgba(59,130,246,0.2)',
        }}
      />
    </div>
  )
}
