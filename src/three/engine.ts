import * as THREE from 'three'
import gsap from 'gsap'
import { SCENES, type SceneDef } from './scenes'

/** Shared pointer state (normalized -1..1) — scenes read this for interactivity */
export const POINTER = { x: 0, y: 0 }

/** Shared soft radial glow sprite (cached) — used for particles + nebula + crystal halos */
let _glowTex: THREE.CanvasTexture | null = null
export function glowTexture(): THREE.CanvasTexture {
  if (_glowTex) return _glowTex
  const size = 128
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.25, 'rgba(255,255,255,0.55)')
  grad.addColorStop(0.6, 'rgba(255,255,255,0.12)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  _glowTex = new THREE.CanvasTexture(c)
  return _glowTex
}

export interface Focal {
  group: THREE.Group
  update: (t: number, dt: number, elapsed: number) => void
  dispose: () => void
}

export class Engine {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  clock = new THREE.Clock()
  focal = new THREE.Group()
  private _cur: Focal | null = null
  private _backdrop: THREE.Group
  private _mx = 0
  private _my = 0
  private _px = 0
  private _py = 0
  private _raf = 0
  private _disposed = false
  private _reduced: boolean

  constructor(canvas: HTMLCanvasElement) {
    this._reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    this.renderer.setClearColor(0x07090f, 1)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 0.92

    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x07090f, 0.03)

    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 120)
    this.camera.position.set(0, 0, 9)
    this.scene.add(this.camera)

    // lights for faceted crystals
    this.scene.add(new THREE.AmbientLight(0x334a5c, 0.9))
    const key = new THREE.PointLight(0x67e8f9, 26, 60, 1.8)
    key.position.set(2, 1.5, 5)
    this.scene.add(key)
    const warm = new THREE.PointLight(0xe8b44c, 14, 60, 1.8)
    warm.position.set(-3, -1, 4)
    this.scene.add(warm)

    this.scene.add(this.focal)

    this._backdrop = this._buildBackdrop()
    this.scene.add(this._backdrop)

    this._resize()
    window.addEventListener('resize', this._resize)
    window.addEventListener('mousemove', this._onMouse)
    this._loop()
  }

  private _buildBackdrop(): THREE.Group {
    const g = new THREE.Group()

    // deep starfield sphere
    const starCount = 1700
    const pos = new Float32Array(starCount * 3)
    const col = new Float32Array(starCount * 3)
    const kyber = new THREE.Color('#a5e9f7')
    const bone = new THREE.Color('#e8e6df')
    const ember = new THREE.Color('#e8b44c')
    for (let i = 0; i < starCount; i++) {
      // random point on a large shell
      const r = 26 + Math.random() * 30
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th)
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th)
      pos[i * 3 + 2] = r * Math.cos(ph) - 6
      const pick = Math.random()
      const c = pick < 0.12 ? ember : pick < 0.5 ? kyber : bone
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    const mat = new THREE.PointsMaterial({
      size: 0.05,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const stars = new THREE.Points(geo, mat)
    g.add(stars)

    // soft nebula glows
    const nebulas: [number, number, number, number, string][] = [
      [-7, 4, -14, 9, '#67e8f9'],
      [7, -3, -16, 8, '#2e8fa3'],
      [3, 6, -18, 7, '#e8b44c'],
    ]
    for (const [x, y, z, s, color] of nebulas) {
      const spr = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: glowTexture(), color, transparent: true, opacity: 0.10, depthWrite: false, blending: THREE.AdditiveBlending }),
      )
      spr.position.set(x, y, z)
      spr.scale.setScalar(s)
      g.add(spr)
    }
    return g
  }

  setScene(id: string) {
    // dispose previous
    if (this._cur) {
      this._cur.dispose()
      this._cur = null
    }
    this.focal.clear()
    const def: SceneDef | undefined = SCENES[id]
    if (def) {
      const built = def.build()
      this._cur = built
      this.focal.add(built.group)
      // intro settle + slight dolly punch
      gsap.fromTo(this.focal.scale, { x: 0.55, y: 0.55, z: 0.55 }, { x: 1, y: 1, z: 1, duration: 1.0, ease: 'power3.out' })
      gsap.fromTo(this.camera.position, { z: this.camera.position.z + 1.4 }, { z: 9, duration: 1.1, ease: 'power3.out' })
    }
  }

  private _onMouse = (e: MouseEvent) => {
    this._mx = (e.clientX / window.innerWidth) * 2 - 1
    this._my = (e.clientY / window.innerHeight) * 2 - 1
    POINTER.x = this._mx
    POINTER.y = this._my
  }

  private _resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6)
    this.renderer.setPixelRatio(dpr)
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  private _loop = () => {
    if (this._disposed) return
    this._raf = requestAnimationFrame(this._loop)
    const dt = Math.min(this.clock.getDelta(), 0.05)
    const elapsed = this.clock.elapsedTime

    // parallax (lerped)
    this._px += (this._mx - this._px) * 0.04
    this._py += (this._my - this._py) * 0.04
    this.camera.position.x = this._px * 0.9
    this.camera.position.y = this._py * 0.55
    this.camera.lookAt(0, 0, 0)

    // focal group tilts gently toward the cursor (interactivity on every scene)
    this.focal.rotation.y += (this._px * 0.16 - this.focal.rotation.y) * 0.05
    this.focal.rotation.x += (-this._py * 0.10 - this.focal.rotation.x) * 0.05

    // slow backdrop drift
    this._backdrop.rotation.y += dt * 0.008
    this._backdrop.rotation.x += dt * 0.003

    if (!this._reduced && this._cur) this._cur.update(elapsed, dt, elapsed)

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this._disposed = true
    cancelAnimationFrame(this._raf)
    if (this._cur) this._cur.dispose()
    window.removeEventListener('resize', this._resize)
    window.removeEventListener('mousemove', this._onMouse)
    this.renderer.dispose()
  }
}
