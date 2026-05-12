# Squared — Puzzle Game

Juego de puzzle inspirado en Bloxorz. Rueda el bloque por el tablero isométrico y cáelo de pie en el agujero objetivo.

## Stack

- React 19 + TypeScript + Vite
- Zustand (estado global)
- Tailwind CSS
- Capacitor (Android)
- Canvas 2D (renderizado isométrico custom)

## Pantallas

1. **Splash** — animación de entrada
2. **Home** — menú principal
3. **Niveles** — selector de niveles con estrellas
4. **Juego** — tablero isométrico con D-Pad y controles de teclado
5. **Completado** — resultado con estrellas y tiempo
6. **Game Over** — pantalla de derrota
7. **Ajustes** — toggle de sonido, vibración y reset de progreso
8. **Créditos** — equipo y tecnologías

## Controles

| Acción | Teclado |
|---|---|
| Mover | Flechas o WASD |
| Reiniciar nivel | R |
| Pausar | Pausa en pantalla |

## Cómo correr

```bash
npm install
npm run dev
```

## Niveles

15 niveles con dificultad progresiva. Mecánicas incluidas:
- Baldosas frágiles (se rompen si te paras sobre ellas)
- Switches suaves (se activan con cualquier contacto)
- Switches duros (solo se activan de pie)

## Equipo

| Nombre | GitHub |
|---|---|
| Daniel | @dano796 |
| Emanuel | @emanuel0428 |
| Anthony | @thony-arango |
