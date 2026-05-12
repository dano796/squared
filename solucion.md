# Soluciones — Squared (Niveles 11–15)

Soluciones óptimas encontradas por BFS. Flechas: ↑ arriba · ↓ abajo · ← izquierda · → derecha.

---

## Nivel 11 — The Split
**Movimientos óptimos:** 8
**Solución:** ↓ → → ↓ ↓ → → ↓

```
[0, 1, 1, 1, 0, 0]
[0, 1, 1, 1, 0, 0]
[0, 1, 1, 1, 1, 1]
[0, 0, 3, 1, 1, 1]
[0, 0, 1, 1, 3, 1]
[0, 0, 1, 1, 1, 1]
[0, 0, 0, 0, 1, 2]
```
Start: parado en (1,0)

---

## Nivel 12 — Switchback
**Movimientos óptimos:** 7
**Solución:** ↓ ← ↓ → → ↓ ↓

```
[0, 1, 1, 1, 0, 0]
[0, 1, 1, 1, 0, 0]
[1, 1, 1, 1, 1, 0]
[1, 4, 1, 0, 1, 0]   ← interruptor suave en (1,3) abre (3,3) y (3,4)
[1, 1, 1, 0, 1, 0]
[0, 1, 1, 1, 1, 0]
[0, 0, 0, 1, 2, 0]
```
Start: parado en (2,0)

---

## Nivel 13 — Glass Floor
**Movimientos óptimos:** 9
**Solución:** ↓ → ↓ ↓ → → ↓ → →

```
[1, 1, 1, 0, 0, 0, 0]
[1, 3, 1, 1, 1, 0, 0]
[1, 1, 3, 1, 3, 1, 0]
[0, 1, 1, 1, 1, 1, 0]
[0, 3, 1, 3, 1, 3, 1]
[0, 1, 1, 1, 1, 1, 1]
[0, 0, 0, 1, 1, 1, 2]
```
Start: parado en (0,0)

---

## Nivel 14 — The Gate
**Movimientos óptimos:** 16
**Solución:** ↓ ↓ ↓ ↓ ← ↑ → ↑ → ↑ → ↓ ↓ ↓ → ↓

```
[0, 1, 1, 1, 1, 0, 0]
[0, 1, 1, 1, 1, 0, 0]
[1, 1, 1, 0, 1, 1, 1]
[1, 5, 1, 0, 1, 1, 1]   ← interruptor duro en (1,3) abre (3,2)
[1, 1, 1, 0, 3, 1, 1]
[0, 0, 0, 0, 1, 1, 1]
[0, 0, 0, 0, 1, 2, 1]
```
Start: tumbado horizontal en (1,0)-(2,0)

---

## Nivel 15 — Endgame
**Movimientos óptimos:** 11
**Solución:** ↓ ↓ ↓ ← ↓ ↓ → ↓ → → →

```
[0, 0, 1, 1, 1, 0, 0, 0]
[0, 0, 1, 1, 1, 0, 0, 0]
[0, 1, 1, 3, 1, 1, 0, 0]
[0, 1, 1, 1, 0, 1, 0, 0]
[1, 1, 0, 0, 0, 4, 1, 1]   ← interruptor suave en (5,4)
[1, 3, 1, 1, 1, 1, 3, 1]
[1, 1, 1, 1, 1, 1, 1, 1]
[0, 0, 5, 1, 1, 3, 1, 2]   ← interruptor duro en (2,7)
```
Start: tumbado horizontal en (2,0)-(3,0)

**Interruptores:**
- Suave (5,4): alterna (3,3) y (4,3)
- Duro (2,7): alterna (3,6) — requiere estar parado
