import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

/** Canvas particle-field cursor — a soft glowing trail of kyber motes that
    swirl behind the pointer (richer than DOM sparks, still cheap). */
function ParticleCursor() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let w = 0, h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    let mx = w / 2, my = h / 2
    let tx = mx, ty = my
    const particles: { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number }[] = []
    const MAX = 90

    const move = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY }

    let raf = 0
    let last = 0
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      // eased pointer
      mx += (tx - mx) * 0.22
      my += (ty - my) * 0.22
      const speed = Math.hypot(tx - mx, ty - my)
      // emit
      if (speed > 1 && particles.length < MAX) {
        for (let i = 0; i < 2; i++) {
          particles.push({
            x: mx + (Math.random() - 0.5) * 6,
            y: my + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 0.6 - (tx - mx) * 0.02,
            vy: (Math.random() - 0.5) * 0.6 - (ty - my) * 0.02,
            life: 0, max: 0.5 + Math.random() * 0.7,
            size: 0.8 + Math.random() * 2.2,
          })
        }
      }
      // update + draw
      ctx.clearRect(0, 0, w, h)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life += dt
        if (p.life >= p.max) { particles.splice(i, 1); continue }
        p.x += p.vx; p.y += p.vy
        p.vx *= 0.96; p.vy *= 0.96
        const a = 1 - p.life / p.max
        ctx.globalAlpha = a * 0.8
        ctx.fillStyle = '#67e8f9'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2)
        ctx.fill()
        // soft glow
        ctx.globalAlpha = a * 0.25
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 2.4 * a, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(loop)
    window.addEventListener('mousemove', move)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', move) }
  }, [])
  return <canvas ref={ref} className="particle-cursor" aria-hidden />
}

/** Magnetic element — pulls toward the cursor, springs back on leave */
export function Magnetic({ children, strength = 0.28, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current!
    if (window.matchMedia('(hover: none)').matches) return
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const x = e.clientX - r.left - r.width / 2
      const y = e.clientY - r.top - r.height / 2
      el.style.transition = 'transform 0.1s ease-out'
      el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`
    }
    const leave = () => {
      el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
      el.style.transform = 'translate3d(0, 0, 0)'
    }
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave) }
  }, [strength])
  return <div ref={ref} className={className} data-cursor="button">{children}</div>
}

/** Fixed film grain overlay (SVG turbulence, cheap) */
export function Grain() {
  return <div className="grain" aria-hidden />
}

/** Full-viewport scanline sweep */
export function Scanline() {
  return <div className="scanline" aria-hidden />
}

/** Vignette */
export function Vignette() {
  return <div className="layer-fixed vignette" aria-hidden />
}

/** Custom kyber cursor — dot (instant) + ring (lerped), hot states, click ripple */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx, ry = my
    let raf = 0

    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      if (dot.current) dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`
      const t = e.target as HTMLElement | null
      const zone = t?.closest?.('[data-cursor]') as HTMLElement | null
      const kind = zone?.getAttribute('data-cursor')
      if (ring.current) {
        ring.current.classList.toggle('is-hot', !!kind)
        ring.current.classList.toggle('is-hot-square', kind === 'button' || kind === 'link')
      }
    }

    const down = (e: MouseEvent) => {
      ring.current?.classList.add('is-press')
      if ((e.target as HTMLElement)?.closest?.('[data-cursor]')) return
      const r = document.createElement('div')
      r.className = 'ripple'
      r.style.left = `${e.clientX}px`; r.style.top = `${e.clientY}px`
      r.style.transform = 'translate(-50%, -50%) scale(0.4)'
      document.body.appendChild(r)
      r.animate(
        [
          { transform: 'translate(-50%, -50%) scale(0.4)', opacity: 0.9 },
          { transform: 'translate(-50%, -50%) scale(2.4)', opacity: 0 },
        ],
        { duration: 620, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      ).onfinish = () => r.remove()
    }
    const up = () => ring.current?.classList.remove('is-press')

    const loop = () => {
      rx += (mx - rx) * 0.16
      ry += (my - ry) * 0.16
      if (ring.current) {
        const d = Math.hypot(mx - rx, my - ry)
        const g = ring.current.classList.contains('is-hot') ? 1.9 : 1
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${Math.max(1, g - d * 0.004)})`
      }
      raf = requestAnimationFrame(loop)
    }
    loop()

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
    }
  }, [])

  return (
    <>
      <ParticleCursor />
      <div ref={dot} className="cursor-dot" aria-hidden />
      <div ref={ring} className="cursor-ring" aria-hidden />
    </>
  )
}

/** Iris wipe transition layer — driven imperatively by App via gsap */
export function Iris({ irisRef, ringRef }: { irisRef: React.RefObject<HTMLDivElement | null>; ringRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <>
      <div ref={irisRef} className="iris" aria-hidden />
      <div ref={ringRef} className="iris-ring" style={{ opacity: 0 }} aria-hidden />
    </>
  )
}
