import bonkUrl from "../../sounds/fall.mp3?url";
import winUrl from "../../sounds/final_move.mp3?url";
import moveUrl from "../../sounds/move.mp3?url";
import levelUpUrl from "../../sounds/level_up.mp3?url";
import tileUnlockUrl from "../../sounds/tile_unlock.mp3?url";
import tileBreakUrl from "../../sounds/tile_break.mp3?url";
import { useGameStore } from "../store/gameStore";

function play(url: string) {
  if (!useGameStore.getState().soundEnabled) return;
  const audio = new Audio(url);
  audio.play().catch(() => {});
}

export const playGameOver = () => play(bonkUrl);
export const playWin = () => play(winUrl);
export const playMove = () => play(moveUrl);
export const playLevelUp = () => play(levelUpUrl);
export const playTileUnlock = () => play(tileUnlockUrl);
export const playTileBreak = () => play(tileBreakUrl);
