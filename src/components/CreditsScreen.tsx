import { useGameStore } from '../store/gameStore'

export default function CreditsScreen() {
  const setScreen = useGameStore(s => s.setScreen)

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-navy screen-enter"
      style={{ background: 'radial-gradient(ellipse at 50% 80%, #0d0a1a 0%, #0a0a1a 70%)' }}
    >
      <div className="absolute inset-0 bg-grid opacity-10" />

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-purple-800 opacity-50" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-purple-800 opacity-50" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-purple-800 opacity-50" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-purple-800 opacity-50" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-8 w-full max-w-sm text-center">
        <h1 className="font-display font-black text-4xl text-white neon-purple tracking-widest"
          style={{ letterSpacing: '0.2em' }}>
          CREDITS
        </h1>

        <div className="w-full space-y-4">
          <div className="border border-purple-900/50 rounded-sm p-4"
            style={{ background: 'rgba(88, 28, 135, 0.1)' }}>
            <div className="font-display text-xl font-bold text-purple-300 mb-1">SQUARED</div>
            <div className="font-body text-xs text-purple-600">Version 1.0.0</div>
          </div>

          <div className="border border-blue-900/30 rounded-sm p-4 text-left space-y-3"
            style={{ background: 'rgba(10, 10, 26, 0.5)' }}>
            <div>
              <div className="font-body text-xs text-blue-600 tracking-widest mb-1">ORIGINAL GAME</div>
              <div className="font-display text-sm text-white">Bloxorz</div>
              <div className="font-body text-xs text-blue-400">Damien Clarke · DX Interactive</div>
            </div>

            <div className="border-t border-blue-900/30 pt-3">
              <div className="font-body text-xs text-blue-600 tracking-widest mb-1">DEVELOPED WITH</div>
              <div className="font-body text-xs text-blue-300 space-y-0.5">
                <div>React + TypeScript + Vite</div>
                <div>Tailwind CSS</div>
                <div>Zustand</div>
              </div>
            </div>

            <div className="border-t border-blue-900/30 pt-3">
              <div className="font-body text-xs text-blue-600 tracking-widest mb-1">FONTS</div>
              <div className="font-body text-xs text-blue-300 space-y-0.5">
                <div className="font-display">Orbitron</div>
                <div>Share Tech Mono</div>
              </div>
            </div>
          </div>

          <div className="font-body text-xs text-blue-800">
            Fan-made tribute. All rights to original Bloxorz belong to their respective owners.
          </div>
        </div>

        <button
          className="w-full py-3 font-display text-sm font-semibold tracking-widest text-purple-300 rounded-sm border border-purple-800 active:scale-95 transition-transform"
          style={{ background: 'rgba(88, 28, 135, 0.2)', letterSpacing: '0.2em' }}
          onClick={() => setScreen('home')}
        >
          ← BACK
        </button>
      </div>
    </div>
  )
}
