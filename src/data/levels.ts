import type { BlockState } from '../logic/blockLogic'

export interface Switch {
  x: number
  y: number
  type: 'soft' | 'hard'
  // What tiles to toggle when activated
  toggleTiles?: { x: number; y: number; to: number }[]
}

export interface Level {
  id: number
  name: string
  grid: number[][]
  start: BlockState
  optimalMoves: number
  switches?: Switch[]
  description?: string
}

export const LEVELS: Level[] = [
  {
    id: 1,
    name: 'First Steps',
    description: 'Learn to roll the block into the hole.',
    optimalMoves: 10,
    grid: [
      [0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 1, 0, 0],
      [1, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 2],
      [1, 1, 1, 0, 0, 0, 0],
    ],
    start: { x1: 0, y1: 3, x2: 0, y2: 4 },
  },
  {
    id: 2,
    name: 'Bridge Walk',
    description: 'Navigate the narrow bridges carefully.',
    optimalMoves: 16,
    grid: [
      [0, 1, 1, 1, 0, 0, 0, 0],
      [0, 1, 0, 1, 0, 0, 0, 0],
      [1, 1, 0, 1, 1, 1, 0, 0],
      [1, 0, 0, 0, 0, 1, 0, 0],
      [1, 1, 1, 0, 0, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 2, 0, 0, 0],
    ],
    start: { x1: 0, y1: 2, x2: 0, y2: 3 },
  },
  {
    id: 3,
    name: 'Careful Steps',
    description: 'Fragile tiles break if you stand on them!',
    optimalMoves: 20,
    grid: [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [1, 1, 1, 0, 0, 1, 1, 1],
      [1, 0, 3, 1, 1, 3, 0, 1],
      [1, 1, 1, 0, 0, 1, 1, 1],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 1, 1, 2, 1, 0, 0],
    ],
    start: { x1: 0, y1: 2, x2: 0, y2: 3 },
  },
  {
    id: 4,
    name: 'The Gauntlet',
    description: 'Switches open new paths. Step wisely.',
    optimalMoves: 24,
    grid: [
      [0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0, 0],
      [0, 1, 1, 1, 0, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 1, 0],
      [1, 1, 0, 0, 1, 0, 0, 1, 1],
      [1, 4, 1, 1, 1, 1, 1, 5, 1],
      [1, 1, 0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 2, 0, 0, 0, 0],
    ],
    start: { x1: 3, y1: 0, x2: 4, y2: 0 },
    switches: [
      {
        x: 1, y: 5, type: 'soft',
        toggleTiles: [{ x: 2, y: 6, to: 1 }, { x: 3, y: 6, to: 1 }],
      },
      {
        x: 7, y: 5, type: 'hard',
        toggleTiles: [{ x: 5, y: 6, to: 1 }, { x: 4, y: 7, to: 1 }],
      },
    ],
  },
  {
    id: 5,
    name: 'Abyss',
    description: 'The path is narrow. One wrong step and you fall.',
    optimalMoves: 28,
    grid: [
      [0, 0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0, 0],
      [1, 1, 1, 0, 0, 1, 1, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 1, 0],
      [1, 3, 1, 1, 1, 1, 3, 1, 0],
      [0, 1, 1, 0, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 2, 0, 0, 0, 0],
    ],
    start: { x1: 3, y1: 0, x2: 4, y2: 0 },
  },
]
