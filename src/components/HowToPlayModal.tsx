interface Props { onClose: () => void }

const swatch = (style: React.CSSProperties) => (
  <div style={{
    width: 18, height: 18, borderRadius: 4, flexShrink: 0,
    ...style,
  }} />
)

export default function HowToPlayModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full mx-4 screen-enter"
        style={{
          maxWidth: 340,
          borderRadius: 20,
          border: '1px solid #22223a',
          background: '#13131e',
          padding: '24px 22px 20px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: '1.1rem',
          color: '#e6e4f0',
          marginBottom: 18,
          letterSpacing: '0.03em',
        }}>
          How to Play
        </h2>

        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 400,
          fontSize: '0.82rem',
          color: '#7070a0',
          marginBottom: 18,
          lineHeight: 1.5,
        }}>
          Roll the block across the grid and land it upright into the goal hole.
        </p>

        {/* Block states */}
        <div style={{ marginBottom: 16 }}>
          <div style={sectionLabel}>Block States</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={row}>
              <div style={{
                width: 12, height: 24, borderRadius: 3, flexShrink: 0,
                background: 'linear-gradient(145deg, #5a72f0, #2840b8)',
              }} />
              <span style={rowText}><b style={{ color: '#c8c6e0' }}>Standing</b> — can fall into the hole</span>
            </div>
            <div style={row}>
              <div style={{
                width: 24, height: 12, borderRadius: 3, flexShrink: 0,
                background: 'linear-gradient(145deg, #5a72f0, #2840b8)',
              }} />
              <span style={rowText}><b style={{ color: '#c8c6e0' }}>Lying flat</b> — must roll upright first</span>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: '#1e1e30', marginBottom: 16 }} />

        {/* Tile types */}
        <div style={{ marginBottom: 16 }}>
          <div style={sectionLabel}>Tile Types</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={row}>
              {swatch({ background: '#1c2d4a', border: '1px solid #2a3a5a' })}
              <span style={rowText}>Normal — safe to stand on</span>
            </div>
            <div style={row}>
              {swatch({ background: '#160d38', border: '1px solid #5a50cc' })}
              <span style={{ ...rowText, color: '#a08ef8' }}>Goal — land upright to win</span>
            </div>
            <div style={row}>
              {swatch({ background: '#3a2000', border: '1px solid #c9963a' })}
              <span style={{ ...rowText, color: '#c9963a' }}>Fragile — breaks if you stand upright</span>
            </div>
            <div style={row}>
              {swatch({ background: '#052b12', border: '1px solid #5aaf7a' })}
              <span style={{ ...rowText, color: '#5aaf7a' }}>Soft switch — any touch activates</span>
            </div>
            <div style={row}>
              {swatch({ background: '#3e0a0a', border: '1px solid #d85a5a' })}
              <span style={{ ...rowText, color: '#d85a5a' }}>Hard switch — must stand upright</span>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: '#1e1e30', marginBottom: 16 }} />

        {/* Stars */}
        <div style={{ marginBottom: 16 }}>
          <div style={sectionLabel}>Star Rating</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={rowText}><span style={{ color: '#c9963a' }}>★★★</span> — optimal moves or fewer</div>
            <div style={rowText}><span style={{ color: '#c9963a' }}>★★</span> — within 50% extra moves</div>
            <div style={rowText}><span style={{ color: '#c9963a' }}>★</span> — completed</div>
          </div>
        </div>

        <div style={{ height: 1, background: '#1e1e30', marginBottom: 16 }} />

        {/* Controls */}
        <div style={{ marginBottom: 20 }}>
          <div style={sectionLabel}>Controls</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={rowText}>Keyboard: Arrow keys or WASD</div>
            <div style={rowText}>Mobile: on-screen D-Pad</div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 12,
            border: '1px solid #22223a',
            background: 'rgba(107,124,248,0.12)',
            color: '#6b7cf8',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'transform 0.08s',
          }}
          onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
          onPointerUp={e => (e.currentTarget.style.transform = '')}
          onPointerLeave={e => (e.currentTarget.style.transform = '')}
        >
          Got it
        </button>
      </div>
    </div>
  )
}

const sectionLabel: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 600,
  fontSize: '0.7rem',
  letterSpacing: '0.12em',
  color: '#4a4a70',
  textTransform: 'uppercase',
  marginBottom: 10,
}

const row: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
}

const rowText: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 400,
  fontSize: '0.78rem',
  color: '#7070a0',
  lineHeight: 1.4,
}
