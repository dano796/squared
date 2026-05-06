import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { LEVELS } from '../data/levels'
import type { BlockState, Direction } from '../logic/blockLogic'
import { getOrientation } from '../logic/blockLogic'

// ─────────────────────────────────────────────
//  ISOMETRIC MATH
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
const TILE_Z = 0.22

interface TileColors { top: string; right: string; front: string; stroke: string }
const TC: Record<number, TileColors> = {
  1: { top: '#1e3a5f', right: '#0b1f38', front: '#071428', stroke: 'rgba(96,165,250,0.18)' },
  2: { top: '#1a0a2e', right: '#0f0620', front: '#080012', stroke: 'rgba(168,85,247,0.5)' },
  3: { top: '#3d2200', right: '#281700', front: '#160d00', stroke: 'rgba(245,158,11,0.45)' },
  4: { top: '#042d14', right: '#021a0c', front: '#010d07', stroke: 'rgba(34,197,94,0.4)' },
  5: { top: '#420a0a', right: '#2b0606', front: '#180404', stroke: 'rgba(239,68,68,0.4)' },
}

function drawIsoTile(ctx: CanvasRenderingContext2D, p: ReturnType<typeof makeProj>, col: number, row: number, tile: number) {
  const c = TC[tile] ?? TC[1]
  const z = TILE_Z
  poly(ctx, [p(col+1,row,0), p(col+1,row+1,0), p(col+1,row+1,z), p(col+1,row,z)], c.right)
  poly(ctx, [p(col,row+1,0), p(col+1,row+1,0), p(col+1,row+1,z), p(col,row+1,z)], c.front)
  poly(ctx, [p(col,row,z), p(col+1,row,z), p(col+1,row+1,z), p(col,row+1,z)], c.top, c.stroke)
}

function drawGoalTile(ctx: CanvasRenderingContext2D, p: ReturnType<typeof makeProj>, col: number, row: number, TW: number, TH: number, time: number) {
  drawIsoTile(ctx, p, col, row, 2)
  const z = TILE_Z
  const pts = [p(col,row,z), p(col+1,row,z), p(col+1,row+1,z), p(col,row+1,z)]
  const cx = pts.reduce((s, pt) => s + pt.x, 0) / 4
  const cy = pts.reduce((s, pt) => s + pt.y, 0) / 4
  ctx.save()
  clipDiamond(ctx, p, col, row, z)
  const r = Math.max(TW, TH) * 0.5
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
  grd.addColorStop(0, 'rgba(0,0,0,1)')
  grd.addColorStop(0.35, 'rgba(40,0,70,0.95)')
  grd.addColorStop(0.65, 'rgba(88,28,135,0.6)')
  grd.addColorStop(1, 'rgba(168,85,247,0.05)')
  ctx.fillStyle = grd
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2)
  const pulse = 0.55 + 0.45 * Math.sin(time * 2.8)
  ctx.strokeStyle = `rgba(168,85,247,${pulse})`
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.ellipse(cx, cy, TW * 0.17, TH * 0.2, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = `rgba(196,132,252,${pulse * 0.6})`
  ctx.beginPath()
  ctx.ellipse(cx, cy, TW * 0.06, TH * 0.07, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawFragileTile(ctx: CanvasRenderingContext2D, p: ReturnType<typeof makeProj>, col: number, row: number, TW: number, TH: number) {
  drawIsoTile(ctx, p, col, row, 3)
  const z = TILE_Z
  const pts = [p(col,row,z), p(col+1,row,z), p(col+1,row+1,z), p(col,row+1,z)]
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

function drawSwitchTile(ctx: CanvasRenderingContext2D, p: ReturnType<typeof makeProj>, col: number, row: number, tile: number, TW: number) {
  drawIsoTile(ctx, p, col, row, tile)
  const z = TILE_Z
  const pts = [p(col,row,z), p(col+1,row,z), p(col+1,row+1,z), p(col,row+1,z)]
  const cx = pts.reduce((s, pt) => s + pt.x, 0) / 4
  const cy = pts.reduce((s, pt) => s + pt.y, 0) / 4
  const r = TW * 0.17
  ctx.save()
  clipDiamond(ctx, p, col, row, z)
  if (tile === 4) {
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 1.5
    ctx.globalAlpha = 0.9
    ctx.beginPath()
    ctx.ellipse(cx, cy, r, r * 0.58, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = 'rgba(34,197,94,0.25)'
    ctx.fill()
    ctx.globalAlpha = 0.7
    ctx.fillStyle = '#22c55e'
    ctx.beginPath()
    ctx.ellipse(cx, cy, r * 0.35, r * 0.22, 0, 0, Math.PI * 2)
    ctx.fill()
  } else {
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
//  BLOCK ANIMATION SYSTEM
// ─────────────────────────────────────────────
const ANIM_DURATION = 0.18  // seconds per move
const FALL_DURATION = 0.55  // seconds for fall

function easeInOut(t: number): number {
  const c = Math.min(t, 1)
  return c < 0.5 ? 2 * c * c : 1 - 2 * (1 - c) * (1 - c)
}

type RotType = 'col-cw' | 'col-ccw' | 'row-cw' | 'row-ccw'
type AnimType = RotType | 'slide-col' | 'slide-row'

// When one tile is valid and one is void, the block tips over the valid edge
type FallConfig =
  | { type: 'straight' }
  | { type: 'tip'; pivot: number; rotType: RotType }

function computeFallConfig(block: BlockState, grid: number[][], brokenTiles: Set<string>): FallConfig {
  const { x1, y1, x2, y2 } = block
  if (x1 === x2 && y1 === y2) return { type: 'straight' }  // standing — free fall

  const ok = (x: number, y: number) => (grid[y]?.[x] ?? 0) !== 0 && !brokenTiles.has(`${x},${y}`)

  if (y1 === y2) {  // lying-h
    const lx = Math.min(x1, x2), rx = Math.max(x1, x2)
    const lv = ok(lx, y1), rv = ok(rx, y1)
    if (lv && !rv) return { type: 'tip', pivot: lx + 1, rotType: 'col-cw'  }  // right falls
    if (!lv && rv) return { type: 'tip', pivot: lx + 1, rotType: 'col-ccw' }  // left falls
    return { type: 'straight' }
  } else {          // lying-v
    const ty = Math.min(y1, y2), by = Math.max(y1, y2)
    const tv = ok(x1, ty), bv = ok(x1, by)
    if (tv && !bv) return { type: 'tip', pivot: ty + 1, rotType: 'row-cw'  }  // front falls
    if (!tv && bv) return { type: 'tip', pivot: ty + 1, rotType: 'row-ccw' }  // back falls
    return { type: 'straight' }
  }
}

// Rotate the block corners around the valid-tile edge and add quadratic gravity
function getTipCorners(block: BlockState, cfg: Extract<FallConfig, { type: 'tip' }>, ft: number): [number,number,number][] {
  const raw = blockCorners(block)
  const angle   = ft * Math.PI * 0.85   // tips ~153° — clearly past vertical
  const gravity = ft * ft * 3           // accelerating drop
  const cos = Math.cos(angle), sin = Math.sin(angle)
  const { pivot, rotType } = cfg

  return raw.map(([c, r, z]) => {
    const dz = z - TILE_Z
    let nc = c, nr = r, nz = z

    if (rotType === 'col-cw') {
      const dc = c - pivot
      nc = pivot + dc * cos + dz * sin
      nz = TILE_Z + (-dc * sin + dz * cos)
    } else if (rotType === 'col-ccw') {
      const dc = c - pivot
      nc = pivot + dc * cos - dz * sin
      nz = TILE_Z + ( dc * sin + dz * cos)
    } else if (rotType === 'row-cw') {
      const dr = r - pivot
      nr = pivot + dr * cos + dz * sin
      nz = TILE_Z + (-dr * sin + dz * cos)
    } else {  // row-ccw
      const dr = r - pivot
      nr = pivot + dr * cos - dz * sin
      nz = TILE_Z + ( dr * sin + dz * cos)
    }

    return [nc, nr, nz - gravity] as [number, number, number]
  })
}

interface AnimState {
  from: BlockState
  to: BlockState
  type: AnimType
  pivot: number
  t: number
}

function getAnimParams(from: BlockState, dir: Direction): { type: AnimType; pivot: number } {
  const orient = getOrientation(from)
  const col = Math.min(from.x1, from.x2)
  const row = Math.min(from.y1, from.y2)
  if (orient === 'standing') {
    if (dir === 'right') return { type: 'col-cw',  pivot: col + 1 }
    if (dir === 'left')  return { type: 'col-ccw', pivot: col }
    if (dir === 'down')  return { type: 'row-cw',  pivot: row + 1 }
    return                      { type: 'row-ccw', pivot: row }
  }
  if (orient === 'lying-h') {
    if (dir === 'right') return { type: 'col-cw',  pivot: col + 2 }
    if (dir === 'left')  return { type: 'col-ccw', pivot: col }
    if (dir === 'down')  return { type: 'row-cw',  pivot: row + 1 }  // bd=1
    return                      { type: 'row-ccw', pivot: row }
  }
  // lying-v: bd=2, bw=1
  if (dir === 'down')  return { type: 'row-cw',  pivot: row + 2 }
  if (dir === 'up')    return { type: 'row-ccw', pivot: row }
  if (dir === 'right') return { type: 'col-cw',  pivot: col + 1 }
  return                      { type: 'col-ccw', pivot: col }
}

function getBlockDims(block: BlockState) {
  const orient = getOrientation(block)
  const col = Math.min(block.x1, block.x2)
  const row = Math.min(block.y1, block.y2)
  return {
    col, row,
    bw: orient === 'lying-h' ? 2 : 1,
    bd: orient === 'lying-v' ? 2 : 1,
    bh: orient === 'standing' ? 2 : 1,
  }
}

// Rotate or slide a single 3D point according to the animation
function transformPt(
  c: number, r: number, z: number,
  anim: AnimState, eased: number
): [number, number, number] {
  const { type, pivot, from, to } = anim
  const angle = eased * Math.PI / 2
  const cos = Math.cos(angle), sin = Math.sin(angle)
  const dz = z - TILE_Z

  if (type === 'col-cw') {
    const dc = c - pivot
    return [pivot + dc * cos + dz * sin, r, TILE_Z + (-dc * sin + dz * cos)]
  }
  if (type === 'col-ccw') {
    const dc = c - pivot
    return [pivot + dc * cos - dz * sin, r, TILE_Z + (dc * sin + dz * cos)]
  }
  if (type === 'row-cw') {
    const dr = r - pivot
    return [c, pivot + dr * cos + dz * sin, TILE_Z + (-dr * sin + dz * cos)]
  }
  if (type === 'row-ccw') {
    const dr = r - pivot
    return [c, pivot + dr * cos - dz * sin, TILE_Z + (dr * sin + dz * cos)]
  }
  if (type === 'slide-col') {
    const dc = Math.min(to.x1, to.x2) - Math.min(from.x1, from.x2)
    return [c + dc * eased, r, z]
  }
  // slide-row
  const dr = Math.min(to.y1, to.y2) - Math.min(from.y1, from.y2)
  return [c, r + dr * eased, z]
}

// Build the 8 corners of the block box in 3D space
function blockCorners(block: BlockState, zOffset = 0): [number, number, number][] {
  const { col, row, bw, bd, bh } = getBlockDims(block)
  const bz = TILE_Z + zOffset
  const tz = bz + bh
  return [
    [col,    row,    bz],  // 0 back-left-bottom
    [col+bw, row,    bz],  // 1 back-right-bottom
    [col+bw, row+bd, bz],  // 2 front-right-bottom
    [col,    row+bd, bz],  // 3 front-left-bottom
    [col,    row,    tz],  // 4 back-left-top
    [col+bw, row,    tz],  // 5 back-right-top
    [col+bw, row+bd, tz],  // 6 front-right-top
    [col,    row+bd, tz],  // 7 front-left-top
  ]
}

function animCorners(anim: AnimState): [number, number, number][] {
  const eased = easeInOut(anim.t)
  return blockCorners(anim.from).map(([c, r, z]) => transformPt(c, r, z, anim, eased)) as [number, number, number][]
}

// Draw block from 8 pre-computed 3D corners
function drawBlock3D(
  ctx: CanvasRenderingContext2D,
  p: ReturnType<typeof makeProj>,
  corners: [number, number, number][],
  TW: number, TH: number,
  alpha = 1,
) {
  const pp = (i: number) => { const [c, r, z] = corners[i]; return p(c, r, z) }

  // Shadow
  const midC = (corners[0][0] + corners[6][0]) / 2
  const midR = (corners[0][1] + corners[6][1]) / 2
  const sc = p(midC, midR, TILE_Z)
  const sgrd = ctx.createRadialGradient(sc.x, sc.y + 4, 0, sc.x, sc.y + 4, TW * 1.4)
  sgrd.addColorStop(0, `rgba(59,130,246,${0.28 * alpha})`)
  sgrd.addColorStop(1, 'rgba(59,130,246,0)')
  ctx.fillStyle = sgrd
  ctx.fillRect(sc.x - TW * 2.5, sc.y - TH * 7, TW * 5, TH * 14)

  ctx.globalAlpha = alpha

  // Painter's order: back faces first, then right/front, then top
  poly(ctx, [pp(0), pp(1), pp(5), pp(4)], '#0f2560')  // back  (row=min)
  poly(ctx, [pp(0), pp(3), pp(7), pp(4)], '#152e74')  // left  (col=min)
  poly(ctx, [pp(1), pp(2), pp(6), pp(5)], '#1d4ed8')  // right (col=max)
  poly(ctx, [pp(3), pp(2), pp(6), pp(7)], '#2563eb')  // front (row=max)
  poly(ctx, [pp(4), pp(5), pp(6), pp(7)], '#3b82f6')  // top   (z=max)

  // Gradient shimmer on top face
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.beginPath()
  const tf = [pp(4), pp(5), pp(6), pp(7)]
  tf.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)))
  ctx.closePath()
  ctx.clip()
  const xs = tf.map(pt => pt.x), ys = tf.map(pt => pt.y)
  const lg = ctx.createLinearGradient(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys))
  lg.addColorStop(0, 'rgba(147,197,253,0.55)')
  lg.addColorStop(0.5, 'rgba(96,165,250,0.1)')
  lg.addColorStop(1, 'rgba(29,78,216,0.15)')
  ctx.fillStyle = lg
  ctx.fillRect(Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys))
  ctx.restore()

  // Top edge glow
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.shadowColor = '#60a5fa'
  ctx.shadowBlur = 10
  ctx.strokeStyle = '#93c5fd'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pp(4).x, pp(4).y)
  ctx.lineTo(pp(5).x, pp(5).y)
  ctx.stroke()
  ctx.restore()

  ctx.globalAlpha = 1
}

// ─────────────────────────────────────────────
//  COMPONENT
// ─────────────────────────────────────────────
export default function GameBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Read from store
  const storeBlock    = useGameStore(s => s.block)
  const currentLevel  = useGameStore(s => s.currentLevel)
  const brokenTiles   = useGameStore(s => s.brokenTiles)
  const dynamicGrid   = useGameStore(s => s.dynamicGrid)
  const isFalling     = useGameStore(s => s.isFalling)
  const isWinFalling  = useGameStore(s => s.isWinFalling)
  const lastMoveDir   = useGameStore(s => s.lastMoveDir)
  const setAnimating  = useGameStore(s => s.setAnimating)

  // Stable ref so the RAF loop always reads fresh state
  const stateRef = useRef({ storeBlock, currentLevel, brokenTiles, dynamicGrid, isFalling, isWinFalling, lastMoveDir })
  stateRef.current   = { storeBlock, currentLevel, brokenTiles, dynamicGrid, isFalling, isWinFalling, lastMoveDir }

  // Animation refs
  const animRef        = useRef<AnimState | null>(null)
  const prevBlockRef   = useRef<BlockState | null>(null)
  const prevLevelRef   = useRef(currentLevel)
  const fallTRef       = useRef(0)
  const fallConfigRef  = useRef<FallConfig>({ type: 'straight' })
  const prevFallingRef = useRef(false)
  const animatingRef   = useRef(false)
  const setAnimRef     = useRef(setAnimating)
  setAnimRef.current   = setAnimating

  // Start roll animation when block changes
  useEffect(() => {
    const levelChanged = currentLevel !== prevLevelRef.current
    prevLevelRef.current = currentLevel

    if (levelChanged) {
      animRef.current    = null
      animatingRef.current = false
      fallTRef.current   = 0
      prevFallingRef.current = false
      prevBlockRef.current = storeBlock
      setAnimRef.current(false)
      return
    }

    const prev = prevBlockRef.current
    if (prev !== null && lastMoveDir !== null) {
      const params = getAnimParams(prev, lastMoveDir)
      animRef.current = { from: prev, to: storeBlock, t: 0, ...params }
      if (!animatingRef.current) {
        animatingRef.current = true
        setAnimRef.current(true)
      }
    }
    prevBlockRef.current = storeBlock
  }, [storeBlock, currentLevel, lastMoveDir])

  // Reset fall state when any falling starts.
  // Do NOT cancel the roll — let it complete first, then the fall kicks in.
  useEffect(() => {
    const falling = isFalling || isWinFalling
    if (falling && !prevFallingRef.current) {
      fallTRef.current = 0
      if (isFalling) {
        // Death fall: check which tile is valid to decide tip vs straight
        const { dynamicGrid, brokenTiles, currentLevel } = stateRef.current
        const level = LEVELS[currentLevel]
        const grid = dynamicGrid ?? level?.grid ?? []
        fallConfigRef.current = computeFallConfig(storeBlock, grid, brokenTiles)
      } else {
        // Win fall: block sinks straight into the goal hole
        fallConfigRef.current = { type: 'straight' }
      }
    }
    prevFallingRef.current = falling
  }, [isFalling, isWinFalling, storeBlock])

  // Stable RAF loop — runs once, reads everything via refs
  useEffect(() => {
    let rafId: number
    let lastNow = performance.now()

    const loop = (now: number) => {
      const dt = Math.min((now - lastNow) / 1000, 0.1)
      lastNow = now
      const time = now / 1000

      const { storeBlock, currentLevel, brokenTiles, dynamicGrid, isFalling, isWinFalling } = stateRef.current
      const falling = isFalling || isWinFalling
      const level = LEVELS[currentLevel]
      const canvas = canvasRef.current
      if (!canvas || !level) { rafId = requestAnimationFrame(loop); return }
      const ctx = canvas.getContext('2d')
      if (!ctx) { rafId = requestAnimationFrame(loop); return }

      const grid = dynamicGrid ?? level.grid
      const rows = grid.length
      const cols = grid[0]?.length ?? 0

      // Adaptive sizing
      const vw = Math.min(window.innerWidth - 8, 560)
      const vh = window.innerHeight * 0.54
      const tileByW = (vw * 0.95) / ((cols + rows) * 0.5)
      const tileByH = (vh * 0.88) / ((cols + rows) * 0.25 + 2.5)
      const TW = Math.floor(Math.min(tileByW, tileByH, 80))
      const TH = Math.floor(TW / 2)
      const PAD_X = Math.ceil(TW * 0.4)
      const PAD_Y = Math.ceil(TH * 2.8)
      const cW = (cols + rows) * Math.ceil(TW / 2) + PAD_X * 2
      const cH = (cols + rows) * Math.ceil(TH / 2) + PAD_Y + Math.ceil(TH * 1.2)
      const ox = rows * Math.ceil(TW / 2) + PAD_X
      const oy = PAD_Y
      if (canvas.width !== cW)  canvas.width  = cW
      if (canvas.height !== cH) canvas.height = cH

      // Advance roll — always runs, even during falling, so the roll completes first
      if (animRef.current) {
        animRef.current.t += dt / ANIM_DURATION
        if (animRef.current.t >= 1) {
          animRef.current = null
          if (animatingRef.current && !falling) {
            animatingRef.current = false
            setAnimRef.current(false)
          } else {
            animatingRef.current = false
          }
        }
      }

      // Advance fall only once the roll animation is done
      if (falling && !animRef.current) {
        fallTRef.current = Math.min(fallTRef.current + dt / FALL_DURATION, 1)
      }

      const p = makeProj(TW, TH, ox, oy)

      ctx.clearRect(0, 0, cW, cH)

      // Ambient glow
      const bg = ctx.createRadialGradient(cW/2, cH*0.58, 0, cW/2, cH*0.58, cW*0.65)
      bg.addColorStop(0, 'rgba(30,58,138,0.13)')
      bg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, cW, cH)

      // Tiles — painter's order
      const tiles: { col: number; row: number; tile: number }[] = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const tile = grid[r]?.[c] ?? 0
          if (tile !== 0 && !brokenTiles.has(`${c},${r}`)) tiles.push({ col: c, row: r, tile })
        }
      }
      tiles.sort((a, b) => (a.col + a.row) - (b.col + b.row))
      for (const { col, row, tile } of tiles) {
        if (tile === 2)            drawGoalTile(ctx, p, col, row, TW, TH, time)
        else if (tile === 3)       drawFragileTile(ctx, p, col, row, TW, TH)
        else if (tile === 4 || tile === 5) drawSwitchTile(ctx, p, col, row, tile, TW)
        else                       drawIsoTile(ctx, p, col, row, tile)
      }

      // Block
      let corners: [number, number, number][]
      let alpha = 1

      if (falling && !animRef.current) {
        // Roll done — tip or straight fall depending on which tile was valid
        const ft  = fallTRef.current
        alpha     = Math.max(0, 1 - ft * 1.8)
        const cfg = fallConfigRef.current
        if (cfg.type === 'tip') {
          corners = getTipCorners(storeBlock, cfg, ft)
        } else {
          corners = blockCorners(storeBlock, -ft * 4)
        }
      } else if (animRef.current) {
        corners = animCorners(animRef.current)
      } else {
        corners = blockCorners(storeBlock)
      }

      drawBlock3D(ctx, p, corners, TW, TH, alpha)

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, []) // stable — reads state via stateRef

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      style={{ display: 'block', maxWidth: '100%', imageRendering: 'crisp-edges' }}
    />
  )
}
