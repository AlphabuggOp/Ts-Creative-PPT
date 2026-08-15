import { useEffect, useRef } from 'react'

interface Star {
  x: number; y: number; r: number; tw: number; ph: number; z: number
}

/** Cheap 2D starfield with twinkle + depth parallax (no WebGL needed) */
export function Starfield({ density = 160, className = '' }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let w = 0, h = 0
    let stars: Star[] = []
    let raf = 0
    let t = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6)

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.2,
        tw: Math.random() * Math.PI * 2,
        ph: Math.random() * 0.06 + 0.01,
        z: Math.random() * 0.8 + 0.2,
      }))
    }

    const loop = (now: number) => {
      t = now / 1000
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        const a = 0.25 + Math.abs(Math.sin(t * s.ph * 10 + s.tw)) * 0.7
        ctx.globalAlpha = a * s.z
        ctx.fillStyle = s.z > 0.75 ? '#a5e9f7' : '#e8e6df'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(loop)
    }

    resize()
    loop(0)
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [density])

  return <canvas ref={ref} className={className} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden />
}
