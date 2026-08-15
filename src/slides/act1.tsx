import { SlideFrame } from './SlideFrame'
import { Kinetic, Decrypt, Rise, Blur } from '../lib/textfx'
import { Magnetic } from '../lib/fx'
import { SpotText, Bars, Expandable, TiltCard, ShinyText, NumberTicker } from '../lib/reactbits'

/* ════════ 01 · THE HOOK ════════ */
export function HookSlide() {
  return (
    <SlideFrame num="01" label="THE HOOK" layout="center" ghost="Ⅰ" kickerNote="PROJECT SANCTUM">

      <div style={{ position: 'relative', zIndex: 2 }}>
        <Kinetic
          text="The network that pretends not to exist."
          accent={['pretends']}
          className="gt-steel slide-title"
          delay={0.15}
        />
        <div style={{ marginTop: 30 }}>
          <Decrypt
            text="HOW DO YOU RECRUIT A REBELLION THE EMPIRE CAN SEE?"
            className="t-mono"
            duration={1.3}
            start={0.6}
            style={{ fontSize: 'clamp(13px, 1.5vw, 19px)', letterSpacing: '0.28em', color: 'var(--kyber)' }}
          />
        </div>
        <Rise delay={1.4} className="slide-body" style={{ margin: '26px auto 0', textAlign: 'center' }}>
          <p data-rise style={{ margin: 0 }}>
            <Blur text="A secret network for the survivors of the Purge — hidden in plain sight," delay={1.45} />{' '}
            <Blur text="and revealing itself only to those who prove worthy." delay={1.7} />
          </p>
        </Rise>
        <div style={{ marginTop: 18 }}>
          <SpotText
            text="HIDE IN PLAIN SIGHT · TEST BEFORE YOU TRUST"
            className="t-mono"
            style={{ fontSize: 'clamp(10px, 1vw, 13px)', letterSpacing: '0.3em', fontWeight: 500 }}
          />
        </div>
        <Rise delay={2.0} style={{ marginTop: 42 }}>
          <div data-rise style={{ display: 'flex', justifyContent: 'center' }}>
            <Magnetic strength={0.25}>
              <button className="cta" data-cursor="button" onClick={() => window.dispatchEvent(new CustomEvent('deck-nav', { detail: 'next' }))}>
                <span>BEGIN THE RITE</span>
                <span className="cta-arrow">→</span>
              </button>
            </Magnetic>
          </div>
        </Rise>
      </div>
    </SlideFrame>
  )
}

/* ════════ 02 · THE PROBLEM ════════ */
export function ProblemSlide() {
  return (
    <SlideFrame num="02" label="THE PROBLEM" ghost="02" layout="left">

      <div style={{ position: 'absolute', right: '7%', top: '15%', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.28em', color: 'var(--threat)', opacity: 0.85 }}>
        ● SURVEILLANCE ACTIVE
        <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,59,59,0.55)', marginTop: 6 }}>SECTOR SWEEP · LIVE</div>
      </div>

      <Kinetic text="Survivors can't google a rebellion." accent={['google']} className="gt-steel slide-title" />
      <div className="slide-rule" style={{ width: 220, margin: '30px 0 26px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 220px', gap: 30, alignItems: 'start' }}>
        <Rise className="slide-body">
          <p data-rise>After the Purge, every public channel is watched. Every frequency is logged.</p>
          <p data-rise>An open call for recruits is found and burned within hours.</p>
          <p data-rise>
            So <b>SANCTUM</b> hides its front door in plain sight — and makes the door itself the filter.
          </p>
        </Rise>
        <TiltCard className="glass" max={9}>
          <div style={{ padding: 14 }}>
            <div className="t-mono" style={{ fontSize: 9, letterSpacing: '0.24em', color: 'var(--threat)', marginBottom: 6, textAlign: 'center' }}>SURVEILLANCE DENSITY</div>
            <Bars
              data={[
                { label: 'HOLONET', value: 92, color: 'var(--threat)' },
                { label: 'COMMS', value: 84, color: 'var(--threat)' },
                { label: 'TRADE', value: 61, color: 'var(--ember)' },
                { label: 'DARK', value: 12, color: 'var(--kyber)' },
              ]}
            />
          </div>
        </TiltCard>
      </div>
      <div style={{ marginTop: 18, maxWidth: 520 }}>
        <Expandable label="WHY THIS IS THE PROBLEM WE SOLVE" badge="READ" defaultOpen={false}>
          A hidden network can't recruit openly — so SANCTUM makes the <b style={{ color: 'var(--bone)' }}>door itself the filter</b>.
          Only those who prove themselves pass through. The Empire sees a dead astronomy blog; the worthy see the network.
        </Expandable>
      </div>
    </SlideFrame>
  )
}

/* ════════ 03 · THE IDEA ════════ */
export function IdeaSlide() {
  return (
    <SlideFrame num="03" label="THE IDEA" layout="center" ghost="Ⅲ" kickerNote="THE WEBSITE IS THE NETWORK">

      <Kinetic text="We built the network." accent={['network']} className="gt-steel slide-title" />
      <div style={{ marginTop: 8 }}>
        <Kinetic text="Not a site about it." className="slide-title" delay={0.55} style={{ color: 'var(--bone)', fontSize: 'clamp(26px, 4.4vw, 56px)' }} />
      </div>
      <Rise delay={1.1} className="slide-body" style={{ margin: '34px auto 0', textAlign: 'center' }}>
        <p data-rise style={{ margin: 0 }}>
          The website <b>behaves like the network it represents</b> — it boots like a covert uplink,
          speaks in transmissions, and tests you before it trusts you.
        </p>
      </Rise>
      <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14 }}>
        {[
          { t: 'BOOTS LIKE AN UPLINK', d: 'The loader isn\'t a spinner — it\'s a covert uplink establishing, status lines decrypting, the sigil drawing itself.', c: 'var(--kyber)' },
          { t: 'SPEAKS IN TRANSMISSIONS', d: 'Every line arrives as a scrambled signal that resolves under your eyes. Sound fires on scroll, both directions.', c: 'var(--kyber)' },
          { t: 'TESTS BEFORE IT TRUSTS', d: 'Three rites screen the worthy before the network opens. The door is the filter.', c: 'var(--ember)' },
        ].map((item, i) => (
          <Rise key={item.t} delay={1.3 + i * 0.12}>
            <TiltCard data-rise className="glass" max={10}>
              <div style={{ padding: '18px 18px 16px' }}>
                <div className="t-mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: item.c, marginBottom: 10 }}>0{i + 1}</div>
                <div className="t-mono" style={{ fontSize: 11, letterSpacing: '0.16em', color: 'var(--bone)', marginBottom: 8 }}>{item.t}</div>
                <div style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--ghost)' }}>{item.d}</div>
              </div>
            </TiltCard>
          </Rise>
        ))}
      </div>
    </SlideFrame>
  )
}

/* ════════ 04 · THE JOURNEY ════════ */
const ACTS = [
  { n: 'ACT 0', name: 'THE SEAL', desc: 'A loader that behaves like a covert uplink. Honest, ritual, lore.', beats: ['Sigil self-draws', 'Honest % counter', 'Iris-open lift'] },
  { n: 'ACT 1', name: 'THE GATE', desc: 'A 620vh scroll-cinematic — you breach the portal yourself.', beats: ['Void → doors → portal', 'Hyperspace dive', 'Beat-locked sound'] },
  { n: 'ACT 2', name: 'THE TRIALS', desc: 'Signal, Focus, Choice — judged by the voiced Archivist.', beats: ['3 playable rites', 'Voiced Archivist', 'Rank + callsign + sigil'] },
  { n: 'ACT 3', name: 'THE SANCTUM', desc: 'The living hub: map, cipher, forge — and the panic key.', beats: ['Holo-map + cipher', 'Beacon poster forge', 'Panic key ~'] },
]

export function JourneySlide() {
  return (
    <SlideFrame num="04" label="THE JOURNEY" ghost="04" layout="left" kickerNote="FOUR ACTS · ONE RITE">

      <Kinetic text="Four acts. One rite of passage." accent={['rite']} className="gt-steel slide-title" />

      <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 190px', gap: 26, alignItems: 'start' }}>
        {/* expandable act timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ACTS.map((a, i) => (
            <Rise key={a.name} delay={0.35 + i * 0.12}>
              <Expandable label={`${a.n} — ${a.name}`} defaultOpen={i === 0}>
                <div style={{ marginBottom: 10 }}>{a.desc}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {a.beats.map((b) => (
                    <span key={b} className="t-mono" style={{ fontSize: 9, letterSpacing: '0.12em', color: 'var(--kyber)', border: '1px solid rgba(103,232,249,0.25)', borderRadius: 3, padding: '4px 8px' }}>◈ {b}</span>
                  ))}
                </div>
              </Expandable>
            </Rise>
          ))}
        </div>

        {/* stat panel */}
        <Rise delay={0.9}>
          <TiltCard data-rise className="glass" max={9}>
            <div style={{ padding: 18, textAlign: 'center' }}>
              <div className="t-mono" style={{ fontSize: 8, letterSpacing: '0.22em', color: 'var(--kyber-dim)' }}>RITE LENGTH</div>
              <ShinyText text="620vh" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 46, letterSpacing: '0.04em' }} />
              <div className="t-mono" style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--ghost)', marginTop: 4 }}>OF SCROLL-CINEMA</div>
              <div style={{ height: 1, background: 'rgba(103,232,249,0.2)', margin: '14px 0' }} />
              <div className="t-mono" style={{ fontSize: 8, letterSpacing: '0.2em', color: 'var(--kyber-dim)', marginBottom: 8 }}>TIME BY ACT</div>
              <Bars
                data={[
                  { label: 'SEAL', value: 15 },
                  { label: 'GATE', value: 55, color: 'var(--ember)' },
                  { label: 'TRIALS', value: 25 },
                  { label: 'HUB', value: 5 },
                ]}
              />
            </div>
          </TiltCard>
        </Rise>
      </div>

      <Rise delay={1.2} className="slide-body" style={{ marginTop: 24 }}>
        <p data-rise style={{ margin: 0, fontSize: 13, color: 'var(--kyber-dim)' }} className="t-mono">
          PROGRESS PERSISTS ACROSS RELOADS — <NumberTicker value={100} suffix="%" className="t-kyber" /> OF THE JOURNEY REMEMBERS YOU.
        </p>
      </Rise>
    </SlideFrame>
  )
}
