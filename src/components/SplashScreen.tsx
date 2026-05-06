import { useEffect, useState } from 'react'
import { useGameStore } from '../store/gameStore'

export default function SplashScreen() {
  const setScreen = useGameStore(s => s.setScreen)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300)
    const t2 = setTimeout(() => setPhase(2), 900)
    const t3 = setTimeout(() => setScreen('home'), 3200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [setScreen])

  return (
    <div
      className="fixed inset-0 bg-navy flex flex-col items-center justify-center cursor-pointer scanlines"
      onClick={() => setScreen('home')}
      style={{ background: 'radial-gradient(ellipse at center, #0d1633 0%, #0a0a1a 70%)' }}
    >
      {/* Animated grid lines */}
      <div className="absolute inset-0 bg-grid opacity-30" />

      {/* Floating 3D block */}
      <div
        className="relative mb-8"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(-20px)',
          animation: phase >= 2 ? 'float 3s ease-in-out infinite' : undefined,
        }}
      >
        {/* Isometric block illusion */}
        <div style={{ perspective: '200px', perspectiveOrigin: '50% 30%' }}>
          <div style={{ transform: 'rotateX(20deg) rotateY(-15deg)', transformStyle: 'preserve-3d' }}>
            <div
              className="block-standing rounded-sm"
              style={{ width: 48, height: 96 }}
            />
          </div>
        </div>

        {/* Glow under block */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: 60,
            height: 16,
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.6) 0%, transparent 70%)',
            filter: 'blur(4px)',
            animation: phase >= 2 ? 'float 3s ease-in-out infinite reverse' : undefined,
          }}
        />
      </div>

      {/* Title */}
      <div
        className="text-center"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 0.6s ease 0.2s',
        }}
      >
        <h1
          className="font-display font-black text-5xl sm:text-7xl tracking-widest neon-blue text-white mb-2"
          style={{ letterSpacing: '0.2em' }}
        >
          SQ<span style={{ color: '#a855f7' }}>UA</span>RED
        </h1>
        <p className="font-body text-blue-400 text-xs tracking-[0.4em] uppercase mt-2">
          puzzle · logic · precision
        </p>
      </div>

      {/* Tap to start */}
      <div
        className="mt-12 font-body text-blue-300 text-sm tracking-widest"
        style={{
          opacity: phase >= 2 ? 1 : 0,
          transition: 'opacity 0.4s ease',
          animation: phase >= 2 ? 'pulse 1.5s ease-in-out infinite' : undefined,
        }}
      >
        TAP TO START
      </div>

      {/* Version */}
      <div className="absolute bottom-6 font-body text-xs text-blue-900">
        v1.0.0
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  )
}
