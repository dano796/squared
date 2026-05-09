import { useGameStore } from "../store/gameStore";
import { LEVELS } from "../data/levels";

function StarRow({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          style={{
            fontSize: 13,
            color: i <= count ? "#c9963a" : "#2a2a3c",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function LevelSelectScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const startLevel = useGameStore((s) => s.startLevel);
  const levelStars = useGameStore((s) => s.levelStars);
  const unlockedLevels = useGameStore((s) => s.unlockedLevels);

  return (
    <div
      className="fixed inset-0 flex flex-col screen-enter"
      style={{
        background:
          "linear-gradient(160deg, #12121c 0%, #0e0e14 60%, #111020 100%)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "20px 20px 16px",
          borderBottom: "1px solid #1e1e2e",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setScreen("home")}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            fontSize: "0.85rem",
            color: "#6b7cf8",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 0",
          }}
        >
          Back
        </button>
        <h2
          style={{
            flex: 1,
            textAlign: "center",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "1rem",
            letterSpacing: "0.08em",
            color: "#e6e4f0",
          }}
        >
          Levels
        </h2>
        <div style={{ width: 44 }} />
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 10,
            maxWidth: 360,
            margin: "0 auto",
          }}
        >
          {LEVELS.map((level, idx) => {
            const unlocked = unlockedLevels.includes(idx);
            const stars = levelStars[idx] ?? 0;
            const completed = stars > 0;

            return (
              <button
                key={level.id}
                disabled={!unlocked}
                onClick={() => unlocked && startLevel(idx)}
                style={{
                  position: "relative",
                  textAlign: "left",
                  padding: "14px 14px 12px",
                  borderRadius: 14,
                  border: `1px solid ${unlocked ? (completed ? "rgba(90,175,122,0.25)" : "rgba(107,124,248,0.18)") : "#1c1c28"}`,
                  background: unlocked
                    ? completed
                      ? "linear-gradient(145deg, #141f18 0%, #101710 100%)"
                      : "linear-gradient(145deg, #17172a 0%, #131320 100%)"
                    : "#111118",
                  cursor: unlocked ? "pointer" : "default",
                  transition: "transform 0.08s",
                }}
                onPointerDown={(e) =>
                  unlocked && (e.currentTarget.style.transform = "scale(0.97)")
                }
                onPointerUp={(e) => (e.currentTarget.style.transform = "")}
                onPointerLeave={(e) => (e.currentTarget.style.transform = "")}
              >
                {/* Level number */}
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 800,
                    fontSize: "2rem",
                    color: unlocked ? "#e6e4f0" : "#252535",
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {String(level.id).padStart(2, "0")}
                </div>

                {/* Level name */}
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 400,
                    fontSize: "0.7rem",
                    color: unlocked ? "#7070a0" : "#252535",
                    marginBottom: 8,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {level.name}
                </div>

                {/* Stars or lock */}
                {unlocked ? (
                  <StarRow count={stars} />
                ) : (
                  <div style={{ fontSize: "1rem", color: "#252535" }}>🔒</div>
                )}

                {/* Par badge */}
                {unlocked && (
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      color: "#c9963a",
                    }}
                  >
                    ★ {level.optimalMoves}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
