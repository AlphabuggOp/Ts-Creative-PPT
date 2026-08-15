import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Grain, Scanline, Vignette, Cursor, Iris } from './lib/fx'
import { Hud } from './components/Hud'
import { GridMode } from './components/GridMode'
import { HelpOverlay } from './components/HelpOverlay'
import { Bootloader } from './components/Bootloader'
import { DecoyBlog } from './components/DecoyBlog'
import { ThreeStage } from './three/ThreeStage'
import { SLIDES } from './slides/registry'
import { armAudio, sfxWhoosh, sfxTick, setMuted, sfxChime } from './lib/audio'

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

function initialIndex(total: number): number {
  if (typeof window === 'undefined') return 0
  const p = new URLSearchParams(window.location.search).get('slide')
  const n = p === null ? NaN : parseInt(p, 10)
  return Number.isFinite(n) ? clamp(n - 1, 0, total - 1) : 0
}

export default function App() {
  const [index, setIndex] = useState(() => initialIndex(SLIDES.length))
  const [gridOpen, setGridOpen] = useState(false)
  const [gridSel, setGridSel] = useState(0)
  const [helpOpen, setHelpOpen] = useState(false)
  const [muted, setMutedState] = useState(false)
  const [panic, setPanic] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false
    // ?unlock bypasses the decoy (for render/QA scripts). Otherwise the unlock
    // persists via localStorage — once found, reloads go straight to the deck.
    if (new URLSearchParams(window.location.search).has('unlock')) return true
    return localStorage.getItem('sanctum-found') === '1'
  })
  const [booting, setBooting] = useState(() => {
    if (typeof window === 'undefined') return false
    if (new URLSearchParams(window.location.search).has('noboot')) return false
    return !sessionStorage.getItem('sanctum-booted')
  })
  const indexRef = useRef(index)
  const lockRef = useRef(false)
  const gridRef = useRef(false)
  const helpRef = useRef(false)
  const selRef = useRef(0)
  const irisRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)

  const total = SLIDES.length
  const labels = SLIDES.map((s) => s.label)

  const goTo = (next: number) => {
    next = clamp(next, 0, total - 1)
    if (next === indexRef.current || lockRef.current) return
    lockRef.current = true
    sfxWhoosh()

    // 1 · kyber flash-burst (visual only — never blocks the switch)
    if (flashRef.current) {
      gsap.fromTo(flashRef.current, { opacity: 0 }, { opacity: 1, duration: 0.16, ease: 'power1.in', onComplete: () => {
        gsap.to(flashRef.current, { opacity: 0, duration: 0.3, ease: 'power1.out' })
      } })
    }

    // 2 · iris closes (visual only)
    gsap.to(irisRef.current, { clipPath: 'circle(150% at 50% 50%)', duration: 0.34, ease: 'power2.in' })

    // 3 · the actual slide switch — WALL-CLOCK timer (rAF-independent), so a
    //     throttled rAF on a weak GPU can never freeze navigation.
    window.setTimeout(() => {
      indexRef.current = next
      setIndex(next)
      // expanding shockwave ring as the portal re-opens
      if (ringRef.current) {
        gsap.fromTo(ringRef.current,
          { width: 0, height: 0, opacity: 0.6, left: '50%', top: '50%', xPercent: -50, yPercent: -50 },
          { width: '170vmax', height: '170vmax', opacity: 0, duration: 0.85, ease: 'power2.out' })
      }
      // 4 · iris opens (visual)
      gsap.to(irisRef.current, { clipPath: 'circle(0% at 50% 50%)', duration: 0.65, ease: 'power3.out' })
      // release the lock on a wall-clock timer too
      window.setTimeout(() => { lockRef.current = false }, 700)
    }, 400)
  }

  const next = () => goTo(indexRef.current + 1)
  const prev = () => goTo(indexRef.current - 1)

  const openGrid = () => {
    setGridSel(indexRef.current); selRef.current = indexRef.current
    gridRef.current = true; setGridOpen(true); sfxTick()
  }
  const closeGrid = () => { gridRef.current = false; setGridOpen(false); sfxTick() }
  const toggleHelp = () => {
    helpRef.current = !helpRef.current
    setHelpOpen(helpRef.current); sfxTick()
  }
  const toggleMute = () => {
    const m = !muted
    setMutedState(m); setMuted(m); sfxTick()
  }
  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else document.documentElement.requestFullscreen?.()
  }

  useEffect(() => {
    if (!autoPlay) return
    const iv = setInterval(() => {
      if (indexRef.current >= total - 1) {
        goTo(0)
      } else {
        goTo(indexRef.current + 1)
      }
    }, 5500)
    return () => clearInterval(iv)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay])

  useEffect(() => {
    const arm = () => armAudio()
    window.addEventListener('pointerdown', arm, { once: true })
    window.addEventListener('keydown', arm, { once: true })
    window.addEventListener('wheel', arm, { once: true })

    const onKey = (e: KeyboardEvent) => {
      // PANIC KEY — only active once the Sanctum has been found
      if ((e.key === '`' || e.key === '~') && unlocked) { e.preventDefault(); setPanic((p) => !p); return; }
      // Hidden demo key: D wipes the unlock (blog returns on next refresh)
      if ((e.key === 'd' || e.key === 'D') && unlocked) { e.preventDefault(); resetAccess(); return; }
      // global extras (work everywhere, even in overlays)
      if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFullscreen(); return }
      if (e.key === 'm' || e.key === 'M') { e.preventDefault(); toggleMute(); return }
      if (e.key === '?') { e.preventDefault(); toggleHelp(); return }
      if (e.key === 'a' || e.key === 'A') { e.preventDefault(); setAutoPlay((v) => !v); return }
      if (e.key === 'Escape' && helpRef.current) { helpRef.current = false; setHelpOpen(false); return }

      if (gridRef.current) {
        switch (e.key) {
          case 'Escape': case 'g': case 'G': e.preventDefault(); closeGrid(); break
          case 'ArrowRight': case 'ArrowDown': e.preventDefault(); setGridSel((s) => { const v = clamp(s + 1, 0, total - 1); selRef.current = v; return v }); break
          case 'ArrowLeft': case 'ArrowUp': e.preventDefault(); setGridSel((s) => { const v = clamp(s - 1, 0, total - 1); selRef.current = v; return v }); break
          case 'Enter': case ' ': e.preventDefault(); goTo(selRef.current); closeGrid(); break
          default: break
        }
        return
      }

      switch (e.key) {
        case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': e.preventDefault(); next(); break
        case 'ArrowLeft': case 'ArrowUp': case 'PageUp': e.preventDefault(); prev(); break
        case '[': e.preventDefault(); prev(); break
        case ']': e.preventDefault(); next(); break
        case 'Home': e.preventDefault(); goTo(0); break
        case 'End': e.preventDefault(); goTo(total - 1); break
        case 'g': case 'G': e.preventDefault(); openGrid(); break
        case 'r': case 'R': e.preventDefault(); goTo(indexRef.current); break
        default: break
      }
      // number keys 1-9, 0 → jump to slide (0 = slide 10)
      if (/^[0-9]$/.test(e.key)) {
        const n = parseInt(e.key, 10)
        const target = n === 0 ? 9 : n - 1
        if (target < total) { e.preventDefault(); goTo(target) }
      }
    }
    window.addEventListener('keydown', onKey)

    // Navigation event bus — slides dispatch these to drive the deck.
    const onDeckNav = (e: Event) => {
      const d = (e as CustomEvent<string>).detail
      if (d === 'next') next()
      else if (d === 'prev') prev()
      else if (d === 'home') goTo(0)
      else if (d === 'blog') setPanic(true)
    }
    const onDeckNext = () => next()
    window.addEventListener('deck-nav', onDeckNav)
    window.addEventListener('deck-next', onDeckNext)

    let wheelLock = false
    const onWheel = (e: WheelEvent) => {
      if (gridRef.current || wheelLock) return
      const dy = e.deltaY
      if (Math.abs(dy) < 24) return
      wheelLock = true
      setTimeout(() => (wheelLock = false), 720)
      if (dy > 0) next()
      else prev()
    }
    window.addEventListener('wheel', onWheel, { passive: true })

    let tx = 0, ty = 0
    const onTouchStart = (e: TouchEvent) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY }
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - tx
      const dy = e.changedTouches[0].clientY - ty
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) { dx > 0 ? prev() : next() }
      else if (Math.abs(dy) > 70 && Math.abs(dy) > Math.abs(dx)) { dy > 0 ? next() : prev() }
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('deck-nav', onDeckNav)
      window.removeEventListener('deck-next', onDeckNext)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('pointerdown', arm)
      window.removeEventListener('keydown', arm)
      window.removeEventListener('wheel', arm)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted, unlocked])

  const Slide = SLIDES[index].Component

  const finishBoot = () => {
    setBooting(false)
    if (typeof window !== 'undefined') sessionStorage.setItem('sanctum-booted', '1')
    sfxChime()
  }

  const doUnlock = () => {
    if (typeof window !== 'undefined') localStorage.setItem('sanctum-found', '1')
    setUnlocked(true)
    setBooting(true)
  }

  // Hidden demo key: D clears the saved unlock, so the next refresh lands on the blog
  const resetAccess = () => {
    if (typeof window !== 'undefined') localStorage.removeItem('sanctum-found')
    setUnlocked(false)
    setPanic(false)
  }

  // ── THE DECOY: the deck hides behind a dead astronomy blog until found ──
  if (!unlocked) {
    return (
      <div className="deck-stage">
        <DecoyBlog mode="landing" onUnlock={doUnlock} />
      </div>
    )
  }

  return (
    <div className="deck-stage">
      <ThreeStage sceneId={SLIDES[index].id} />
      <div className="bg-scrim" aria-hidden />
      <Vignette />
      <div className="deck-scale">
        <Slide key={index} />
      </div>
      <Scanline />
      <Grain />
      <Hud index={index} total={total} labels={labels} onGo={(i) => { sfxTick(); goTo(i) }} onGrid={openGrid} muted={muted} onHelp={toggleHelp} />
      <GridMode open={gridOpen} sel={gridSel} current={index} onSelect={(i) => { selRef.current = i; setGridSel(i) }} onGo={(i) => { goTo(i); closeGrid() }} />
      <HelpOverlay open={helpOpen} onClose={toggleHelp} muted={muted} />
      <Cursor />
      <Iris irisRef={irisRef} ringRef={ringRef} />
      <div ref={flashRef} className="flash" aria-hidden />
      {booting && <Bootloader onDone={finishBoot} />}
      {panic && <DecoyBlog mode="panic" onReturn={() => setPanic(false)} />}

      {/* mobile nav */}
      <button className="mnav mnav-prev" data-cursor="button" onClick={prev} aria-label="Previous slide">‹</button>
      <button className="mnav mnav-next" data-cursor="button" onClick={next} aria-label="Next slide">›</button>

      {/* auto-reel indicator */}
      {autoPlay && (
        <div className="autoplay-pill">▶ AUTO-REEL — PRESS A TO STOP</div>
      )}
    </div>
  )
}
