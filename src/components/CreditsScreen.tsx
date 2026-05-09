import { useGameStore } from '../store/gameStore'

const label: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 600,
  fontSize: '0.65rem',
  letterSpacing: '0.14em',
  color: '#3e3e60',
  textTransform: 'uppercase',
  marginBottom: 4,
}

const value: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 500,
  fontSize: '0.875rem',
  color: '#c8c6e0',
}

const sub: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 400,
  fontSize: '0.75rem',
  color: '#5a5a80',
}

export default function CreditsScreen() {
  const setScreen = useGameStore(s => s.setScreen)

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center screen-enter"
      style={{ background: 'linear-gradient(160deg, #12121c 0%, #0e0e14 60%, #111020 100%)' }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        padding: '0 24px',
        width: '100%',
        maxWidth: 340,
      }}>

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: '2rem',
            color: '#e6e4f0',
            letterSpacing: '0.08em',
            marginBottom: 4,
          }}>
            Credits
          </h1>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 400,
            fontSize: '0.7rem',
            color: '#3a3a5e',
            letterSpacing: '0.1em',
          }}>
            v1.0.0
          </div>
        </div>

        {/* Card */}
        <div style={{
          width: '100%',
          borderRadius: 16,
          border: '1px solid #1e1e2e',
          background: '#13131e',
          overflow: 'hidden',
        }}>

          {/* App header inside card */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #1e1e2e',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: '1.1rem',
              color: '#6b7cf8',
              letterSpacing: '0.1em',
              marginBottom: 2,
            }}>
              SQUARED
            </div>
            <div style={sub}>A Bloxorz-inspired puzzle game</div>
          </div>

          {/* Rows */}
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div>
              <div style={label}>Original Game</div>
              <div style={value}>Bloxorz</div>
              <div style={sub}>Damien Clarke · DX Interactive</div>
            </div>

            <div style={{ height: 1, background: '#1a1a28' }} />

            <div>
              <div style={label}>Built with</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {['React + TypeScript + Vite', 'Tailwind CSS', 'Zustand'].map(t => (
                  <div key={t} style={sub}>{t}</div>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: '#1a1a28' }} />

            <div>
              <div style={label}>Font</div>
              <div style={sub}>Space Grotesk — Google Fonts</div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 400,
          fontSize: '0.68rem',
          color: '#2e2e48',
          textAlign: 'center',
          lineHeight: 1.6,
        }}>
          Fan-made tribute. All rights to the original Bloxorz belong to their respective owners.
        </p>

        {/* Back */}
        <button
          onClick={() => setScreen('home')}
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 12,
            border: '1px solid #1e1e2e',
            background: 'rgba(255,255,255,0.03)',
            color: '#6b7cf8',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'transform 0.08s',
          }}
          onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
          onPointerUp={e => (e.currentTarget.style.transform = '')}
          onPointerLeave={e => (e.currentTarget.style.transform = '')}
        >
          Back
        </button>
      </div>
    </div>
  )
}
