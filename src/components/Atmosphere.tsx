import { Component, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState, prefersReducedMotion } from '../lib/scroll'
import '../styles/atmosphere.css'

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uVelocity;
  uniform float uProgress;
  uniform vec3 uBase;
  uniform vec3 uAccent;
  uniform vec3 uAccent2;
  varying vec2 vUv;

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

  // 4 octaves max
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = rot * p * 2.03 + 17.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 2.1;

    float t = uTime * 0.032;
    float turb = 1.0 + uVelocity * 0.9;

    // domain warp, three passes
    vec2 q = vec2(
      fbm(p + vec2(0.0, t)),
      fbm(p + vec2(5.2, 1.3) - t * 0.7)
    );
    vec2 r = vec2(
      fbm(p + 3.2 * turb * q + vec2(1.7, 9.2) + t * 1.25),
      fbm(p + 3.2 * turb * q + vec2(8.3, 2.8) - t * 0.9)
    );
    float f = fbm(p + 2.4 * turb * r + vec2(0.0, -t * 1.6));

    // colour balance: acid yellow at the top of the page, orange at the bottom
    float bal = smoothstep(0.0, 1.0, uProgress);
    vec3 mixAccent = mix(uAccent, uAccent2, bal);

    float plume = smoothstep(0.42, 0.92, f);
    float plumeA = plume * smoothstep(0.25, 0.85, q.x);
    float plumeB = plume * smoothstep(0.25, 0.85, r.y);
    float intensity = 0.055 * (1.0 + uVelocity * 0.55);

    vec3 col = uBase;
    col += uAccent * plumeA * mix(1.0, 0.22, bal) * intensity;
    col += uAccent2 * plumeB * mix(0.22, 1.0, bal) * intensity;
    // very low ambient lift following the warped field
    col += mixAccent * f * f * 0.014;

    // soft radial light following the (lagged) mouse
    vec2 md = (uv - uMouse) * vec2(aspect, 1.0);
    float ml = exp(-dot(md, md) * 4.5);
    vec3 lightTint = mix(vec3(0.96, 0.95, 0.88), mixAccent, 0.55);
    col += lightTint * ml * 0.032 * (0.65 + 0.7 * f);

    // thin horizontal light leak drifting slowly up and down the frame
    float bandY = 0.5 + 0.36 * sin(uTime * 0.041) + 0.05 * sin(uTime * 0.13 + 1.7);
    float bandW = 0.022 + 0.016 * f;
    float bd = (uv.y - bandY + (f - 0.5) * 0.05) / bandW;
    float band = exp(-bd * bd);
    float bx = 0.45 + 0.55 * smoothstep(-0.2, 1.0, sin(uTime * 0.027 + uv.x * 2.6));
    vec3 leakTint = mix(uAccent2, uAccent, 0.3 + 0.4 * (1.0 - bal));
    col += leakTint * band * bx * 0.03 * (1.0 + uVelocity * 0.8);

    // vignette back toward the base so the edges sink
    float vig = smoothstep(1.3, 0.35, length((uv - 0.5) * vec2(aspect * 0.8, 1.0)));
    col = mix(uBase * 0.65, col, 0.5 + 0.5 * vig);

    // fine grain
    float g = hash(uv * uRes + fract(uTime * 7.0) * vec2(91.7, 37.3)) - 0.5;
    col += g * 0.016;

    gl_FragColor = vec4(max(col, 0.0), 1.0);
  }
`

/** sRGB hex to a raw 0..1 vector (no colour management: the shader writes display values directly). */
function hexToVec3(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16)
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)
}

const STATIC_TIME = 18

function AtmospherePlane({ reduced }: { reduced: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const pointer = useRef({ x: 0.5, y: 0.6, tx: 0.5, ty: 0.6 })
  const motion = useRef({ time: STATIC_TIME, velocity: 0, progress: 0 })

  useEffect(() => {
    if (reduced) return
    const onMove = (e: PointerEvent) => {
      pointer.current.tx = e.clientX / window.innerWidth
      pointer.current.ty = 1 - e.clientY / window.innerHeight
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced])

  const uniforms = useMemo(
    () => ({
      uTime: { value: STATIC_TIME },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.6) },
      uVelocity: { value: 0 },
      uProgress: { value: 0 },
      uBase: { value: hexToVec3('#080907') },
      uAccent: { value: hexToVec3('#e9ff4b') },
      uAccent2: { value: hexToVec3('#ff5a1f') },
    }),
    []
  )

  useFrame((state, rawDelta) => {
    const m = matRef.current
    if (!m) return
    const u = m.uniforms
    const dpr = state.viewport.dpr
    u.uRes.value.set(state.size.width * dpr, state.size.height * dpr)

    if (reduced) {
      u.uTime.value = STATIC_TIME
      u.uProgress.value = 0
      u.uVelocity.value = 0
      return
    }

    // clamp so resuming from a hidden tab does not jump
    const delta = Math.min(rawDelta, 0.1)
    const mo = motion.current
    mo.time += delta

    const kVel = 1 - Math.exp(-delta * 3.5)
    const targetVel = Math.min(1, Math.abs(scrollState.velocity) / 45)
    mo.velocity += (targetVel - mo.velocity) * kVel

    const kProg = 1 - Math.exp(-delta * 2.2)
    mo.progress += (scrollState.progress - mo.progress) * kProg

    const pm = pointer.current
    const kMouse = 1 - Math.exp(-delta * 2.4)
    pm.x += (pm.tx - pm.x) * kMouse
    pm.y += (pm.ty - pm.y) * kMouse

    u.uTime.value = mo.time
    u.uVelocity.value = mo.velocity
    u.uProgress.value = mo.progress
    u.uMouse.value.set(pm.x, pm.y)
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

/** Renders nothing if WebGL or the canvas throws; the page background colour remains. */
class SilentBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

/** Fixed full-viewport WebGL atmosphere behind all page content. */
export default function Atmosphere() {
  const [reduced] = useState(() => prefersReducedMotion())
  const [hidden, setHidden] = useState(() => typeof document !== 'undefined' && document.hidden)

  useEffect(() => {
    const onVis = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // reduced motion: 'demand' renders a single static frame (re-rendered only on resize)
  const frameloop = reduced ? 'demand' : hidden ? 'never' : 'always'

  return (
    <div className="atmosphere" aria-hidden="true">
      <SilentBoundary>
        <Canvas
          dpr={0.5}
          flat
          linear
          frameloop={frameloop}
          gl={{ alpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' }}
          orthographic
          camera={{ position: [0, 0, 1], zoom: 1 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <AtmospherePlane reduced={reduced} />
        </Canvas>
      </SilentBoundary>
    </div>
  )
}
