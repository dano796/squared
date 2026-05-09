import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import HowToPlayModal from './HowToPlayModal'

const btn = {
  primary: {
    padding: '14px 0',
    borderRadius: 12,
    border: 'none',
    background: '#6b7cf8',
    color: '#fff',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: '1rem',
    letterSpacing: '0.06em',
    cursor: 'pointer',
    width: '100%',
    boxShadow: '0 4px 20px rgba(107,124,248,0.35), 0 1px 0 rgba(255,255,255,0.1) inset',
    transition: 'transform 0.08s, box-shadow 0.08s',
  } as React.CSSProperties,
  secondary: {
    padding: '12px 0',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: '#a8a8cc',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    fontSize: '0.875rem',
    letterSpacing: '0.06em',
    cursor: 'pointer',
    width: '100%',
    transition: 'transform 0.08s, background 0.1s',
  } as React.CSSProperties,
}

export default function HomeScreen() {
  const setScreen = useGameStore(s => s.setScreen)
  const [showHow, setShowHow] = useState(false)

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center screen-enter"
      style={{ background: 'linear-gradient(160deg, #12121c 0%, #0e0e14 60%, #111020 100%)' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 55% 35% at 50% 30%, rgba(107,124,248,0.08) 0%, transparent 70%)'
      }} />

      <div className="relative z-10 flex flex-col items-center w-full max-w-xs px-6" style={{ gap: 28 }}>

        {/* Block preview */}
        <div style={{ perspective: '240px', perspectiveOrigin: '50% 30%', marginBottom: 4 }}>
          <div style={{
            transform: 'rotateX(18deg) rotateY(-14deg)',
            transformStyle: 'preserve-3d',
            animation: 'blockFloat 3s ease-in-out infinite',
          }}>
            <div style={{
              width: 36,
              height: 72,
              borderRadius: 6,
              background: 'linear-gradient(145deg, #5a72f0 0%, #3f56d0 50%, #2840b8 100%)',
              boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.18), 3px 3px 0 #1a2890, 5px 5px 0 #111f70',
            }} />
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', lineHeight: 1 }}>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: '2.6rem',
            letterSpacing: '0.12em',
            color: '#e6e4f0',
            marginBottom: 6,
          }}>
            SQUARED
          </h1>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 400,
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            color: '#6b7cf8',
            textTransform: 'uppercase',
          }}>
            Roll · Think · Conquer
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          <button
            style={btn.primary}
            onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
            onPointerUp={e => { e.currentTarget.style.transform = ''; setScreen('levelSelect') }}
            onPointerLeave={e => (e.currentTarget.style.transform = '')}
          >
            Play
          </button>

          <button
            style={btn.secondary}
            onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
            onPointerUp={e => { e.currentTarget.style.transform = ''; setShowHow(true) }}
            onPointerLeave={e => (e.currentTarget.style.transform = '')}
          >
            How to Play
          </button>

          <button
            style={btn.secondary}
            onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
            onPointerUp={e => { e.currentTarget.style.transform = ''; setScreen('credits') }}
            onPointerLeave={e => (e.currentTarget.style.transform = '')}
          >
            Credits
          </button>
        </div>
      </div>

      {showHow && <HowToPlayModal onClose={() => setShowHow(false)} />}

      <style>{`
        @keyframes blockFloat {
          0%, 100% { transform: rotateX(18deg) rotateY(-14deg) translateY(0); }
          50% { transform: rotateX(18deg) rotateY(-14deg) translateY(-10px); }
        }
      `}</style>
    </div>
  )
}
