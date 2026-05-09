import { useState } from "react";
import type { Direction } from "../logic/blockLogic";

interface Props {
  onMove: (dir: Direction) => void;
}

const DIRS: { dir: Direction; label: string; gridArea: string }[] = [
  { dir: "up", label: "▲", gridArea: "1 / 2" },
  { dir: "left", label: "◀", gridArea: "2 / 1" },
  { dir: "right", label: "▶", gridArea: "2 / 3" },
  { dir: "down", label: "▼", gridArea: "3 / 2" },
];

export default function DPad({ onMove }: Props) {
  const [pressed, setPressed] = useState<Direction | null>(null);

  const handlePress = (dir: Direction) => {
    setPressed(dir);
    onMove(dir);
  };

  const handleRelease = () => setPressed(null);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 62px)",
        gridTemplateRows: "repeat(3, 62px)",
        gap: 6,
      }}
    >
      {DIRS.map(({ dir, label, gridArea }) => (
        <button
          key={dir}
          className={`dpad-btn ${pressed === dir ? "pressed" : ""}`}
          style={{
            gridArea,
            color: pressed === dir ? "#a0aeff" : "#5060a0",
            fontSize: "1.1rem",
          }}
          onPointerDown={(e) => {
            e.preventDefault();
            handlePress(dir);
          }}
          onPointerUp={handleRelease}
          onPointerLeave={handleRelease}
        >
          {label}
        </button>
      ))}

      {/* Center */}
      <div
        style={{
          gridArea: "2 / 2",
          borderRadius: 12,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      />
    </div>
  );
}
