import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BlockState, Direction } from '../logic/blockLogic'
import { moveBlock } from '../logic/blockLogic'
import { validateMove, getActivatedSwitches, getFragileTilesToBreak } from '../logic/levelValidator'
import { LEVELS } from '../data/levels'

export type Screen =
  | 'splash'
  | 'home'
  | 'levelSelect'
  | 'game'
  | 'levelComplete'
  | 'gameOver'
  | 'credits'
  | 'howToPlay'

interface GameStore {
  screen: Screen
  currentLevel: number
  block: BlockState
  moves: number
  time: number
  levelStars: Record<number, number>
  unlockedLevels: number[]
  brokenTiles: Set<string>
  dynamicGrid: number[][] | null
  isFalling: boolean
  isShaking: boolean

  setScreen: (s: Screen) => void
  startLevel: (levelIndex: number) => void
  moveBlock: (dir: Direction) => void
  resetLevel: () => void
  tickTime: () => void
  completeLevel: (stars: number) => void
}

function calcStars(moves: number, optimalMoves: number): number {
  if (moves <= optimalMoves) return 3
  if (moves <= optimalMoves * 1.5) return 2
  return 1
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      screen: 'splash',
      currentLevel: 0,
      block: LEVELS[0].start,
      moves: 0,
      time: 0,
      levelStars: {},
      unlockedLevels: [0],
      brokenTiles: new Set(),
      dynamicGrid: null,
      isFalling: false,
      isShaking: false,

      setScreen: (screen) => set({ screen }),

      startLevel: (idx) => {
        const level = LEVELS[idx]
        if (!level) return
        set({
          currentLevel: idx,
          block: { ...level.start },
          moves: 0,
          time: 0,
          brokenTiles: new Set(),
          dynamicGrid: level.grid.map(row => [...row]),
          screen: 'game',
          isFalling: false,
          isShaking: false,
        })
      },

      moveBlock: (dir) => {
        const { block, currentLevel, moves, brokenTiles, dynamicGrid } = get()
        const level = LEVELS[currentLevel]
        if (!level) return

        const newBlock = moveBlock(block, dir)
        const grid = dynamicGrid ?? level.grid
        const result = validateMove(newBlock, { ...level, grid }, brokenTiles)

        if (result === 'lose') {
          set({ isFalling: true })
          setTimeout(() => {
            set({ screen: 'gameOver', isFalling: false })
          }, 700)
          return
        }

        // Handle fragile tiles
        const newBroken = new Set(brokenTiles)
        const toBreak = getFragileTilesToBreak(newBlock, { ...level, grid })
        toBreak.forEach(k => newBroken.add(k))

        // Handle switches
        let newGrid = grid.map(row => [...row])
        const activated = getActivatedSwitches(newBlock, { ...level, grid })
        activated.forEach(swIdx => {
          const sw = level.switches?.[swIdx]
          sw?.toggleTiles?.forEach(({ x, y, to }) => {
            if (newGrid[y]?.[x] !== undefined) newGrid[y][x] = to
          })
        })

        const newMoves = moves + 1

        if (result === 'win') {
          const stars = calcStars(newMoves, level.optimalMoves)
          set({
            block: newBlock,
            moves: newMoves,
            brokenTiles: newBroken,
            dynamicGrid: newGrid,
          })
          setTimeout(() => {
            get().completeLevel(stars)
          }, 400)
          return
        }

        set({
          block: newBlock,
          moves: newMoves,
          brokenTiles: newBroken,
          dynamicGrid: newGrid,
        })
      },

      resetLevel: () => {
        const { currentLevel } = get()
        get().startLevel(currentLevel)
      },

      tickTime: () => set(s => ({ time: s.time + 1 })),

      completeLevel: (stars) => {
        const { currentLevel, levelStars, unlockedLevels } = get()
        const existing = levelStars[currentLevel] ?? 0
        const nextLevel = currentLevel + 1

        const newUnlocked = unlockedLevels.includes(nextLevel)
          ? unlockedLevels
          : [...unlockedLevels, nextLevel]

        set({
          levelStars: { ...levelStars, [currentLevel]: Math.max(existing, stars) },
          unlockedLevels: newUnlocked,
          screen: 'levelComplete',
        })
      },
    }),
    {
      name: 'squared-game-v1',
      partialize: (state) => ({
        levelStars: state.levelStars,
        unlockedLevels: state.unlockedLevels,
      }),
    }
  )
)
