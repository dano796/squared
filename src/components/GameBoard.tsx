import { useEffect, useRef, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'
import { LEVELS } from '../data/levels'

// ─────────────────────────────────────────────
//  ISOMETRIC MATH
//  projection: (col, row, z) → canvas (x, y)
//  z=0 is ground, z>0 is up
// ─────────────────────────────────────────────
type P = { x: number; y: number }

function makeProj(TW: number, TH: number, ox: number, oy: number) {
  return (col: number, row: number, z: number): P => ({
    x: (col - row) * (TW / 2) + ox,
    y: (col + row) * (TH / 2) - z * TH + oy,
  })
}

function poly(ctx: CanvasRenderingContext2D, pts: P[], fill: string, stroke?: string, lw = 0.6) {
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = lw
    ctx.stroke()
  }
}

function clipDiamond(ctx: CanvasRenderingContext2D, p: ReturnType<typeof makeProj>, col: number, row: number, z: number) {
  ctx.beginPath()
  ctx.moveTo(p(col, row, z).x, p(col, row, z).y)
  ctx.lineTo(p(col + 1, row, z).x, p(col + 1, row, z).y)
  ctx.lineTo(p(col + 1, row + 1, z).x, p(col + 1, row + 1, z).y)
  ctx.lineTo(p(col, row + 1, z).x, p(col, row + 1, z).y)
  ctx.closePath()
  ctx.clip()
}

// ─────────────────────────────────────────────
//  TILE DRAWING
// ─────────────────────────────────────────────
const TILE_Z = 0.22  // tile thickness in grid-z units

interface TileColors { top: string; right: string; front: string; stroke: string }
const TC: Record<number, TileColors> = {
  1: { top: '#1e3a5f', right: '#0b1f38', front: '#071428', stroke: 'rgba(96,165,250,0.18)' },
  2: { top: '#1a0a2e', right: '#0f0620', front: '#080012', stroke: 'rgba(168,85,247,0.5)' },
  3: { top: '#3d2200', right: '#281700', front: '#160d00', stroke: 'rgba(245,158,11,0.45)' },
  4: { top: '#042d14', right: '#021a0c', front: '#010d07', stroke: 'rgba(34,197,94,0.4)' },
  5: { top: '#420a0a', right: '#2b0606', front: '#180404', stroke: 'rgba(239,68,68,0.4)' },
}

function drawIsoTile(
  ctx: CanvasRenderingContext2D,
  p: ReturnType<typeof makeProj>,
  col: number, row: number,
  tile: number
) {
  const c = TC[tile] ?? TC[1]
  const z = TILE_Z

  // Right side face (appears on screen-right)
  poly(ctx,
    [p(col + 1, row, 0), p(col + 1, row + 1, 0), p(col + 1, row + 1, z), p(col + 1, row, z)],
    c.right
  )
  // Front side face (appears on screen-left/bottom)
  poly(ctx,
    [p(col, row + 1, 0), p(col + 1, row + 1, 0), p(col + 1, row + 1, z), p(col, row + 1, z)],
    c.front
  )
  // Top face (diamond)
  poly(ctx,
    [p(col, row, z), p(col + 1, row, z), p(col + 1, row + 1, z), p(col, row + 1, z)],
    c.top, c.stroke
  )
}

function drawGoalTile(
  ctx: CanvasRenderingContext2D,
  p: ReturnType<typeof makeProj>,
  col: number, row: number,
  TW: number, TH: number,
  time: number
) {
  drawIsoTile(ctx, p, col, row, 2)

  const z = TILE_Z
  const pts = [p(col, row, z), p(col + 1, row, z), p(col + 1, row + 1, z), p(col, row + 1, z)]
  const cx = pts.reduce((s, pt) => s + pt.x, 0) / 4
  const cy = pts.reduce((s, pt) => s + pt.y, 0) / 4

  ctx.save()
  clipDiamond(ctx, p, col, row, z)

  // Deep hole radial gradient
  const r = Math.max(TW, TH) * 0.5
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
  grd.addColorStop(0, 'rgba(0,0,0,1)')
  grd.addColorStop(0.35, 'rgba(40,0,70,0.95)')
  grd.addColorStop(0.65, 'rgba(88,28,135,0.6)')
  grd.addColorStop(1, 'rgba(168,85,247,0.05)')
  ctx.fillStyle = grd
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2)

  // Pulsing ring
  const pulse = 0.55 + 0.45 * Math.sin(time * 2.8)
  ctx.strokeStyle = `rgba(168,85,247,${pulse})`
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.ellipse(cx, cy, TW * 0.17, TH * 0.2, 0, 0, Math.PI * 2)
  ctx.stroke()

  // Inner glow dot
  ctx.fillStyle = `rgba(196,132,252,${pulse * 0.6})`
  ctx.beginPath()
  ctx.ellipse(cx, cy, TW * 0.06, TH * 0.07, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

function drawFragileTile(
  ctx: CanvasRenderingContext2D,
  p: ReturnType<typeof makeProj>,
  col: number, row: number,
  TW: number, TH: number
) {
  drawIsoTile(ctx, p, col, row, 3)

  const z = TILE_Z
  const pts = [p(col, row, z), p(col + 1, row, z), p(col + 1, row + 1, z), p(col, row + 1, z)]
  const cx = pts.reduce((s, pt) => s + pt.x, 0) / 4
  const cy = pts.reduce((s, pt) => s + pt.y, 0) / 4

  ctx.save()
  clipDiamond(ctx, p, col, row, z)

  ctx.strokeStyle = 'rgba(245,158,11,0.65)'
  ctx.lineWidth = 0.9

  const crack = (dx1: number, dy1: number, bx: number, by: number, dx2: number, dy2: number) => {
    ctx.beginPath()
    ctx.moveTo(cx + TW * dx1, cy + TH * dy1)
    ctx.lineTo(cx + TW * bx, cy + TH * by)
    ctx.lineTo(cx + TW * dx2, cy + TH * dy2)
    ctx.stroke()
  }
  crack(-0.08, -0.35, 0.04, 0.05, -0.06, 0.35)
  crack(0.15, -0.2, 0.02, 0.08, 0.12, 0.3)
  crack(-0.2, 0.1, -0.06, 0.18, -0.15, 0.3)

  ctx.restore()
}

function drawSwitchTile(
  ctx: CanvasRenderingContext2D,
  p: ReturnType<typeof makeProj>,
  col: number, row: number,
  tile: number,
  TW: number
) {
  drawIsoTile(ctx, p, col, row, tile)

  const z = TILE_Z
  const pts = [p(col, row, z), p(col + 1, row, z), p(col + 1, row + 1, z), p(col, row + 1, z)]
  const cx = pts.reduce((s, pt) => s + pt.x, 0) / 4
  const cy = pts.reduce((s, pt) => s + pt.y, 0) / 4
  const r = TW * 0.17

  ctx.save()
  clipDiamond(ctx, p, col, row, z)

  if (tile === 4) {
    // Soft switch — circle
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 1.5
    ctx.globalAlpha = 0.9
    ctx.beginPath()
    ctx.ellipse(cx, cy, r, r * 0.58, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = 'rgba(34,197,94,0.25)'
    ctx.fill()
    // inner dot
    ctx.globalAlpha = 0.7
    ctx.fillStyle = '#22c55e'
    ctx.beginPath()
    ctx.ellipse(cx, cy, r * 0.35, r * 0.22, 0, 0, Math.PI * 2)
    ctx.fill()
  } else {
    // Hard switch — X
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 1.8
    ctx.globalAlpha = 0.9
    const rx = r * 0.75, ry = r * 0.45
    ctx.beginPath()
    ctx.moveTo(cx - rx, cy - ry); ctx.lineTo(cx + rx, cy + ry)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx + rx, cy - ry); ctx.lineTo(cx - rx, cy + ry)
    ctx.stroke()
  }

  ctx.globalAlpha = 1
  ctx.restore()
}

// ─────────────────────────────────────────────
//  BLOCK DRAWING  (isometric 3D box)
// ─────────────────────────────────────────────
function drawBlock(
  ctx: CanvasRenderingContext2D,
  p: ReturnType<typeof makeProj>,
  x1: number, y1: number, x2: number, y2: number,
  TW: number, TH: number
) {
  const standing = x1 === x2 && y1 === y2
  const lyingH = y1 === y2 && x1 !== x2

  const col = Math.min(x1, x2)
  const row = Math.min(y1, y2)
  const bw = lyingH ? 2 : 1       // grid width
  const bd = (!standing && !lyingH) ? 2 : 1  // grid depth
  const bh = standing ? 2 : 1    // grid height (z units)

  const baseZ = TILE_Z
  const topZ = baseZ + bh

  // ── Shadow glow beneath block ──
  const sc = p(col + bw / 2, row + bd / 2, baseZ)
  const sgrd = ctx.createRadialGradient(sc.x, sc.y + 4, 0, sc.x, sc.y + 4, TW * Math.max(bw, bd) * 0.75)
  sgrd.addColorStop(0, 'rgba(59,130,246,0.28)')
  sgrd.addColorStop(1, 'rgba(59,130,246,0)')
  ctx.fillStyle = sgrd
  ctx.fillRect(sc.x - TW * bw, sc.y - TH * (bd + bh + 1), TW * bw * 2, TH * (bd + bh + 2) * 2)

  // ── Right face (+col edge) ──
  poly(ctx, [
    p(col + bw, row,      baseZ),
    p(col + bw, row + bd, baseZ),
    p(col + bw, row + bd, topZ),
    p(col + bw, row,      topZ),
  ], '#1d4ed8')

  // Right edge line
  ctx.strokeStyle = 'rgba(59,130,246,0.45)'
  ctx.lineWidth = 1
  ctx.beginPath()
  const re0 = p(col + bw, row, topZ), re1 = p(col + bw, row, baseZ)
  ctx.moveTo(re0.x, re0.y); ctx.lineTo(re1.x, re1.y)
  ctx.stroke()

  // ── Front face (+row edge) ──
  poly(ctx, [
    p(col,      row + bd, baseZ),
    p(col + bw, row + bd, baseZ),
    p(col + bw, row + bd, topZ),
    p(col,      row + bd, topZ),
  ], '#2563eb')

  // Front edge line
  ctx.beginPath()
  const fe0 = p(col, row + bd, topZ), fe1 = p(col, row + bd, baseZ)
  ctx.moveTo(fe0.x, fe0.y); ctx.lineTo(fe1.x, fe1.y)
  ctx.stroke()

  // ── Top face ──
  const topFace = [
    p(col,      row,      topZ),
    p(col + bw, row,      topZ),
    p(col + bw, row + bd, topZ),
    p(col,      row + bd, topZ),
  ]
  poly(ctx, topFace, '#3b82f6')

  // Gradient overlay on top
  ctx.save()
  ctx.beginPath()
  topFace.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)))
  ctx.closePath()
  ctx.clip()

  const xs = topFace.map(pt => pt.x), ys = topFace.map(pt => pt.y)
  const minX = Math.min(...xs), minY = Math.min(...ys)
  const maxX = Math.max(...xs), maxY = Math.max(...ys)
  const lg = ctx.createLinearGradient(minX, minY, maxX, maxY)
  lg.addColorStop(0, 'rgba(147,197,253,0.55)')
  lg.addColorStop(0.45, 'rgba(96,165,250,0.1)')
  lg.addColorStop(1, 'rgba(29,78,216,0.15)')
  ctx.fillStyle = lg
  ctx.fillRect(minX, minY, maxX - minX, maxY - minY)
  ctx.restore()

  // Top face border + glow
  poly(ctx, topFace, 'transparent', 'rgba(147,197,253,0.7)', 1.2)

  ctx.save()
  ctx.shadowColor = '#60a5fa'
  ctx.shadowBlur = 10
  ctx.strokeStyle = '#93c5fd'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(topFace[0].x, topFace[0].y)
  ctx.lineTo(topFace[1].x, topFace[1].y)
  ctx.stroke()
  ctx.restore()
}

// ─────────────────────────────────────────────
//  COMPONENT
// ─────────────────────────────────────────────
export default function GameBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeRef = useRef(0)

  const { block, currentLevel, brokenTiles, dynamicGrid } = useGameStore()
  const level = LEVELS[currentLevel]
  const grid = dynamicGrid ?? level?.grid ?? []
  const rows = grid.length
  const cols = grid[0]?.length ?? 0

  // ── Compute adaptive tile size ──
  const vw = typeof window !== 'undefined' ? Math.min(window.innerWidth - 8, 560) : 380
  const vh = typeof window !== 'undefined' ? window.innerHeight * 0.54 : 300
  const tileByW = (vw * 0.95) / ((cols + rows) * 0.5)
  const tileByH = (vh * 0.88) / ((cols + rows) * 0.25 + 2.5)
  const TILE_W = Math.floor(Math.min(tileByW, tileByH, 80))
  const TILE_H = Math.floor(TILE_W / 2)

  const PAD_X = Math.ceil(TILE_W * 0.4)
  const PAD_Y = Math.ceil(TILE_H * 2.8)  // top padding for block height
  const canvasW = (cols + rows) * Math.ceil(TILE_W / 2) + PAD_X * 2
  const canvasH = (cols + rows) * Math.ceil(TILE_H / 2) + PAD_Y + Math.ceil(TILE_H * 1.2)

  // Grid origin in canvas coords (where tile (0,0) top corner appears)
  const ox = rows * Math.ceil(TILE_W / 2) + PAD_X
  const oy = PAD_Y

  const draw = useCallback((time: number) => {
    const canvas = canvasRef.current
    if (!canvas || !level) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Subtle ambient glow under the board
    const bg = ctx.createRadialGradient(canvasW / 2, canvasH * 0.58, 0, canvasW / 2, canvasH * 0.58, canvasW * 0.65)
    bg.addColorStop(0, 'rgba(30,58,138,0.13)')
    bg.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, canvasW, canvasH)

    const p = makeProj(TILE_W, TILE_H, ox, oy)

    // ── Collect & sort tiles (painter's algorithm: back→front) ──
    const tiles: { col: number; row: number; tile: number }[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tile = grid[r]?.[c] ?? 0
        if (tile !== 0 && !brokenTiles.has(`${c},${r}`)) {
          tiles.push({ col: c, row: r, tile })
        }
      }
    }
    tiles.sort((a, b) => (a.col + a.row) - (b.col + b.row))

    // ── Draw tiles ──
    for (const { col, row, tile } of tiles) {
      if (tile === 2) {
        drawGoalTile(ctx, p, col, row, TILE_W, TILE_H, time)
      } else if (tile === 3) {
        drawFragileTile(ctx, p, col, row, TILE_W, TILE_H)
      } else if (tile === 4 || tile === 5) {
        drawSwitchTile(ctx, p, col, row, tile, TILE_W)
      } else {
        drawIsoTile(ctx, p, col, row, tile)
      }
    }

    // ── Draw block (always on top) ──
    drawBlock(ctx, p, block.x1, block.y1, block.x2, block.y2, TILE_W, TILE_H)
  }, [block, grid, brokenTiles, rows, cols, TILE_W, TILE_H, canvasW, canvasH, ox, oy, level])

  // ── Animation loop (for goal pulse) ──
  useEffect(() => {
    let rafId: number
    const loop = (t: number) => {
      timeRef.current = t / 1000
      draw(timeRef.current)
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      width={canvasW}
      height={canvasH}
      style={{ display: 'block', maxWidth: '100%', imageRendering: 'crisp-edges' }}
    />
  )
}
