# Squared — Juego de Puzzle

## Descripción

Juego de puzzle inspirado en Bloxorz. Mueve el bloque por un tablero isométrico y hazlo caer de pie en el agujero objetivo. 15 niveles de dificultad progresiva, renderizado isométrico y diseño mobile-first empaquetado como app nativa Android mediante Capacitor.

## Stack Tecnológico

- **React 19 + TypeScript** — framework principal de UI
- **Vite** — bundler y servidor de desarrollo
- **Zustand** — manejo de estado global
- **Tailwind CSS + estilos en línea** — estilos de la interfaz
- **Canvas 2D** — motor de renderizado isométrico custom
- **Capacitor** — empaquetado nativo para Android

## Renderizado de niveles

El tablero se dibuja sobre un elemento `<canvas>` usando la API 2D del navegador. Cada nivel está definido en `src/data/levels.ts` como un grid de tiles con sus tipos (normal, frágil, switch, agujero). En cada frame, `GameBoard.tsx` recorre el grid y proyecta cada celda al espacio isométrico usando una transformación matemática simple, dibujando primero el fondo y luego el bloque encima.

El bloque es representado por dos puntos en el grid: `(x1, y1)` y `(x2, y2)`, donde `x` es la columna y `y` es la fila.

Cuando el bloque está de pie, ambos puntos coinciden (`x1 === x2`, `y1 === y2`) y ocupa una sola celda. Cuando está acostado, `y1 === y2` pero `x1 !== x2`, ocupando dos columnas seguidas. Cuando está acostado verticalmente, `x1 === x2` pero `y1 !== y2`, ocupando dos filas.

Esta representación determina qué celdas ocupa y cómo interactúa con los tiles especiales.

## Estado global con Zustand

El estado del juego vive en un único store, definido en `src/store/gameStore.ts`. Esto incluye el nivel actual, la posición y orientación del bloque, los movimientos realizados, el tiempo transcurrido, el progreso desbloqueado y la pantalla visible.

Los componentes se suscriben solo a los valores que necesitan, lo que evita re-renders innecesarios. Las acciones como `moveBlock`, `resetLevel` o `startLevel` mutan el estado directamente dentro del store, manteniendo la lógica del juego separada de la UI.

## Pantallas

1. **Splash** — animación de entrada al abrir la app
2. **Home** — menú principal
3. **Niveles** — grid de niveles con estrellas y estado de bloqueo
4. **Juego** — tablero isométrico con D-Pad en pantalla y soporte de teclado
5. **Completado** — resumen con puntaje, movimientos y tiempo
6. **Game Over** — pantalla de derrota con opción de reintento y salida
7. **Ajustes** — toggle de sonido, vibración y reinicio de progreso
8. **Créditos** — inspitación, tecnologías y equipo

## Mecánicas

| Mecánica              | Descripción                                                                   |
| --------------------- | ----------------------------------------------------------------------------- |
| Movimiento del bloque | El bloque rueda sobre sus aristas; su orientación puede ser de pie o acostado |
| Baldosas frágiles     | Se rompen tras ser pisadas una vez                                            |
| Switches suaves       | Se activan con cualquier contacto (de pie o acostado)                         |
| Switches duros        | Solo se activan cuando el bloque está de pie                                  |
| Tile objetivo         | El bloque debe caer de pie sobre el agujero objetivo                          |

---

### Desarrollado por

- Daniel Ortiz Aristizábal - 000186841
- Emanuel Londoño Osorio - 000507237
- Anthony Arango Betancur

### Aplicaciones Móviles - Universidad Pontificia Bolivariana
