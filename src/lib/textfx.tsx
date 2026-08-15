import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

const SCRAMBLE_CHARS = '█▓▒░<>/\\|{}[]#*+=_-^~?@ΞΔΨΩ◈'

/** Scrambles toward `target` — returns the live string */
export function useScramble(target: string, start = 0, duration = 1.1) {
  const [text, setText] = useState('')
  useEffect(() => {
    let raf = 0
    let t0 = 0
    const startAt = performance.now() + start * 1000
    const tick = (now: number) => {
      if (now < startAt) { raf = requestAnimationFrame(tick); return }
      if (!t0) t0 = now
      const p = Math.min(1, (now - t0) / (duration * 1000))
      const resolved = Math.floor(p * target.length)
      let out = ''
      for (let i = 0; i < target.length; i++) {
        if (target[i] === ' ') { out += ' '; continue }
        out += i < resolved ? target[i] : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      }
      setText(p >= 1 ? target : out)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, start, duration])
  return text
}

/** Mono decode-reveal label */
export function Decrypt({ text, start = 0, duration = 1.1, className = '', style }: {
  text: string; start?: number; duration?: number; className?: string; style?: React.CSSProperties
}) {
  const out = useScramble(text, start, duration)
  return (
    <span className={`t-mono ${className}`} style={style} aria-label={text}>
      {out || '\u00A0'}
    </span>
  )
}

/** 3D char-flip title. `accent` words render in kyber glow. */
export function Kinetic({ text, accent = [], className = '', delay = 0.15, stagger = 0.024, style }: {
  text: string; accent?: string[]; className?: string; delay?: number; stagger?: number; style?: React.CSSProperties
}) {
  const ref = useRef<HTMLSpanElement>(null)
  useGSAP(() => {
    const chars = ref.current!.querySelectorAll('.char')
    gsap.fromTo(
      chars,
      { y: '0.45em', opacity: 0, rotateX: -70 },
      { y: 0, opacity: 1, rotateX: 0, duration: 0.85, ease: 'power4.out', stagger, delay, transformOrigin: '50% 100%', clearProps: 'transform' },
    )
  }, { scope: ref })

  const isAccent = (w: string) => accent.some((a) => a.replace(/[^a-zA-Z0-9]+$/, '') === w.replace(/[^a-zA-Z0-9]+$/, ''))

  const words = text.split(' ')
  return (
    <span ref={ref} className={className} style={{ perspective: 900, display: 'inline-block', ...style }}>
      {words.map((w, i) => (
        <span key={i} className="kw" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {w.split('').map((c, j) => (
            <span key={j} className={`char ${isAccent(w) ? 'gt-kyber' : ''}`} style={{ display: 'inline-block' }}>
              {c}
            </span>
          ))}
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </span>
  )
}

/** Blur-in reveal (ReactBits BlurText-style entrance) */
export function Blur({ text, className = '', delay = 0.1, duration = 0.9 }: {
  text: string; className?: string; delay?: number; duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  useGSAP(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, filter: 'blur(14px)', y: 12 },
      { opacity: 1, filter: 'blur(0px)', y: 0, duration, delay, ease: 'power2.out', clearProps: 'filter,transform' },
    )
  }, { scope: ref })
  return <span ref={ref} className={className}>{text}</span>
}

/** Simple fade/rise-in for body blocks (staggered children) */
export function Rise({ children, className = '', delay = 0.3, stagger = 0.09, style }: {
  children: React.ReactNode; className?: string; delay?: number; stagger?: number; style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const items = ref.current!.querySelectorAll('[data-rise]')
    if (items.length === 0) {
      gsap.fromTo(ref.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay })
      return
    }
    gsap.fromTo(items, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger, delay })
  }, { scope: ref })
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
