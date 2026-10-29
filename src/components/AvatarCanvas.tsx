import { Component, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { AvatarCtrl } from '../lib/avatar'

/* ---------- shared GLSL ---------- */

const noiseChunk = /* glsl */ `
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.1 + 10.0;
      a *= 0.5;
    }
    return v;
  }
`

const uniformDecls = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uRes;
  uniform vec2 uImgRes;
  uniform float uTime;
  uniform float uReveal;
  uniform float uZoom;
  uniform float uGray;
  uniform float uRgb;
  uniform float uGlow;
  uniform float uOffsetY;
  uniform float uShatter;
  uniform float uDpr;
  uniform vec2 uGrid;
  uniform float uBleed; // canvas is uBleed x larger than the portrait box so particles can leave it
  uniform vec2 uMouse;
  uniform vec3 uAccent;
  uniform vec3 uAccent2;
`

// cover-fit, zoom, mouse parallax, drift and grade: identical for plane and particles so they register exactly
const sampleChunk = /* glsl */ `
  vec2 coverUv(vec2 uv) {
    float ca = uRes.x / uRes.y;
    float ia = uImgRes.x / uImgRes.y;
    vec2 s = vec2(1.0);
    if (ca > ia) s.y = ia / ca; else s.x = ca / ia;
    return 0.5 + (uv - 0.5) * s;
  }

  vec3 gradePortrait(vec2 base) {
    vec2 uv = coverUv(base);
    uv = 0.5 + (uv - 0.5) / uZoom;
    uv += uMouse * vec2(0.018, 0.012);
    uv.y += uOffsetY;

    // chromatic aberration radiating from centre
    vec2 dir = (base - 0.5) * uRgb * 0.028;
    float r = texture2D(uTex, uv + dir).r;
    float g = texture2D(uTex, uv).g;
    float b = texture2D(uTex, uv - dir).b;
    vec3 col = vec3(r, g, b);

    // grade: lift contrast, cool the shadows, crush blacks slightly
    col = (col - 0.5) * 1.18 + 0.5 - 0.06;
    col = mix(col, col * vec3(0.92, 0.97, 1.08), 0.35);
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(col, vec3(lum), uGray);
    return clamp(col, 0.0, 1.0);
  }

  // vignette & bottom fade so the studio backdrop sinks into the page
  float portraitAlpha(vec2 base) {
    vec2 vc = (base - vec2(0.5, 0.6)) * vec2(1.3, 0.85);
    float vig = smoothstep(0.74, 0.3, length(vc));
    float bottom = smoothstep(0.0, 0.3, base.y);
    float top = smoothstep(1.0, 0.82, base.y);
    float inBox = step(0.0, base.x) * step(base.x, 1.0) * step(0.0, base.y) * step(base.y, 1.0);
    return vig * bottom * top * inBox;
  }

  // dissolve noise field (biased so the centre emerges first)
  float revealNoise(vec2 base) {
    vec2 vc = (base - vec2(0.5, 0.6)) * vec2(1.3, 0.85);
    float n = fbm(base * 3.2 + vec2(uTime * 0.04, -uTime * 0.02));
    return mix(n, length(vc) * 0.9, 0.35);
  }
`

/* ---------- solid portrait plane ---------- */

const planeVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const planeFragment = /* glsl */ `
  precision highp float;
  ${uniformDecls}
  varying vec2 vUv;
  ${noiseChunk}
  ${sampleChunk}

  void main() {
    vec2 base = 0.5 + (vUv - 0.5) * uBleed;
    if (base.x < 0.0 || base.x > 1.0 || base.y < 0.0 || base.y > 1.0) {
      gl_FragColor = vec4(0.0);
      return;
    }
    vec3 col = gradePortrait(base);
    float alphaBase = portraitAlpha(base);

    // dissolve reveal through fbm noise (skipped entirely once fully emerged: the costliest part of the shader)
    float vis = 1.0;
    vec3 glow = vec3(0.0);
    if (uReveal < 0.999) {
      float n = revealNoise(base);
      float rv = uReveal * 1.25 - 0.12;
      float edge = 0.09;
      vis = 1.0 - smoothstep(rv - edge, rv, n);

      // burning accent frontier
      float frontier = smoothstep(rv - edge * 2.6, rv, n) * (1.0 - smoothstep(rv, rv + edge * 0.6, n));
      float glowFade = (1.0 - smoothstep(0.92, 1.0, uReveal)) * step(0.001, uReveal) * uGlow;
      glow = mix(uAccent2, uAccent, frontier) * frontier * glowFade * 1.6;
    }

    // film grain + faint scanline sweep
    float grain = (hash(vUv * uRes + fract(uTime) * 100.0) - 0.5) * 0.07;
    float scan = (1.0 - smoothstep(0.0, 0.012, abs(vUv.y - fract(uTime * 0.11)))) * 0.05;
    col += grain + scan;

    // hand the solid image over to the particle layer as the shatter begins
    float handoff = 1.0 - smoothstep(0.0, 0.25, uShatter);

    float a = alphaBase * vis;
    gl_FragColor = vec4(col * a + glow * alphaBase, a) * handoff;
  }
`

/* ---------- particle layer ---------- */

const pointsVertex = /* glsl */ `
  precision highp float;
  ${uniformDecls}
  attribute vec2 aGrid;
  attribute vec3 aRand;
  varying vec4 vColor;
  varying float vSoft;
  ${noiseChunk}
  ${sampleChunk}

  void main() {
    vec2 g = aGrid;
    float alphaBase = portraitAlpha(g);
    if (uShatter <= 0.0 || alphaBase < 0.05) {
      // outside the visible portrait (or idle): push off-screen with zero size
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      gl_PointSize = 0.0;
      vColor = vec4(0.0);
      vSoft = 0.0;
      return;
    }

    // follow the plane's reveal mask so a half-emerged portrait never pops in whole
    float vis = 1.0;
    if (uReveal < 0.999) {
      float rv = uReveal * 1.25 - 0.12;
      vis = 1.0 - smoothstep(rv - 0.09, rv, revealNoise(g));
    }

    vec3 col = gradePortrait(g);

    // ---- stagger: a ragged front that climbs from the chin to the crown ----
    float front = g.y * 0.42 + (fbm(g * 4.0 + 3.7) - 0.5) * 0.18 + aRand.x * 0.1;
    front = clamp(front, 0.0, 0.55);
    float t = clamp((uShatter - front) / 0.45, 0.0, 1.0);
    float e = t * t;

    // ---- flight, in aspect-corrected space so the burst is round ----
    float aspect = uRes.x / uRes.y;
    vec2 p = g * 2.0 - 1.0;
    vec2 q = vec2(p.x * aspect, p.y);
    vec2 centre = vec2(0.0, 0.15);
    vec2 outward = q - centre;
    vec2 radial = outward / (length(outward) + 1e-4);

    // toward the camera: perspective expansion from the centre (+ growing point size below)
    float z = e * (0.35 + aRand.z * 1.5);
    q = centre + outward * (1.0 + z * 0.5);

    // outward + upward drift with per-point spread
    vec2 drift = radial * (0.2 + aRand.y * 0.8) + vec2((aRand.z - 0.5) * 0.7, 0.85 + aRand.x);
    q += drift * e * 0.7;

    // turbulence: noise-driven wobble that swells mid-flight
    float tt = uTime * 0.35;
    vec2 turb = vec2(
      noise(g * 7.0 + vec2(tt, aRand.x * 13.0)),
      noise(g * 7.0 + vec2(5.2 - tt, aRand.y * 13.0))
    ) - 0.5;
    q += turb * (e * 0.8 + sin(t * 3.14159) * 0.12);

    gl_Position = vec4(q.x / aspect / uBleed, q.y / uBleed, 0.0, 1.0);

    // ---- size: tile the image at rest, bloom as points approach the lens ----
    float cell = max(uRes.x / uGrid.x, uRes.y / uGrid.y) * uDpr / uBleed;
    gl_PointSize = cell * (1.35 + z * 0.9);

    // ---- colour & alpha ----
    float glowAmt = sin(t * 3.14159) * (0.35 + 0.65 * aRand.y) * uGlow;
    vec3 accent = mix(uAccent2, uAccent, smoothstep(0.25, 0.85, aRand.z + (1.0 - t) * 0.3));
    col = mix(col, accent, glowAmt * 0.14);

    float fade = (1.0 - smoothstep(0.35, 0.9, t)) * (1.0 - smoothstep(0.9, 1.0, uShatter));
    float a = alphaBase * vis * fade / (1.0 + z * 0.6);

    // premultiplied; alpha below the colour weight lets the glow add light (additive-ish)
    vColor = vec4(col * a + accent * glowAmt * a * 0.22, a * (1.0 - glowAmt * 0.25));
    vSoft = clamp(t * 1.5, 0.0, 1.0);
  }
`

const pointsFragment = /* glsl */ `
  precision highp float;
  varying vec4 vColor;
  varying float vSoft;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float m = smoothstep(0.5, mix(0.38, 0.05, vSoft), r);
    gl_FragColor = vColor * m;
  }
`

/* ---------- helpers ---------- */

/** Canvas overdraw factor; must match the negative inset on .avatar-canvas in index.css (inset: -30% => 1.6). */
const BLEED = 1.6

type Grid = { cols: number; rows: number }

/** Deterministic PRNG: stable particle layout across mounts, and keeps render pure. */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildPointsGeometry({ cols, rows }: Grid) {
  const count = cols * rows
  const position = new Float32Array(count * 3) // computed in the vertex shader
  const grid = new Float32Array(count * 2)
  const rand = new Float32Array(count * 3)
  const rnd = mulberry32(0x5eed)
  let i = 0
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[i * 2] = (x + 0.5) / cols
      grid[i * 2 + 1] = (y + 0.5) / rows
      rand[i * 3] = rnd()
      rand[i * 3 + 1] = rnd()
      rand[i * 3 + 2] = rnd()
      i++
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(position, 3))
  geo.setAttribute('aGrid', new THREE.BufferAttribute(grid, 2))
  geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 3))
  return geo
}

function pickGrid(): Grid {
  return window.innerWidth < 768 ? { cols: 80, rows: 106 } : { cols: 150, rows: 200 }
}

function useImageTexture(src: string) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  useEffect(() => {
    let alive = true
    const loader = new THREE.TextureLoader()
    loader.load(src, t => {
      if (!alive) return
      t.minFilter = THREE.LinearFilter
      t.magFilter = THREE.LinearFilter
      t.generateMipmaps = false
      t.needsUpdate = true
      setTexture(t)
    })
    return () => {
      alive = false
    }
  }, [src])
  return texture
}

type Uniforms = {
  uTime: { value: number }
  uRes: { value: THREE.Vector2 }
  uDpr: { value: number }
  uReveal: { value: number }
  uZoom: { value: number }
  uGray: { value: number }
  uRgb: { value: number }
  uGlow: { value: number }
  uOffsetY: { value: number }
  uShatter: { value: number }
  uMouse: { value: THREE.Vector2 }
}

/* ---------- scene ---------- */

function AvatarScene({ texture, ctrl }: { texture: THREE.Texture; ctrl: AvatarCtrl }) {
  const planeRef = useRef<THREE.Mesh>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const pointsMatRef = useRef<THREE.ShaderMaterial>(null)
  const clock = useRef(0)
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const [grid] = useState(pickGrid)
  const geometry = useMemo(() => buildPointsGeometry(grid), [grid])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.ty = (0.5 - e.clientY / window.innerHeight) * 2
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  // one uniforms object shared by both materials, so plane and particles always agree
  const uniforms = useMemo(
    () => ({
      uTex: { value: texture },
      uRes: { value: new THREE.Vector2(1, 1) },
      uImgRes: { value: new THREE.Vector2((texture.image as HTMLImageElement | undefined)?.width ?? 3, (texture.image as HTMLImageElement | undefined)?.height ?? 4) },
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uZoom: { value: 1.2 },
      uGray: { value: 0.85 },
      uRgb: { value: 1 },
      uGlow: { value: 1 },
      uOffsetY: { value: 0 },
      uShatter: { value: 0 },
      uDpr: { value: 1 },
      uGrid: { value: new THREE.Vector2(grid.cols, grid.rows) },
      uBleed: { value: BLEED },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAccent: { value: new THREE.Color('#e9ff4b') },
      uAccent2: { value: new THREE.Color('#ff5a1f') },
    }),
    [texture, grid]
  )

  // R3F applies the `uniforms` prop per material (copying the {value} holders), so the two materials do NOT share
  // uniform objects: push the control values into both of them every frame.
  useFrame((state, delta) => {
    clock.current += delta
    const mm = mouse.current
    mm.x += (mm.tx - mm.x) * 0.06
    mm.y += (mm.ty - mm.y) * 0.06

    const apply = (u: Uniforms) => {
      u.uTime.value = clock.current
      u.uRes.value.set(state.size.width, state.size.height)
      u.uDpr.value = state.viewport.dpr
      u.uReveal.value = ctrl.reveal
      u.uZoom.value = ctrl.zoom
      u.uGray.value = ctrl.gray
      u.uRgb.value = ctrl.rgb
      u.uGlow.value = ctrl.glow
      u.uOffsetY.value = ctrl.offsetY
      u.uShatter.value = ctrl.shatter
      u.uMouse.value.set(mm.x, mm.y)
    }
    if (matRef.current) apply(matRef.current.uniforms as Uniforms)
    if (pointsMatRef.current) apply(pointsMatRef.current.uniforms as Uniforms)

    // idle hero draws only the plane; once the hand-off completes only the particles draw
    const points = pointsRef.current
    if (points) points.visible = ctrl.shatter > 0.0001
    const plane = planeRef.current
    if (plane) plane.visible = ctrl.shatter < 0.25
  })

  return (
    <>
      <mesh ref={planeRef} frustumCulled={false} renderOrder={0}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={planeVertex}
          fragmentShader={planeFragment}
          uniforms={uniforms}
          transparent
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
      <points ref={pointsRef} geometry={geometry} frustumCulled={false} renderOrder={1} visible={false}>
        <shaderMaterial
          ref={pointsMatRef}
          vertexShader={pointsVertex}
          fragmentShader={pointsFragment}
          uniforms={uniforms}
          transparent
          premultipliedAlpha
          depthTest={false}
          depthWrite={false}
        />
      </points>
    </>
  )
}

class GLBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

type Props = {
  src: string
  ctrl: AvatarCtrl
  /** false pauses rendering entirely (hero scrolled away) */
  active?: boolean
  className?: string
  alt?: string
}

/** Full-bleed WebGL portrait. Falls back to a plain <img> if WebGL is unavailable. */
export default function AvatarCanvas({ src, ctrl, active = true, className = '', alt = '' }: Props) {
  const texture = useImageTexture(src)
  const fallback = <img src={src} alt={alt} className="avatar-fallback" />
  return (
    <div className={`avatar-canvas ${className}`}>
      <GLBoundary fallback={fallback}>
        <Canvas
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance', premultipliedAlpha: true }}
          frameloop={active ? 'always' : 'never'}
          orthographic
          camera={{ position: [0, 0, 1], zoom: 1 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {texture && <AvatarScene texture={texture} ctrl={ctrl} />}
        </Canvas>
      </GLBoundary>
    </div>
  )
}
