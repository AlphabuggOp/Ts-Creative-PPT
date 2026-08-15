/* Physical pitch deck — a DETAILED, read-first presentation.
   Different structure + deeper content than the kinetic web deck: ~16 slides
   telling the full story (problem → insight → product → acts → stack → brand →
   UX → why it wins → team → roadmap). Composed, print-grade. */
import { createRoot } from 'react-dom/client'
import '@fontsource/cinzel/700.css'
import '@fontsource/cinzel/900.css'
import '@fontsource/space-grotesk/300.css'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './design/tokens.css'
import './print.css'

const INK = '#07090f'
const INK2 = '#0b0f1a'
const KYBER = '#67e8f9'
const KYBER_DIM = '#2e8fa3'
const EMBER = '#e8b44c'
const THREAT = '#ff3b3b'
const BONE = '#e8e6df'
const GHOST = '#9aa3b2'

const mono = { fontFamily: "'IBM Plex Mono', monospace" } as const
const display = { fontFamily: "'Cinzel', serif" } as const
const ui = { fontFamily: "'Space Grotesk', sans-serif" } as const

function Frame({ num, label, children, ghost, accent = KYBER }: {
  num: string; label: string; children: React.ReactNode; ghost?: string; accent?: string
}) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: INK, color: BONE, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: `
        radial-gradient(130% 100% at 50% -10%, rgba(103,232,249,0.10), transparent 55%),
        radial-gradient(90% 70% at 100% 110%, rgba(232,180,76,0.07), transparent 55%),
        radial-gradient(60% 50% at 0% 100%, rgba(46,143,163,0.06), transparent 60%),
        ${INK}` }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(1px 1px at 12% 18%, rgba(232,230,223,0.5) 50%, transparent 51%), radial-gradient(1px 1px at 82% 12%, rgba(159,242,255,0.6) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 70% 80%, rgba(232,230,223,0.35) 50%, transparent 51%), radial-gradient(1px 1px at 25% 72%, rgba(159,242,255,0.45) 50%, transparent 51%), radial-gradient(1px 1px at 90% 55%, rgba(232,180,76,0.5) 50%, transparent 51%), radial-gradient(1px 1px at 40% 90%, rgba(232,230,223,0.3) 50%, transparent 51%), radial-gradient(1px 1px at 55% 22%, rgba(159,242,255,0.4) 50%, transparent 51%)` }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      {ghost && (
        <div style={{ position: 'absolute', right: 60, bottom: -70, fontFamily: "'Cinzel', serif", fontWeight: 900, fontSize: 620, lineHeight: 1, color: 'transparent', WebkitTextStroke: `1px ${accent}18` }}>{ghost}</div>
      )}
      <div style={{ position: 'absolute', top: 60, left: 70, width: 54, height: 54, border: `1px solid ${accent}55`, borderRight: 0, borderBottom: 0 }} />
      <div style={{ position: 'absolute', top: 60, right: 70, width: 54, height: 54, border: `1px solid ${accent}55`, borderLeft: 0, borderBottom: 0 }} />
      <div style={{ position: 'absolute', bottom: 60, left: 70, width: 54, height: 54, border: `1px solid ${accent}55`, borderRight: 0, borderTop: 0 }} />
      <div style={{ position: 'absolute', bottom: 60, right: 70, width: 54, height: 54, border: `1px solid ${accent}55`, borderLeft: 0, borderTop: 0 }} />
      <div style={{ position: 'absolute', top: 70, left: 90, right: 90, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ ...display, fontWeight: 700, fontSize: 22, letterSpacing: '0.3em', color: BONE }}>SANCTUM</span>
          <span style={{ ...mono, fontSize: 12, letterSpacing: '0.2em', color: GHOST }}>// rev.2026</span>
        </div>
        <div style={{ ...mono, fontSize: 15, letterSpacing: '0.2em', color: GHOST }}>
          <span style={{ color: accent }}>{num}</span> / {label}
        </div>
      </div>
      <div style={{ position: 'absolute', top: 150, left: 90, right: 90, bottom: 110, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      <div style={{ position: 'absolute', bottom: 60, left: 90, right: 90, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ ...mono, fontSize: 11, letterSpacing: '0.22em', color: KYBER_DIM }}>PROJECT SANCTUM · PITCH DECK</span>
        <span style={{ ...mono, fontSize: 11, letterSpacing: '0.22em', color: GHOST }}>TS '26 CREATIVE · TEAM CCA</span>
      </div>
    </div>
  )
}

function Kicker({ children, color = KYBER }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
      <span style={{ ...mono, fontSize: 14, letterSpacing: '0.34em', color }}>{children}</span>
      <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${color}66, transparent)` }} />
    </div>
  )
}

function Title({ children, size = 64 }: { children: React.ReactNode; size?: number }) {
  return <div style={{ ...display, fontWeight: 900, fontSize: size, lineHeight: 1.1, letterSpacing: '0.02em' }}>{children}</div>
}

function Sub({ children, size = 22, style }: { children: React.ReactNode; size?: number; style?: React.CSSProperties }) {
  return <div style={{ ...ui, fontWeight: 300, fontSize: size, lineHeight: 1.55, color: GHOST, maxWidth: 1000, ...style }}>{children}</div>
}

function Chip({ children, color = KYBER }: { children: React.ReactNode; color?: string }) {
  return <span style={{ ...mono, fontSize: 12, letterSpacing: '0.14em', color, border: `1px solid ${color}55`, borderRadius: 999, padding: '7px 16px' }}>{children}</span>
}

function Card({ children, border = KYBER, title, sub, color = KYBER }: {
  children: React.ReactNode; border?: string; title?: string; sub?: string; color?: string
}) {
  return (
    <div style={{ border: `1px solid ${border}28`, borderRadius: 12, padding: '24px 26px', background: `linear-gradient(180deg, ${INK2}e6, ${INK}b8)` }}>
      {title && <div style={{ ...mono, fontSize: 13, letterSpacing: '0.24em', color, marginBottom: 8 }}>{title}</div>}
      {sub && <div style={{ ...display, fontWeight: 700, fontSize: 26, letterSpacing: '0.1em', marginBottom: 12 }}>{sub}</div>}
      {children}
    </div>
  )
}

function Bullet({ children, color = KYBER }: { children: React.ReactNode; color?: string }) {
  return <div style={{ ...ui, fontSize: 18, lineHeight: 1.6, color: GHOST, marginBottom: 6 }}><span style={{ color, marginRight: 8 }}>◈</span>{children}</div>
}

/* ══════════ 16 DETAILED SLIDES ══════════ */

function S01() {
  return (
    <Frame num="01" label="COVER" ghost="Ⅰ">
      <div style={{ position: 'absolute', left: '50%', top: '44%', transform: 'translate(-50%, -50%)', width: 1000, height: 1000, borderRadius: '50%', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(103,232,249,0.10), transparent 60%)' }} />
        <div style={{ position: 'absolute', inset: '8%', borderRadius: '50%', border: '1px solid rgba(103,232,249,0.18)' }} />
        <div style={{ position: 'absolute', inset: '16%', borderRadius: '50%', border: '1px dashed rgba(103,232,249,0.12)' }} />
        <div style={{ position: 'absolute', inset: '24%', borderRadius: '50%', border: '1px solid rgba(103,232,249,0.08)' }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 26, textAlign: 'center' }}>
        <div style={{ ...mono, fontSize: 15, letterSpacing: '0.4em', color: KYBER_DIM }}>PROJECT SANCTUM</div>
        <div style={{ ...display, fontWeight: 900, fontSize: 128, lineHeight: 1.04 }}>
          <span style={{ background: 'linear-gradient(180deg,#fff 0%,#eae8e2 34%,#9fb9c4 66%,#67e8f9 105%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>The network that</span><br />
          <span style={{ color: KYBER, textShadow: `0 0 40px ${KYBER}55` }}>pretends not to exist.</span>
        </div>
        <Sub size={26}><span style={{ color: BONE }}>A secret network for the survivors of the Purge</span> — hidden in plain sight, and revealing itself only to those who prove worthy.</Sub>
        <div style={{ display: 'flex', gap: 14, marginTop: 6 }}>
          <Chip>TEAM CCA</Chip><Chip color={EMBER}>TS '26 CREATIVE</Chip><Chip>TECH SYNDICATE</Chip>
        </div>
      </div>
    </Frame>
  )
}

function S02() {
  return (
    <Frame num="02" label="THE CONCEPT" ghost="Ⅱ">
      <Kicker>THE CONCEPT — IN ONE BREATH</Kicker>
      <Sub size={30} style={{ color: BONE }}>
        Survivors of the Purge can't google a rebellion, so SANCTUM hides in plain sight as a dead astronomy blog.
        Only the worthy pass a three-trial rite — judged by a voice-guided Archivist — and earn their rank, callsign and sigil.
      </Sub>
      <div style={{ height: 34 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <Card title="THE ONE-LINE PITCH" color={KYBER}>
          <div style={{ ...ui, fontSize: 24, lineHeight: 1.5, color: BONE }}>
            A website that doesn't describe a secret network — it <b style={{ color: KYBER }}>is</b> one.
          </div>
        </Card>
        <Card title="THE 99-WORD WRITE-UP" color={EMBER}>
          <div style={{ ...ui, fontSize: 19, lineHeight: 1.65, color: GHOST }}>
            <span style={{ color: BONE }}>PROJECT SANCTUM — the network that pretends not to exist.</span> Survivors of the Purge can't google a rebellion, so SANCTUM hides in plain sight as a dead astronomy blog. Only the worthy pass: a three-trial rite — Signal, Focus, Choice — judged by a voice-guided Archivist, minting your rank, callsign and sigil. Press ~ and it vanishes. <i>The Empire surveils everything. We hide in plain sight.</i>
          </div>
        </Card>
      </div>
    </Frame>
  )
}

function S03() {
  return (
    <Frame num="03" label="THE PROBLEM" ghost="03" accent={THREAT}>
      <Kicker color={THREAT}>THE PROBLEM — SET IN STAR WARS, AFTER THE PURGE</Kicker>
      <Title size={60}>Survivors can't <span style={{ color: THREAT }}>google</span> a rebellion.</Title>
      <div style={{ height: 26 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
        <Card border={THREAT} title="01" sub="EVERY CHANNEL IS WATCHED" color={THREAT}>
          <Bullet color={THREAT}>Public networks are surveilled.</Bullet>
          <Bullet color={THREAT}>Every frequency is logged.</Bullet>
          <Bullet color={THREAT}>Any open call is intercepted.</Bullet>
        </Card>
        <Card border={THREAT} title="02" sub="OPEN CALLS BURN" color={THREAT}>
          <Bullet color={THREAT}>Recruit posts are found in hours.</Bullet>
          <Bullet color={THREAT}>Cells are traced and burned.</Bullet>
          <Bullet color={THREAT}>Trust is the rarest resource.</Bullet>
        </Card>
        <Card border={EMBER} title="03" sub="SO WE MADE THE DOOR THE FILTER" color={EMBER}>
          <Bullet color={EMBER}>Hide the front door in plain sight.</Bullet>
          <Bullet color={EMBER}>Let the door itself screen the worthy.</Bullet>
          <Bullet color={EMBER}>Secrecy becomes a feeling, not a login.</Bullet>
        </Card>
      </div>
    </Frame>
  )
}

function S04() {
  return (
    <Frame num="04" label="THE INSIGHT" ghost="Ⅳ">
      <Kicker>THE CORE CREATIVE DECISION</Kicker>
      <Title>We didn't build a site <i style={{ color: KYBER }}>about</i> a network.</Title>
      <Title size={60}>We built <span style={{ color: KYBER, textShadow: `0 0 40px ${KYBER}55` }}>the network.</span></Title>
      <div style={{ height: 28 }} />
      <Sub>
        Most "secret society" sites are a login box with a dark theme. That's a missed opportunity —
        secrecy is a <b style={{ color: BONE }}>feeling</b>: hesitation, ritual, verification, relief.
        So every part of SANCTUM makes the visitor <b style={{ color: BONE }}>do</b> the secrecy, not read about it.
      </Sub>
      <div style={{ height: 26 }} />
      <div style={{ display: 'flex', gap: 14 }}>
        <Chip>BOOTS LIKE AN UPLINK</Chip>
        <Chip>SPEAKS IN TRANSMISSIONS</Chip>
        <Chip color={EMBER}>TESTS BEFORE IT TRUSTS</Chip>
      </div>
    </Frame>
  )
}

function S05() {
  const acts = [
    ['ACT 0', 'THE SEAL', 'The loader is lore — a covert uplink establishing, honest to the last byte.'],
    ['ACT 1', 'THE GATE', '620vh of scroll-cinema. You breach a portal yourself to cross over.'],
    ['ACT 2', 'THE TRIALS', 'Signal, Focus, Choice — three rites judged by a voiced Archivist.'],
    ['ACT 3', 'THE SANCTUM', 'The living hub: map, cipher, forge — and the panic key.'],
  ]
  return (
    <Frame num="05" label="THE EXPERIENCE" ghost="05">
      <Kicker>THE EXPERIENCE — FOUR ACTS, ONE RITE</Kicker>
      <Title size={56}>A rite of passage, not a website.</Title>
      <div style={{ height: 30 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
        {acts.map(([n, name, desc], i) => (
          <Card key={n} title={n} sub={name} color={i === 2 ? EMBER : KYBER} border={i === 2 ? EMBER : KYBER}>
            <div style={{ ...ui, fontSize: 17, lineHeight: 1.55, color: GHOST }}>{desc}</div>
          </Card>
        ))}
      </div>
      <div style={{ height: 24 }} />
      <div style={{ ...mono, fontSize: 14, letterSpacing: '0.2em', color: KYBER_DIM }}>PROGRESS PERSISTS ACROSS RELOADS — THE SANCTUM REMEMBERS. EVERY ACT IS PLAYABLE, SELF-NARRATED, AND SURVIVES A REFRESH.</div>
    </Frame>
  )
}

function S06() {
  return (
    <Frame num="06" label="ACT 0 · THE SEAL" ghost="0">
      <Kicker>ACT 0 — THE SEAL (THE LOADER IS LORE)</Kicker>
      <Title size={56}>Most preloaders apologise for loading.</Title>
      <Title size={56}><span style={{ color: KYBER }}>Ours turns loading into lore.</span></Title>
      <div style={{ height: 28 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <Card title="WHAT IT DOES" color={KYBER}>
          <Bullet>A sigil draws itself as the site warms up.</Bullet>
          <Bullet>An honest percentage counter — synced to the real load.</Bullet>
          <Bullet>Six rotating status lines (CALIBRATING KYBER LATTICE…).</Bullet>
          <Bullet>At 100%: "CHANNEL OPEN." — the veil iris-opens.</Bullet>
        </Card>
        <Card title="WHY IT MATTERS" color={EMBER}>
          <Bullet color={EMBER}>It sets the tone: this is not a normal website.</Bullet>
          <Bullet color={EMBER}>Scroll is hard-locked until it lifts — anticipation, not annoyance.</Bullet>
          <Bullet color={EMBER}>Returning members get a 0.6s quick-seal.</Bullet>
          <Bullet color={EMBER}>A rare easter egg: "» SURVEILLANCE SWEEP — RE-ROUTING…".</Bullet>
        </Card>
      </div>
    </Frame>
  )
}

function S07() {
  const beats = [
    ['0.00', 'HUD console self-decrypts, glyph-rain falls'],
    ['0.05', 'Transmission 1 — "YOU FEEL IT, DON\'T YOU"'],
    ['0.18', 'Transmission 2 — "A SIGNAL BENEATH THE STATIC"'],
    ['0.34', 'Transmission 3 — "WE ARE THE HCET SYNDICATE"'],
    ['0.50', 'THE DOORS — void slabs part, glowing edges'],
    ['0.53', 'Portal assembles — 10 crystals sweep into the ring'],
    ['0.69', 'Wordmark — SANCTUM in steel + the shockwave'],
    ['0.80', 'Hyperspace — camera dives, whispers flash by'],
    ['0.93', 'BREACH — kyber flash → "SANCTUM REACHED"'],
  ]
  return (
    <Frame num="07" label="ACT 1 · THE GATE" ghost="1">
      <Kicker>ACT 1 — THE GATE (SCROLL CINEMA)</Kicker>
      <Title size={52}>A scroll is a journey. You don't click — you <span style={{ color: KYBER }}>fly.</span></Title>
      <div style={{ height: 24 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <Card title="THE MECHANIC" color={KYBER}>
          <Bullet>620 viewport-heights of pinned scroll-cinema.</Bullet>
          <Bullet>A custom GLSL portal — swirl disc, fresnel rim, orbiting crystals.</Bullet>
          <Bullet>Beat-locked master timeline: every element hand-budgeted.</Bullet>
          <Bullet>Procedural sound fires on scroll crossings, both directions.</Bullet>
        </Card>
        <Card title="THE BEAT MAP" color={EMBER}>
          {beats.map(([t, d]) => (
            <div key={t} style={{ display: 'flex', gap: 14, marginBottom: 7 }}>
              <span style={{ ...mono, fontSize: 14, color: EMBER, minWidth: 44 }}>{t}</span>
              <span style={{ ...ui, fontSize: 15, color: GHOST, lineHeight: 1.4 }}>{d}</span>
            </div>
          ))}
        </Card>
      </div>
    </Frame>
  )
}

function S08() {
  const rites = [
    ['RITE I', 'SIGNAL', 'memory', 'Drag-rotate a sealed dial to catch a living, drifting frequency. The signal slips and runs — hunt it across three escalating rounds.'],
    ['RITE II', 'FOCUS', 'steadiness', 'Hold your light inside a breathing ring while the void pulls. The ring tightens as you steady — hold better, hold finer.'],
    ['RITE III', 'CHOICE', 'judgment', 'Three moral dilemmas. No wrong answers — only conviction. Every judgment slams a wax-stamp verdict, then demands its proof.'],
  ]
  return (
    <Frame num="08" label="ACT 2 · THE TRIALS" ghost="2">
      <Kicker>ACT 2 — THE TRIALS (PROVE YOURSELF)</Kicker>
      <Title size={54}>Three rites judge the worthy.</Title>
      <div style={{ height: 26 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {rites.map(([n, name, skill, desc], i) => (
          <Card key={n as string} title={`${n} · ${skill.toUpperCase()}`} sub={name as string} color={i === 2 ? EMBER : KYBER} border={i === 2 ? EMBER : KYBER}>
            <div style={{ ...ui, fontSize: 16, lineHeight: 1.55, color: GHOST }}>{desc}</div>
          </Card>
        ))}
      </div>
    </Frame>
  )
}

function S09() {
  return (
    <Frame num="09" label="THE CEREMONY" ghost="3">
      <Kicker>THE CEREMONY — YOUR SCORE MINTED INTO IDENTITY</Kicker>
      <Title size={56}>Score 0–9 becomes a <span style={{ color: KYBER }}>person.</span></Title>
      <div style={{ height: 28 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
        <Card title="RANK" sub="0–3 · 4–6 · 7–9" color={KYBER}>
          <div style={{ ...ui, fontSize: 19, color: GHOST }}>Youngling · Padawan · Knight — earned from the three rites, not rolled.</div>
        </Card>
        <Card title="CALLSIGN" sub="KESTREL · NIMBUS · …" color={EMBER}>
          <div style={{ ...ui, fontSize: 19, color: GHOST }}>A callsign seeded by your choices — how you answered shapes who you become.</div>
        </Card>
        <Card title="SIGIL" sub="FORGED FROM PLAY" color={KYBER}>
          <div style={{ ...ui, fontSize: 19, color: GHOST }}>Each rite contributes strokes — particles converge into a personal sigil, drawn on live.</div>
        </Card>
      </div>
      <div style={{ height: 24 }} />
      <div style={{ ...mono, fontSize: 14, letterSpacing: '0.2em', color: KYBER_DIM }}>ALL PERSISTED — THE IDENTITY SURVIVES RELOADS. THE ARCHIVIST REMEMBERS YOU.</div>
    </Frame>
  )
}

function S10() {
  const hub = [
    ['HOLO-MAP', 'A living 3D globe of beacon nodes and expanding red threat zones.'],
    ['DEAD-DROP CIPHER', 'Write a message → it encodes into star-chart coordinates. Your sigil is the key.'],
    ['SAFE-LANE ROUTER', 'A* pathing plots the route that avoids patrol zones — judges can test it.'],
    ['ARCHIVES', 'Holocron lore, survival guides, and an editable field-notes ledger.'],
    ['COUNCIL', 'A war-room board for syndicate strategy — drag-drop ops cards.'],
    ['BEACON FORGE', 'Type a friend\'s name → mint a recruitment poster with your sigil → PNG export.'],
  ]
  return (
    <Frame num="10" label="ACT 3 · THE SANCTUM" ghost="4">
      <Kicker>ACT 3 — THE SANCTUM (YOU'RE INSIDE)</Kicker>
      <Title size={54}>Inside: the tools of a hidden war.</Title>
      <div style={{ height: 26 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {hub.map(([name, desc]) => (
          <div key={name} style={{ border: `1px solid ${KYBER}22`, borderRadius: 10, padding: '20px 22px' }}>
            <div style={{ ...mono, fontSize: 14, letterSpacing: '0.2em', color: KYBER, marginBottom: 8 }}>◈ {name}</div>
            <div style={{ ...ui, fontSize: 16, lineHeight: 1.5, color: GHOST }}>{desc}</div>
          </div>
        ))}
      </div>
    </Frame>
  )
}

function S11() {
  return (
    <Frame num="11" label="SECRECY" ghost="5" accent={EMBER}>
      <Kicker color={EMBER}>SECRECY — THE DECOY & THE PANIC KEY</Kicker>
      <Title size={54}>Press <span style={{ color: EMBER }}>~</span> and the whole network <span style={{ color: EMBER }}>vanishes.</span></Title>
      <div style={{ height: 28 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <Card title="THE DECOY" sub="HIDES THE FRONT DOOR" color={EMBER} border={EMBER}>
          <Bullet color={EMBER}>The site loads as "Andoria Deep-Sky Archive" — a dead 1998 astronomy blog.</Bullet>
          <Bullet color={EMBER}>Real photos, a webring, a guestbook, an observation log.</Bullet>
          <Bullet color={EMBER}>The deck hides behind a secret: a portal photo, clicked three times, then a code.</Bullet>
        </Card>
        <Card title="THE PANIC KEY" sub="INSTANT DISGUISE" color={EMBER} border={EMBER}>
          <Bullet color={EMBER}>Press ~ and the deck instantly morphs back into the blog.</Bullet>
          <Bullet color={EMBER}>Security theatre judges demo to each other.</Bullet>
          <Bullet color={EMBER}>Lore-true: the network pretends not to exist — on command.</Bullet>
        </Card>
      </div>
    </Frame>
  )
}

function S12() {
  const stack = [
    ['MOTION', 'GSAP + ScrollTrigger + Lenis', 'beat-locked timelines, scrub, inertia'],
    ['3D', 'three.js · custom GLSL', 'procedural shaders, particles, bloom'],
    ['MICRO', 'framer-motion · anime.js', 'springs, staggers, tilt'],
    ['TYPE', 'split-type + scramble engine', 'char split, self-decrypting labels'],
    ['STATE', 'zustand + persist', 'progress survives reload'],
    ['AUDIO', 'procedural WebAudio', 'drone, chime, riser — zero files'],
  ]
  return (
    <Frame num="12" label="THE STACK" ghost="6">
      <Kicker>HOW IT'S BUILT</Kicker>
      <Title size={54}>Engineered to feel <span style={{ color: KYBER }}>expensive.</span></Title>
      <div style={{ height: 26 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {stack.map(([k, v, tag]) => (
          <div key={k} style={{ border: `1px solid ${KYBER}22`, borderRadius: 10, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ ...mono, fontSize: 13, letterSpacing: '0.26em', color: KYBER_DIM }}>{k}</div>
            <div style={{ ...ui, fontSize: 20, color: BONE }}>{v}</div>
            <div style={{ ...ui, fontSize: 14, color: GHOST }}>{tag}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 22 }} />
      <div style={{ ...mono, fontSize: 14, letterSpacing: '0.18em', color: KYBER }}>◈ THE BEAT-LOCKED TIMELINE — EVERY ENTRANCE IS HAND-BUDGETED SO MOTION ALWAYS LANDS ON TIME.</div>
    </Frame>
  )
}

function S13() {
  const swatches = [
    ['INK', '#07090f', INK, 'the void'],
    ['KYBER', '#67e8f9', KYBER, 'sanctum light'],
    ['EMBER', '#e8b44c', EMBER, 'attention'],
    ['THREAT', '#ff3b3b', THREAT, 'danger only'],
    ['BONE', '#e8e6df', BONE, 'text'],
  ]
  return (
    <Frame num="13" label="THE BRAND" ghost="7">
      <Kicker>DESIGN SYSTEM</Kicker>
      <Title size={54}>Motion must <span style={{ color: KYBER }}>mean</span> something.</Title>
      <div style={{ height: 26 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 14 }}>
        {swatches.map(([name, hex, color, note]) => (
          <div key={name} style={{ border: `1px solid ${KYBER}22`, borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ height: 80, background: color as string }} />
            <div style={{ padding: '12px 14px' }}>
              <div style={{ ...mono, fontSize: 13, letterSpacing: '0.2em', color: BONE }}>{name}</div>
              <div style={{ ...mono, fontSize: 11, color: KYBER_DIM, marginTop: 4 }}>{hex} · {note}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: 24 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card title="TYPE" color={KYBER}>
          <div style={{ ...display, fontWeight: 900, fontSize: 40, letterSpacing: '0.08em' }}>CINZEL — THE SACRED SERIF</div>
          <div style={{ ...ui, fontSize: 22, color: GHOST, marginTop: 8 }}>Space Grotesk — the honest voice.</div>
          <div style={{ ...mono, fontSize: 16, color: KYBER, marginTop: 8 }}>IBM Plex Mono — the network's whisper.</div>
        </Card>
        <Card title="THE LAW" color={EMBER}>
          <div style={{ ...ui, fontSize: 24, lineHeight: 1.6, color: BONE }}>
            Nothing shakes for no reason.<br />Displays get steel; terminals decode;<br /><span style={{ color: EMBER }}>warmth signals attention.</span>
          </div>
        </Card>
      </div>
    </Frame>
  )
}

function S14() {
  return (
    <Frame num="14" label="UI / UX" ghost="8">
      <Kicker>UI / UX — DESIGNED FOR HOW IT'S USED</Kicker>
      <Title size={52}>Onboarding that teaches through <span style={{ color: KYBER }}>play.</span></Title>
      <div style={{ height: 26 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
        <Card title="ONBOARDING" color={KYBER}>
          <Bullet>Progressive disclosure — each rite teaches the next.</Bullet>
          <Bullet>The Archivist narrates in-fiction, at the moment of need.</Bullet>
          <Bullet>Never a wall of text — you learn by doing.</Bullet>
        </Card>
        <Card title="ACCESSIBILITY" color={EMBER}>
          <Bullet color={EMBER}>prefers-reduced-motion → char anims degrade to fades.</Bullet>
          <Bullet color={EMBER}>Audio arms only on real gesture (autoplay law).</Bullet>
          <Bullet color={EMBER}>Full keyboard nav + touch (swipe) support.</Bullet>
        </Card>
        <Card title="PERSISTENCE" color={KYBER}>
          <Bullet>Progress survives reloads via local state.</Bullet>
          <Bullet>Identity (rank, callsign, sigil) is remembered.</Bullet>
          <Bullet>"The Sanctum remembers" — demonstrated, not claimed.</Bullet>
        </Card>
      </div>
    </Frame>
  )
}

function S15() {
  const axes = [
    ['FUNCTIONALITY', 'cipher, A* router, trials — real working software', 92, KYBER],
    ['UI · UX', 'narrated rite onboarding is a UX case study', 88, KYBER],
    ['AESTHETIC', 'kyber-luminous, grain, beat-locked sound', 94, KYBER],
    ['CREATIVITY', 'decoy blog + panic key + the hidden entry rite', 96, KYBER],
    ['ORIGINALITY', 'a website that pretends not to exist', 98, EMBER],
  ]
  return (
    <Frame num="15" label="WHY IT WINS" ghost="9">
      <Kicker>MAPPED TO THE RUBRIC</Kicker>
      <Title size={54}>Every criterion becomes a <span style={{ color: KYBER }}>feature.</span></Title>
      <div style={{ height: 26 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        {axes.map(([k, v, score, color]) => (
          <div key={k as string} style={{ display: 'flex', alignItems: 'center', gap: 20, border: `1px solid ${KYBER}22`, borderRadius: 10, padding: '16px 22px' }}>
            <span style={{ ...mono, fontSize: 14, letterSpacing: '0.16em', color: color as string, width: 170 }}>{k}</span>
            <span style={{ ...ui, fontSize: 18, color: GHOST, flex: 1 }}>{v}</span>
            <span style={{ ...mono, fontSize: 20, color: color as string }}>{score}</span>
            <div style={{ width: 110, height: 8, background: `${KYBER}22`, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${score}%`, height: '100%', background: color as string, boxShadow: `0 0 12px ${color}` }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: 20 }} />
      <div style={{ ...ui, fontSize: 20, lineHeight: 1.5, color: BONE }}>
        The judge's first 90 seconds are a <b style={{ color: KYBER }}>story with a payoff</b> — and that wins rooms.
      </div>
    </Frame>
  )
}

function S16() {
  const team = [
    ['AARAV CHOUDHARY', 'product & story'],
    ['ANUJ PHULERA', 'engineering'],
    ['JEEHAN KWATRA', 'design & motion'],
  ]
  return (
    <Frame num="END" label="TEAM" ghost="∴" accent={EMBER}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 30, textAlign: 'center' }}>
        <div style={{ ...mono, fontSize: 15, letterSpacing: '0.4em', color: KYBER_DIM }}>BUILT BY</div>
        <Title size={110}>The network <span style={{ color: KYBER, textShadow: `0 0 40px ${KYBER}55` }}>remembers.</span></Title>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
          {team.map(([name, role]) => (
            <div key={name}>
              <div style={{ ...display, fontWeight: 700, fontSize: 24, letterSpacing: '0.14em', color: BONE }}>{name}</div>
              <div style={{ ...mono, fontSize: 13, letterSpacing: '0.2em', color: GHOST, marginTop: 6 }}>{role.toUpperCase()}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ ...mono, fontSize: 16, letterSpacing: '0.16em', color: KYBER_DIM }}>ts46.club/creative</span>
          <span style={{ ...mono, fontSize: 16, letterSpacing: '0.16em', color: KYBER_DIM }}>Colonels Central Academy</span>
        </div>
        <div style={{ ...mono, fontSize: 18, letterSpacing: '0.3em', color: EMBER }}>END / TRANSMISSION</div>
      </div>
    </Frame>
  )
}

const SLIDES = [S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12, S13, S14, S15, S16]

function App() {
  const idx = parseInt(new URLSearchParams(window.location.search).get('p') || '1', 10) - 1
  const S = SLIDES[Math.max(0, Math.min(idx, SLIDES.length - 1))]
  return <div style={{ position: 'fixed', inset: 0, width: 1920, height: 1080 }}><S /></div>
}

createRoot(document.getElementById('root')!).render(<App />)
