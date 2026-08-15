# SANCTUM — Pitch Deck

A web-based pitch deck for **PROJECT SANCTUM** (TS '26 Creative · Tech Syndicate · Team CCA), built in the same identity + motion language as the product — with a full **WebGL engine** behind the slides and a **secret decoy entry**.

---

## The experience (how it opens)

1. **Land on "Andoria Deep-Sky Archive"** — a realistic dead-1998 astronomy blog (webring, guestbook, hit counter, real deep-space photos).
2. **Find the secret** — in the Gallery, *Fig. 5 · "Unidentified object, 14 Nov 1998"* is the portal photo. Click it **3 times**.
3. **Enter the protocol** — the prompt asks for the code: **`HIDE`** (the whole protocol in four letters).
4. **The bootloader** plays, then the deck opens.
5. Press **`~`** at any time to panic — the whole deck vanishes back into the blog.

---

## The 12 slides · each with its own WebGL setpiece

| # | Slide | Setpiece |
|---|---|---|
| 01 | Hook | Procedural GLSL portal — swirl disc, fresnel rim, orbiting crystals, shockwaves |
| 02 | Problem | Holographic threat-scanner — rotating sweep + radar blips |
| 03 | Idea | The network self-assembles — nodes fly in from the void |
| 04 | Journey | The rite-path — curve, milestone stones, traveling pulse |
| 05 | Gate | Hyperspace fly-through — streak tunnel + destination core |
| 06 | Trials | The Trial Triad — three rite-orbs, cursor-charged |
| 07 | Sanctum | Holographic beacon-globe — beacons + threat zones |
| 08 | Craft | The Kyber Forge — crystal core + orbiting shards + blueprint grid |
| 09 | Brand | The Design Constellation — swatch orbs + hero crystal |
| 10 | Why | Rising Conviction — embers + orbiting judgment plaques |
| 11 | Summary | The Cipher Ring — H-I-D-E with a decoder pulse |
| 12 | End | Convergence — the network assembles, remembers, releases |

---

## Keyboard + interaction

| Key | Action |
|---|---|
| `← →` / `space` / `[ ]` / wheel / swipe | navigate |
| `1 – 9, 0` | jump to slide (0 = 10) |
| `G` | grid overview (live mini-previews) |
| `A` | auto-reel (self-playing promo mode) |
| `~` | panic — hide as a blog |
| `R` | replay slide entrance · `F` fullscreen · `M` mute · `?` help · `ESC` close |

Plus: cursor (ring/dot/spark-trail/ripples), 3D + text parallax, magnetic buttons, char-hover lift, and 11 hand-built effects (tilt cards, spotlight text, shiny text, letter-glitch, electric borders, expandables, charts, number tickers, blur-in, magnetic, scramble).

---

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
```

## Deliverables

The finished assets live in `exports/`:
- `SANCTUM-Deck.pptx` — the physical 16-slide pitch deck
- `SANCTUM-WriteUp.pdf` — the two-page write-up
- `SANCTUM-UIUX.pdf` — the UI/UX design doc
- `SANCTUM-JudgesGuide.pdf` — how to enter the deck

## Design tokens

`--ink #07090f` · `--kyber #67e8f9` · `--ember #e8b44c` · `--threat #ff3b3b` · `--bone #e8e6df` · `--ghost #9aa3b2`
