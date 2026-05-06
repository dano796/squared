import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import HowToPlayModal from './HowToPlayModal'

export default function HomeScreen() {
  const setScreen = useGameStore(s => s.setScreen)
  const [showHow, setShowHow] = useState(false)

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-navy screen-enter"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, #0d1a3a 0%, #0a0a1a 70%)' }}
    >
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* Decorative corner pieces */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-600 opacity-50" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-600 opacity-50" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-600 opacity-50" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-blue-600 opacity-50" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-8 w-full max-w-sm">
        {/* Title */}
        <div className="text-center mb-4">
          <h1
            className="font-display font-black text-4xl sm:text-5xl text-white neon-blue tracking-widest"
            style={{ letterSpacing: '0.2em' }}
          >
            SQ<span className="text-purple-400 neon-purple">UA</span>RED
          </h1>
          <p className="font-body text-blue-400 text-xs tracking-widest mt-2 uppercase">
            Roll · Think · Conquer
          </p>
        </div>

        {/* Mini block preview */}
        <div className="relative my-2" style={{ perspective: '200px' }}>
          <div
            className="block-standing rounded"
            style={{
              width: 32,
              height: 64,
              transform: 'rotateX(15deg) rotateY(-10deg)',
              animation: 'float 2.5s ease-in-out infinite',
            }}
          />
        </div>

        {/* Buttons */}
        <button
          className="w-full py-4 font-display font-bold text-lg tracking-widest text-white rounded-sm border-2 border-blue-500 transition-all duration-150 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
            boxShadow: '0 0 20px rgba(59,130,246,0.4), 0 4px 0 #1e3a8a',
            letterSpacing: '0.2em',
          }}
          onClick={() => setScreen('levelSelect')}
        >
          PLAY
        </button>

        <button
          className="w-full py-3 font-display font-semibold text-sm tracking-widest text-purple-300 rounded-sm border border-purple-700 transition-all duration-150 active:scale-95"
          style={{
            background: 'rgba(88, 28, 135, 0.2)',
            letterSpacing: '0.2em',
          }}
          onClick={() => setShowHow(true)}
        >
          HOW TO PLAY
        </button>

        <button
          className="w-full py-3 font-display font-semibold text-sm tracking-widest text-blue-400 rounded-sm border border-blue-800 transition-all duration-150 active:scale-95"
          style={{
            background: 'rgba(30, 58, 138, 0.2)',
            letterSpacing: '0.15em',
          }}
          onClick={() => setScreen('credits')}
        >
          CREDITS
        </button>
      </div>

      {showHow && <HowToPlayModal onClose={() => setShowHow(false)} />}

      <style>{`
        @keyframes float {
          0%, 100% { transform: rotateX(15deg) rotateY(-10deg) translateY(0); }
          50% { transform: rotateX(15deg) rotateY(-10deg) translateY(-10px); }
        }
      `}</style>
    </div>
  )
}
