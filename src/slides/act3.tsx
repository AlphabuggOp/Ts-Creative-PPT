import React, { useState } from 'react'
import gsap from 'gsap'
import { SlideFrame } from './SlideFrame'
import { Kinetic, Decrypt, Rise } from '../lib/textfx'
import { TiltCard, Expandable, NumberTicker, LetterGlitch, ElectricBorder, Drawer } from '../lib/reactbits'

/* ════════ 08 · THE CRAFT ════════ */
const STACK = [
  ['MOTION', 'GSAP + ScrollTrigger + Lenis', 'beat-locked timelines · scrub · inertia', 'Scroll drives a master timeline; every beat is hand-budgeted. Sound fires on scroll crossings, both directions.'],
  ['3D', 'three.js · custom GLSL', 'shaders · particles · bloom', 'The portal, tunnel, and every setpiece is procedural — swirl discs, fresnel rims, streak fields. No video, no models.'],
  ['MICRO', 'framer-motion · anime.js', 'springs · staggers', 'Card tilt, magnetic buttons, click ripples, glare sweeps — calibrated, never loud. Motion must mean something.'],
  ['TYPE', 'split-type + scramble engine', 'char split · decode', 'Titles flip in char-by-char; labels self-decrypt. A custom scramble engine types every transmission.'],
  ['STATE', 'zustand + persist', 'progress survives reload', 'The Sanctum remembers. Rank, callsign, and cleared rites persist across visits via local storage.'],
  ['AUDIO', 'procedural WebAudio', 'drone · chime · riser', 'Zero audio files — temple drone, crystal chimes, and hyperspace risers are synthesized live, armed on first touch.'],
]

// tiny live previews for the interactive stack list
function StackPreview({ id }: { id: string }) {
  if (id === 'MOTION') return <div className="sp-preview sp-motion"><div className="sp-bar" /></div>
  if (id === '3D') return <div className="sp-preview sp-3d"><div className="sp-orb orbit-ring" /></div>
  if (id === 'MICRO') return <div className="sp-preview sp-micro"><div className="sp-dot" /></div>
  if (id === 'TYPE') return <div className="sp-preview sp-type"><span className="t-mono">A→◈→Z</span></div>
  if (id === 'STATE') return <div className="sp-preview sp-state"><span className="t-mono">✓ SAVED</span></div>
  if (id === 'AUDIO') return <div className="sp-preview sp-audio"><span className="sp-wave" /></div>
  return null
}

const CRAFT_NOTES = [
  { t: 'The beat-locked timeline', d: 'Every entrance is hand-budgeted on a master timeline — no overlapping text, every hold lands crisp. Motion reads as choreography, not chaos.' },
  { t: 'Sound that answers the touch', d: 'Audio arms on the first real gesture, never on page load — so the first note lands exactly when the visitor acts, and silence stays silent.' },
]

export function CraftSlide() {
  const [active, setActive] = useState(0)
  const item = STACK[active]

  return (
    <SlideFrame num="08" label="THE CRAFT" ghost="08" layout="left" kickerNote="ENGINEERED TO FEEL EXPENSIVE">

      <Kinetic text="Engineered to feel expensive." accent={['expensive']} className="gt-steel slide-title" />
      <div className="slide-rule" style={{ width: 220, margin: '26px 0 22px' }} />

      {/* interactive stack list — click to preview */}
      <div className="t-mono" style={{ fontSize: 8, letterSpacing: '0.24em', color: 'var(--kyber-dim)', marginBottom: 10 }}>CLICK A LAYER — SEE WHAT IT DOES</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
        {STACK.map(([k, v, tag], i) => (
          <Rise key={k} delay={0.3 + i * 0.06}>
            <button
              data-rise
              data-cursor="button"
              onClick={() => setActive(i)}
              className="stack-chip"
              style={{ borderColor: i === active ? 'var(--kyber)' : 'rgba(103,232,249,0.16)' }}
            >
              <span className="t-mono" style={{ fontSize: 9, letterSpacing: '0.24em', color: i === active ? 'var(--kyber)' : 'var(--kyber-dim)' }}>{k}</span>
              <span style={{ fontSize: 11, color: 'var(--bone)' }}>{v}</span>
              <span className="t-mono" style={{ fontSize: 8, letterSpacing: '0.12em', color: 'var(--ghost)' }}>{tag}</span>
            </button>
          </Rise>
        ))}
      </div>

      {/* live preview panel for the active layer */}
      <div className="glass" style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '120px 1fr', gap: 18, alignItems: 'center', padding: '14px 18px' }}>
        <div style={{ width: 120, height: 80, display: 'grid', placeItems: 'center', borderRadius: 6, background: 'rgba(4,6,12,0.6)', border: '1px solid rgba(103,232,249,0.12)' }}>
          <StackPreview id={item[0]} />
        </div>
        <div>
          <div className="t-mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--kyber)', marginBottom: 6 }}>{item[0]} — {item[2]}</div>
          <div style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ghost)' }}>{item[3]}</div>
        </div>
      </div>

      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        {CRAFT_NOTES.map((w, i) => (
          <Rise key={w.t} delay={0.8 + i * 0.1}>
            <Expandable label={`CRAFT NOTE — ${w.t.toUpperCase()}`} defaultOpen={i === 0}>
              {w.d}
            </Expandable>
          </Rise>
        ))}
      </div>
    </SlideFrame>
  )
}

/* ════════ 09 · THE BRAND ════════ */
const SWATCHES = [
  ['INK', '#07090f', 'var(--ink)', 'the void'],
  ['KYBER', '#67e8f9', 'var(--kyber)', 'sanctum light'],
  ['EMBER', '#e8b44c', 'var(--ember)', 'attention'],
  ['THREAT', '#ff3b3b', 'var(--threat)', 'danger only'],
  ['BONE', '#e8e6df', 'var(--bone)', 'text'],
]

export function BrandSlide() {
  return (
    <SlideFrame num="09" label="THE BRAND" ghost="09" layout="left" kickerNote="DESIGN SYSTEM">

      <Kinetic text="Motion must mean something." accent={['mean']} className="gt-steel slide-title" />

      <div style={{ marginTop: 34, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        {SWATCHES.map(([name, hex, color, note], i) => (
          <Rise key={name} delay={0.4 + i * 0.09}>
            <TiltCard data-rise className="glass" max={12}>
              <div style={{ borderRadius: 6, overflow: 'hidden', background: 'rgba(11,15,26,0.5)' }}>
                <div style={{ height: 56, background: color, boxShadow: `inset 0 0 30px ${color}33`, transition: 'height 0.25s' }} />
                <div style={{ padding: '10px 12px' }}>
                  <div className="t-mono" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--bone)' }}>{name}</div>
                  <div className="t-mono" style={{ fontSize: 9, color: 'var(--kyber-dim)', marginTop: 2 }}>{hex} · {note}</div>
                </div>
              </div>
            </TiltCard>
          </Rise>
        ))}
      </div>

      <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <Rise delay={0.9}>
          <div data-rise style={{ border: '1px solid rgba(103,232,249,0.14)', borderRadius: 6, padding: '16px', background: 'rgba(11,15,26,0.4)' }}>
            <div className="t-mono" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--kyber-dim)', marginBottom: 8 }}>DISPLAY — CINZEL</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 30, letterSpacing: '0.1em', color: 'var(--bone)' }}>THE SACRED SERIF</div>
            <div className="t-mono" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--kyber-dim)', margin: '14px 0 8px' }}>UI — SPACE GROTESK</div>
            <div style={{ fontSize: 16, color: 'var(--ghost)' }}>The honest voice.</div>
            <div className="t-mono" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--kyber-dim)', margin: '14px 0 8px' }}>MACHINE — IBM PLEX MONO</div>
            <div className="t-mono" style={{ fontSize: 12, color: 'var(--kyber)' }}>the network's whisper</div>
          </div>
        </Rise>
        <Rise delay={1.05}>
          <div data-rise style={{ border: '1px solid rgba(103,232,249,0.14)', borderRadius: 6, padding: '16px', background: 'rgba(11,15,26,0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
            <div className="t-mono" style={{ fontSize: 8, letterSpacing: '0.24em', color: 'var(--kyber-dim)' }}>TYPE SCALE — LIVE</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 40, letterSpacing: '0.04em', color: 'var(--bone)' }}>Aa</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 400, fontSize: 22, color: 'var(--ghost)' }}>Aa</span>
              <span className="t-mono" style={{ fontSize: 14, color: 'var(--kyber)' }}>Aa</span>
              <span className="t-mono" style={{ fontSize: 9, color: 'var(--kyber-dim)' }}>Aa</span>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--bone)' }}>Nothing shakes for no reason.</div>
            <div style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--bone)' }}>Displays get steel; terminals decode; <span className="t-ember">warmth signals attention.</span></div>
            <div className="t-mono" style={{ fontSize: 11, letterSpacing: '0.16em', color: 'var(--kyber)' }}>ONE LAW: MOTION MUST MEAN SOMETHING.</div>
          </div>
        </Rise>
      </div>

      <Rise delay={1.2}>
        <div data-rise style={{ marginTop: 22, maxWidth: 640 }}>
          <Drawer label="THE TOKEN PHILOSOPHY" badge="DETAIL">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>◈ <b style={{ color: 'var(--bone)' }}>INK</b> — the void. Everything sits in deep space, never flat black.</div>
              <div>◈ <b style={{ color: 'var(--bone)' }}>KYBER</b> — the network's light. Used only for what is alive: portals, beacons, progress.</div>
              <div>◈ <b style={{ color: 'var(--bone)' }}>EMBER</b> — warmth and attention. The moment something matters, it warms gold.</div>
              <div>◈ <b style={{ color: 'var(--bone)' }}>THREAT</b> — red appears only for danger. It means the Empire is watching.</div>
            </div>
          </Drawer>
        </div>
      </Rise>
    </SlideFrame>
  )
}

/* ════════ 10 · WHY THIS WINS ════════ */
const AXES = [
  ['FUNCTIONALITY', 'cipher, A* router, trials — real working software', 92],
  ['UI · UX', 'narrated rite onboarding is a UX case study', 88],
  ['AESTHETIC', 'kyber-luminous, grain, beat-locked sound', 94],
  ['CREATIVITY', 'decoy blog + panic key + the hidden entry rite', 96],
  ['ORIGINALITY', 'a website that pretends not to exist', 98],
]

function ScoreBar({ value, color }: { value: number; color: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    gsap.fromTo(ref.current, { width: '0%' }, { width: `${value}%`, duration: 1.2, ease: 'power3.out', delay: 0.5 })
  }, [value])
  return (
    <div style={{ height: 5, borderRadius: 3, background: 'rgba(103,232,249,0.12)', overflow: 'hidden' }}>
      <div ref={ref} style={{ height: '100%', borderRadius: 3, background: color, boxShadow: `0 0 12px ${color}` }} />
    </div>
  )
}

export function WhySlide() {
  return (
    <SlideFrame num="10" label="WHY THIS WINS" ghost="10" layout="left" kickerNote="MAPPED TO THE RUBRIC">

      <Kinetic text="Every criterion becomes a feature." accent={['feature']} className="gt-steel slide-title" />
      <div className="slide-rule" style={{ width: 220, margin: '28px 0 24px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {AXES.map(([k, v, score], i) => (
          <Rise key={k as string} delay={0.3 + i * 0.1}>
            <div data-rise style={{ border: '1px solid rgba(103,232,249,0.12)', borderRadius: 6, padding: '13px 16px', background: 'rgba(11,15,26,0.55)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                <span className="t-mono" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--kyber)', width: 130 }}>{k}</span>
                <span style={{ fontSize: 13.5, color: 'var(--ghost)', flex: 1 }}>{v}</span>
                <span className="t-mono" style={{ fontSize: 16, color: 'var(--kyber)' }}><NumberTicker value={score as number} className="t-kyber" /></span>
              </div>
              <ScoreBar value={score as number} color={i === 4 ? 'var(--ember)' : 'var(--kyber)'} />
            </div>
          </Rise>
        ))}
      </div>

      <Rise delay={1.1}>
        <div data-rise style={{ marginTop: 20, maxWidth: 640 }}>
          <Drawer label="THE PROOF BEHIND THE SCORE" badge="DETAIL">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>◈ <b style={{ color: 'var(--bone)' }}>Functionality</b> — the cipher, A* router and trials are real, working software — not mockups.</div>
              <div>◈ <b style={{ color: 'var(--bone)' }}>UI/UX</b> — the narrated rite onboarding teaches through play, never paragraphs.</div>
              <div>◈ <b style={{ color: 'var(--bone)' }}>Originality</b> — no other submission is a website that pretends not to exist until you prove yourself.</div>
            </div>
          </Drawer>
        </div>
      </Rise>
    </SlideFrame>
  )
}

/* ════════ 11 · SUMMARY (mnemonic) ════════ */
const HIDE = [
  ['H', 'HIDE', 'in plain sight — the decoy blog'],
  ['I', 'INVITE', 'only the worthy — the three trials'],
  ['D', 'DEFEND', 'the network — panic key, secrecy'],
  ['E', 'ENDURE', 'progress persists — the network remembers'],
]

export function MnemonicSlide() {
  return (
    <SlideFrame num="11" label="SUMMARY" layout="center" ghost="Ⅺ" kickerNote="REMEMBER IT LIKE THIS">

      <Kinetic text="Hide in plain sight." accent={['Hide']} className="gt-steel slide-title" delay={0.15} />
      <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        {HIDE.map(([letter, word, rest], i) => (
          <Rise key={letter} delay={0.5 + i * 0.12}>
            <TiltCard data-rise className="glass" max={14}>
              <div style={{ textAlign: 'center', padding: '20px 14px' }}>
                <LetterGlitch text={letter} interval={3400 + i * 600} style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 42, color: 'var(--kyber)', textShadow: '0 0 26px rgba(103,232,249,0.5)' }} />
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, letterSpacing: '0.2em', color: 'var(--bone)', margin: '8px 0 6px' }}>{word}</div>
                <div style={{ fontSize: 12, lineHeight: 1.45, color: 'var(--ghost)' }}>{rest}</div>
              </div>
            </TiltCard>
          </Rise>
        ))}
      </div>
      <div style={{ marginTop: 30 }}>
        <Decrypt text="[ THE WHOLE PROTOCOL, IN FOUR LETTERS ]" className="t-mono" duration={1.1} start={1.3} style={{ fontSize: 12, letterSpacing: '0.2em', color: 'var(--kyber-dim)' }} />
      </div>
    </SlideFrame>
  )
}

/* ════════ 12 · END / TRANSMISSION ════════ */
export function EndSlide() {
  return (
    <SlideFrame num="END" label="TRANSMISSION" layout="center" kickerNote="TS'26 CREATIVE · TEAM CCA">

      <div style={{ position: 'absolute', left: '50%', top: '50%', translate: '-50% -50%', width: '90vmin', height: '90vmin', borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(103,232,249,0.08), transparent 60%)' }} />

      <Kinetic text="The network remembers." accent={['remembers']} className="gt-steel slide-title" delay={0.15} />

      <Rise delay={0.9} style={{ marginTop: 40 }}>
        <div data-rise style={{ display: 'flex', justifyContent: 'center', gap: 26, flexWrap: 'wrap' }}>
          {['AARAV CHOUDHARY', 'ANUJ PHULERA', 'JEEHAN KWATRA'].map((n) => (
            <span key={n} className="t-mono" style={{ fontSize: 12, letterSpacing: '0.24em', color: 'var(--bone)' }}>{n}</span>
          ))}
        </div>
      </Rise>

      <Rise delay={1.2} style={{ marginTop: 30 }}>
        <div data-rise style={{ display: 'flex', justifyContent: 'center', gap: 30, flexWrap: 'wrap' }}>
          <span className="t-mono" style={{ fontSize: 11, letterSpacing: '0.16em', color: 'var(--kyber-dim)' }}>ts46.club/creative</span>
          <span className="t-mono" style={{ fontSize: 11, letterSpacing: '0.16em', color: 'var(--kyber-dim)' }}>Colonels Central Academy</span>
        </div>
      </Rise>

      <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
        <ElectricBorder
          className="glass"
          style={{ padding: '4px' }}
          onClick={() => window.dispatchEvent(new CustomEvent('deck-nav', { detail: 'home' }))}
        >
          <div style={{ padding: '12px 26px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className="t-mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--kyber)' }}>↻ RUN IT AGAIN</span>
            <span className="t-mono" style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--ember)' }}>—</span>
            <LetterGlitch text="END / TRANSMISSION" className="t-mono" interval={3200} style={{ fontSize: 11, letterSpacing: '0.22em', color: 'var(--bone)' }} />
          </div>
        </ElectricBorder>
      </div>

      {/* actions */}
      <Rise delay={1.5} style={{ marginTop: 24 }}>
        <div data-rise style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          <button
            className="t-mono end-link"
            data-cursor="button"
            onClick={() => window.dispatchEvent(new CustomEvent('deck-nav', { detail: 'blog' }))}
            style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--kyber-dim)' }}
          >
            ← RETURN TO THE ARCHIVE
          </button>
          <button
            className="t-mono end-link"
            data-cursor="button"
            onClick={() => window.dispatchEvent(new CustomEvent('deck-nav', { detail: 'home' }))}
            style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--kyber-dim)' }}
          >
            ↻ RESTART THE RITE
          </button>
        </div>
      </Rise>

      {/* credits */}
      <Rise delay={1.7} style={{ marginTop: 30 }}>
        <div data-rise style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div className="t-mono" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--kyber-dim)' }}>CONCEIVED · DESIGNED · BUILT BY</div>
          <div className="t-mono" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--bone)' }}>TEAM CCA</div>
          <div className="t-mono" style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--ghost)' }}>PROJECT SANCTUM · TS '26 CREATIVE · TECH SYNDICATE</div>
        </div>
      </Rise>
    </SlideFrame>
  )
}
