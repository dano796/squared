// BFS solver for Squared levels — verifies solvability and finds optimal solutions
// Run: node solver.js

function getOrientation(b) {
  if (b.x1 === b.x2 && b.y1 === b.y2) return 'standing';
  if (b.y1 === b.y2) return 'lying-h';
  return 'lying-v';
}

function moveBlock(block, dir) {
  const { x1, y1, x2, y2 } = block;
  if (x1 === x2 && y1 === y2) {
    switch (dir) {
      case 'up':    return { x1, y1: y1 - 2, x2, y2: y2 - 1 };
      case 'down':  return { x1, y1: y1 + 1, x2, y2: y2 + 2 };
      case 'left':  return { x1: x1 - 2, y1, x2: x2 - 1, y2 };
      case 'right': return { x1: x1 + 1, y1, x2: x2 + 2, y2 };
    }
  }
  if (y1 === y2) {
    const minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
    switch (dir) {
      case 'left':  return { x1: minX - 1, y1, x2: minX - 1, y2 };
      case 'right': return { x1: maxX + 1, y1, x2: maxX + 1, y2 };
      case 'up':    return { x1, y1: y1 - 1, x2, y2: y2 - 1 };
      case 'down':  return { x1, y1: y1 + 1, x2, y2: y2 + 1 };
    }
  }
  const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
  switch (dir) {
    case 'up':    return { x1, y1: minY - 1, x2, y2: minY - 1 };
    case 'down':  return { x1, y1: maxY + 1, x2, y2: maxY + 1 };
    case 'left':  return { x1: x1 - 1, y1, x2: x2 - 1, y2 };
    case 'right': return { x1: x1 + 1, y1, x2: x2 + 1, y2 };
  }
}

function getBlockCells(b) {
  if (b.x1 === b.x2 && b.y1 === b.y2) return [[b.x1, b.y1]];
  return [[b.x1, b.y1], [b.x2, b.y2]];
}

function getTile(x, y, grid, brokenSet, dynGrid) {
  if (y < 0 || y >= grid.length || x < 0 || x >= grid[0].length) return 0;
  if (brokenSet.has(`${x},${y}`)) return 0;
  return dynGrid[y][x];
}

function validateMove(block, level, brokenSet, dynGrid) {
  const cells = getBlockCells(block);
  const orient = getOrientation(block);
  for (const [x, y] of cells) {
    const tile = getTile(x, y, level.grid, brokenSet, dynGrid);
    if (tile === 0) return 'lose';
    if (tile === 3 && orient === 'standing') return 'lose';
  }
  if (orient === 'standing') {
    const [x, y] = cells[0];
    if (getTile(x, y, level.grid, brokenSet, dynGrid) === 2) return 'win';
  }
  return 'valid';
}

function applyMove(block, level, brokenSet, dynGrid, activatedSwitches) {
  const cells = getBlockCells(block);
  const orient = getOrientation(block);

  // Fragile tiles
  const newBroken = new Set(brokenSet);
  if (orient !== 'standing') {
    for (const [x, y] of cells) {
      if (dynGrid[y] && dynGrid[y][x] === 3) newBroken.add(`${x},${y}`);
    }
  }

  // Switches
  const newGrid = dynGrid.map(r => [...r]);
  const newActivated = new Set(activatedSwitches);
  if (level.switches) {
    level.switches.forEach((sw, i) => {
      const onSwitch = cells.some(([cx, cy]) => cx === sw.x && cy === sw.y);
      if (!onSwitch) return;
      if (sw.type === 'soft' || (sw.type === 'hard' && orient === 'standing')) {
        const isNowActive = !newActivated.has(i);
        if (isNowActive) newActivated.add(i); else newActivated.delete(i);
        sw.toggleTiles?.forEach(({ x, y, on, off }) => {
          if (newGrid[y]?.[x] !== undefined) newGrid[y][x] = isNowActive ? on : off;
        });
      }
    });
  }
  return { brokenSet: newBroken, dynGrid: newGrid, activatedSwitches: newActivated };
}

function stateKey(block, brokenSet, activatedSwitches) {
  const bs = [...brokenSet].sort().join('|');
  const as = [...activatedSwitches].sort().join('|');
  return `${block.x1},${block.y1},${block.x2},${block.y2}|${bs}|${as}`;
}

function solveBFS(level) {
  const initDynGrid = level.grid.map(r => [...r]);
  const initState = {
    block: { ...level.start },
    brokenSet: new Set(),
    dynGrid: initDynGrid,
    activatedSwitches: new Set(),
    path: [],
  };

  const visited = new Set();
  const queue = [initState];
  visited.add(stateKey(initState.block, initState.brokenSet, initState.activatedSwitches));

  const dirs = ['up', 'down', 'left', 'right'];
  const arrow = { up: '↑', down: '↓', left: '←', right: '→' };

  while (queue.length > 0) {
    const state = queue.shift();

    for (const dir of dirs) {
      const newBlock = moveBlock(state.block, dir);
      const result = validateMove(newBlock, level, state.brokenSet, state.dynGrid);

      if (result === 'lose') continue;

      const { brokenSet, dynGrid, activatedSwitches } = applyMove(
        newBlock, level, state.brokenSet, state.dynGrid, state.activatedSwitches
      );
      const path = [...state.path, dir];

      if (result === 'win') {
        return path.map(d => arrow[d]);
      }

      const key = stateKey(newBlock, brokenSet, activatedSwitches);
      if (visited.has(key)) continue;
      visited.add(key);
      queue.push({ block: newBlock, brokenSet, dynGrid, activatedSwitches, path });
    }
  }
  return null; // unsolvable
}

// ===== LEVELS 11-15 (candidates) =====
const LEVELS = [
  {
    id: 11,
    name: "The Split",
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
        x: 1, y: 3, type: 'soft',
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
        x: 1, y: 3, type: 'hard',
        toggleTiles: [{ x: 3, y: 2, on: 1, off: 0 }],
      },
    ],
  },
  {
    id: 15,
    name: "Endgame",
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
        x: 5, y: 4, type: 'soft',
        toggleTiles: [{ x: 3, y: 3, on: 0, off: 1 }, { x: 4, y: 3, on: 1, off: 0 }],
      },
      {
        x: 2, y: 7, type: 'hard',
        toggleTiles: [{ x: 3, y: 6, on: 0, off: 1 }],
      },
    ],
  },
];

for (const level of LEVELS) {
  console.log(`\nLevel ${level.id} — ${level.name}`);
  const sol = solveBFS(level);
  if (sol) {
    console.log(`  SOLVABLE in ${sol.length} moves`);
    console.log(`  Solution: ${sol.join(' ')}`);
  } else {
    console.log(`  UNSOLVABLE`);
  }
}
