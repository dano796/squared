import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BlockState, Direction } from "../logic/blockLogic";
import { moveBlock } from "../logic/blockLogic";
import {
  validateMove,
  getActivatedSwitches,
  getFragileTilesToBreak,
} from "../logic/levelValidator";
import { LEVELS } from "../data/levels";

export type Screen =
  | "splash"
  | "home"
  | "levelSelect"
  | "game"
  | "levelComplete"
  | "gameOver"
  | "credits"
  | "howToPlay";

interface GameStore {
  screen: Screen;
  currentLevel: number;
  block: BlockState;
  moves: number;
  time: number;
  levelStars: Record<number, number>;
  unlockedLevels: number[];
  brokenTiles: Set<string>;
  dynamicGrid: number[][] | null;
  activatedSwitches: Set<number>;
  isFalling: boolean;
  isWinFalling: boolean;
  isShaking: boolean;
  lastMoveDir: Direction | null;
  isAnimating: boolean;
  switchEventCount: number;
  tileBreakCount: number;

  setScreen: (s: Screen) => void;
  startLevel: (levelIndex: number) => void;
  moveBlock: (dir: Direction) => void;
  resetLevel: () => void;
  tickTime: () => void;
  completeLevel: (stars: number) => void;
  setAnimating: (v: boolean) => void;
}

export function calcStars(moves: number, optimalMoves: number): number {
  if (moves <= optimalMoves) return 3;
  if (moves <= optimalMoves * 1.5) return 2;
  return 1;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      screen: "splash",
      currentLevel: 0,
      block: LEVELS[0].start,
      moves: 0,
      time: 0,
      levelStars: {},
      unlockedLevels: [0],
      brokenTiles: new Set(),
      dynamicGrid: null,
      activatedSwitches: new Set(),
      isFalling: false,
      isWinFalling: false,
      isShaking: false,
      lastMoveDir: null,
      isAnimating: false,
      switchEventCount: 0,
      tileBreakCount: 0,

      setScreen: (screen) => set({ screen }),

      setAnimating: (v) => set({ isAnimating: v }),

      startLevel: (idx) => {
        const level = LEVELS[idx];
        if (!level) return;
        set({
          currentLevel: idx,
          block: { ...level.start },
          moves: 0,
          time: 0,
          brokenTiles: new Set(),
          dynamicGrid: level.grid.map((row) => [...row]),
          activatedSwitches: new Set(),
          screen: "game",
          isFalling: false,
          isWinFalling: false,
          isShaking: false,
          lastMoveDir: null,
          switchEventCount: 0,
          tileBreakCount: 0,
          isAnimating: false,
        });
      },

      moveBlock: (dir) => {
        if (get().isAnimating || get().isFalling || get().isWinFalling) return;
        const {
          block,
          currentLevel,
          moves,
          brokenTiles,
          dynamicGrid,
          activatedSwitches,
        } = get();
        const level = LEVELS[currentLevel];
        if (!level) return;

        const newBlock = moveBlock(block, dir);
        const grid = dynamicGrid ?? level.grid;
        const result = validateMove(newBlock, { ...level, grid }, brokenTiles);

        if (result === "lose") {
          set({
            block: newBlock,
            lastMoveDir: dir,
            isFalling: true,
            isShaking: true,
          });
          setTimeout(() => set({ isShaking: false }), 400);
          setTimeout(() => set({ screen: "gameOver", isFalling: false }), 600);
          return;
        }

        // Handle fragile tiles
        const newBroken = new Set(brokenTiles);
        const toBreak = getFragileTilesToBreak(newBlock, { ...level, grid });
        toBreak.forEach((k) => newBroken.add(k));

        // Handle switches — each activation toggles state
        const newGrid = grid.map((row) => [...row]);
        const newActivated = new Set(activatedSwitches);
        const triggered = getActivatedSwitches(newBlock, { ...level, grid });
        triggered.forEach((swIdx) => {
          const sw = level.switches?.[swIdx];
          if (!sw) return;
          const isNowActive = !newActivated.has(swIdx);
          if (isNowActive) newActivated.add(swIdx);
          else newActivated.delete(swIdx);
          sw.toggleTiles?.forEach(({ x, y, on, off }) => {
            if (newGrid[y]?.[x] !== undefined)
              newGrid[y][x] = isNowActive ? on : off;
          });
        });

        const newMoves = moves + 1;
        const switchFired = triggered.length > 0;
        const tileBroke = toBreak.length > 0;

        if (result === "win") {
          const stars = calcStars(newMoves, level.optimalMoves);
          // Block rolls to goal then falls into the hole before win screen
          set((s) => ({
            block: newBlock,
            moves: newMoves,
            brokenTiles: newBroken,
            dynamicGrid: newGrid,
            activatedSwitches: newActivated,
            lastMoveDir: dir,
            isWinFalling: true,
            switchEventCount: switchFired ? s.switchEventCount + 1 : s.switchEventCount,
            tileBreakCount: tileBroke ? s.tileBreakCount + 1 : s.tileBreakCount,
          }));
          setTimeout(() => {
            set({ isWinFalling: false });
            get().completeLevel(stars);
          }, 950);
          return;
        }

        set((s) => ({
          block: newBlock,
          moves: newMoves,
          brokenTiles: newBroken,
          dynamicGrid: newGrid,
          activatedSwitches: newActivated,
          lastMoveDir: dir,
          switchEventCount: switchFired ? s.switchEventCount + 1 : s.switchEventCount,
          tileBreakCount: tileBroke ? s.tileBreakCount + 1 : s.tileBreakCount,
        }));
      },

      resetLevel: () => {
        const { currentLevel } = get();
        get().startLevel(currentLevel);
      },

      tickTime: () => set((s) => ({ time: s.time + 1 })),

      completeLevel: (stars) => {
        const { currentLevel, levelStars, unlockedLevels } = get();
        const existing = levelStars[currentLevel] ?? 0;
        const nextLevel = currentLevel + 1;

        const newUnlocked = unlockedLevels.includes(nextLevel)
          ? unlockedLevels
          : [...unlockedLevels, nextLevel];

        set({
          levelStars: {
            ...levelStars,
            [currentLevel]: Math.max(existing, stars),
          },
          unlockedLevels: newUnlocked,
          screen: "levelComplete",
        });
      },
    }),
    {
      name: "squared-game-v1",
      partialize: (state) => ({
        levelStars: state.levelStars,
        unlockedLevels: state.unlockedLevels,
      }),
    },
  ),
);
