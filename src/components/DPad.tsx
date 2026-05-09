import { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Direction } from '../logic/blockLogic'

interface Props {
  onMove: (dir: Direction) => void
}

const DIRS: { dir: Direction; Icon: React.ElementType; gridArea: string }[] = [
  { dir: 'up',    Icon: ChevronUp,    gridArea: '1 / 2' },
  { dir: 'left',  Icon: ChevronLeft,  gridArea: '2 / 1' },
  { dir: 'right', Icon: ChevronRight, gridArea: '2 / 3' },
  { dir: 'down',  Icon: ChevronDown,  gridArea: '3 / 2' },
]

export default function DPad({ onMove }: Props) {
  const [pressed, setPressed] = useState<Direction | null>(null)

  const handlePress = (dir: Direction) => {
    setPressed(dir)
    onMove(dir)
  }

  const handleRelease = () => setPressed(null)

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 62px)',
      gridTemplateRows: 'repeat(3, 62px)',
      gap: 6,
    }}>
      {DIRS.map(({ dir, Icon, gridArea }) => (
        <button
          key={dir}
          className={`dpad-btn ${pressed === dir ? 'pressed' : ''}`}
          style={{ gridArea, color: pressed === dir ? '#a0aeff' : '#5060a0' }}
          onPointerDown={(e) => { e.preventDefault(); handlePress(dir) }}
          onPointerUp={handleRelease}
          onPointerLeave={handleRelease}
        >
          <Icon size={22} strokeWidth={2} />
        </button>
      ))}

      {/* Center */}
      <div style={{
        gridArea: '2 / 2',
        borderRadius: 12,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)',
      }} />
    </div>
  )
}
