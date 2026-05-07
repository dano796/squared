# SQUARED — Plan de Mejora

## Diagnóstico

### Nivel 1 — irresoluble
El objetivo está en `(col:6, row:3)`. Para ganar, el bloque debe llegar **de pie** sobre ese tile.
Las únicas aproximaciones válidas requieren un tile en `(6,4)` (desde abajo) o en `(5,3)` (desde la izquierda).
Ninguno existe en el grid actual. El nivel no tiene solución.

### Nivel 2 — irresoluble
Desde el start `(col:0, rows:2-3)` lying-v, el único movimiento válido es bajar a standing en `(0,4)`.
Desde ahí, los puentes al este se cortan en `col:3` (vacío). No hay camino continuo hasta el objetivo en `(4,6)`.

### Niveles 3–5 — requieren verificación
Tienen estructuras más complejas; hay que trazar el camino completo antes de confirmar que son solubles.

---

## Fase 1 — Rediseño de niveles

**Prioridad máxima.** Sin niveles solubles, el resto no importa.

### Criterios de diseño

- Cada nivel se verifica trazando el camino óptimo a mano **antes** de guardarlo en código.
- Los caminos deben ser suficientemente anchos para permitir ambas orientaciones del bloque.
- La dificultad sube de forma progresiva; cada nivel introduce exactamente una mecánica nueva.

### Progresión objetivo

| # | Nombre | Mecánica introducida | Dificultad |
|---|--------|----------------------|------------|
| 1 | First Steps | Movimiento básico, orientaciones | Muy fácil |
| 2 | Bridge Walk | Puentes de 1 tile (la orientación importa) | Fácil |
| 3 | Careful Steps | Tiles frágiles | Medio |
| 4 | The Switch | Switch soft (activa con cualquier contacto) | Medio-alto |
| 5 | Hard Target | Switch hard (solo activa de pie) + frágiles | Difícil |

### Archivos a modificar

- `src/data/levels.ts` — redefinir los grids de los 5 niveles y ajustar `optimalMoves` y `start`.

---

## Fase 2 — Animación de caída

El flag `isFalling` ya existe en el store pero `GameBoard` nunca lo consume.
Es el cambio más simple de las tres animaciones y tiene alto impacto visual.

### Diseño

1. `GameBoard` lee `isFalling` desde el store.
2. Cuando es `true`, animar el bloque cayendo en el eje z (desciende por debajo de la superficie de los tiles).
3. Al mismo tiempo, hacer fade out de la opacidad del bloque.
4. Duración total: ~500 ms. Al terminar, el store cambia a `screen: 'gameOver'`.
5. El timeout actual en el store (700 ms) se ajusta para sincronizarse con la animación.

### Implementación

- Agregar `fallProgress` (0→1) como ref local en `GameBoard` manejado por el rAF loop.
- En `drawBlock`, recibir `fallProgress` y aplicar `z -= fallProgress * 4` + `globalAlpha = 1 - fallProgress`.
- Cuando `isFalling` pasa a `false`, resetear `fallProgress` a 0.

### Archivos a modificar

- `src/components/GameBoard.tsx` — leer `isFalling`, animar z y opacidad del bloque.

---

## Fase 3 — Animación de movimiento (roll)

El cambio técnico más importante. Define completamente la "sensación" del juego.
Actualmente el bloque teletransporta a la nueva posición en cada frame.

### Diseño del sistema de animación

**Estado de animación** (ref local en `GameBoard`, no en el store):
```ts
interface AnimState {
  from: BlockState
  to: BlockState
  dir: Direction
  t: number        // progreso 0 → 1
  active: boolean
}
```

**Flujo por movimiento:**
1. El usuario presiona una tecla.
2. Si hay animación activa, el input se descarta (o se encola, ver Fase 5).
3. El store calcula `newBlock` y valida el resultado.
4. Si es válido/win: se guarda `animState = { from: currentBlock, to: newBlock, active: true, t: 0 }`.
5. El estado del store (`block`) se actualiza al **final** de la animación, no al inicio.
6. El rAF loop avanza `t` cada frame (`t += dt / ANIM_DURATION`).
7. Al llegar `t >= 1`, se confirma el nuevo estado y la animación termina.

### Interpolación por tipo de roll

El bloque siempre rota alrededor de una **arista pivote** (el borde en la dirección del movimiento).

| Transición | Tipo | Pivote |
|------------|------|--------|
| Standing → Lying-H/V | Rotación 90° | Borde frontal/trasero/izq/der |
| Lying-H/V → Standing | Rotación 90° | Borde opuesto al movimiento |
| Lying → Lying (slide) | Traslación lineal | N/A |

**Implementación de la rotación:**

Para cada frame con progreso `t`:
1. Calcular el pivote en coordenadas de grilla (arista 3D del bloque).
2. Aplicar rotación de `angle = t * 90°` alrededor del pivote en espacio 3D `(col, row, z)`.
3. Proyectar los vértices rotados con `makeProj` y dibujar el bloque resultante.
4. Usar `easeInOut` para suavizar la curva (`t' = t<0.5 ? 2t² : 1-2(1-t)²`).

**Duración:** 180 ms por movimiento.

### Archivos a modificar

- `src/store/gameStore.ts` — exponer `pendingMove` o separar "calcular" de "confirmar".
- `src/components/GameBoard.tsx` — gestionar `animState` como ref, interpolar vértices del bloque.
- `src/components/GameScreen.tsx` — bloquear input mientras `animating`.

---

## Fase 4 — Toggle real de switches

### Problema actual
Los switches son **one-shot**: al activarse cambian los tiles a un valor fijo y nunca regresan.
En Bloxorz, los switches **alternan** (toggle): cada activación invierte el estado de los tiles objetivo.

### Diseño

Modificar la interfaz `Switch` para soportar toggle real:
```ts
interface Switch {
  x: number
  y: number
  type: 'soft' | 'hard'
  activated: boolean       // estado actual
  toggleTiles?: {
    x: number
    y: number
    on: number             // valor cuando activated=true
    off: number            // valor cuando activated=false
  }[]
}
```

En `gameStore.ts`, al activar un switch: invertir `activated` y aplicar el valor `on`/`off` correspondiente.
Guardar el estado de switches en `dynamicGrid` junto con `activatedSwitches: Set<number>`.

### Archivos a modificar

- `src/data/levels.ts` — agregar campos `on`/`off` a `toggleTiles`.
- `src/logic/levelValidator.ts` — actualizar `getActivatedSwitches` para devolver los índices a togglear.
- `src/store/gameStore.ts` — mantener `activatedSwitches` y aplicar toggle correcto.

---

## Fase 5 — Pulido final

### Input buffer
Encolar **un** movimiento mientras la animación está activa.
Al terminar la animación, ejecutar el movimiento encolado inmediatamente.
Esto hace que el juego se sienta responsive sin permitir que el jugador se adelante más de un paso.

### Tile split (mecánica avanzada)
Bloxorz tiene un tile especial (valor `6`) que cuando el bloque lo cubre **acostado**, lo parte en dos mitades independientes que se controlan por separado.
Esta mecánica es compleja y va en niveles 6+. Se deja para una iteración futura.

### Shake en game over
Cuando el bloque cae por el borde de un tile (no por vacío sino por resbalar), la cámara hace un leve shake.
Usar `isShaking` que ya está declarado en el store pero nunca se usa.

---

## Orden de ejecución

```
[x] Fase 1 — Rediseño de niveles        → el juego es jugable de punta a punta
[x] Fase 2 — Animación de caída         → tip/straight fall con fade-out
[x] Fase 3 — Animación de movimiento    → roll 3D con pivot rotation + easeInOut
[x] Fase 4 — Toggle real de switches    → on/off per tile, activatedSwitches Set
[x] Fase 5 — Pulido final               → input buffer (1 move) + canvas shake
```

---

## Archivos involucrados (resumen)

| Archivo | Fases |
|---------|-------|
| `src/data/levels.ts` | 1, 4 |
| `src/logic/levelValidator.ts` | 4 |
| `src/store/gameStore.ts` | 3, 4, 5 |
| `src/components/GameBoard.tsx` | 2, 3 |
| `src/components/GameScreen.tsx` | 3, 5 |
