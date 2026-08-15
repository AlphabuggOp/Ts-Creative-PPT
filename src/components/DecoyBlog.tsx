import { useRef, useState } from 'react'

interface DecoyBlogProps {
  mode: 'landing' | 'panic'
  onUnlock?: () => void
  onReturn?: () => void
}

const CODE = 'hide'

interface Object {
  src: string
  cap: string
  secret?: boolean
  name: string
  catalog: string
  constellation: string
  magnitude: string
  distance: string
  exposure: string
  taken: string
  desc: string
}

const OBJECTS: Object[] = [
  {
    src: '/blog/andromeda.jpg', cap: 'Fig. 1 — M31, the Andromeda Galaxy.',
    name: 'The Andromeda Galaxy', catalog: 'M31 · NGC 224', constellation: 'Andromeda',
    magnitude: '3.4', distance: '2.5 million ly', exposure: '12 × 4 min', taken: '14 Mar 2003',
    desc: 'The closest large spiral to our own. On a clear night it is the farthest thing you can see with the naked eye — a faint smudge that resolves, in a telescope, into a full galaxy with dust lanes and satellite companions. I have been chasing a clean capture of the dust lanes since 1999. This is the first roll that held them.',
  },
  {
    src: '/blog/bodes-galaxy.jpg', cap: 'Fig. 2 — M81, Bode\'s Galaxy.',
    name: 'Bode\'s Galaxy', catalog: 'M81 · NGC 3031', constellation: 'Ursa Major',
    magnitude: '6.9', distance: '12 million ly', exposure: '9 × 5 min', taken: '28 Jan 2003',
    desc: 'Named for the fellow who first described it in 1774. M81 is a grand-design spiral whose arms you can just begin to tease apart with patient tracking. It sits near the Big Dipper, which makes it an easy find on a cold winter night.',
  },
  {
    src: '/blog/nebula.jpg', cap: 'Fig. 3 — The Orion Nebula (M42).',
    name: 'The Orion Nebula', catalog: 'M42 · NGC 1976', constellation: 'Orion',
    magnitude: '4.0', distance: '1,344 ly', exposure: '60 × 30 sec', taken: '21 Dec 2002',
    desc: 'The showpiece of the winter sky and a star nursery in action — gas and dust collapsing into new suns. Even binoculars show its heart; a stacked long exposure brings out the swirling structure. Stacked from sixty frames to hold the faint tendrils.',
  },
  {
    src: '/blog/eagle-nebula.png', cap: 'Fig. 4 — M16, the Eagle Nebula.',
    name: 'The Eagle Nebula', catalog: 'M16 · NGC 6611', constellation: 'Serpens',
    magnitude: '6.0', distance: '5,700 ly', exposure: '15 × 4 min', taken: '08 Jun 1998',
    desc: 'Famous for the "Pillars of Creation" — columns of gas where stars are being born. From a back yard the pillars are only a whisper, but the core cluster comes through nicely. This was one of my first serious targets after the new reflector.',
  },
  {
    src: '/blog/portal-anomaly.jpg', cap: 'Fig. 5 — Unidentified object.',
    name: 'The Unidentified Object', catalog: 'unclassified', constellation: 'Andoria',
    magnitude: '?', distance: '?', exposure: 'single 30 sec', taken: '14 Nov 1998',
    desc: 'Logged at 3:12 AM, 14 November 1998. A perfect ring of faint teal light, stationary for the length of one exposure, then gone. Tried to reproduce it on two further nights — nothing. Filed under "unexplained". I look for it every season.',
    secret: true,
  },
]

const LOG = [
  { date: 'Mar 14, 2003', title: 'Andromeda dust lanes', note: 'Finally got 4-minute subs to hold. The dust lanes in M31 are unmistakable tonight. Best night this year.' },
  { date: 'Feb 02, 2003', title: 'Jupiter & the Galilean moons', note: 'Four moons in a neat line at 160×. Ganymede drifted behind the disc just before I packed up.' },
  { date: 'Dec 21, 2002', title: 'Winter solstice viewing', note: 'Coldest night of the season, but the seeing was superb. Orion was tack-sharp from 11 PM.' },
  { date: 'Nov 14, 1998', title: 'The unidentified object', note: 'Logged a strange ring of light near Andoria at 3:12 AM. Tried to reproduce it twice — nothing. Filed under "unexplained".' },
  { date: 'Jun 08, 1998', title: 'First light, new reflector', note: 'Collimated the new 8-inch. First target: the Ring Nebula (M57). It really does look like a smoke ring.' },
]

const EQUIPMENT = [
  ['Telescope', '8-inch (203mm) Newtonian reflector, f/6'],
  ['Mount', 'Homemade German equatorial, clock-drive'],
  ['Camera', '35mm film body, prime focus adapter'],
  ['Eyepieces', '25mm, 10mm Plössl + 2× Barlow'],
  ['Guidescope', '50mm finder, crosshair reticle'],
  ['Film', 'Kodak Ektachrome & Tri-X, pushed 1 stop'],
]

const LINKS = [
  ['The Messier Catalog', 'messier.seds.org'],
  ['Sky & Telescope', 'skyandtelescope.com'],
  ['Clear Dark Sky — astronomy forecast', 'cleardarksky.com'],
  ['The Andoria Stargazers Society', 'andoria-stargazers.example'],
  ['Webring: Deep-Sky Enthusiasts', 'ring: deepsky-ring'],
]

const NAV = ['Home', 'Gallery', 'Observation Log', 'Equipment', 'About', 'Links', 'Guestbook'] as const

export function DecoyBlog({ mode, onUnlock, onReturn }: DecoyBlogProps) {
  const [tab, setTab] = useState<(typeof NAV)[number]>('Home')
  const [viewing, setViewing] = useState<number | null>(null)
  const [clicks, setClicks] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [guestNote, setGuestNote] = useState('')
  const [entries, setEntries] = useState<{ name: string; note: string; date: string }[]>([
    { name: 'Rick_from_Tucson', note: 'Great M31 shots! What mount are you using?', date: 'Mar 09, 2003' },
    { name: 'Debbie_A', note: 'Found your site through the webring. The Pleiades notes helped me find them!', date: 'Feb 27, 2003' },
  ])
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const go = (section: (typeof NAV)[number]) => {
    setTab(section)
    setViewing(null)
    document.getElementById('decoy-top')?.scrollIntoView({ behavior: 'smooth' })
  }

  const openObject = (i: number) => {
    if (OBJECTS[i].secret) { portalClick(); return }
    setViewing(i)
    document.getElementById('decoy-top')?.scrollIntoView({ behavior: 'smooth' })
  }

  const portalClick = () => {
    if (mode === 'panic') return
    setClicks((c) => {
      const n = c + 1
      if (n >= 3) { setModalOpen(true); setClicks(0); return 0 }
      if (clickTimer.current) clearTimeout(clickTimer.current)
      clickTimer.current = setTimeout(() => setClicks(0), 2000)
      return n
    })
  }

  const submit = () => {
    if (code.trim().toLowerCase() === CODE) {
      setUnlocking(true)
      setTimeout(() => onUnlock?.(), 500)
    } else {
      setError(true); setCode('')
      setTimeout(() => setError(false), 1600)
    }
  }

  const signGuestbook = () => {
    if (!guestName.trim()) return
    setEntries((e) => [{ name: guestName.trim(), note: guestNote.trim() || '(no note)', date: 'today' }, ...e])
    setGuestName(''); setGuestNote('')
  }

  const hint = clicks === 0 ? null : clicks === 1 ? '…' : '…something is off about this one.'

  return (
    <div className={`decoy decoy-${mode}`}>
      <div className="decoy-wrap" id="decoy-top">
        <div className="decoy-head">
          <span className="decoy-logo">✦ ANDORIA DEEP-SKY ARCHIVE</span>
          <span className="decoy-rev">est. 1998 · webring member #481</span>
        </div>

        <div className="decoy-nav">
          {NAV.map((n, i) => (
            <span key={n}>
              <a className={`decoy-link ${tab === n && viewing === null ? 'decoy-link-on' : ''}`} onClick={() => go(n)}>{n}</a>
              {i < NAV.length - 1 && ' | '}
            </span>
          ))}
        </div>

        <div className="decoy-marquee"><span>✦ WELCOME STARGAZERS ✦ CLEAR SKIES THIS WEEK ✦ THE PERSEIDS PEAKED LAST NIGHT ✦ NEW IMAGES IN THE GALLERY ✦</span></div>

        <hr className="decoy-rule" />

        {/* ── IMAGE DETAIL PAGE ── */}
        {viewing !== null && (() => {
          const o = OBJECTS[viewing]
          return (
            <div className="decoy-body">
              <p className="decoy-crumb"><a className="decoy-link" onClick={() => setViewing(null)}>Gallery</a> &gt; {o.name}</p>
              <h1 className="decoy-h1">{o.name}</h1>
              <p className="decoy-date">Object {o.catalog} · captured {o.taken}</p>
              <figure className="decoy-fig decoy-fig-full">
                <img src={o.src} alt={o.name} className="decoy-img decoy-img-full" />
                <figcaption className="decoy-cap">{o.cap}</figcaption>
              </figure>
              <div className="decoy-specs">
                <div className="decoy-spec"><span>Constellation</span><b>{o.constellation}</b></div>
                <div className="decoy-spec"><span>Apparent mag.</span><b>{o.magnitude}</b></div>
                <div className="decoy-spec"><span>Distance</span><b>{o.distance}</b></div>
                <div className="decoy-spec"><span>Exposure</span><b>{o.exposure}</b></div>
              </div>
              <p className="decoy-desc">{o.desc}</p>
              <p className="decoy-foot"><a className="decoy-link" onClick={() => setViewing(null)}>← back to the Gallery</a></p>
            </div>
          )
        })()}

        {/* ── HOME ── */}
        {tab === 'Home' && viewing === null && (
          <div className="decoy-body">
            <h1 className="decoy-h1">Welcome to Andoria Deep-Sky</h1>
            <p className="decoy-date">Last updated: March 14, 2003 · 9:47 PM</p>
            <p>
              A quiet corner of the internet for cataloguing the night sky from a back yard just outside the city.
              I've been pointing an 8-inch reflector at whatever wanders overhead since 1996, and this site is
              where the better nights get written down.
            </p>

            <div className="decoy-new">
              <div className="decoy-h2">✦ What's new</div>
              <p style={{ margin: 0 }}><b>14 Mar</b> — New Andromeda dust-lane capture added to the <a className="decoy-link" onClick={() => go('Gallery')}>Gallery</a>. <b>02 Feb</b> — Jupiter notes in the <a className="decoy-link" onClick={() => go('Observation Log')}>Log</a>.</p>
            </div>

            <h2 className="decoy-h2">✧ This month's notes</h2>
            <ul className="decoy-list">
              <li><b>Andromeda (M31)</b> — brightest it's been in years. The 4-min exposures finally show dust lanes.</li>
              <li><b>The Pleiades (M45)</b> — naked-eye faint before midnight; a lovely blue haze in the eyepiece.</li>
              <li><b>Orion (M42)</b> — still low in the south-east, but the core is coming through beautifully.</li>
              <li><b>Jupiter</b> — four moons clear last Tuesday at 160×. Worth a look before it sets.</li>
            </ul>
            <p>
              A note for new visitors: the Andorian constellation cluster is unusually bright in the northern
              hemisphere this season. If you catch something you can't identify, look three times before you
              decide it isn't there. — <i>the Archivist</i>
            </p>
            <div className="decoy-counters">
              <span className="decoy-counter">👁 000042 visitors</span>
              <span className="decoy-counter">★ best viewed in 800×600</span>
              <span className="decoy-counter">🕑 last obs: 14 Nov 1998</span>
            </div>
          </div>
        )}

        {/* ── GALLERY ── */}
        {tab === 'Gallery' && viewing === null && (
          <div className="decoy-body">
            <h1 className="decoy-h1">The Gallery</h1>
            <p className="decoy-date">Photos taken through the 8-inch reflector, scanned from film. Click any object for its page.</p>
            <div className="decoy-gallery">
              {OBJECTS.map((g, i) => (
                <figure key={i} className={`decoy-fig ${g.secret ? 'decoy-secret' : ''}`}>
                  <img
                    src={g.src}
                    alt={g.cap}
                    className="decoy-img"
                    onClick={() => openObject(i)}
                  />
                  <figcaption className="decoy-cap">{g.cap}</figcaption>
                  {g.secret && hint && <div className="decoy-hint">{hint}</div>}
                </figure>
              ))}
            </div>
            <p className="decoy-foot">Click a thumbnail for the full-resolution scan and observing notes.</p>
          </div>
        )}

        {/* ── OBSERVATION LOG ── */}
        {tab === 'Observation Log' && viewing === null && (
          <div className="decoy-body">
            <h1 className="decoy-h1">Observation Log</h1>
            <p className="decoy-date">Selected entries from the notebook.</p>
            {LOG.map((e, i) => (
              <div key={i} className="decoy-log-entry">
                <div className="decoy-log-date">[{e.date}]</div>
                <div className="decoy-log-title">◈ {e.title}</div>
                <p className="decoy-log-note">{e.note}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── EQUIPMENT ── */}
        {tab === 'Equipment' && viewing === null && (
          <div className="decoy-body">
            <h1 className="decoy-h1">My Equipment</h1>
            <p className="decoy-date">What I use, and how it's bolted together.</p>
            <div className="decoy-specs decoy-specs-stack">
              {EQUIPMENT.map(([k, v], i) => (
                <div key={i} className="decoy-spec"><span>{k}</span><b>{v}</b></div>
              ))}
            </div>
            <p className="decoy-foot">The mount is homemade from a gearbox and a stepper — it drifts a little, but it holds long enough for the deep stuff.</p>
          </div>
        )}

        {/* ── ABOUT ── */}
        {tab === 'About' && viewing === null && (
          <div className="decoy-body">
            <h1 className="decoy-h1">About the Archivist</h1>
            <p className="decoy-date">The one who keeps the notebooks.</p>
            <p>
              I started this page because the night sky is too good not to share, and too easy to forget.
              Every clear night I roll the telescope out and point it at whatever wanders overhead, then write
              down what I saw — the good nights and the puzzling ones alike.
            </p>
            <p>
              Some things in the sky resist explanation. I keep those here too, in case someone else has seen
              them. If you have — sign the <a className="decoy-link" onClick={() => go('Guestbook')}>guestbook</a>.
            </p>
            <p className="decoy-foot">— the Archivist</p>
          </div>
        )}

        {/* ── LINKS ── */}
        {tab === 'Links' && viewing === null && (
          <div className="decoy-body">
            <h1 className="decoy-h1">Links</h1>
            <p className="decoy-date">Fellow travelers on the information superhighway.</p>
            <ul className="decoy-list">
              {LINKS.map(([name, url], i) => (
                <li key={i}><a className="decoy-link">{name}</a> <span className="decoy-url">— {url}</span></li>
              ))}
            </ul>
            <p className="decoy-foot">Most of these moved or shut down years ago. The Archive remains.</p>
          </div>
        )}

        {/* ── GUESTBOOK ── */}
        {tab === 'Guestbook' && viewing === null && (
          <div className="decoy-body">
            <h1 className="decoy-h1">Sign the Guestbook</h1>
            <p className="decoy-date">Let us know you stopped by.</p>
            <div className="decoy-guestbook">
              <input
                className="decoy-input"
                placeholder="your name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                maxLength={30}
              />
              <textarea
                className="decoy-input"
                rows={2}
                placeholder="leave a note…"
                value={guestNote}
                onChange={(e) => setGuestNote(e.target.value)}
                maxLength={200}
              />
              <button className="decoy-btn" onClick={signGuestbook}>Sign it</button>
            </div>
            <h2 className="decoy-h2">✧ Recent signatures</h2>
            {entries.map((e, i) => (
              <div key={i} className="decoy-log-entry">
                <div className="decoy-log-date">[{e.date}] · {e.name}</div>
                <p className="decoy-log-note">{e.note}</p>
              </div>
            ))}
          </div>
        )}

        <p className="decoy-foot">This site is not updated. Nothing to see here. Move along.</p>

        {/* 90s webring + sitemap footer */}
        <div className="decoy-webring">
          <div className="decoy-webring-nav">
            <a className="decoy-link">« prev</a> ·{' '}
            <a className="decoy-link">Deep-Sky Enthusiasts Webring</a> ·{' '}
            <a className="decoy-link">next »</a> · <a className="decoy-link">random</a>
          </div>
          <div className="decoy-sitemap">
            {NAV.map((n, i) => (
              <span key={n}>
                <a className="decoy-link" onClick={() => go(n)}>{n}</a>
                {i < NAV.length - 1 && ' · '}
              </span>
            ))}
          </div>
          <div className="decoy-credits">
            © 1998–2003 Andoria Deep-Sky Archive · hosted on Geocities · hand-coded in Notepad
          </div>
        </div>
      </div>

      {mode === 'panic' && (
        <div className="decoy-return" onClick={onReturn}>PRESS ~ TO RETURN</div>
      )}

      {/* access code modal */}
      {modalOpen && (
        <div className="decoy-modal">
          <div className="decoy-modal-box">
            <div className="decoy-modal-title">⚠ ACCESS REQUEST</div>
            <p className="decoy-modal-text">The Archive is protected. Speak the protocol to enter.</p>
            <input
              autoFocus
              className="decoy-input decoy-code"
              placeholder="_ _ _ _"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              maxLength={12}
            />
            {error && <div className="decoy-error">ACCESS DENIED — wrong protocol</div>}
            <div className="decoy-modal-actions">
              <button className="decoy-btn" onClick={submit}>ENTER</button>
              <button className="decoy-btn decoy-btn-ghost" onClick={() => setModalOpen(false)}>CANCEL</button>
            </div>
            {unlocking && <div className="decoy-unlocking">CHANNEL OPENING…</div>}
          </div>
        </div>
      )}
    </div>
  )
}
