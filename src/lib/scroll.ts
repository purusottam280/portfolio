import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase)

CustomEase.create('cine', '0.76, 0, 0.24, 1')
CustomEase.create('cineOut', '0.16, 1, 0.3, 1')

let lenis: Lenis | null = null

/** Smoothed scroll velocity in px/frame, exposed for skew / marquee effects. */
export const scrollState = {
  velocity: 0,
  progress: 0,
  direction: 1,
}

export { gsap, ScrollTrigger, SplitText }

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isFinePointer() {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
}

export function getLenis() {
  return lenis
}

export function initScroll() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
  if (prefersReducedMotion()) return () => {}

  lenis = new Lenis({
    lerp: 0.08,
    wheelMultiplier: 1,
    touchMultiplier: 1.3,
  })

  lenis.on('scroll', ScrollTrigger.update)

  let lastY = window.scrollY
  const tick = (time: number) => {
    lenis?.raf(time * 1000)
    // velocity measured from the real scroll position each tick, so it always settles to 0 when idle
    const y = window.scrollY
    const delta = gsap.utils.clamp(-120, 120, y - lastY)
    lastY = y
    scrollState.velocity += (delta - scrollState.velocity) * 0.18
    if (Math.abs(scrollState.velocity) < 0.01) scrollState.velocity = 0
    if (delta !== 0) scrollState.direction = delta > 0 ? 1 : -1
    const max = document.documentElement.scrollHeight - window.innerHeight
    scrollState.progress = max > 0 ? y / max : 0
  }

  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

export function stopScroll() {
  lenis?.stop()
  document.documentElement.classList.add('is-locked')
}

export function startScroll() {
  lenis?.start()
  document.documentElement.classList.remove('is-locked')
}

export function scrollToSection(href: string) {
  const target = document.querySelector<HTMLElement>(href)
  if (!target) return
  if (lenis) {
    lenis.scrollTo(target, {
      duration: 1.8,
      easing: t => 1 - Math.pow(1 - t, 4),
    })
  } else {
    target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }
}

/* ---------- Scene registry (drives the fixed timecode HUD) ---------- */

export type Scene = { index: string; label: string }

type SceneEntry = { el: Element; scene: Scene }
const sceneEntries: SceneEntry[] = []

/** Registers a section as a scene. The HUD picks whichever registered element currently spans the viewport centre. */
export function registerScene(el: Element | null, scene: Scene) {
  if (!el) return () => {}
  const entry = { el, scene }
  sceneEntries.push(entry)
  return () => {
    const i = sceneEntries.indexOf(entry)
    if (i >= 0) sceneEntries.splice(i, 1)
  }
}

/** Debug/inspection helper: every registered scene with its current viewport top. */
export function getScenes() {
  return sceneEntries.map(e => ({ label: e.scene.label, top: Math.round(e.el.getBoundingClientRect().top) }))
}

/** Returns the scene whose element is the last one whose top edge has crossed the viewport centre. */
export function getActiveScene(): Scene | null {
  const centre = window.innerHeight * 0.5
  let best: SceneEntry | null = null
  let bestTop = -Infinity
  for (const entry of sceneEntries) {
    const top = entry.el.getBoundingClientRect().top
    if (top <= centre && top > bestTop) {
      best = entry
      bestTop = top
    }
  }
  return best?.scene ?? null
}

/* ---------- Scene change subscription (shared poller) ---------- */

type SceneListener = (scene: Scene | null) => void
const sceneListeners = new Set<SceneListener>()
let lastSceneLabel: string | null = null
let lastScenePoll = 0

const pollScene = (time: number) => {
  // ~10 polls per second is plenty for a scene boundary and keeps layout reads off most frames
  if (time - lastScenePoll < 0.1) return
  lastScenePoll = time
  const scene = getActiveScene()
  const label = scene?.label ?? null
  if (label === lastSceneLabel) return
  lastSceneLabel = label
  sceneListeners.forEach(fn => fn(scene))
}

/**
 * Calls `fn` whenever the active scene (see getActiveScene) changes label.
 * All subscribers share one gsap.ticker poller, which only runs while someone is listening.
 * Returns an unsubscribe function.
 */
export function onSceneChange(fn: SceneListener) {
  if (sceneListeners.size === 0) {
    lastSceneLabel = getActiveScene()?.label ?? null
    lastScenePoll = 0
    gsap.ticker.add(pollScene)
  }
  sceneListeners.add(fn)
  return () => {
    sceneListeners.delete(fn)
    if (sceneListeners.size === 0) gsap.ticker.remove(pollScene)
  }
}
