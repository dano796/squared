import { ChevronLeft } from "lucide-react";
import { useGameStore } from "../store/gameStore";

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 0",
        borderBottom: "1px solid #1a1a28",
      }}
    >
      <span
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 500,
          fontSize: "0.9rem",
          color: "#c8c6e0",
        }}
      >
        {label}
      </span>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          border: "none",
          background: value ? "#6b7cf8" : "#2a2a40",
          cursor: "pointer",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: value ? 23 : 3,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
          }}
        />
      </button>
    </div>
  );
}

export default function SettingsScreen() {
  const {
    setScreen,
    soundEnabled,
    setSoundEnabled,
    vibrationEnabled,
    setVibrationEnabled,
    resetProgress,
  } = useGameStore();

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
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <ChevronLeft size={15} strokeWidth={2} />
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
          Settings
        </h2>
        <div style={{ width: 44 }} />
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 24px 32px",
          maxWidth: 400,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* Audio section */}
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: "0.65rem",
            letterSpacing: "0.14em",
            color: "#3e3e60",
            textTransform: "uppercase",
            marginTop: 20,
            marginBottom: 4,
          }}
        >
          Audio
        </div>
        <div
          style={{
            borderRadius: 14,
            border: "1px solid #1e1e2e",
            background: "#13131e",
            padding: "0 16px",
          }}
        >
          <ToggleRow
            label="Sound Effects"
            value={soundEnabled}
            onChange={setSoundEnabled}
          />
          <ToggleRow
            label="Vibration"
            value={vibrationEnabled}
            onChange={setVibrationEnabled}
          />
        </div>

        {/* Progress section */}
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: "0.65rem",
            letterSpacing: "0.14em",
            color: "#3e3e60",
            textTransform: "uppercase",
            marginTop: 24,
            marginBottom: 4,
          }}
        >
          Progress
        </div>
        <div
          style={{
            borderRadius: 14,
            border: "1px solid #1e1e2e",
            background: "#13131e",
            padding: "0 16px",
          }}
        >
          <button
            onClick={() => {
              if (confirm("Reset all progress? This cannot be undone.")) {
                resetProgress();
              }
            }}
            style={{
              width: "100%",
              padding: "14px 0",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 500,
              fontSize: "0.9rem",
              color: "#e05a5a",
              textAlign: "left",
            }}
          >
            Reset Progress
          </button>
        </div>
      </div>
    </div>
  );
}
