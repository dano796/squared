interface Props { onClose: () => void }

export default function HowToPlayModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm mx-4 rounded-sm border border-blue-700 p-6 screen-enter"
        style={{ background: '#0d1633', boxShadow: '0 0 40px rgba(59,130,246,0.3)' }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="font-display text-xl font-bold text-white mb-4 tracking-wider neon-blue">
          HOW TO PLAY
        </h2>

        <div className="space-y-3 font-body text-sm text-blue-200">
          <p>Roll the block across the grid to make it fall into the glowing hole.</p>

          <div className="border-t border-blue-800 pt-3">
            <p className="text-white font-bold mb-2">Block States:</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-8 block-standing rounded-sm flex-shrink-0" />
                <span><strong className="text-blue-300">Standing</strong> — can fall in the hole</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 block-lying-h rounded-sm flex-shrink-0" />
                <span><strong className="text-blue-300">Lying</strong> — must roll upright first</span>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-800 pt-3">
            <p className="text-white font-bold mb-2">Tile Types:</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 tile-floor rounded-sm flex-shrink-0" />
                <span>Normal floor — safe to stand on</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 tile-goal rounded-sm flex-shrink-0" />
                <span className="text-purple-300">Goal — fall in while standing!</span>
              </div>
              <div className="flex items-center gap-2 relative">
                <div className="w-5 h-5 tile-fragile rounded-sm flex-shrink-0 relative overflow-hidden" />
                <span className="text-amber-300">Fragile — don't stand vertically!</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 tile-switch-soft rounded-full flex-shrink-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <span className="text-green-300">Soft switch — touch to activate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 tile-switch-hard rounded-sm flex-shrink-0 flex items-center justify-center text-red-400 text-xs font-bold">✕</div>
                <span className="text-red-300">Hard switch — stand on it to activate</span>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-800 pt-3 text-xs">
            <p className="text-white font-bold mb-1">Controls:</p>
            <p>Keyboard: Arrow keys</p>
            <p>Mobile: On-screen D-Pad</p>
          </div>

          <div className="border-t border-blue-800 pt-3 text-xs text-blue-400">
            <p>⭐⭐⭐ = optimal moves or less</p>
            <p>⭐⭐ = within 50% more moves</p>
            <p>⭐ = completed</p>
          </div>
        </div>

        <button
          className="mt-5 w-full py-3 font-display text-sm font-bold tracking-widest text-white border border-blue-600 rounded-sm active:scale-95 transition-transform"
          style={{ background: 'rgba(30, 58, 138, 0.5)', letterSpacing: '0.2em' }}
          onClick={onClose}
        >
          GOT IT
        </button>
      </div>
    </div>
  )
}
