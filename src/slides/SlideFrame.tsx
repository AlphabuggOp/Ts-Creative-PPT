import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Decrypt } from '../lib/textfx'

interface SlideFrameProps {
  num: string
  label: string
  ghost?: string
  layout?: 'center' | 'left'
  children: React.ReactNode
  /** className passthrough onto .slide */
  className?: string
  /** optional custom kicker suffix (decrypt) */
  kickerNote?: string
}

/** Shared slide chrome: kicker, ghost numeral, corner brackets, staged entrance + cursor parallax */
export function SlideFrame({ num, label, ghost, layout = 'left', children, className = '', kickerNote }: SlideFrameProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current!
    const ghost = el.querySelector('.ghost-num')
    gsap.fromTo(el.querySelector('.slide-kicker'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.05 })
    if (ghost) gsap.fromTo(ghost, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out', delay: 0.1 })

    // cursor parallax on the content (subtle, layers depth)
    const content = el.querySelector('.slide-inner') as HTMLElement | null
    if (!content || window.matchMedia('(hover: none)').matches) return
    let raf = 0
    let tx = 0, ty = 0, cx = 0, cy = 0
    const onMove = (e: MouseEvent) => {
      cx = (e.clientX / window.innerWidth - 0.5) * 2
      cy = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const loop = () => {
      tx += (cx * 14 - tx) * 0.05
      ty += (cy * 10 - ty) * 0.05
      content.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <div ref={ref} className={`slide slide-${layout} ${className}`}>
      {/* ghost numeral */}
      {ghost && (
        <div className="ghost-num" style={layout === 'center' ? { left: '50%', top: '8%', transform: 'translateX(-50%)' } : { right: '4%', bottom: '-6%' }}>
          {ghost}
        </div>
      )}

      {/* corner brackets */}
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />

      <div className="slide-inner" style={{ position: 'relative', zIndex: 2, maxWidth: 1100, width: '100%', justifySelf: 'center', alignSelf: 'center', padding: '70px 0' }}>
        <div className="slide-kicker" style={{ marginBottom: 26, justifyContent: layout === 'center' ? 'center' : 'flex-start' }}>
          <span className="idx">{num}</span>
          <span>{label}</span>
          {kickerNote && <Decrypt text={kickerNote} duration={0.7} start={0.15} />}
        </div>
        {children}
      </div>
    </div>
  )
}
