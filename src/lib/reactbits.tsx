import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'
import gsap from 'gsap'

/* ── TiltCard — cursor-reactive 3D tilt + traveling sheen (ReactBits-style) ── */
export function TiltCard({ children, className = '', max = 10, glare = true }: {
  children: ReactNode; className?: string; max?: number; glare?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current!
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const rx = (0.5 - py) * max
    const ry = (px - 0.5) * max
    el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(4px)`
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(320px circle at ${px * 100}% ${py * 100}%, rgba(159,242,255,0.22), transparent 55%)`
      glareRef.current.style.opacity = '1'
    }
  }
  const onLeave = () => {
    const el = ref.current!
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)'
    if (glareRef.current) glareRef.current.style.opacity = '0'
  }

  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      data-cursor="button"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: 'transform 0.18s ease-out', transformStyle: 'preserve-3d', position: 'relative' }}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', opacity: 0, transition: 'opacity 0.3s' }}
        />
      )}
    </div>
  )
}

/* ── SpotText — cursor-reactive spotlight highlight sweeping across the text ── */
export function SpotText({ text, className = '', style, radius = 190 }: {
  text: string; className?: string; style?: CSSProperties; radius?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current!
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  const base: CSSProperties = {
    color: 'transparent',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    backgroundImage: `radial-gradient(${radius}px circle at var(--mx, 50%) var(--my, 50%), #eafdff 0%, #67e8f9 26%, #2e8fa3 58%, #9aa3b2 100%)`,
    ...style,
  }
  return (
    <span ref={ref} onMouseMove={onMove} className={className} style={base} data-cursor="text">
      {text}
    </span>
  )
}

/* ── Expandable — accordion that grows open (GSAP height) ── */
export function Expandable({ label, badge, children, defaultOpen = false, className = '' }: {
  label: string; badge?: string; children: ReactNode; defaultOpen?: boolean; className?: string
}) {
  const [open, setOpen] = useState(defaultOpen)
  const bodyRef = useRef<HTMLDivElement>(null)

  const toggle = () => {
    const el = bodyRef.current!
    const next = !open
    setOpen(next)
    gsap.to(el, {
      height: next ? 'auto' : 0,
      opacity: next ? 1 : 0,
      duration: 0.45,
      ease: 'power3.inOut',
    })
  }

  return (
    <div className={`expand ${open ? 'is-open' : ''} ${className}`} data-cursor="button">
      <button className="expand-head" onClick={toggle} data-cursor="button">
        <span className="expand-caret">{open ? '−' : '+'}</span>
        <span className="expand-label">{label}</span>
        {badge && <span className="expand-badge">{badge}</span>}
      </button>
      <div ref={bodyRef} className="expand-body" style={{ height: defaultOpen ? 'auto' : 0, opacity: defaultOpen ? 1 : 0, overflow: 'hidden' }}>
        <div className="expand-inner">{children}</div>
      </div>
    </div>
  )
}

/* ── ShinyText — periodic sheen sweep across gradient-clipped text ── */
export function ShinyText({ text, className = '', style, duration = 3.6 }: {
  text: string; className?: string; style?: CSSProperties; duration?: number
}) {
  return (
    <span
      className={`shiny ${className}`}
      style={{ ...style, ['--shiny-dur' as string]: `${duration}s` }}
      data-cursor="text"
    >
      {text}
    </span>
  )
}

/* ── NumberTicker — counts up to `value` on mount ── */
export function NumberTicker({ value, className = '', duration = 1.4, delay = 0.2, decimals = 0, suffix = '' }: {
  value: number; className?: string; duration?: number; delay?: number; decimals?: number; suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current!
    const obj = { v: 0 }
    gsap.to(obj, {
      v: value, duration, delay, ease: 'power2.out',
      onUpdate: () => { el.textContent = obj.v.toFixed(decimals) + suffix },
    })
  }, [value, duration, delay, decimals, suffix])
  return <span ref={ref} className={className}>0{suffix}</span>
}

/* ── LetterGlitch — text that periodically scrambles a few chars (FaultyTerminal-style) ── */
const GLITCH_CHARS = '█▓▒░<>/\\|{}[]#*+=_-^~?@ΞΔΨΩ◈01'
export function LetterGlitch({ text, className = '', interval = 2600, style }: {
  text: string; className?: string; interval?: number; style?: CSSProperties
}) {
  const [display, setDisplay] = useState(text)
  useEffect(() => {
    let raf = 0
    let last = 0
    let glitching = false
    let frame = 0
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (!glitching && now - last > interval) {
        glitching = true
        last = now
        frame = 0
      }
      if (glitching) {
        frame++
        let out = ''
        const burst = Math.floor(frame / 3) // chars that settle each frame
        for (let i = 0; i < text.length; i++) {
          if (text[i] === ' ') { out += ' '; continue }
          out += i < burst ? text[i] : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        }
        setDisplay(out)
        if (burst >= text.length) { glitching = false; setDisplay(text) }
      }
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [text, interval])
  return <span className={`glitch ${className}`} style={style} aria-label={text}>{display}</span>
}

/* ── ElectricBorder — an animated dashed border that "charges" and draws on hover ── */
export function ElectricBorder({ children, className = '', style, onClick }: {
  children: ReactNode; className?: string; style?: CSSProperties; onClick?: () => void
}) {
  return (
    <div className={`eborder ${className}`} style={style} data-cursor="button" onClick={onClick} role={onClick ? 'button' : undefined}>
      <div className="eborder-inner">{children}</div>
    </div>
  )
}

/* ── Drawer — an expandable detail panel (appendix-style, for dense info) ── */
export function Drawer({ label, badge, children, defaultOpen = false }: {
  label: string; badge?: string; children: ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const bodyRef = useRef<HTMLDivElement>(null)
  const toggle = () => {
    const el = bodyRef.current!
    const next = !open
    setOpen(next)
    gsap.to(el, { height: next ? 'auto' : 0, opacity: next ? 1 : 0, duration: 0.4, ease: 'power3.inOut' })
  }
  return (
    <div className={`drawer ${open ? 'is-open' : ''}`} data-cursor="button">
      <button className="drawer-head" onClick={toggle} data-cursor="button">
        <span className="drawer-caret">{open ? '−' : '+'}</span>
        <span className="drawer-label">{label}</span>
        {badge && <span className="drawer-badge">{badge}</span>}
      </button>
      <div ref={bodyRef} className="drawer-body" style={{ height: defaultOpen ? 'auto' : 0, opacity: defaultOpen ? 1 : 0, overflow: 'hidden' }}>
        <div className="drawer-inner">{children}</div>
      </div>
    </div>
  )
}

/* ── Bars — animated mini bar chart, grows in with stagger, hover reveals value ── */
export function Bars({ data, className = '' }: {
  data: { label: string; value: number; color?: string }[]; className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const max = Math.max(...data.map((d) => d.value))

  // animate in on mount
  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(
      ref.current.querySelectorAll('.bar-fill'),
      { scaleY: 0 },
      { scaleY: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 0.35, transformOrigin: 'bottom' },
    )
  }, [])

  return (
    <div ref={ref} className={`bars ${className}`}>
      {data.map((d, i) => (
        <div key={i} className="bar" data-cursor="button">
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ height: `${(d.value / max) * 100}%`, background: d.color ?? 'var(--kyber)' }}
              data-val={`${d.value}`}
            />
          </div>
          <div className="bar-val">{d.value}</div>
          <div className="bar-label">{d.label}</div>
        </div>
      ))}
    </div>
  )
}
