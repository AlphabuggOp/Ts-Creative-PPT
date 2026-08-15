interface HelpOverlayProps {
  open: boolean
  onClose: () => void
  muted: boolean
}

const KEYS: [string, string][] = [
  ['← →', 'previous / next slide'],
  ['SPACE / ↓', 'next slide'],
  ['↑', 'previous slide'],
  ['[ ]', 'previous / next'],
  ['1 – 9, 0', 'jump to slide (0 = 10)'],
  ['HOME / END', 'first / last slide'],
  ['G', 'grid overview'],
  ['A', 'auto-reel (self-playing)'],
  ['~', 'panic — hide as a blog'],
  ['R', 'replay current slide entrance'],
  ['F', 'fullscreen'],
  ['M', 'mute / unmute'],
  ['?', 'this help'],
  ['ESC', 'close overlay'],
]

export function HelpOverlay({ open, onClose, muted }: HelpOverlayProps) {
  if (!open) return null
  return (
    <div className="help-overlay" onClick={onClose}>
      <div className="help-panel glass" onClick={(e) => e.stopPropagation()}>
        <div className="help-title">CONTROLS</div>
        <div className="help-grid">
          {KEYS.map(([k, v]) => (
            <div key={k} className="help-row">
              <span className="help-key">{k}</span>
              <span className="help-val">{v}</span>
            </div>
          ))}
        </div>
        <div className="help-foot">
          <span className="t-mono" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--kyber-dim)' }}>
            AUDIO: <span style={{ color: muted ? 'var(--threat)' : 'var(--kyber)' }}>{muted ? 'MUTED' : 'ARMED'}</span> · PRESS M
          </span>
        </div>
      </div>
    </div>
  )
}
