import * as THREE from 'three'
import { glowTexture, POINTER, type Focal } from './engine'

export interface SceneDef {
  build: () => Focal
}

const KYBER = new THREE.Color('#67e8f9')
const EMBER = new THREE.Color('#e8b44c')
const BONE = new THREE.Color('#e8e6df')

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

function dispose(root: THREE.Object3D) {
  root.traverse((o) => {
    const m = o as THREE.Mesh
    if (m.geometry) m.geometry.dispose()
    const mat = m.material as THREE.Material | THREE.Material[] | undefined
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
    else if (mat) mat.dispose()
  })
}

function glowPoints(count: number, spread: THREE.Vector3, size: number, color: THREE.Color, opacity = 0.9): THREE.Points {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * spread.x
    pos[i * 3 + 1] = (Math.random() - 0.5) * spread.y
    pos[i * 3 + 2] = (Math.random() - 0.5) * spread.z
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const mat = new THREE.PointsMaterial({
    size, color, map: glowTexture(), transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  })
  return new THREE.Points(geo, mat)
}

function crystal(size = 0.5, color: THREE.Color = KYBER): THREE.Group {
  const g = new THREE.Group()
  const geo = new THREE.OctahedronGeometry(size, 0)
  const mat = new THREE.MeshStandardMaterial({
    color, metalness: 0.2, roughness: 0.18,
    emissive: color, emissiveIntensity: 0.55,
  })
  const mesh = new THREE.Mesh(geo, mat)
  g.add(mesh)
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTexture(), color, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }),
  )
  halo.scale.setScalar(size * 5)
  g.add(halo)
  return g
}

/* ════ PORTAL — procedural GLSL swirl disc + fresnel rim ════ */
const PORTAL_FRAG = /* glsl */ `
uniform float uTime;
uniform float uProg;
uniform float uBoost;
uniform vec3 uColor;
uniform vec3 uColor2;
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  vec2 c = vUv - 0.5;
  float r = length(c) * 2.0;
  float ang = atan(c.y, c.x);

  float swirl = sin(ang * 4.0 - uTime * 1.6 + r * 10.0) * 0.5 + 0.5;
  float n = noise(vUv * 7.0 + uTime * 0.22);
  float disc = smoothstep(1.0, 0.0, r) * (0.25 + swirl * 0.5 + n * 0.3);

  // rotating energy rays
  float rays = pow(abs(sin(ang * 6.0 + uTime * 0.9)), 16.0) * smoothstep(0.95, 0.22, r);

  float rim = smoothstep(0.06, 0.0, abs(r - 0.9)) * 1.6;
  float throat = smoothstep(0.10 + uProg * 0.6, uProg * 0.6, r);
  float core = smoothstep(0.5, 0.0, r);

  vec3 col = uColor * (disc * 0.82 + rays * 0.7);
  col += uColor * rim * 1.6;
  col += uColor2 * swirl * disc * 0.4;
  col += uColor * core * 0.45 * (0.7 + uBoost);
  col *= 1.0 - throat * 0.9;

  float alpha = clamp(disc * 0.82 + rim + core * 0.4, 0.0, 1.0);
  gl_FragColor = vec4(col * (1.0 + uBoost * 0.45), alpha);
}
`

function particleRing(radius: number, count: number, color: THREE.Color, size: number, squash = 0.55) {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2
    const rr = radius + (Math.random() - 0.5) * 0.5
    pos[i * 3] = Math.cos(a) * rr
    pos[i * 3 + 1] = Math.sin(a) * rr * squash
    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.6
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const mat = new THREE.PointsMaterial({
    size, color, map: glowTexture(), transparent: true, opacity: 0.8,
    blending: THREE.AdditiveBlending, depthWrite: false,
  })
  return new THREE.Points(geo, mat)
}

function makeShockwaves(group: THREE.Group, n: number) {
  const shocks: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial }[] = []
  for (let i = 0; i < n; i++) {
    const geo = new THREE.RingGeometry(0.86, 0.9, 72)
    const mat = new THREE.MeshBasicMaterial({
      color: 0x9feaff, transparent: true, opacity: 0, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.scale.setScalar(1.9)
    group.add(mesh)
    shocks.push({ mesh, mat })
  }
  const update = (t: number) => {
    const cycle = 4.2
    shocks.forEach((s, i) => {
      const ph = (t + (i * cycle) / n) % cycle
      const p = ph / cycle
      const sc = 1.9 * (1 + p * 0.75)
      s.mesh.scale.setScalar(sc)
      s.mat.opacity = (1 - p) * (1 - p) * 0.55
    })
  }
  return update
}

function portal(opts: { scale?: number; prog?: number } = {}): { group: THREE.Group; update: (t: number) => void } {
  const scale = opts.scale ?? 1
  const group = new THREE.Group()
  const geo = new THREE.PlaneGeometry(1, 1, 1, 1)
  const mat = new THREE.ShaderMaterial({
    vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: PORTAL_FRAG,
    uniforms: {
      uTime: { value: 0 },
      uProg: { value: opts.prog ?? 0.22 },
      uBoost: { value: 0 },
      uColor: { value: KYBER },
      uColor2: { value: EMBER },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  })
  const disc = new THREE.Mesh(geo, mat)
  disc.scale.setScalar(3.6 * scale)
  group.add(disc)

  // dual counter-rotating crystal rings
  const mkRing = (count: number, radius: number, color: THREE.Color, lo: number, hi: number) => {
    const arr: { c: THREE.Group; ph: number; radius: number; speed: number }[] = []
    for (let i = 0; i < count; i++) {
      const c = crystal(lo + Math.random() * (hi - lo), color)
      group.add(c)
      arr.push({ c, ph: (i / count) * Math.PI * 2, radius, speed: 0.4 + Math.random() * 0.5 })
    }
    return arr
  }
  const outer = mkRing(10, 1.85, KYBER, 0.16, 0.3)
  const inner = mkRing(5, 1.5, EMBER, 0.12, 0.2)

  // swirling particle halo
  const halo = particleRing(2.3, 260, KYBER, 0.18)
  group.add(halo)
  const halo2 = particleRing(1.9, 90, EMBER, 0.16)
  group.add(halo2)

  // expanding shockwave rings
  const shocks = makeShockwaves(group, 3)

  group.rotation.z = -0.12
  group.rotation.x = 0.22

  const update = (t: number) => {
    mat.uniforms.uTime.value = t
    mat.uniforms.uBoost.value = (Math.sin(t * 1.4) + 1) * 0.5
    group.rotation.y += 0.002
    for (const h of outer) {
      const a = h.ph + t * h.speed * 0.4
      h.c.position.set(Math.cos(a) * h.radius, Math.sin(a) * h.radius * 0.5, Math.sin(a) * 0.4)
      h.c.rotation.y += 0.02
      h.c.rotation.x += 0.012
    }
    for (const h of inner) {
      const a = -h.ph + t * h.speed * 0.55
      h.c.position.set(Math.cos(a) * h.radius, Math.sin(a) * h.radius * 0.45, Math.sin(a) * 0.35)
      h.c.rotation.y -= 0.024
    }
    halo.rotation.z += 0.004
    halo2.rotation.z -= 0.006
    shocks(t)
  }
  return { group, update }
}

/* ════ HOVER RING (for trials stones) ════ */
function hoverRing(radius: number, color: THREE.Color, tilt = 0): THREE.LineLoop {
  const pts: THREE.Vector3[] = []
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * Math.PI * 2
    pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0))
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts)
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending })
  const ring = new THREE.LineLoop(geo, mat)
  ring.rotation.x = tilt
  return ring
}

/* ════ SCENE DEFINITIONS ════ */
export const SCENES: Record<string, SceneDef> = {
  /* 01 hook — the portal, hero */
  hook: {
    build: () => {
      const p = portal({ scale: 1.05 })
      return { group: p.group, update: p.update, dispose: () => dispose(p.group) }
    },
  },

  /* 02 problem — holographic threat-scanner (radar sweep + blips) */
  problem: {
    build: () => {
      const group = new THREE.Group()
      const RED = new THREE.Color('#ff3b3b')
      const EMBER = new THREE.Color('#ff7a45')

      // radar scope shader — rotating sweep, range rings, trailing fade
      const scopeMat = new THREE.ShaderMaterial({
        vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            vec2 c = vUv - 0.5;
            float r = length(c) * 2.0;
            float ang = atan(c.y, c.x);
            float sweep = mod(uTime * 0.85, 6.28318);
            float rel = mod(ang - sweep + 6.28318, 6.28318);
            float line = smoothstep(0.055, 0.0, rel) * (1.0 - r * 0.35);
            float trail = smoothstep(1.5, 0.0, rel) * 0.30 * (1.0 - r * 0.4);
            float rings = smoothstep(0.02, 0.0, abs(r - 0.42))
                        + smoothstep(0.02, 0.0, abs(r - 0.72))
                        + smoothstep(0.02, 0.0, abs(r - 1.0));
            float edge = smoothstep(0.025, 0.0, abs(r - 1.0));
            vec3 col = vec3(0.42, 0.07, 0.07) * (rings * 0.8 + edge * 1.3);
            col += vec3(1.0, 0.20, 0.16) * (line * 0.9 + trail);
            col += vec3(1.0, 0.48, 0.27) * line * 0.35;
            float a = clamp(rings * 0.7 + edge + line + trail, 0.0, 1.0);
            gl_FragColor = vec4(col, a);
          }
        `,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      })
      const scope = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 4.4, 1, 1), scopeMat)

      const pivot = new THREE.Group()
      pivot.position.set(0.85, 0.05, 0)
      pivot.rotation.x = -0.42
      pivot.add(scope)
      group.add(pivot)

      // threat blips — flash when the sweep crosses them (classic radar persistence)
      const blips: { spr: THREE.Sprite; ang: number; speed: number; phase: number; rad: number }[] = []
      for (let i = 0; i < 9; i++) {
        const ang = (i / 9) * Math.PI * 2 + Math.random() * 0.4
        const rad = 0.85 + Math.random() * 1.05
        const spr = new THREE.Sprite(
          new THREE.SpriteMaterial({ map: glowTexture(), color: i % 3 === 0 ? EMBER : RED, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }),
        )
        spr.position.set(Math.cos(ang) * rad, Math.sin(ang) * rad, 0.06)
        spr.scale.setScalar(0.5)
        pivot.add(spr)
        blips.push({ spr, ang, rad, speed: 1.5 + Math.random() * 2.5, phase: Math.random() * 6.28 })
      }

      // wireframe ground grid (surveillance floor)
      const grid = new THREE.Mesh(
        new THREE.PlaneGeometry(13, 8.5, 32, 20),
        new THREE.MeshBasicMaterial({ color: 0x2a1a20, wireframe: true, transparent: true, opacity: 0.28 }),
      )
      grid.position.set(-0.6, -0.2, -1.6)
      grid.rotation.x = -0.35
      group.add(grid)

      // red particle haze
      const haze = glowPoints(40, new THREE.Vector3(11, 7, 1.5), 0.5, RED, 0.5)
      haze.position.z = -1.5
      group.add(haze)

      const update = (t: number) => {
        scopeMat.uniforms.uTime.value = t
        const sweep = (t * 0.85) % (Math.PI * 2)
        for (const b of blips) {
          const rel = (((b.ang - sweep) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
          const flash = Math.exp(-rel * 2.4)
          const flicker = 0.72 + 0.28 * Math.sin(t * b.speed + b.phase)
          const o = Math.min(1, (0.14 + flash * 0.9) * flicker)
          ;(b.spr.material as THREE.SpriteMaterial).opacity = o
          b.spr.scale.setScalar(0.42 + flash * 0.4)
        }
        haze.rotation.z += 0.001
        pivot.rotation.y = Math.sin(t * 0.2) * 0.08
      }
      return { group, update, dispose: () => dispose(group) }
    },
  },

  /* 03 idea — the network self-assembles: nodes fly in from the void and
     land on a constellation lattice; a bright signal node tracks your cursor */
  idea: {
    build: () => {
      const group = new THREE.Group()
      const N = 64

      // homes form a loose 3D constellation; starts are scattered far out
      const homes: THREE.Vector3[] = []
      const starts: THREE.Vector3[] = []
      for (let i = 0; i < N; i++) {
        const th = Math.random() * Math.PI * 2
        const ph = Math.acos(2 * Math.random() - 1)
        const r = 1.3 + Math.random() * 1.0
        homes.push(new THREE.Vector3(r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph)))
        starts.push(new THREE.Vector3((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 8))
      }

      // faint pre-built lattice (links between near neighbors)
      const pairs: number[] = []
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          if (homes[i].distanceTo(homes[j]) < 0.85) pairs.push(i, j)
        }
      }
      const linkGeo = new THREE.BufferGeometry()
      const linkPosFull = new Float32Array(pairs.length * 3)
      for (let k = 0; k < pairs.length; k++) {
        linkPosFull[k * 3] = homes[pairs[k]].x
        linkPosFull[k * 3 + 1] = homes[pairs[k]].y
        linkPosFull[k * 3 + 2] = homes[pairs[k]].z
      }
      linkGeo.setAttribute('position', new THREE.BufferAttribute(linkPosFull, 3))
      const links = new THREE.LineSegments(linkGeo, new THREE.LineBasicMaterial({ color: 0x2e8fa3, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending }))
      group.add(links)

      // nodes (start scattered)
      const nodePos = new Float32Array(N * 3)
      starts.forEach((s, i) => { nodePos[i * 3] = s.x; nodePos[i * 3 + 1] = s.y; nodePos[i * 3 + 2] = s.z })
      const nodeGeo = new THREE.BufferGeometry()
      nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3))
      const nodes = new THREE.Points(nodeGeo, new THREE.PointsMaterial({
        size: 0.16, color: 0x67e8f9, map: glowTexture(), transparent: true, opacity: 0.9,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }))
      group.add(nodes)

      // wireframe core (rotates)
      const ico = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.95, 1),
        new THREE.MeshBasicMaterial({ color: 0x67e8f9, wireframe: true, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending }),
      )
      group.add(ico)

      // cursor-tracking signal node
      const signal = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xdffcff, blending: THREE.AdditiveBlending, transparent: true }),
      )
      const sigHalo = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: glowTexture(), color: 0x9feaff, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending }),
      )
      sigHalo.scale.setScalar(1.2)
      signal.add(sigHalo)
      group.add(signal)

      group.position.set(0.5, 0, 0)

      let local = 0
      let sx = 0, sy = 0
      const update = (t: number, dt: number) => {
        local += dt
        const p = Math.min(1, local / 1.7)
        const e = 1 - Math.pow(1 - p, 3) // easeOutCubic assembly
        const attr = nodeGeo.getAttribute('position') as THREE.BufferAttribute
        for (let i = 0; i < N; i++) {
          attr.setXYZ(i,
            starts[i].x + (homes[i].x - starts[i].x) * e,
            starts[i].y + (homes[i].y - starts[i].y) * e,
            starts[i].z + (homes[i].z - starts[i].z) * e,
          )
        }
        attr.needsUpdate = true
        ico.rotation.x += dt * 0.3; ico.rotation.y += dt * 0.42
        // gentle group sway + slow drift
        group.rotation.y += dt * 0.06
        // signal node follows cursor (lerped)
        sx += (POINTER.x * 2.6 - sx) * 0.08
        sy += (POINTER.y * 1.7 - sy) * 0.08
        signal.position.set(sx, sy, 0.4)
        // nodes breathe subtly once assembled
        const breathe = 1 + Math.sin(t * 1.4) * 0.15 * e
        signal.scale.setScalar(1 + Math.sin(t * 3) * 0.25)
        nodes.scale.setScalar(breathe)
      }
      return { group, update, dispose: () => dispose(group) }
    },
  },

  /* 04 journey — the rite path: smooth curve, milestone stones, traveling pulse */
  journey: {
    build: () => {
      const group = new THREE.Group()
      const anchor = [
        new THREE.Vector3(-2.7, -0.75, 0),
        new THREE.Vector3(-0.95, 0.6, 0.4),
        new THREE.Vector3(0.95, -0.4, -0.3),
        new THREE.Vector3(2.7, 0.7, 0.1),
      ]
      const curve = new THREE.CatmullRomCurve3(anchor)
      const curvePts = curve.getPoints(96)
      const path = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curvePts),
        new THREE.LineBasicMaterial({ color: 0x2e8fa3, transparent: true, opacity: 0.45 }),
      )
      group.add(path)

      // milestone stones + orbit ticks
      const stones: THREE.Group[] = []
      const ticks: THREE.LineLoop[] = []
      anchor.forEach((p, i) => {
        const c = crystal(0.5, i === 2 ? EMBER : KYBER)
        c.position.copy(p)
        group.add(c)
        stones.push(c)
        const tick = hoverRing(0.42, i === 2 ? EMBER : KYBER, Math.PI / 2.2)
        tick.position.copy(p)
        group.add(tick)
        ticks.push(tick)
      })

      // traveling pulse + halo
      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xdffcff, blending: THREE.AdditiveBlending, transparent: true }),
      )
      const halo = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: glowTexture(), color: 0x9feaff, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending }),
      )
      halo.scale.setScalar(0.9)
      pulse.add(halo)
      group.add(pulse)

      group.position.set(0.5, 0, 0)

      const update = (t: number, dt: number) => {
        const loop = (t * 0.09) % 1
        const p = curve.getPointAt(loop)
        pulse.position.copy(p)
        pulse.scale.setScalar(1 + Math.sin(t * 6) * 0.3)
        stones.forEach((s, i) => {
          s.rotation.y += dt * 0.5
          s.position.y = anchor[i].y + Math.sin(t * 1.3 + i * 1.2) * 0.12
        })
        ticks.forEach((tk) => { tk.rotation.z += dt * 0.7 })
        group.rotation.z = Math.sin(t * 0.3) * 0.04
      }
      return { group, update, dispose: () => dispose(group) }
    },
  },

  /* 05 gate — hyperspace fly-through: streaking tunnel, destination core,
     cursor-reactive warp, ember accent streaks, speed pulse */
  gate: {
    build: () => {
      const group = new THREE.Group()
      const count = 850
      const pos = new Float32Array(count * 3)
      const speeds = new Float32Array(count)
      const radius = new Float32Array(count)
      const R = 3.4
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2
        const rr = Math.sqrt(Math.random()) * R
        pos[i * 3] = Math.cos(a) * rr
        pos[i * 3 + 1] = Math.sin(a) * rr
        pos[i * 3 + 2] = 14 - Math.random() * 26
        radius[i] = rr
        speeds[i] = 5 + (1 - rr / R) * 13 + Math.random() * 5
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const mat = new THREE.PointsMaterial({
        size: 0.18, color: 0x9feaff, map: glowTexture(), transparent: true, opacity: 0.85,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const streaks = new THREE.Points(geo, mat)
      group.add(streaks)

      // ember accent streaks (fewer, warmer)
      const emberCount = 90
      const epos = new Float32Array(emberCount * 3)
      for (let i = 0; i < emberCount; i++) {
        const a = Math.random() * Math.PI * 2
        const rr = Math.sqrt(Math.random()) * R
        epos[i * 3] = Math.cos(a) * rr
        epos[i * 3 + 1] = Math.sin(a) * rr
        epos[i * 3 + 2] = 14 - Math.random() * 26
      }
      const egeo = new THREE.BufferGeometry()
      egeo.setAttribute('position', new THREE.BufferAttribute(epos, 3))
      const embers = new THREE.Points(egeo, new THREE.PointsMaterial({
        size: 0.22, color: 0xe8b44c, map: glowTexture(), transparent: true, opacity: 0.7,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }))
      group.add(embers)

      // destination core — the light we're flying toward
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.34, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0xdffcff, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }),
      )
      core.position.z = -9
      group.add(core)
      const coreHalo = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: glowTexture(), color: 0x67e8f9, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending }),
      )
      coreHalo.scale.setScalar(4)
      coreHalo.position.z = -9
      group.add(coreHalo)

      // throat rings
      const ringA = hoverRing(1.7, EMBER, Math.PI / 2)
      const ringB = hoverRing(2.4, KYBER, Math.PI / 2)
      group.add(ringA, ringB)

      let warpX = 0, warpY = 0
      const update = (t: number, dt: number) => {
        const attr = geo.getAttribute('position') as THREE.BufferAttribute
        const eattr = egeo.getAttribute('position') as THREE.BufferAttribute
        const speedPulse = 1 + Math.sin(t * 1.1) * 0.25
        for (let i = 0; i < count; i++) {
          let z = attr.getZ(i) - speeds[i] * dt * speedPulse
          if (z < -10) z = 14
          attr.setZ(i, z)
        }
        attr.needsUpdate = true
        for (let i = 0; i < emberCount; i++) {
          let z = eattr.getZ(i) - 10 * dt * speedPulse
          if (z < -10) z = 14
          eattr.setZ(i, z)
        }
        eattr.needsUpdate = true
        // cursor-reactive warp: the whole tunnel leans toward the pointer
        warpX += (POINTER.x * 0.5 - warpX) * 0.05
        warpY += (POINTER.y * 0.35 - warpY) * 0.05
        group.rotation.y = warpX
        group.rotation.x = warpY
        group.rotation.z = Math.sin(t * 0.4) * 0.06
        ringA.rotation.z += dt * 0.4
        ringB.rotation.z -= dt * 0.3
        core.scale.setScalar(1 + Math.sin(t * 2.4) * 0.25)
        coreHalo.scale.setScalar(4 + Math.sin(t * 2.4) * 0.8)
      }
      return { group, update, dispose: () => dispose(group) }
    },
  },

  /* 06 trials — THE TRIAL TRIAD: three large rite-orbs on a sigil triangle.
     Signal orbits, Focus breathes, Choice weighs; cursor proximity charges the
     nearest orb. Bright, additive, reactive — matches the earlier setpieces. */
  trials: {
    build: () => {
      const group = new THREE.Group()
      const lit = (color: THREE.Color, emissive = 0.85) => new THREE.MeshStandardMaterial({
        color, metalness: 0.2, roughness: 0.15, emissive: color, emissiveIntensity: emissive,
      })

      const defs = [
        { home: new THREE.Vector3(-1.75, 0.55, 0.2), col: KYBER, kind: 'signal' as const },
        { home: new THREE.Vector3(1.75, 0.55, 0.2), col: KYBER, kind: 'focus' as const },
        { home: new THREE.Vector3(0, -1.4, 0.5), col: EMBER, kind: 'choice' as const },
      ]

      // sigil triangle connecting the three orbs
      const triLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([...defs.map((d) => d.home), defs[0].home]),
        new THREE.LineBasicMaterial({ color: 0x3aa8bd, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending }),
      )
      group.add(triLine)

      const orbs = defs.map((d) => {
        const orb = new THREE.Group()
        orb.position.copy(d.home)
        const core = d.kind === 'focus'
          ? new THREE.Mesh(new THREE.SphereGeometry(0.78, 40, 40), lit(d.col))
          : new THREE.Mesh(new THREE.OctahedronGeometry(0.78, 0), lit(d.col))
        core.rotation.y = Math.PI / 4
        orb.add(core)
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: d.col, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }))
        halo.scale.setScalar(2.8)
        orb.add(halo)
        const ring = hoverRing(1.5, d.col, Math.PI / 2.4)
        orb.add(ring)
        group.add(orb)
        return { orb, core, ring, halo, kind: d.kind, home: d.home, col: d.col }
      })

      // Signal's orbiting marker — the "frequency" sweeping rite I
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xdffcff, blending: THREE.AdditiveBlending, transparent: true }),
      )
      const markerHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0x9feaff, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending }))
      markerHalo.scale.setScalar(0.8)
      marker.add(markerHalo)
      group.add(marker)

      // drifting dust
      const dust = glowPoints(130, new THREE.Vector3(10, 7, 4), 0.26, KYBER, 0.55)
      group.add(dust)

      group.position.set(0.5, 0.1, 0)

      const update = (t: number, dt: number) => {
        const wx = POINTER.x * 4.6
        const wy = -POINTER.y * 3.2
        orbs.forEach((o, i) => {
          const baseY = o.home.y + Math.sin(t * 1.1 + i * 1.9) * 0.2
          o.orb.position.y = baseY
          o.ring.rotation.z += dt * (0.5 + i * 0.18)
          o.ring.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.6 + i) * 0.12
          o.core.rotation.y += dt * (0.4 + i * 0.2)

          if (o.kind === 'focus') {
            const b = 1 + Math.sin(t * 2.2) * 0.13
            o.core.scale.setScalar(b)
            o.ring.scale.setScalar(1 + Math.sin(t * 2.2) * 0.07)
          }
          if (o.kind === 'choice') o.orb.rotation.z = Math.sin(t * 0.8) * 0.14

          // cursor proximity → charge
          const near = clamp01(1 - Math.hypot(wx - o.home.x, wy - o.home.y) / 2.7)
          o.halo.scale.setScalar(2.8 + near * 1.5)
          ;(o.halo.material as THREE.SpriteMaterial).opacity = 0.5 + near * 0.45
          ;(o.core.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.85 + near * 1.5
          ;(o.ring.material as THREE.LineBasicMaterial).opacity = 0.45 + near * 0.5
        })

        // marker orbits rite I (Signal)
        const a = t * 1.7
        const h0 = orbs[0].home
        marker.position.set(h0.x + Math.cos(a) * 1.5, h0.y + Math.sin(a) * 0.95 + Math.sin(t * 1.1) * 0.2, 0.2)
        marker.scale.setScalar(1 + Math.sin(t * 5) * 0.3)

        dust.rotation.y += dt * 0.05
        group.rotation.y = Math.sin(t * 0.25) * 0.07
      }
      return { group, update, dispose: () => dispose(group) }
    },
  },

  /* 07 sanctum — INTERACTIVE HOLO-GLOBE: the wireframe beacon-map turns to
     face your cursor, a scan reticle tracks the pointer across its surface,
     and every beacon node brightens as the reticle sweeps near it. Threat
     zones pulse red beneath the sweep. */
  sanctum: {
    build: () => {
      const group = new THREE.Group()
      const R = 2.3

      // outer group is static; the globe inside turns toward the cursor
      const globePivot = new THREE.Group()
      group.add(globePivot)

      // holographic wireframe cage (lat/long globe)
      const cage = new THREE.Mesh(
        new THREE.SphereGeometry(R, 26, 18),
        new THREE.MeshBasicMaterial({ color: 0x2e8fa3, wireframe: true, transparent: true, opacity: 0.15 }),
      )
      globePivot.add(cage)

      // beacon nodes on the shell — vertex-colored so the reticle can brighten them
      const count = 150
      const pos = new Float32Array(count * 3)
      const col = new Float32Array(count * 3)
      const idxs: number[] = []
      for (let i = 0; i < count; i++) {
        const th = Math.random() * Math.PI * 2
        const ph = Math.acos(2 * Math.random() - 1)
        pos[i * 3] = R * Math.sin(ph) * Math.cos(th)
        pos[i * 3 + 1] = R * Math.sin(ph) * Math.sin(th)
        pos[i * 3 + 2] = R * Math.cos(ph)
        col[i * 3] = 0.25; col[i * 3 + 1] = 0.5; col[i * 3 + 2] = 0.6
        if (i > 0 && Math.random() < 0.3) idxs.push(i - 1, i)
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
      const nodes = new THREE.Points(geo, new THREE.PointsMaterial({
        size: 0.14, vertexColors: true, map: glowTexture(), transparent: true, opacity: 1,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }))
      globePivot.add(nodes)
      const lineGeo = new THREE.BufferGeometry()
      lineGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      lineGeo.setIndex(idxs)
      const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0x2e8fa3, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending }))
      globePivot.add(lines)

      // threat zones — red pulsing blobs on the shell (rotate with the globe)
      const threat = glowPoints(30, new THREE.Vector3(1, 1, 1), 0.9, new THREE.Color('#ff3b3b'), 0.85)
      threat.scale.setScalar(R * 0.5)
      globePivot.add(threat)
      const threat2 = glowPoints(20, new THREE.Vector3(1, 1, 1), 0.8, new THREE.Color('#ff3b3b'), 0.7)
      threat2.scale.setScalar(R * 0.5)
      threat2.rotation.y = 2
      globePivot.add(threat2)

      // scanning sweep ring (orbital plane)
      const sweep = hoverRing(R * 1.12, KYBER, Math.PI / 2)
      globePivot.add(sweep)
      const sweep2 = hoverRing(R * 1.12, KYBER, Math.PI / 2)
      sweep2.rotation.x = Math.PI / 2 + 1.1
      globePivot.add(sweep2)

      // ── scan reticle: tracks the cursor across the globe's face ──
      const reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.22, 0.3, 40),
        new THREE.MeshBasicMaterial({ color: 0xdffcff, transparent: true, opacity: 0.95, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
      )
      group.add(reticle)
      const reticleHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0x9feaff, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending }))
      reticleHalo.scale.setScalar(1.1)
      reticle.add(reticleHalo)
      // thin scan beam from reticle back to globe
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.02, 3, 12, 1, true),
        new THREE.MeshBasicMaterial({ color: 0x9feaff, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
      )
      group.add(beam)

      group.position.set(0.6, 0, 0)

      let rx = 0, ry = 0, srx = 0, sry = 0
      const update = (t: number, dt: number) => {
        // globe turns to face the cursor (strong, obvious reaction)
        rx += (POINTER.y * 0.9 - rx) * 0.05
        ry += (POINTER.x * 0.9 - ry) * 0.05
        globePivot.rotation.x = rx
        globePivot.rotation.y = ry + t * 0.12

        // reticle follows the cursor in front of the globe
        srx += (POINTER.x * 2.6 - srx) * 0.09
        sry += (POINTER.y * 1.9 - sry) * 0.09
        reticle.position.set(srx, sry, R + 0.35)
        reticle.rotation.z = t * 1.4
        // beam connects reticle to globe center
        beam.position.set(srx * 0.6, sry * 0.6, R * 0.5)
        beam.lookAt(reticle.position)
        beam.scale.set(1, 1, 1)
        const pulse = 0.85 + Math.sin(t * 3) * 0.15
        ;(reticle.material as THREE.MeshBasicMaterial).opacity = pulse

        // brighten nodes near the reticle (approximate: compare node world-ish pos to reticle)
        const cattr = geo.getAttribute('color') as THREE.BufferAttribute
        const cosY = Math.cos(ry), sinY = Math.sin(ry)
        const cosX = Math.cos(rx), sinX = Math.sin(rx)
        for (let i = 0; i < count; i++) {
          // rotate node into globe's current orientation
          let px = pos[i * 3], py = pos[i * 3 + 1], pz = pos[i * 3 + 2]
          let y1 = py * cosX - pz * sinX
          let z1 = py * sinX + pz * cosX
          let x1 = px * cosY + z1 * sinY
          // z is toward camera after rotation
          const dx = x1 - srx
          const dy = y1 - sry
          const d = Math.hypot(dx, dy)
          const near = clamp01(1 - d / 1.4)
          const base = 0.3 + Math.sin(t * 1.5 + i) * 0.12
          cattr.setXYZ(i,
            Math.min(1, base + near * 0.85),
            Math.min(1, 0.5 + near * 0.5),
            Math.min(1, 0.6 + near * 0.4),
          )
        }
        cattr.needsUpdate = true

        sweep.rotation.y += dt * 0.5
        sweep2.rotation.y -= dt * 0.35
        threat.rotation.y += dt * 0.3
        threat2.rotation.y -= dt * 0.25
        ;(threat.material as THREE.PointsMaterial).opacity = 0.75 + Math.sin(t * 2.5) * 0.25
      }
      return { group, update, dispose: () => dispose(group) }
    },
  },

  /* 08 craft — THE KYBER FORGE: a bright faceted crystal core with a white-hot
     heart, gyroscopic energy rings, orbiting component chips, a holographic
     blueprint grid and rising sparks. Cursor proximity accelerates the forge. */
  craft: {
    build: () => {
      const group = new THREE.Group()

      // ── central crystal core (bright, faceted, premium) ──
      const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.15, 1),
        new THREE.MeshStandardMaterial({ color: 0x67e8f9, metalness: 0.25, roughness: 0.1, emissive: 0x2e8fa3, emissiveIntensity: 0.7, flatShading: true }),
      )
      group.add(core)
      // white-hot heart
      const heart = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0xffffff, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.9 }),
      )
      group.add(heart)
      // crystal glow halo
      const coreHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0x67e8f9, transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending }))
      coreHalo.scale.setScalar(4.4)
      group.add(coreHalo)
      // thin wireframe shell for the "engineered" read
      const shell = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.3, 1),
        new THREE.MeshBasicMaterial({ color: 0x67e8f9, wireframe: true, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending }),
      )
      group.add(shell)

      // ── gyroscopic energy rings ──
      const gyro = new THREE.Group()
      const ring1 = hoverRing(1.7, KYBER, Math.PI / 2)
      const ring2 = hoverRing(1.85, EMBER, Math.PI / 1.6)
      const ring3 = hoverRing(2.0, KYBER, Math.PI / 1.1)
      gyro.add(ring1, ring2, ring3)
      group.add(gyro)

      // ── orbiting component chips (the stack made physical) ──
      const chipGeos = [new THREE.BoxGeometry(0.28, 0.18, 0.14), new THREE.OctahedronGeometry(0.2, 0), new THREE.TetrahedronGeometry(0.2)]
      const chips: { m: THREE.Mesh; halo: THREE.Sprite; a: number; r: number; spd: number }[] = []
      for (let i = 0; i < 10; i++) {
        const col = i % 3 === 2 ? EMBER : KYBER
        const m = new THREE.Mesh(chipGeos[i % chipGeos.length], new THREE.MeshStandardMaterial({
          color: col, metalness: 0.5, roughness: 0.25, emissive: col, emissiveIntensity: 0.9,
        }))
        const a = (i / 10) * Math.PI * 2
        m.position.set(Math.cos(a) * 2.4, Math.sin(a) * 1.5, Math.sin(a) * 0.6)
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: col, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }))
        halo.scale.setScalar(0.7)
        m.add(halo)
        group.add(m)
        chips.push({ m, halo, a, r: 2.4, spd: 0.4 + Math.random() * 0.5 })
      }

      // ── holographic blueprint grid (circular floor + concentric rings) ──
      const bp = new THREE.Group()
      const ringR = [1.2, 1.8, 2.4, 3.0]
      ringR.forEach((r) => {
        const ring = hoverRing(r, KYBER, Math.PI / 2)
        ;(ring.material as THREE.LineBasicMaterial).opacity = 0.18
        bp.add(ring)
      })
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2
        const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.cos(a) * 3, Math.sin(a) * 3, 0)]
        const spoke = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x2e8fa3, transparent: true, opacity: 0.14 }))
        bp.add(spoke)
      }
      bp.position.y = -2.2
      bp.rotation.x = -0.5
      group.add(bp)

      // ── rising sparks ──
      const sparkCount = 130
      const spos = new Float32Array(sparkCount * 3)
      const sseed = new Float32Array(sparkCount)
      for (let i = 0; i < sparkCount; i++) {
        spos[i * 3] = (Math.random() - 0.5) * 9
        spos[i * 3 + 1] = (Math.random() - 0.5) * 5.5
        spos[i * 3 + 2] = (Math.random() - 0.5) * 5
        sseed[i] = Math.random() * 1000
      }
      const sgeo = new THREE.BufferGeometry()
      sgeo.setAttribute('position', new THREE.BufferAttribute(spos, 3))
      const sparks = new THREE.Points(sgeo, new THREE.PointsMaterial({
        size: 0.17, color: 0x67e8f9, map: glowTexture(), transparent: true, opacity: 0.85,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }))
      group.add(sparks)

      group.position.set(0.6, 0.1, 0)

      let spin = 0.5
      const update = (t: number, dt: number) => {
        const near = clamp01(1 - Math.abs(POINTER.x) * 1.2)
        spin += (0.5 + near * 1.8 - spin) * 0.04
        core.rotation.x += dt * spin * 0.7
        core.rotation.y += dt * spin
        shell.rotation.x -= dt * spin * 0.5
        shell.rotation.y -= dt * spin * 0.6
        heart.scale.setScalar(1 + Math.sin(t * 2.2) * 0.2 + near * 0.3)
        coreHalo.scale.setScalar(4.4 + Math.sin(t * 2.2) * 0.5)
        // gyroscope rings counter-rotate
        ring1.rotation.z += dt * 0.5
        ring2.rotation.z -= dt * 0.4
        ring3.rotation.z += dt * 0.32
        gyro.rotation.y += dt * 0.2
        // chips orbit
        chips.forEach((s) => {
          s.a += dt * s.spd * (0.6 + near)
          s.m.position.set(Math.cos(s.a) * s.r, Math.sin(s.a) * 1.5, Math.sin(s.a) * 0.6)
          s.m.rotation.y += dt * 2.4
          s.m.rotation.x += dt * 1.6
        })
        // sparks rise
        const attr = sgeo.getAttribute('position') as THREE.BufferAttribute
        for (let i = 0; i < sparkCount; i++) {
          let y = attr.getY(i) + dt * 0.55
          if (y > 2.8) y = -2.8
          attr.setY(i, y)
        }
        attr.needsUpdate = true
        sparks.rotation.y += dt * 0.03
        group.rotation.y = Math.sin(t * 0.2) * 0.06
      }
      return { group, update, dispose: () => dispose(group) }
    },
  },

  /* 09 brand — THE DESIGN CONSTELLATION: the 5 palette tokens orbit as
     glowing swatch-orbs around a hero crystal ("north star"); a typographic
     ring of diamonds sweeps the outer orbit. Cursor proximity recharges the
     nearest orb (pulls its hue to full brightness). */
  brand: {
    build: () => {
      const group = new THREE.Group()

      // hero crystal — the north star
      const star = crystal(1.25, KYBER)
      group.add(star)

      // palette swatch-orbs (the 5 design tokens)
      const tokens = [
        { col: new THREE.Color('#07090f'), emissive: new THREE.Color('#67e8f9'), r: 2.1, name: 'INK' },
        { col: new THREE.Color('#67e8f9'), emissive: new THREE.Color('#67e8f9'), r: 2.1, name: 'KYBER' },
        { col: new THREE.Color('#e8b44c'), emissive: new THREE.Color('#e8b44c'), r: 2.1, name: 'EMBER' },
        { col: new THREE.Color('#ff3b3b'), emissive: new THREE.Color('#ff3b3b'), r: 2.1, name: 'THREAT' },
        { col: new THREE.Color('#e8e6df'), emissive: new THREE.Color('#e8e6df'), r: 2.1, name: 'BONE' },
      ]
      const orbs = tokens.map((tk, i) => {
        const a = (i / tokens.length) * Math.PI * 2
        const orb = new THREE.Group()
        orb.position.set(Math.cos(a) * tk.r, Math.sin(a) * tk.r * 0.75, 0)
        const core = new THREE.Mesh(
          new THREE.SphereGeometry(0.34, 24, 24),
          new THREE.MeshStandardMaterial({ color: tk.col, metalness: 0.4, roughness: 0.2, emissive: tk.emissive, emissiveIntensity: 0.7 }),
        )
        orb.add(core)
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: tk.emissive, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }))
        halo.scale.setScalar(1.6)
        orb.add(halo)
        group.add(orb)
        return { orb, core, halo, a, baseY: 0 }
      })

      // orbit path (ellipse linking the swatches)
      const ellipse = new THREE.EllipseCurve(0, 0, tokens[0].r, tokens[0].r * 0.75, 0, Math.PI * 2, false, 0)
      const ring = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(ellipse.getPoints(100).map((p) => new THREE.Vector3(p.x, p.y, 0))),
        new THREE.LineBasicMaterial({ color: 0x2e8fa3, transparent: true, opacity: 0.3 }),
      )
      group.add(ring)

      // typographic ring — diamonds orbiting further out
      const glyphs = 16
      const gs: THREE.Mesh[] = []
      for (let i = 0; i < glyphs; i++) {
        const a = (i / glyphs) * Math.PI * 2
        const m = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.09, 0),
          new THREE.MeshBasicMaterial({ color: 0x9feaff, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false }),
        )
        m.position.set(Math.cos(a) * 3.1, Math.sin(a) * 3.1 * 0.7, 0)
        m.rotation.z = Math.PI / 4
        group.add(m)
        gs.push(m)
      }

      // motes
      const motes = glowPoints(90, new THREE.Vector3(9, 7, 5), 0.3, KYBER, 0.55)
      group.add(motes)

      group.position.set(0.7, 0, 0)

      const update = (t: number, dt: number) => {
        star.rotation.y += dt * 0.5
        star.rotation.x += dt * 0.3
        const wx = POINTER.x * 4.6
        const wy = -POINTER.y * 3.2
        orbs.forEach((o) => {
          // slow orbital drift
          o.a += dt * 0.08
          const ox = Math.cos(o.a) * tokens[0].r
          const oy = Math.sin(o.a) * tokens[0].r * 0.75
          o.orb.position.x = ox
          o.orb.position.y = oy
          o.core.rotation.y += dt * 0.8
          // cursor proximity → recharge
          const near = clamp01(1 - Math.hypot(wx - ox, wy - oy) / 2.6)
          ;(o.core.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.7 + near * 1.3
          o.halo.scale.setScalar(1.6 + near * 1.0)
          ;(o.halo.material as THREE.SpriteMaterial).opacity = 0.55 + near * 0.4
        })
        // glyph ring counter-rotates + breathes
        gs.forEach((g, i) => {
          const a = (i / glyphs) * Math.PI * 2 - t * 0.12
          g.position.x = Math.cos(a) * 3.1
          g.position.y = Math.sin(a) * 3.1 * 0.7
          g.rotation.y += dt * 1.2
        })
        motes.rotation.y += dt * 0.04
        group.rotation.z = Math.sin(t * 0.2) * 0.05
      }
      return { group, update, dispose: () => dispose(group) }
    },
  },

  /* 10 why — RISING CONVICTION: embers ascend through a column of light, and
     the five judging axes orbit as glowing plaques. Cursor proximity lifts the
     nearest plaque toward you. */
  why: {
    build: () => {
      const group = new THREE.Group()

      // ascending embers
      const count = 340
      const pos = new Float32Array(count * 3)
      const seed = new Float32Array(count)
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 14
        pos[i * 3 + 1] = (Math.random() - 0.5) * 9
        pos[i * 3 + 2] = (Math.random() - 0.5) * 7
        seed[i] = Math.random() * 1000
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const embers = new THREE.Points(geo, new THREE.PointsMaterial({
        size: 0.5, color: 0xe8b44c, map: glowTexture(), transparent: true, opacity: 0.9,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }))
      group.add(embers)
      const under = glowPoints(80, new THREE.Vector3(14, 9, 7), 0.3, KYBER, 0.3)
      group.add(under)

      // a rising light column (conviction ascending)
      const column = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.22, 7, 24, 1, true),
        new THREE.MeshBasicMaterial({ color: 0x9feaff, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
      )
      group.add(column)

      // five judging axes as orbiting glowing plaques
      const axes = ['FUNCTIONALITY', 'UI · UX', 'AESTHETIC', 'CREATIVITY', 'ORIGINALITY']
      const plaques = axes.map((_, i) => {
        const a = (i / axes.length) * Math.PI * 2
        const plaque = new THREE.Group()
        plaque.position.set(Math.cos(a) * 3.0, Math.sin(a) * 3.0 * 0.7, 0)
        const core = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.3, 0),
          new THREE.MeshStandardMaterial({ color: i % 2 ? KYBER : EMBER, metalness: 0.4, roughness: 0.2, emissive: i % 2 ? KYBER : EMBER, emissiveIntensity: 0.9 }),
        )
        plaque.add(core)
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: i % 2 ? KYBER : EMBER, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending }))
        halo.scale.setScalar(1.5)
        plaque.add(halo)
        group.add(plaque)
        return { plaque, core, halo, a }
      })

      group.position.set(0.7, 0, 0)

      const update = (t: number, dt: number) => {
        const attr = geo.getAttribute('position') as THREE.BufferAttribute
        for (let i = 0; i < count; i++) {
          const ph = seed[i]
          let y = attr.getY(i) + dt * (0.7 + (ph % 1) * 1.4)
          if (y > 4.8) y = -4.8
          attr.setY(i, y)
          attr.setX(i, attr.getX(i) + Math.sin(t * 0.8 + ph) * dt * 0.3)
        }
        attr.needsUpdate = true
        embers.rotation.z += dt * 0.015
        ;(embers.material as THREE.PointsMaterial).size = 0.44 + Math.sin(t * 2.2) * 0.08

        // column pulse
        column.material.opacity = 0.18 + Math.sin(t * 1.6) * 0.06

        // plaques orbit + respond to cursor
        const wx = POINTER.x * 4.6
        const wy = -POINTER.y * 3.2
        plaques.forEach((p) => {
          p.a += dt * 0.1
          const ox = Math.cos(p.a) * 3.0
          const oy = Math.sin(p.a) * 3.0 * 0.7
          p.plaque.position.x = ox
          p.plaque.position.y = oy
          p.core.rotation.y += dt * 1.2
          const near = clamp01(1 - Math.hypot(wx - ox, wy - oy) / 2.6)
          p.plaque.position.z = near * 0.7
          ;(p.core.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.9 + near * 1.2
          p.halo.scale.setScalar(1.5 + near * 0.8)
        })
        group.rotation.z = Math.sin(t * 0.2) * 0.04
      }
      return { group, update, dispose: () => dispose(group) }
    },
  },

  /* 11 mnemonic — THE CIPHER RING: H-I-D-E as four rune stones on an orbit,
     a decoder pulse travels the ring and lights each rune in turn. Cursor
     proximity swells the nearest rune. */
  mnemonic: {
    build: () => {
      const group = new THREE.Group()
      const cols = [KYBER, KYBER, EMBER, KYBER]
      const runes = cols.map((col, i) => {
        const a = (i / 4) * Math.PI * 2
        const r = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.7, 0),
          new THREE.MeshStandardMaterial({ color: col, metalness: 0.3, roughness: 0.2, emissive: col, emissiveIntensity: 0.6 }),
        )
        r.position.set(Math.cos(a) * 1.9, Math.sin(a) * 1.9 * 0.8, 0)
        r.rotation.z = Math.PI / 4
        group.add(r)
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: col, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }))
        halo.scale.setScalar(2.0)
        r.add(halo)
        return { mesh: r, halo, a }
      })

      // orbit ring (ellipse)
      const ellipse = new THREE.EllipseCurve(0, 0, 1.9, 1.9 * 0.8, 0, Math.PI * 2, false, 0)
      const orbit = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(ellipse.getPoints(120).map((p) => new THREE.Vector3(p.x, p.y, 0))),
        new THREE.LineBasicMaterial({ color: 0x2e8fa3, transparent: true, opacity: 0.4 }),
      )
      group.add(orbit)

      // decoder pulse traveling the orbit
      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xdffcff, blending: THREE.AdditiveBlending, transparent: true }),
      )
      const pHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0x9feaff, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending }))
      pHalo.scale.setScalar(1.1)
      pulse.add(pHalo)
      group.add(pulse)

      // motes
      const motes = glowPoints(70, new THREE.Vector3(9, 6, 4), 0.26, KYBER, 0.5)
      group.add(motes)

      group.position.set(0.5, 0, 0)

      const update = (t: number, dt: number) => {
        // pulse sweeps the ellipse, lighting whichever rune it passes
        const loop = (t * 0.5) % 1
        const a = loop * Math.PI * 2
        pulse.position.set(Math.cos(a) * 1.9, Math.sin(a) * 1.9 * 0.8, 0)
        pulse.scale.setScalar(1 + Math.sin(t * 6) * 0.3)

        const wx = POINTER.x * 4.6
        const wy = -POINTER.y * 3.2
        runes.forEach((r, i) => {
          const near = clamp01(1 - Math.hypot(wx - r.mesh.position.x, wy - r.mesh.position.y) / 2.6)
          const pulseProx = clamp01(1 - Math.hypot(pulse.position.x - r.mesh.position.x, pulse.position.y - r.mesh.position.y) / 1.2)
          const glow = 0.6 + near * 1.2 + pulseProx * 1.4
          ;(r.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = glow
          r.halo.scale.setScalar(2.0 + near * 0.9 + pulseProx * 0.8)
          r.mesh.rotation.y += dt * (0.6 + i * 0.15)
          r.mesh.position.y = Math.sin(t * 1.1 + i * 1.2) * 0.16
        })
        motes.rotation.y += dt * 0.03
        group.rotation.z = Math.sin(t * 0.25) * 0.05
      }
      return { group, update, dispose: () => dispose(group) }
    },
  },

  /* 12 end — CONVERGENCE: every mote of the network flies inward to a sigil
     core, holds, then bursts outward as kyber confetti — the network
     remembers, then releases you. */
  end: {
    build: () => {
      const group = new THREE.Group()

      // central sigil core
      const core = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.9, 0),
        new THREE.MeshStandardMaterial({ color: 0x67e8f9, metalness: 0.4, roughness: 0.15, emissive: 0x67e8f9, emissiveIntensity: 1.1 }),
      )
      core.rotation.y = Math.PI / 4
      group.add(core)
      const coreHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0x9feaff, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending }))
      coreHalo.scale.setScalar(3.4)
      group.add(coreHalo)

      // orbit rings around the sigil
      const ringA = hoverRing(1.7, KYBER, Math.PI / 2.2)
      const ringB = hoverRing(2.2, EMBER, Math.PI / 1.9)
      group.add(ringA, ringB)

      // the network motes — fly in, hold, burst
      const count = 420
      const pos = new Float32Array(count * 3)
      const seed = new Float32Array(count)
      const homes = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        // scattered far
        pos[i * 3] = (Math.random() - 0.5) * 26
        pos[i * 3 + 1] = (Math.random() - 0.5) * 16
        pos[i * 3 + 2] = (Math.random() - 0.5) * 14
        // converge toward the sigil
        const th = Math.random() * Math.PI * 2
        const ph = Math.acos(2 * Math.random() - 1)
        const r = 0.9 + Math.random() * 2.6
        homes[i * 3] = r * Math.sin(ph) * Math.cos(th)
        homes[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th)
        homes[i * 3 + 2] = r * Math.cos(ph)
        seed[i] = Math.random() * 1000
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const motes = new THREE.Points(geo, new THREE.PointsMaterial({
        size: 0.2, color: 0x9feaff, map: glowTexture(), transparent: true, opacity: 0.9,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }))
      group.add(motes)

      let local = 0
      const update = (t: number, dt: number) => {
        local += dt
        const cycle = (local % 9) / 9 // 9s loop: converge → hold → burst
        const phase = cycle < 0.4 ? cycle / 0.4 : cycle < 0.7 ? 1 : 1 - (cycle - 0.7) / 0.3
        const e = 1 - Math.pow(1 - phase, 3)
        const attr = geo.getAttribute('position') as THREE.BufferAttribute
        for (let i = 0; i < count; i++) {
          const th = seed[i]
          // deterministic pseudo-scatter offset that collapses to 0 as e→1
          const sx = (Math.cos(th * 7.3) * 0.5 - 0.5) * 26 * (1 - e) * (0.3 + ((th * 13) % 1) * 0.7)
          const sy = (Math.sin(th * 5.1) * 0.5 - 0.5) * 16 * (1 - e) * (0.3 + ((th * 17) % 1) * 0.7)
          const sz = (Math.cos(th * 3.7) * 0.5 - 0.5) * 14 * (1 - e) * (0.3 + ((th * 11) % 1) * 0.7)
          attr.setXYZ(i,
            homes[i * 3] + sx,
            homes[i * 3 + 1] + sy,
            homes[i * 3 + 2] + sz,
          )
        }
        attr.needsUpdate = true

        core.rotation.y += dt * 0.7
        core.rotation.x += dt * 0.4
        coreHalo.scale.setScalar(3.4 + Math.sin(t * 2) * 0.5 + e * 0.6)
        ringA.rotation.z += dt * 0.5
        ringB.rotation.z -= dt * 0.4
        ;(motes.material as THREE.PointsMaterial).size = 0.16 + e * 0.1
        group.rotation.z = Math.sin(t * 0.2) * 0.05
      }
      return { group, update, dispose: () => dispose(group) }
    },
  },
}

// re-export for colour use elsewhere if needed
export { BONE }
