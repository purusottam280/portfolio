import { gsap, scrollState } from './scroll'

/**
 * Tiny synthesized sound layer (WebAudio only, no audio files).
 * Everything is routed through `out`, which fades in on enable() and out on disable().
 * Every public sound is a no-op while disabled or before the context is running.
 */

type Drone = {
  bus: GainNode
  filter: BiquadFilterNode
  sources: AudioScheduledSourceNode[]
}

const DRONE_GAIN = 0.05
const DRONE_CUTOFF = 220
const HOVER_GAP_MS = 80

let ctx: AudioContext | null = null
let out: GainNode | null = null
let drone: Drone | null = null
let enabled = false
let ticking = false
let level = 0 // smoothed 0..1 scroll energy
let lastDroneGain = -1
let lastDroneCutoff = -1
let lastHover = 0
let suspendTimer = 0

function getContext() {
  if (ctx) return ctx
  const Ctor =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  ctx = new Ctor()
  out = ctx.createGain()
  out.gain.value = 0
  out.connect(ctx.destination)
  return ctx
}

function noiseBuffer(ac: AudioContext, seconds: number) {
  const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * seconds), ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

function buildDrone(ac: AudioContext, dest: AudioNode): Drone {
  const bus = ac.createGain()
  bus.gain.value = DRONE_GAIN
  bus.connect(dest)

  const filter = ac.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = DRONE_CUTOFF
  filter.Q.value = 0.8
  filter.connect(bus)

  // root + fifth, slightly detuned against each other so the beating feels alive
  const root = ac.createOscillator()
  root.type = 'sawtooth'
  root.frequency.value = 55
  root.detune.value = -6
  const fifth = ac.createOscillator()
  fifth.type = 'triangle'
  fifth.frequency.value = 82.4
  fifth.detune.value = 7
  const rootGain = ac.createGain()
  rootGain.gain.value = 0.55
  const fifthGain = ac.createGain()
  fifthGain.gain.value = 0.7
  root.connect(rootGain).connect(filter)
  fifth.connect(fifthGain).connect(filter)

  // slow LFO breathing on the cutoff
  const lfo = ac.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = 0.07
  const lfoDepth = ac.createGain()
  lfoDepth.gain.value = 70
  lfo.connect(lfoDepth).connect(filter.frequency)

  // very quiet filtered noise bed (room tone)
  const noise = ac.createBufferSource()
  noise.buffer = noiseBuffer(ac, 2)
  noise.loop = true
  const noiseFilter = ac.createBiquadFilter()
  noiseFilter.type = 'lowpass'
  noiseFilter.frequency.value = 480
  const noiseGain = ac.createGain()
  noiseGain.gain.value = 0.18
  noise.connect(noiseFilter).connect(noiseGain).connect(bus)

  const sources: AudioScheduledSourceNode[] = [root, fifth, lfo, noise]
  sources.forEach(s => s.start())
  return { bus, filter, sources }
}

/** Scroll velocity nudges the drone: a little louder and brighter while moving. */
function droneTick() {
  if (!ctx || !drone) return
  const target = Math.min(1, Math.abs(scrollState.velocity) / 40)
  level += (target - level) * 0.04
  if (level < 0.001) level = 0

  const gain = DRONE_GAIN * (1 + level * 0.6)
  const cutoff = DRONE_CUTOFF + level * 420
  const now = ctx.currentTime
  if (Math.abs(gain - lastDroneGain) > 0.0005) {
    drone.bus.gain.setTargetAtTime(gain, now, 0.08)
    lastDroneGain = gain
  }
  if (Math.abs(cutoff - lastDroneCutoff) > 2) {
    drone.filter.frequency.setTargetAtTime(cutoff, now, 0.08)
    lastDroneCutoff = cutoff
  }
}

function onVisibility() {
  if (!ctx || !enabled) return
  if (document.hidden) void ctx.suspend()
  else void ctx.resume()
}

/** Must be called from a user gesture (click / keydown / pointerdown). Resolves true once audio is running. */
export async function enable(): Promise<boolean> {
  enabled = true
  const ac = getContext()
  if (!ac || !out) {
    enabled = false
    return false
  }
  window.clearTimeout(suspendTimer)
  const resumed = ac.state === 'running' ? Promise.resolve() : ac.resume()
  if (!drone) drone = buildDrone(ac, out)
  try {
    await resumed
  } catch {
    return false
  }
  if (!enabled) return false

  const now = ac.currentTime
  out.gain.cancelScheduledValues(now)
  out.gain.setValueAtTime(out.gain.value, now)
  out.gain.linearRampToValueAtTime(1, now + 1.6)

  if (!ticking) {
    gsap.ticker.add(droneTick)
    document.addEventListener('visibilitychange', onVisibility)
    ticking = true
  }
  return true
}

export function disable() {
  if (!enabled && !ticking) return
  enabled = false
  if (ticking) {
    gsap.ticker.remove(droneTick)
    document.removeEventListener('visibilitychange', onVisibility)
    ticking = false
  }
  if (!ctx || !out) return
  const now = ctx.currentTime
  out.gain.cancelScheduledValues(now)
  out.gain.setValueAtTime(out.gain.value, now)
  out.gain.linearRampToValueAtTime(0, now + 0.4)
  const ac = ctx
  window.clearTimeout(suspendTimer)
  suspendTimer = window.setTimeout(() => {
    if (!enabled) void ac.suspend()
  }, 500)
}

export function isEnabled() {
  return enabled
}

/** Returns the running context + output node, or null when sound should stay silent. */
function live() {
  if (!enabled || !ctx || !out || ctx.state !== 'running') return null
  return { ac: ctx, dest: out }
}

/** Shapes a gain node into a fast attack / exponential decay envelope. */
function envelope(g: GainNode, t: number, peak: number, attack: number, decay: number) {
  g.gain.setValueAtTime(0.0001, t)
  g.gain.linearRampToValueAtTime(peak, t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay)
}

/** ~40ms filtered blip, used on scene changes. */
export function tick() {
  const a = live()
  if (!a) return
  const { ac, dest } = a
  const t = ac.currentTime
  const osc = ac.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(1500, t)
  osc.frequency.exponentialRampToValueAtTime(720, t + 0.04)
  const bp = ac.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 1100
  bp.Q.value = 2.5
  const g = ac.createGain()
  envelope(g, t, 0.035, 0.003, 0.037)
  osc.connect(bp).connect(g).connect(dest)
  osc.start(t)
  osc.stop(t + 0.06)
}

/** ~15ms high, very quiet blip for hovering links / buttons. Rate-limited. */
export function hover() {
  const a = live()
  if (!a) return
  const nowMs = performance.now()
  if (nowMs - lastHover < HOVER_GAP_MS) return
  lastHover = nowMs
  const { ac, dest } = a
  const t = ac.currentTime
  const osc = ac.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(2900, t)
  osc.frequency.exponentialRampToValueAtTime(2300, t + 0.015)
  const g = ac.createGain()
  envelope(g, t, 0.012, 0.002, 0.013)
  osc.connect(g).connect(dest)
  osc.start(t)
  osc.stop(t + 0.03)
}

/** Low, short thump for clicks. */
export function thock() {
  const a = live()
  if (!a) return
  const { ac, dest } = a
  const t = ac.currentTime
  const osc = ac.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(140, t)
  osc.frequency.exponentialRampToValueAtTime(48, t + 0.12)
  const lp = ac.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 400
  const g = ac.createGain()
  envelope(g, t, 0.09, 0.004, 0.13)
  osc.connect(lp).connect(g).connect(dest)
  osc.start(t)
  osc.stop(t + 0.16)
}
