import { SLIDES } from '../slides/registry'

interface GridModeProps {
  open: boolean
  sel: number
  current: number
  onSelect: (i: number) => void
  onGo: (i: number) => void
}

/** Full-screen overview grid — static lightweight previews (no live 3D/GSAP) */
export function GridMode({ open, sel, current, onSelect, onGo }: GridModeProps) {
  if (!open) return null
  return (
    <div className="grid-mode">
      <div className="grid-head">
        <span className="g-title">ALL TRANSMISSIONS</span>
        <span className="g-hint">
          <span className="t-kyber">←→</span> select · <span className="t-kyber">ENTER</span> open · <span className="t-kyber">ESC</span> close
        </span>
      </div>
      <div className="grid-body">
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={`grid-cell ${i === sel ? 'is-sel' : ''} ${i === current ? 'is-current' : ''}`}
            data-cursor="button"
            style={{ animationDelay: `${i * 30}ms` }}
            onClick={() => onGo(i)}
            onMouseEnter={() => onSelect(i)}
            role="button"
            tabIndex={0}
            aria-label={`Open slide ${i + 1}: ${s.label}`}
          >
            <div className="grid-cell-art">
              <span className="grid-cell-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="grid-cell-ghost">{i + 1}</span>
            </div>
            <div className="grid-cell-title">{s.title}</div>
            <span className="grid-cell-tag">{String(i + 1).padStart(2, '0')} · {s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
