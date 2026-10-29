import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase)

CustomEase.create('cine', '0.76, 0, 0.24, 1')
CustomEase.create('cineOut', '0.16, 1, 0.3, 1')

// mobile URL-bar show/hide changes innerHeight; refreshing on that makes pinned scenes jump
ScrollTrigger.config({ ignoreMobileResize: true })

/** One scrub lag for every scroll-scrubbed timeline, so all scenes respond to the wheel with the same feel. */
export const SCRUB = 0.5

let lenis: Lenis | null = null

/**
 * Scroll telemetry, updated once per tick without touching layout.
 * velocity: smoothed px/frame. progress: 0..1 of the page. y: current (smoothed) scroll offset.
 */
export const scrollState = {
  velocity: 0,
  progress: 0,
  direction: 1,
  y: 0,
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

/* ---------- cached page limit (read layout only on resize / refresh) ---------- */

let limit = 1
let viewportH = typeof window !== 'undefined' ? window.innerHeight : 800
function measureLimit() {
  viewportH = window.innerHeight
  limit = Math.max(1, document.documentElement.scrollHeight - viewportH)
  scenesDirty = true
}

function updateState(y: number) {
  const delta = gsap.utils.clamp(-120, 120, y - scrollState.y)
  scrollState.y = y
  scrollState.velocity += (delta - scrollState.velocity) * 0.18
  if (Math.abs(scrollState.velocity) < 0.01) scrollState.velocity = 0
  if (delta !== 0) scrollState.direction = delta > 0 ? 1 : -1
  scrollState.progress = gsap.utils.clamp(0, 1, y / limit)
}

export function initScroll() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)

  measureLimit()
  ScrollTrigger.addEventListener('refresh', measureLimit)
  // web fonts change line heights after first layout: re-measure every trigger once they are in
  document.fonts?.ready.then(() => refreshScroll())

  if (prefersReducedMotion()) {
    // native scrolling; keep telemetry correct for the HUD
    const onScroll = () => updateState(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measureLimit, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measureLimit)
      ScrollTrigger.removeEventListener('refresh', measureLimit)
    }
  }

  lenis = new Lenis({
    lerp: 0.09,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.2,
    autoRaf: false,
  })

  lenis.on('scroll', ScrollTrigger.update)

  // child components subscribe before this effect runs; hand them over from the fallback poller to the main tick
  if (fallbackPolling) {
    gsap.ticker.remove(trackScene)
    fallbackPolling = false
  }

  const tick = (time: number) => {
    lenis?.raf(time * 1000)
    // Lenis' animated scroll is already in memory: no layout read here
    updateState(lenis ? lenis.animatedScroll : window.scrollY)
    trackScene()
  }

  // prioritized: Lenis must move the scroll position before anything writes styles this frame,
  // otherwise window.scrollTo has to force a synchronous layout to clamp against dirty geometry
  gsap.ticker.add(tick, false, true)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    ScrollTrigger.removeEventListener('refresh', measureLimit)
    lenis?.destroy()
    lenis = null
  }
}

/** Re-measures every ScrollTrigger in document order (pins first), then the cached limits. */
export function refreshScroll() {
  ScrollTrigger.sort()
  ScrollTrigger.refresh()
}

export function stopScroll() {
  lenis?.stop()
  document.documentElement.classList.add('is-locked')
}

export function startScroll() {
  lenis?.start()
  document.documentElement.classList.remove('is-locked')
}

/** Smooth-scrolls to a section. Pinned sections are targeted through their pin spacer so the jump lands on frame 0. */
export function scrollToSection(href: string) {
  const el = document.querySelector<HTMLElement>(href)
  if (!el) return
  const target = (el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el) as HTMLElement
  if (lenis) {
    const distance = Math.abs(target.getBoundingClientRect().top)
    lenis.scrollTo(target, {
      duration: gsap.utils.clamp(1, 2.4, distance / 3200),
      easing: t => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2), // quart in-out: no lurch at either end
    })
  } else {
    target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }
}

/* ---------- Scene registry: one tracker drives the HUD, nav highlight and sound ---------- */

export type Scene = { index: string; label: string; id?: string }

type SceneEntry = { el: Element; scene: Scene; top: number }
const sceneEntries: SceneEntry[] = []
let scenesDirty = true

/** Registers a section as a scene. Positions are cached and only re-measured after a resize or ScrollTrigger refresh. */
export function registerScene(el: Element | null, scene: Scene) {
  if (!el) return () => {}
  const entry: SceneEntry = { el, scene: { ...scene, id: scene.id ?? (el.id || undefined) }, top: 0 }
  sceneEntries.push(entry)
  scenesDirty = true
  return () => {
    const i = sceneEntries.indexOf(entry)
    if (i >= 0) sceneEntries.splice(i, 1)
    scenesDirty = true
  }
}

function measureScenes() {
  const y = window.scrollY
  for (const entry of sceneEntries) {
    // a pinned section's own box moves while pinned; its spacer holds the real document position
    const box = entry.el.parentElement?.classList.contains('pin-spacer') ? entry.el.parentElement : entry.el
    entry.top = box.getBoundingClientRect().top + y
  }
  sceneEntries.sort((a, b) => a.top - b.top)
  scenesDirty = false
}

/** Debug/inspection helper: every registered scene with its cached document top. */
export function getScenes() {
  if (scenesDirty) measureScenes()
  return sceneEntries.map(e => ({ label: e.scene.label, top: Math.round(e.top) }))
}

/** The last scene whose top has crossed the middle of the viewport. Pure arithmetic on cached positions. */
export function getActiveScene(): Scene | null {
  if (scenesDirty) measureScenes()
  const probe = (lenis ? scrollState.y : window.scrollY) + viewportH * 0.5
  let active: SceneEntry | null = null
  for (const entry of sceneEntries) {
    if (entry.top <= probe) active = entry
    else break
  }
  return (active ?? sceneEntries[0])?.scene ?? null
}

type SceneListener = (scene: Scene | null) => void
const sceneListeners = new Set<SceneListener>()
let lastSceneLabel: string | null | undefined

function trackScene() {
  if (sceneListeners.size === 0) return
  const scene = getActiveScene()
  const label = scene?.label ?? null
  if (label === lastSceneLabel) return
  lastSceneLabel = label
  sceneListeners.forEach(fn => fn(scene))
}

let fallbackPolling = false
/**
 * Calls `fn` whenever the active scene changes (and once immediately).
 * Driven by the main scroll tick; under reduced motion a light poller is used instead.
 */
export function onSceneChange(fn: SceneListener) {
  sceneListeners.add(fn)
  fn(getActiveScene())
  if (!lenis && !fallbackPolling) {
    fallbackPolling = true
    gsap.ticker.add(trackScene)
  }
  return () => {
    sceneListeners.delete(fn)
    if (sceneListeners.size === 0 && fallbackPolling) {
      gsap.ticker.remove(trackScene)
      fallbackPolling = false
    }
  }
}
