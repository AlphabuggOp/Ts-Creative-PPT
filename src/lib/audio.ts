/* Minimal procedural audio — armed on first real gesture only (autoplay law) */
let ctx: AudioContext | null = null
let master: GainNode | null = null

export function armAudio() {
  if (typeof window === 'undefined') return
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.5
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
}

function ready() {
  return !!ctx && !!master && ctx.state === 'running'
}

let _muted = false
export function setMuted(m: boolean) {
  _muted = m
  if (master && ctx) master.gain.setTargetAtTime(m ? 0 : 0.5, ctx.currentTime, 0.05)
}
export function isMuted() { return _muted }

function tone(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.06, delay = 0, glideTo?: number) {
  if (!ready() || !ctx || !master) return
  const t0 = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur)
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(vol, t0 + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g); g.connect(master)
  osc.start(t0); osc.stop(t0 + dur + 0.02)
}

function noise(dur: number, vol = 0.04, delay = 0, freq = 1000) {
  if (!ready() || !ctx || !master) return
  const t0 = ctx.currentTime + delay
  const len = Math.floor(ctx.sampleRate * dur)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len)
  const src = ctx.createBufferSource()
  src.buffer = buf
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'; filter.frequency.value = freq; filter.Q.value = 0.8
  const g = ctx.createGain()
  g.gain.setValueAtTime(vol, t0)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  src.connect(filter); filter.connect(g); g.connect(master)
  src.start(t0)
}

/** transition whoosh — rising sweep */
export function sfxWhoosh() {
  noise(0.34, 0.05, 0, 900)
  tone(180, 0.34, 'sine', 0.05, 0, 720)
}

/** low thud (doors / landing) */
export function sfxThud() {
  tone(118, 0.4, 'sine', 0.12, 0, 38)
  noise(0.1, 0.04, 0, 220)
}

/** crystal chime arpeggio */
export function sfxChime() {
  tone(528, 0.3, 'sine', 0.05, 0)
  tone(792, 0.3, 'sine', 0.04, 0.09)
  tone(1056, 0.42, 'sine', 0.035, 0.18)
}

/** soft tick (rail / key) */
export function sfxTick() {
  tone(1320, 0.04, 'sine', 0.025)
}
