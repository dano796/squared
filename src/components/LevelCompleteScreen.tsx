import { useEffect, useState } from "react";
import { Star as StarIcon } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { LEVELS } from "../data/levels";

function Star({ index, earned }: { index: number; earned: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200 + index * 250);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <span
      style={{
        display: "inline-block",
        color: earned ? "#c9963a" : "#1e1e30",
        filter:
          earned && visible
            ? "drop-shadow(0 0 6px rgba(201,150,58,0.5))"
            : "none",
        animation:
          visible && earned
            ? "star-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
            : undefined,
        opacity: visible ? 1 : 0,
        transform: visible ? undefined : "scale(0)",
      }}
    >
      <StarIcon size={44} strokeWidth={1.5} fill={earned ? "#c9963a" : "none"} />
    </span>
  );
}

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "0.875rem",
};

export default function LevelCompleteScreen() {
  const {
    currentLevel,
    moves,
    time,
    levelStars,
    unlockedLevels,
    setScreen,
    startLevel,
  } = useGameStore();
  const level = LEVELS[currentLevel];
  const stars = levelStars[currentLevel] ?? 0;
  const hasNext = currentLevel + 1 < LEVELS.length;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center screen-enter"
      style={{
        background:
          "linear-gradient(160deg, #12121c 0%, #0e0e14 60%, #101814 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          padding: "0 24px",
          width: "100%",
          maxWidth: 340,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: "1.8rem",
              color: "#5aaf7a",
              letterSpacing: "0.06em",
              marginBottom: 4,
            }}
          >
            Cleared!
          </div>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 400,
              fontSize: "0.8rem",
              color: "#4a4a70",
            }}
          >
            {level?.name}
          </div>
        </div>

        {/* Stars */}
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <Star key={i} index={i} earned={i < stars} />
          ))}
        </div>

        {/* Stats card */}
        <div
          style={{
            width: "100%",
            borderRadius: 16,
            border: "1px solid #1e2e20",
            background: "#121a14",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={rowStyle}>
            <span style={{ color: "#4a7055", fontWeight: 500 }}>Moves</span>
            <span style={{ color: "#e6e4f0", fontWeight: 600 }}>{moves}</span>
          </div>
          <div style={{ height: 1, background: "#1a281c" }} />
          <div style={rowStyle}>
            <span style={{ color: "#4a7055", fontWeight: 500 }}>Time</span>
            <span style={{ color: "#e6e4f0", fontWeight: 600 }}>
              {formatTime(time)}
            </span>
          </div>
          <div style={{ height: 1, background: "#1a281c" }} />
          <div style={rowStyle}>
            <span style={{ color: "#4a7055", fontWeight: 500 }}>Optimal moves</span>
            <span style={{ color: "#c9963a", fontWeight: 600 }}>{level?.optimalMoves}</span>
          </div>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            width: "100%",
          }}
        >
          {hasNext && unlockedLevels.includes(currentLevel + 1) && (
            <button
              onClick={() => startLevel(currentLevel + 1)}
              style={{
                width: "100%",
                padding: "14px 0",
                borderRadius: 12,
                border: "none",
                background: "#5aaf7a",
                color: "#fff",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "0.95rem",
                letterSpacing: "0.04em",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(90,175,122,0.3)",
                transition: "transform 0.08s",
              }}
              onPointerDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.97)")
              }
              onPointerUp={(e) => (e.currentTarget.style.transform = "")}
              onPointerLeave={(e) => (e.currentTarget.style.transform = "")}
            >
              Next Level
            </button>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => startLevel(currentLevel)}
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
              onPointerDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.97)")
              }
              onPointerUp={(e) => (e.currentTarget.style.transform = "")}
              onPointerLeave={(e) => (e.currentTarget.style.transform = "")}
            >
              Retry
            </button>
            <button
              onClick={() => setScreen("levelSelect")}
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
              onPointerDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.97)")
              }
              onPointerUp={(e) => (e.currentTarget.style.transform = "")}
              onPointerLeave={(e) => (e.currentTarget.style.transform = "")}
            >
              Levels
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
