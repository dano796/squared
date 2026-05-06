import { useGameStore } from '../store/gameStore'

export default function GameOverScreen() {
  const { resetLevel, setScreen } = useGameStore()

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center screen-enter"
      style={{ background: 'radial-gradient(ellipse at center, #1a0505 0%, #0a0a1a 70%)' }}
    >
      <div className="absolute inset-0 bg-grid opacity-10" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-8 w-full max-w-xs text-center">
        {/* Falling block animation */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div
            className="block-standing rounded-sm mx-auto"
            style={{
              width: 28,
              height: 56,
              animation: 'fall 0.6s ease-in forwards',
            }}
          />
        </div>

        <div>
          <h2 className="font-display font-black text-4xl text-red-400 tracking-widest mb-2"
            style={{ textShadow: '0 0 20px rgba(239,68,68,0.6)', letterSpacing: '0.15em' }}>
            YOU FELL!
          </h2>
          <p className="font-body text-sm text-red-700 tracking-widest">
            The void claims another block
          </p>
        </div>

        <button
          className="w-full py-4 font-display font-bold tracking-widest text-white rounded-sm border-2 border-red-700 active:scale-95 transition-transform"
          style={{
            background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
            boxShadow: '0 0 20px rgba(239,68,68,0.3), 0 4px 0 #450a0a',
            letterSpacing: '0.2em',
          }}
          onClick={resetLevel}
        >
          TRY AGAIN
        </button>

        <button
          className="font-body text-xs text-red-800 tracking-widest active:opacity-60"
          onClick={() => setScreen('levelSelect')}
        >
          BACK TO LEVELS
        </button>
      </div>
    </div>
  )
}
