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
    optimalMoves: 12,
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
    optimalMoves: 15,
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
    optimalMoves: 15,
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
    optimalMoves: 32,
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
    optimalMoves: 15,
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
      [0, 1, 1, 1],
    ],
    start: { x1: 0, y1: 0, x2: 0, y2: 0 },
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
      [0, 0, 1, 1, 1, 1],
    ],
    start: { x1: 0, y1: 0, x2: 0, y2: 0 },
  },
  {
    id: 8,
    name: "The Vault",
    description: "Two switches, two bridges. Unlock the vault.",
    optimalMoves: 9,
    grid: [
      [1, 1, 1, 0, 1, 1],
      [1, 1, 1, 0, 5, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 5, 1, 0, 1, 1],
      [0, 0, 0, 1, 1, 2],
      [0, 0, 0, 1, 1, 1],
    ],
    start: { x1: 0, y1: 0, x2: 0, y2: 0 },
    switches: [
      {
        x: 1,
        y: 4,
        type: "hard",
        toggleTiles: [{ x: 3, y: 1, on: 1, off: 0 }],
      },
      {
        x: 4,
        y: 1,
        type: "hard",
        toggleTiles: [{ x: 3, y: 4, on: 1, off: 0 }],
      },
    ],
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
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    start: { x1: 1, y1: 1, x2: 1, y2: 1 },
    switches: [
      {
        x: 2,
        y: 6,
        type: "soft",
        toggleTiles: [
          { x: 3, y: 4, on: 0, off: 1 },
          { x: 4, y: 7, on: 1, off: 0 },
        ],
      },
      {
        x: 6,
        y: 6,
        type: "hard",
        toggleTiles: [{ x: 6, y: 5, on: 1, off: 0 }],
      },
    ],
  },
  {
    id: 10,
    name: "The Masterpiece",
    description: "A one-way journey. Don't look back.",
    optimalMoves: 15,
    grid: [
      [0, 1, 1, 1, 0, 1, 1, 1],
      [0, 1, 1, 1, 0, 1, 2, 1],
      [0, 1, 1, 1, 0, 1, 1, 1],
      [0, 1, 3, 1, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 5, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1],
    ],
    start: { x1: 2, y1: 1, x2: 2, y2: 1 },
    switches: [
      {
        x: 2,
        y: 5,
        type: "hard",
        toggleTiles: [{ x: 6, y: 3, on: 1, off: 0 }],
      },
    ],
  },
  {
    id: 11,
    name: "The Split",
    description: "Two paths diverge. Only one leads forward.",
    optimalMoves: 8,
    grid: [
      [0, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1],
      [0, 0, 3, 1, 1, 1],
      [0, 0, 1, 1, 3, 1],
      [0, 0, 1, 1, 1, 1],
      [0, 0, 0, 0, 1, 2],
    ],
    start: { x1: 1, y1: 0, x2: 1, y2: 0 },
  },
  {
    id: 12,
    name: "Switchback",
    description: "Hit the switch to open the way, then don't look back.",
    optimalMoves: 7,
    grid: [
      [0, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 0, 0],
      [1, 1, 1, 1, 1, 0],
      [1, 4, 1, 0, 1, 0],
      [1, 1, 1, 0, 1, 0],
      [0, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 2, 0],
    ],
    start: { x1: 2, y1: 0, x2: 2, y2: 0 },
    switches: [
      {
        x: 1,
        y: 3,
        type: "soft",
        toggleTiles: [
          { x: 3, y: 3, on: 1, off: 0 },
          { x: 3, y: 4, on: 1, off: 0 },
        ],
      },
    ],
  },
  {
    id: 13,
    name: "Glass Floor",
    description: "The floor shatters beneath you. Plan every step.",
    optimalMoves: 20,
    grid: [
      [1, 1, 1, 0, 0, 0, 0],
      [1, 3, 1, 1, 1, 0, 0],
      [1, 1, 3, 1, 3, 1, 0],
      [0, 1, 1, 1, 1, 1, 0],
      [0, 3, 1, 3, 1, 3, 1],
      [0, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 1, 2],
    ],
    start: { x1: 0, y1: 0, x2: 0, y2: 0 },
  },
  {
    id: 14,
    name: "The Gate",
    description: "Stand tall on the switch to open the gate.",
    optimalMoves: 22,
    grid: [
      [0, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 0, 0],
      [1, 1, 1, 0, 1, 1, 1],
      [1, 5, 1, 0, 1, 1, 1],
      [1, 1, 1, 0, 3, 1, 1],
      [0, 0, 0, 0, 1, 1, 1],
      [0, 0, 0, 0, 1, 2, 1],
    ],
    start: { x1: 1, y1: 0, x2: 2, y2: 0 },
    switches: [
      {
        x: 1,
        y: 3,
        type: "hard",
        toggleTiles: [{ x: 3, y: 2, on: 1, off: 0 }],
      },
    ],
  },
  {
    id: 15,
    name: "Endgame",
    description: "Everything you learned. One final challenge.",
    optimalMoves: 11,
    grid: [
      [0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0],
      [0, 1, 1, 3, 1, 1, 0, 0],
      [0, 1, 1, 1, 0, 1, 0, 0],
      [1, 1, 0, 0, 0, 4, 1, 1],
      [1, 3, 1, 1, 1, 1, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 5, 1, 1, 3, 1, 2],
    ],
    start: { x1: 2, y1: 0, x2: 3, y2: 0 },
    switches: [
      {
        x: 5,
        y: 4,
        type: "soft",
        toggleTiles: [
          { x: 3, y: 3, on: 0, off: 1 },
          { x: 4, y: 3, on: 1, off: 0 },
        ],
      },
      {
        x: 2,
        y: 7,
        type: "hard",
        toggleTiles: [{ x: 3, y: 6, on: 0, off: 1 }],
      },
    ],
  },
];
