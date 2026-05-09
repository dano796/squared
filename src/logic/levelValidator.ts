import type { BlockState } from "./blockLogic";
import { getBlockCells, getOrientation } from "./blockLogic";
import type { Level } from "../data/levels";

export type MoveResult = "valid" | "win" | "lose";

function isInBounds(x: number, y: number, grid: number[][]): boolean {
  return y >= 0 && y < grid.length && x >= 0 && x < grid[0].length;
}

function getTile(x: number, y: number, grid: number[][]): number {
  if (!isInBounds(x, y, grid)) return 0;
  return grid[y][x];
}

export function validateMove(
  block: BlockState,
  level: Level,
  brokenTiles: Set<string>,
): MoveResult {
  const { grid } = level;
  const cells = getBlockCells(block);
  const orient = getOrientation(block);

  for (const [x, y] of cells) {
    const key = `${x},${y}`;
    const tile = getTile(x, y, grid);

    if (tile === 0) return "lose";
    if (brokenTiles.has(key)) return "lose";

    // Fragile tile: only breaks if block stands vertically on it
    if (tile === 3 && orient === "standing") return "lose";
  }

  // Win: standing on goal tile
  if (orient === "standing") {
    const [x, y] = cells[0];
    if (getTile(x, y, grid) === 2) return "win";
  }

  return "valid";
}

export function getActivatedSwitches(
  block: BlockState,
  level: Level,
): number[] {
  const { switches } = level;
  if (!switches) return [];

  const cells = getBlockCells(block);
  const orient = getOrientation(block);
  const activated: number[] = [];

  switches.forEach((sw, i) => {
    const { x, y, type } = sw;
    const isOnSwitch = cells.some(([cx, cy]) => cx === x && cy === y);

    if (!isOnSwitch) return;

    if (type === "soft") {
      activated.push(i);
    } else if (type === "hard" && orient === "standing") {
      activated.push(i);
    }
  });

  return activated;
}

// Check if a tile is fragile and block is lying on it (mark for breaking later)
export function getFragileTilesToBreak(
  block: BlockState,
  level: Level,
): string[] {
  const { grid } = level;
  const cells = getBlockCells(block);
  const orient = getOrientation(block);
  const toBreak: string[] = [];

  if (orient !== "standing") {
    for (const [x, y] of cells) {
      if (getTile(x, y, grid) === 3) {
        toBreak.push(`${x},${y}`);
      }
    }
  }

  return toBreak;
}
