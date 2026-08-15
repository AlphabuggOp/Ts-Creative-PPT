import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Decrypt } from '../lib/textfx'

const LINES = [
  'CALIBRATING KYBER LATTICE',
  'ESTABLISHING COVERT UPLINK',
  'DECRYPTING TRANSMISSIONS',
  'CHARGING PORTAL RING',
  'MASKING SIGNAL IN PLAIN SIGHT',
  'CHANNEL OPEN.',
]

/** SANCTUM bootloader — plays once per session, then iris-lifts into the deck */
export function Bootloader({ onDone }: { onDone: () => void }) {
  const veilRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [lineIdx, setLineIdx] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    const start = performance.now()
    const DURATION = 2200

    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION)
      setProgress(Math.floor(p * 100))
      setLineIdx(Math.min(LINES.length - 1, Math.floor(p * LINES.length)))
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else if (!doneRef.current) {
        doneRef.current = true
        // iris-lift the veil (visual), then finish on a wall-clock timer so a
        // throttled rAF can never strand the deck behind the bootloader
        gsap.to(veilRef.current, {
          clipPath: 'circle(0% at 50% 50%)',
          duration: 0.7,
          ease: 'power3.inOut',
          delay: 0.25,
        })
        window.setTimeout(onDone, 1000)
      }
    }
    raf = requestAnimationFrame(tick)
    // wall-clock failsafe: even if rAF stalls entirely, finish the boot
    const failsafe = window.setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true
        onDone()
      }
    }, DURATION + 1600)
    return () => { cancelAnimationFrame(raf); clearTimeout(failsafe) }
  }, [onDone])

  return (
    <div ref={veilRef} className="boot-veil">
      <div className="boot-inner">
        {/* sigil */}
        <div className="boot-sigil">
          <div className="boot-diamond" />
          <div className="boot-ring orbit-ring" />
        </div>

        {/* status lines */}
        <div className="boot-lines">
          {LINES.slice(0, lineIdx + 1).map((l, i) => (
            <div key={i} className={`boot-line ${i === LINES.length - 1 ? 'is-done' : ''}`}>
              <span className="boot-caret">▸</span>
              {i === lineIdx && lineIdx < LINES.length - 1
                ? <Decrypt text={l} duration={0.4} className="t-mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--kyber)' }} />
                : <span className="t-mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: l === 'CHANNEL OPEN.' ? 'var(--kyber-bright)' : 'var(--ghost)' }}>{l}{i < lineIdx ? ' … OK' : ''}</span>}
            </div>
          ))}
        </div>

        {/* progress */}
        <div className="boot-progress">
          <div className="boot-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="t-mono boot-pct" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--kyber-dim)' }}>
          {progress}%
        </div>
      </div>
    </div>
  )
}
