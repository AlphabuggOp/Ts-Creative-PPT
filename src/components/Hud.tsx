import { Decrypt } from '../lib/textfx'

interface HudProps {
  index: number
  total: number
  labels: string[]
  onGo: (i: number) => void
  onGrid: () => void
  muted: boolean
  onHelp: () => void
}

export function Hud({ index, total, labels, onGo, onGrid, muted, onHelp }: HudProps) {
  return (
    <div className="hud">
      {/* top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="hud-wordmark">
          <span className="brand">SANCTUM</span>
          <span className="rev">// rev.2026</span>
        </div>
        <div className="hud-slide" style={{ textAlign: 'right' }}>
          slide <b>{String(index + 1).padStart(2, '0')}</b> / {String(total).padStart(2, '0')}
          <div style={{ marginTop: 5, fontSize: 8, color: 'var(--kyber-dim)' }}>{labels[index]}</div>
        </div>
      </div>

      {/* bottom bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300 }}>
          <Decrypt
            text="THE NETWORK THAT PRETENDS NOT TO EXIST."
            className="hud-tagline"
            duration={0.8}
          />
          <span className="hud-hint">
            <span className="kbd">←</span> <span className="kbd">→</span> navigate · <span className="kbd">space</span> next · <span className="kbd">~</span> vanish
          </span>
        </div>

        <div className="hud-rail">
          {labels.map((label, i) => (
            <button
              key={i}
              className={`hud-tick ${i === index ? 'is-on' : i < index ? 'is-past' : ''}`}
              data-cursor="button"
              title={`${String(i + 1).padStart(2, '0')} · ${label}`}
              onClick={() => onGo(i)}
              aria-label={`Go to slide ${i + 1}: ${label}`}
            />
          ))}
          <button
            className="hud-tick hud-tick-grid"
            data-cursor="button"
            title="Grid overview (G)"
            onClick={onGrid}
            aria-label="Open grid overview"
          >
            <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', transform: 'none' }}>▦</span>
          </button>
          <button
            className="hud-tick hud-tick-grid"
            data-cursor="button"
            title={`Audio ${muted ? 'muted' : 'armed'} (M)`}
            aria-label="Toggle audio"
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'm' }))}
          >
            <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', transform: 'none', color: muted ? 'var(--threat)' : undefined }}>{muted ? '✕' : '♪'}</span>
          </button>
          <button
            className="hud-tick hud-tick-grid"
            data-cursor="button"
            title="Help (?)"
            onClick={onHelp}
            aria-label="Open help"
          >
            <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', transform: 'none' }}>?</span>
          </button>
        </div>

        <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', color: 'var(--ghost)' }}>
          TS'26 CREATIVE
          <div style={{ color: 'var(--kyber-dim)', marginTop: 3 }}>TEAM CCA</div>
        </div>
      </div>
    </div>
  )
}
