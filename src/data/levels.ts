import type { BlockState } from "../logic/blockLogic";

export interface Switch {
  x: number;
  y: number;
  type: "soft" | "hard";
  toggleTiles?: { x: number; y: number; on: number; off: number }[];
}

export interface Level {
  id: number;
  name: string;
  grid: number[][];
  start: BlockState;
  optimalMoves: number;
  switches?: Switch[];
  description?: string;
}

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "First Steps",
    description: "Learn to roll the block into the hole.",
    optimalMoves: 10,
    grid: [
      [0, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 0, 1, 0, 1],
      [1, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 2],
      [1, 1, 1, 0, 0, 0, 0],
    ],
    start: { x1: 0, y1: 3, x2: 0, y2: 4 },
  },
  {
    id: 2,
    name: "Bridge Walk",
    description: "Navigate the narrow bridges carefully.",
    optimalMoves: 24,
    grid: [
      [0, 1, 1, 1, 0, 0, 0, 0],
      [0, 1, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 0, 0],
      [1, 1, 0, 1, 1, 1, 0, 0],
      [1, 1, 1, 0, 0, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 1, 2, 0, 0],
    ],
    start: { x1: 0, y1: 3, x2: 0, y2: 4 },
  },
  {
    id: 3,
    name: "Careful Steps",
    description: "Fragile tiles break if you stand on them!",
    optimalMoves: 20,
    grid: [
      [0, 1, 1, 1, 1, 1, 0, 0],
      [1, 1, 1, 3, 3, 1, 0, 0],
      [1, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 3, 1, 1, 3, 0, 1],
      [1, 1, 1, 1, 0, 1, 1, 1],
      [0, 0, 1, 1, 0, 2, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0],
    ],
    start: { x1: 0, y1: 2, x2: 0, y2: 2 },
  },
  {
    id: 4,
    name: "The Gauntlet",
    description: "Switches open new paths. Step wisely.",
    optimalMoves: 24,
    grid: [
      [0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 3, 0, 3, 0, 1, 0],
      [1, 1, 0, 0, 1, 0, 0, 1, 1],
      [1, 4, 1, 1, 1, 1, 1, 5, 1],
      [1, 1, 0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 2, 0, 0, 0, 0],
    ],
    start: { x1: 3, y1: 0, x2: 4, y2: 0 },
    switches: [
      {
        x: 1,
        y: 5,
        type: "soft",
        toggleTiles: [{ x: 4, y: 6, on: 1, off: 0 }],
      },
      {
        x: 7,
        y: 5,
        type: "hard",
        toggleTiles: [{ x: 4, y: 3, on: 1, off: 0 }],
      },
    ],
  },
  {
    id: 5,
    name: "Abyss",
    description: "The path is narrow. One wrong step and you fall.",
    optimalMoves: 28,
    grid: [
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [3, 1, 1, 1, 1, 1, 1, 3],
      [1, 1, 1, 0, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 3, 1, 1, 1, 1, 3, 1],
      [3, 1, 1, 0, 3, 1, 1, 3],
      [0, 0, 1, 0, 2, 0, 0, 0],
    ],
    start: { x1: 3, y1: 0, x2: 4, y2: 0 },
  },
  {
    id: 6,
    name: "Fragile Corner",
    description: "Watch your step on the fragile tile!",
    optimalMoves: 6,
    grid: [
      [1, 1, 1, 1],
      [0, 1, 2, 1],
      [0, 1, 3, 1],
      [0, 1, 1, 1]
    ],
    start: { x1: 0, y1: 0, x2: 0, y2: 0 }
  },
  {
    id: 7,
    name: "Crumbling Path",
    description: "Move quickly. The floor is falling apart.",
    optimalMoves: 15,
    grid: [
      [1, 1, 1, 0, 0, 0],
      [0, 1, 1, 1, 3, 1],
      [0, 0, 0, 0, 1, 1],
      [0, 0, 0, 1, 1, 1],
      [0, 2, 1, 1, 1, 3],
      [0, 0, 1, 1, 1, 1]
    ],
    start: { x1: 0, y1: 0, x2: 0, y2: 0 }
  },
  {
    id: 8,
    name: "The Vault",
    description: "Two switches, two bridges. Unlock the vault.",
    optimalMoves: 24,
    grid: [
      [1, 1, 1, 0, 1, 1],
      [1, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 1],
      [0, 0, 0, 1, 1, 2],
      [0, 0, 0, 1, 1, 1]
    ],
    start: { x1: 0, y1: 0, x2: 0, y2: 0 },
    switches: [
      {
        x: 1,
        y: 4,
        type: "hard",
        toggleTiles: [{ x: 3, y: 1, on: 1, off: 0 }]
      },
      {
        x: 4,
        y: 1,
        type: "hard",
        toggleTiles: [{ x: 3, y: 4, on: 1, off: 0 }]
      }
    ]
  },
  {
    id: 9,
    name: "Crossfire",
    description: "Hit the switches to route your path to the goal.",
    optimalMoves: 15,
    grid: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0, 0, 2, 0, 0],
      [0, 0, 0, 1, 0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 1, 4, 1, 0, 1, 5, 1, 1],
      [0, 1, 1, 1, 0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    start: { x1: 1, y1: 1, x2: 1, y2: 1 },
    switches: [
      {
        x: 2,
        y: 6,
        type: "soft",
        toggleTiles: [
          { x: 3, y: 4, on: 0, off: 1 },
          { x: 4, y: 7, on: 1, off: 0 }
        ]
      },
      {
        x: 6,
        y: 6,
        type: "hard",
        toggleTiles: [
          { x: 6, y: 5, on: 1, off: 0 }
        ]
      }
    ]
  },
  {
    id: 10,
    name: "The Masterpiece",
    description: "A one-way journey. Don't look back.",
    optimalMoves: 16,
    grid: [
      [0, 1, 1, 1, 0, 1, 1, 1],
      [0, 1, 1, 1, 0, 1, 2, 1],
      [0, 1, 1, 1, 0, 1, 1, 1],
      [0, 1, 3, 1, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 5, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1]
    ],
    start: { x1: 2, y1: 1, x2: 2, y2: 1 },
    switches: [
      {
        x: 2,
        y: 5,
        type: "hard",
        toggleTiles: [
          { x: 6, y: 3, on: 1, off: 0 }
        ]
      }
    ]
  }
];
