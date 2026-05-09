import { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";

export default function SplashScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [setScreen]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer"
      onClick={() => setScreen("home")}
      style={{
        background:
          "linear-gradient(160deg, #12121c 0%, #0e0e14 60%, #111020 100%)",
      }}
    >
      {/* Subtle radial highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 35%, rgba(107,124,248,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Block preview */}
      <div
        className="relative mb-10"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transition: "opacity 0.5s ease, transform 0.6s ease",
          transform: phase >= 1 ? "translateY(0)" : "translateY(-16px)",
          animation:
            phase >= 2 ? "blockFloat 3s ease-in-out infinite" : undefined,
        }}
      >
        <div style={{ perspective: "240px", perspectiveOrigin: "50% 30%" }}>
          <div
            style={{
              transform: "rotateX(18deg) rotateY(-14deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              style={{
                width: 44,
                height: 88,
                borderRadius: 6,
                background:
                  "linear-gradient(145deg, #5a72f0 0%, #3f56d0 50%, #2840b8 100%)",
                boxShadow:
                  "inset 0 2px 0 rgba(255,255,255,0.18), 3px 3px 0 #1a2890, 6px 6px 0 #111f70",
              }}
            />
          </div>
        </div>
        {/* subtle shadow under block */}
        <div
          style={{
            position: "absolute",
            bottom: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 52,
            height: 12,
            background:
              "radial-gradient(ellipse, rgba(107,124,248,0.3) 0%, transparent 70%)",
            filter: "blur(6px)",
          }}
        />
      </div>

      {/* Title */}
      <div
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transition: "opacity 0.6s ease 0.15s",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.8rem, 12vw, 5rem)",
            letterSpacing: "0.12em",
            color: "#e6e4f0",
            lineHeight: 1,
            marginBottom: 10,
          }}
        >
          SQUARED
        </h1>
        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 400,
            fontSize: "0.75rem",
            letterSpacing: "0.35em",
            color: "#6b7cf8",
            textTransform: "uppercase",
          }}
        >
          puzzle · logic · precision
        </p>
      </div>

      {/* Tap to start */}
      <div
        style={{
          marginTop: 56,
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 500,
          fontSize: "0.8rem",
          letterSpacing: "0.2em",
          color: "#5060b0",
          textTransform: "uppercase",
          opacity: phase >= 2 ? 1 : 0,
          transition: "opacity 0.4s ease",
          animation: phase >= 2 ? "blink 1.6s ease-in-out infinite" : undefined,
        }}
      >
        tap to start
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 24,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "0.7rem",
          color: "#2e2e50",
          letterSpacing: "0.1em",
        }}
      >
        v1.0.0
      </div>

      <style>{`
        @keyframes blockFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
