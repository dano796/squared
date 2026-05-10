import { useEffect, useRef, useCallback, useState } from "react";
import { ChevronLeft, Pause, RotateCcw } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { LEVELS } from "../data/levels";
import GameBoard from "./GameBoard";
import DPad from "./DPad";
import type { Direction } from "../logic/blockLogic";

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
    if (!isAnimating && bufferedMove.current && screen === "game") {
      const dir = bufferedMove.current;
      bufferedMove.current = null;
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
        moveBlock(dir);
      }
    },
    [screen, moveBlock, isPaused],
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
              fontSize: "0.65rem",
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
            background: "radial-gradient(circle at 30% 20%, rgba(20, 20, 36, 0.9), rgba(6, 6, 12, 0.88))",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
          }}
        >
          <div
            style={{
              width: "min(420px, 90vw)",
              background: "linear-gradient(180deg, #141422 0%, #0e0e18 100%)",
              border: "1px solid #23233a",
              borderRadius: 16,
              padding: "22px 20px",
              boxShadow:
                "0 18px 40px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(107, 124, 248, 0.08)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 48,
                height: 4,
                margin: "0 auto 12px",
                borderRadius: 999,
                background: "linear-gradient(90deg, #6b7cf8, #9ba7ff)",
                boxShadow: "0 0 12px rgba(107, 124, 248, 0.5)",
              }}
            />
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "1.15rem",
                color: "#e6e4f0",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Paused
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 400,
                fontSize: "0.75rem",
                color: "#7a7aa2",
                letterSpacing: "0.08em",
              }}
            >
              Level {String(level.id).padStart(2, "0")} · {level.name}
            </div>

            <div
              style={{
                display: "grid",
                gap: 10,
                marginTop: 18,
              }}
            >
              <button
                onClick={() => setIsPaused(false)}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "#0b0b12",
                  background: "linear-gradient(180deg, #6b7cf8 0%, #8d9bfc 80%)",
                  border: "1px solid rgba(155, 167, 255, 0.6)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  cursor: "pointer",
                  boxShadow: "0 10px 20px rgba(107, 124, 248, 0.25)",
                }}
              >
                Resume
              </button>
              <button
                onClick={() => {
                  setIsPaused(false);
                  resetLevel();
                }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "#6b7cf8",
                  background: "rgba(107, 124, 248, 0.08)",
                  border: "1px solid #2f3352",
                  borderRadius: 10,
                  padding: "10px 14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <RotateCcw size={15} strokeWidth={2} />
                Reset Level
              </button>
              <button
                onClick={() => {
                  setIsPaused(false);
                  setScreen("levelSelect");
                }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "#9a9abd",
                  background: "rgba(20, 20, 32, 0.6)",
                  border: "1px solid #25253d",
                  borderRadius: 10,
                  padding: "10px 14px",
                  cursor: "pointer",
                }}
              >
                Exit to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
