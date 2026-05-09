export type Direction = "up" | "down" | "left" | "right";

export interface BlockState {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export type BlockOrientation = "standing" | "lying-h" | "lying-v";

export function getOrientation(b: BlockState): BlockOrientation {
  if (b.x1 === b.x2 && b.y1 === b.y2) return "standing";
  if (b.y1 === b.y2) return "lying-h";
  return "lying-v";
}

export function moveBlock(block: BlockState, dir: Direction): BlockState {
  const { x1, y1, x2, y2 } = block;

  // Standing: x1===x2, y1===y2
  if (x1 === x2 && y1 === y2) {
    switch (dir) {
      case "up":
        return { x1, y1: y1 - 2, x2, y2: y2 - 1 };
      case "down":
        return { x1, y1: y1 + 1, x2, y2: y2 + 2 };
      case "left":
        return { x1: x1 - 2, y1, x2: x2 - 1, y2 };
      case "right":
        return { x1: x1 + 1, y1, x2: x2 + 2, y2 };
    }
  }

  // Lying horizontal: y1===y2, x1!==x2
  if (y1 === y2) {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    switch (dir) {
      case "left":
        return { x1: minX - 1, y1, x2: minX - 1, y2 };
      case "right":
        return { x1: maxX + 1, y1, x2: maxX + 1, y2 };
      case "up":
        return { x1, y1: y1 - 1, x2, y2: y2 - 1 };
      case "down":
        return { x1, y1: y1 + 1, x2, y2: y2 + 1 };
    }
  }

  // Lying vertical: x1===x2, y1!==y2
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  switch (dir) {
    case "up":
      return { x1, y1: minY - 1, x2, y2: minY - 1 };
    case "down":
      return { x1, y1: maxY + 1, x2, y2: maxY + 1 };
    case "left":
      return { x1: x1 - 1, y1, x2: x2 - 1, y2 };
    case "right":
      return { x1: x1 + 1, y1, x2: x2 + 1, y2 };
  }
}

export function getBlockCells(block: BlockState): [number, number][] {
  const { x1, y1, x2, y2 } = block;
  if (x1 === x2 && y1 === y2) return [[x1, y1]];
  return [
    [x1, y1],
    [x2, y2],
  ];
}
