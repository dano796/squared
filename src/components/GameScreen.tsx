import { useEffect, useRef, useCallback, useState } from "react";
import { ChevronLeft, Pause } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { LEVELS } from "../data/levels";
import GameBoard from "./GameBoard";
import DPad from "./DPad";
import type { Direction } from "../logic/blockLogic";
import { playGameOver, playMove, playTileBreak, playTileUnlock, playWin } from "../utils/sounds";

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const statLabel: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 400,
  fontSize: "0.6rem",
  letterSpacing: "0.15em",
  color: "#4a4a70",
  textTransform: "uppercase",
  marginTop: 2,
};

const statValue: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 700,
  fontSize: "1.1rem",
  color: "#e6e4f0",
  lineHeight: 1,
};

export default function GameScreen() {
  const {
    currentLevel,
    moves,
    time,
    screen,
    moveBlock,
    resetLevel,
    setScreen,
    tickTime,
    isAnimating,
    isFalling,
    isWinFalling,
    switchEventCount,
    tileBreakCount,
  } = useGameStore();
  const [isPaused, setIsPaused] = useState(false);
  const level = LEVELS[currentLevel];
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bufferedMove = useRef<Direction | null>(null);
  const isBusyRef = useRef(false);

  useEffect(() => {
    isBusyRef.current = isAnimating || isFalling || isWinFalling;
  }, [isAnimating, isFalling, isWinFalling]);

  useEffect(() => {
    if (isFalling) playGameOver();
  }, [isFalling]);

  useEffect(() => {
    if (switchEventCount > 0) playTileUnlock();
  }, [switchEventCount]);

  useEffect(() => {
    if (tileBreakCount > 0) playTileBreak();
  }, [tileBreakCount]);

  useEffect(() => {
    if (isWinFalling) playWin();
  }, [isWinFalling]);

  useEffect(() => {
    if (!isAnimating && bufferedMove.current && screen === "game") {
      const dir = bufferedMove.current;
      bufferedMove.current = null;
      playMove();
      moveBlock(dir);
    }
  }, [isAnimating, screen, moveBlock]);

  useEffect(() => {
    if (screen !== "game" || isPaused) return;
    timerRef.current = setInterval(tickTime, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen, tickTime, isPaused]);

  useEffect(() => {
    if (screen !== "game") setIsPaused(false);
  }, [screen]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (screen !== "game" || isPaused) return;
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        resetLevel();
        return;
      }
      const map: Record<string, Direction> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      if (isBusyRef.current) {
        bufferedMove.current = dir;
      } else {
        playMove();
        moveBlock(dir);
      }
    },
    [screen, moveBlock, resetLevel, isPaused],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (!level) return null;

  return (
    <div
      className="fixed inset-0 flex flex-col screen-enter"
      style={{ background: "#0e0e14" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px 10px",
          borderBottom: "1px solid #1a1a28",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setScreen("levelSelect")}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            fontSize: "0.82rem",
            color: "#6b7cf8",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <ChevronLeft size={15} strokeWidth={2} />
          Exit
        </button>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#e6e4f0",
              letterSpacing: "0.04em",
            }}
          >
            {level.name}
          </div>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 400,
              fontSize: "0.8rem",
              color: "#3a3a5e",
              letterSpacing: "0.1em",
            }}
          >
            Level {String(level.id).padStart(2, "0")}
          </div>
        </div>

        <button
          onClick={() => setIsPaused(true)}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            fontSize: "0.82rem",
            color: "#6b7cf8",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Pause size={14} strokeWidth={2} />
          Pause
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          padding: "10px 0",
          borderBottom: "1px solid #141420",
          flexShrink: 0,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={statValue}>{moves}</div>
          <div style={statLabel}>Moves</div>
        </div>
        <div style={{ width: 1, height: 28, background: "#1e1e30" }} />
        <div style={{ textAlign: "center" }}>
          <div style={statValue}>{formatTime(time)}</div>
          <div style={statLabel}>Time</div>
        </div>
        <div style={{ width: 1, height: 28, background: "#1e1e30" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ ...statValue, color: "#c9963a" }}>
            {level.optimalMoves}
          </div>
          <div style={statLabel}>Optimal</div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <GameBoard />
      </div>

      {/* D-Pad */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 28,
          paddingTop: 8,
        }}
      >
        <DPad
          onMove={(dir) => {
            if (isPaused) return;
            if (isBusyRef.current) {
              bufferedMove.current = dir;
            } else {
              playMove();
              moveBlock(dir);
            }
          }}
        />
      </div>

      {isPaused && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(6, 6, 12, 0.82)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
          }}
        >
          <div
            style={{
              width: "min(340px, 90vw)",
              background: "#12121c",
              border: "1px solid #1e1e2e",
              borderRadius: 20,
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              textAlign: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.8rem",
                  color: "#e6e4f0",
                  letterSpacing: "0.06em",
                  marginBottom: 4,
                }}
              >
                Paused
              </div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.8rem",
                  color: "#4a4a70",
                }}
              >
                Level {String(level.id).padStart(2, "0")} · {level.name}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                width: "100%",
              }}
            >
              <button
                onClick={() => setIsPaused(false)}
                style={{
                  width: "100%",
                  padding: "14px 0",
                  borderRadius: 12,
                  border: "none",
                  background: "#6b7cf8",
                  color: "#fff",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(107,124,248,0.3)",
                  transition: "transform 0.08s",
                }}
                onPointerDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                onPointerUp={(e) => (e.currentTarget.style.transform = "")}
                onPointerLeave={(e) => (e.currentTarget.style.transform = "")}
              >
                Resume
              </button>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => { setIsPaused(false); resetLevel(); }}
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    borderRadius: 12,
                    border: "1px solid #1e1e2e",
                    background: "rgba(255,255,255,0.03)",
                    color: "#7070a0",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "transform 0.08s",
                  }}
                  onPointerDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                  onPointerUp={(e) => (e.currentTarget.style.transform = "")}
                  onPointerLeave={(e) => (e.currentTarget.style.transform = "")}
                >
                  Retry
                </button>
                <button
                  onClick={() => { setIsPaused(false); setScreen("levelSelect"); }}
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    borderRadius: 12,
                    border: "1px solid #1e1e2e",
                    background: "rgba(255,255,255,0.03)",
                    color: "#7070a0",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "transform 0.08s",
                  }}
                  onPointerDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                  onPointerUp={(e) => (e.currentTarget.style.transform = "")}
                  onPointerLeave={(e) => (e.currentTarget.style.transform = "")}
                >
                  Levels
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
