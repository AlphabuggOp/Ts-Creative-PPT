import { SlideFrame } from './SlideFrame'
import { Kinetic, Rise } from '../lib/textfx'
import { TiltCard, ShinyText, NumberTicker, Expandable, Drawer } from '../lib/reactbits'

/* ════════ 05 · THE GATE ════════ */
const GATE_STATS = ['620vh scroll', 'custom GLSL portal', 'beat-locked timeline', 'procedural audio']

export function GateSlide() {
  return (
    <SlideFrame num="05" label="THE GATE" ghost="05" layout="left" kickerNote="ACT 1 — SCROLL CINEMA">

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 200px', gap: 32, alignItems: 'start' }}>
        <div>
          <Kinetic text="A scroll is a journey." accent={['journey']} className="gt-steel slide-title" />
          <div className="slide-rule" style={{ width: 220, margin: '28px 0 24px' }} />
          <Rise className="slide-body">
            <p data-rise>620vh of pinned scroll-cinema. You don't click — you <b className="ky">fly</b>.</p>
            <p data-rise>The void splits, a portal assembles from ten crystals, and the camera dives to hyperspace.</p>
            <p data-rise>Every beat is hand-budgeted on a <b>beat-locked master timeline</b> — sound and motion fire on scroll crossings, both directions.</p>
          </Rise>
          <div style={{ marginTop: 26, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {GATE_STATS.map((s, i) => (
              <Rise key={s} delay={0.6 + i * 0.1}>
                <span data-rise className="t-mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--kyber-dim)', border: '1px solid rgba(103,232,249,0.22)', borderRadius: 999, padding: '7px 14px' }}>{s}</span>
              </Rise>
            ))}
          </div>
        </div>

        {/* side stat panel */}
        <Rise delay={0.7}>
          <TiltCard data-rise className="glass" max={10}>
            <div style={{ padding: 18, textAlign: 'center' }}>
              <div className="t-mono" style={{ fontSize: 8, letterSpacing: '0.22em', color: 'var(--kyber-dim)' }}>SCROLL DEPTH</div>
              <ShinyText text="620" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 48, letterSpacing: '0.04em' }} />
              <div className="t-mono" style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--ghost)' }}>VIEWPORT HEIGHTS</div>
              <div style={{ height: 1, background: 'rgba(103,232,249,0.2)', margin: '14px 0' }} />
              <div className="t-mono" style={{ fontSize: 8, letterSpacing: '0.2em', color: 'var(--kyber-dim)', marginBottom: 6 }}>BEATS ON THE LINE</div>
              <div className="t-mono" style={{ fontSize: 22, color: 'var(--bone)' }}>
                <NumberTicker value={8} className="t-kyber" /> <span style={{ fontSize: 11, color: 'var(--ghost)' }}>story beats</span>
              </div>
            </div>
          </TiltCard>
        </Rise>
      </div>
    </SlideFrame>
  )
}

/* ════════ 06 · THE TRIALS ════════ */
const RITES = [
  { n: 'RITE I', name: 'SIGNAL', skill: 'memory', desc: 'Drag-rotate a sealed dial to catch a living, drifting frequency.', color: 'var(--kyber)', detail: 'Round I waits still · II slips (random retunes) · III runs with drift. Catch the carrier, hold the window, decode the fragments.' },
  { n: 'RITE II', name: 'FOCUS', skill: 'steadiness', desc: 'Hold your light inside a breathing ring while the void pulls.', color: 'var(--kyber)', detail: 'Three escalating waves — the ring tightens as your coherence rises. Probe-droids fly past; the void yanks. Hold better, hold finer.' },
  { n: 'RITE III', name: 'CHOICE', skill: 'judgment', desc: 'Three dilemmas. No wrong answers — only conviction.', color: 'var(--ember)', detail: 'Every judgment slams a wax-stamp verdict, then demands its proof — a minigame that makes your words become deeds.' },
]

export function TrialsSlide() {
  return (
    <SlideFrame num="06" label="THE TRIALS" ghost="06" layout="left" kickerNote="ACT 2 — PROVE YOURSELF">

      <Kinetic text="Three rites judge the worthy." accent={['judge']} className="gt-steel slide-title" />
      <div className="slide-rule" style={{ width: 220, margin: '28px 0 24px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14 }}>
        {RITES.map((r, i) => (
          <Rise key={r.name} delay={0.35 + i * 0.12}>
            <TiltCard data-rise className="glass" max={11}>
              <div style={{ padding: 18, borderTop: `2px solid ${r.color}` }}>
                <div className="t-mono" style={{ fontSize: 9, letterSpacing: '0.24em', color: r.color, marginBottom: 12 }}>{r.n} · {r.skill.toUpperCase()}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, letterSpacing: '0.12em', color: 'var(--bone)', marginBottom: 8 }}>{r.name}</div>
                <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--ghost)', marginBottom: 10 }}>{r.desc}</div>
                <Expandable label="RITE DETAIL" defaultOpen={false}>
                  {r.detail}
                </Expandable>
              </div>
            </TiltCard>
          </Rise>
        ))}
      </div>
      <Rise delay={1.0} className="slide-body" style={{ marginTop: 22 }}>
        <p data-rise style={{ margin: 0 }}>
          Score 0–9 → the <b>Ceremony</b> mints your <b className="ky">Rank</b>, <b className="ky">Callsign</b>, and an animated <b className="ky">Sigil</b> — forged from how you played.
        </p>
      </Rise>
    </SlideFrame>
  )
}

/* ════════ 07 · THE SANCTUM ════════ */
const HUB = [
  { name: 'HOLO-MAP', desc: 'Living 3D map of beacons & threat zones' },
  { name: 'DEAD-DROP CIPHER', desc: 'Encode messages into star-chart coordinates' },
  { name: 'SAFE-LANE ROUTER', desc: 'A* pathing that avoids patrol zones' },
  { name: 'ARCHIVES', desc: 'Holocron lore & survival guides' },
  { name: 'COUNCIL', desc: 'The war-room board' },
  { name: 'BEACON FORGE', desc: 'Mint recruitment posters → PNG export' },
]

export function SanctumSlide() {
  return (
    <SlideFrame num="07" label="THE SANCTUM" ghost="07" layout="left" kickerNote="ACT 3 — YOU'RE INSIDE">

      <Kinetic text="Inside: the tools of a hidden war." accent={['hidden']} className="gt-steel slide-title" />
      <div className="slide-rule" style={{ width: 220, margin: '28px 0 24px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
        {HUB.map((h, i) => (
          <Rise key={h.name} delay={0.35 + i * 0.08}>
            <div data-rise data-cursor="button" style={{ border: '1px solid rgba(103,232,249,0.14)', borderRadius: 6, padding: '14px 16px', background: 'rgba(11,15,26,0.55)' }}>
              <div className="t-mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--kyber)', marginBottom: 6 }}>◈ {h.name}</div>
              <div style={{ fontSize: 12, lineHeight: 1.45, color: 'var(--ghost)' }}>{h.desc}</div>
            </div>
          </Rise>
        ))}
      </div>
      <Rise delay={1.05}>
        <div data-rise data-cursor="button" style={{ marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 12, border: '1px solid rgba(232,180,76,0.4)', borderRadius: 6, padding: '12px 18px', background: 'rgba(232,180,76,0.05)' }}>
          <span className="t-mono" style={{ fontSize: 12, letterSpacing: '0.18em', color: 'var(--ember)' }}>PRESS ~</span>
          <span className="t-mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--ghost)' }}>— THE WHOLE SITE VANISHES INTO A DEAD ASTRONOMY BLOG.</span>
        </div>
      </Rise>

      <Rise delay={1.2}>
        <div data-rise style={{ marginTop: 18, maxWidth: 640 }}>
          <Drawer label="HOW THE CONSOLES WORK" badge="DETAIL">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>◈ <b style={{ color: 'var(--bone)' }}>Holo-map</b> — a live 3D globe of beacon nodes and expanding red threat zones.</div>
              <div>◈ <b style={{ color: 'var(--bone)' }}>Dead-drop cipher</b> — write a message, it encodes into star-chart coordinates; your sigil is the key.</div>
              <div>◈ <b style={{ color: 'var(--bone)' }}>Safe-lane router</b> — A* pathing plots the route that avoids patrol zones (judges can test it).</div>
              <div>◈ <b style={{ color: 'var(--bone)' }}>Beacon forge</b> — mint a recruitment poster with your callsign + sigil → PNG export.</div>
            </div>
          </Drawer>
        </div>
      </Rise>
    </SlideFrame>
  )
}
