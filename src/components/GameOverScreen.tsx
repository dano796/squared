import { useGameStore } from "../store/gameStore";

export default function GameOverScreen() {
  const { resetLevel, setScreen } = useGameStore();

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center screen-enter"
      style={{
        background:
          "linear-gradient(160deg, #12121c 0%, #0e0e14 60%, #18100e 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          padding: "0 24px",
          width: "100%",
          maxWidth: 300,
          textAlign: "center",
        }}
      >
        {/* Falling block */}
        <div style={{ width: 28, height: 56, marginBottom: 4 }}>
          <div
            style={{
              width: 28,
              height: 56,
              borderRadius: 5,
              background:
                "linear-gradient(145deg, #5a72f0 0%, #3f56d0 50%, #2840b8 100%)",
              boxShadow:
                "inset 0 2px 0 rgba(255,255,255,0.15), 2px 2px 0 #1a2890",
              animation: "fall 0.6s ease-in forwards",
            }}
          />
        </div>

        <div>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: "2rem",
              color: "#d85a5a",
              letterSpacing: "0.06em",
              marginBottom: 6,
            }}
          >
            You fell!
          </h2>
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 400,
              fontSize: "0.8rem",
              color: "#5a3535",
            }}
          >
            The void claims another block
          </p>
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
            onClick={resetLevel}
            style={{
              width: "100%",
              padding: "14px 0",
              borderRadius: 12,
              border: "none",
              background: "#d85a5a",
              color: "#fff",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(216,90,90,0.3)",
              transition: "transform 0.08s",
            }}
            onPointerDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.97)")
            }
            onPointerUp={(e) => (e.currentTarget.style.transform = "")}
            onPointerLeave={(e) => (e.currentTarget.style.transform = "")}
          >
            Try Again
          </button>

          <button
            onClick={() => setScreen("levelSelect")}
            style={{
              width: "100%",
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
            Back to Levels
          </button>
        </div>
      </div>
    </div>
  );
}
