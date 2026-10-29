import { gsap } from './scroll'

/** The single entrance used by every section: same distance, ease, duration and trigger line everywhere. */
export const REVEAL = {
  y: 32,
  duration: 1,
  ease: 'cineOut',
  stagger: 0.08,
  start: 'top 85%',
} as const

/** Fades + lifts each element matching `selector` inside `scope` as it crosses the reveal line. */
export function revealEach(scope: HTMLElement | null, selector: string) {
  if (!scope) return
  scope.querySelectorAll<HTMLElement>(selector).forEach(el => {
    gsap.from(el, {
      y: REVEAL.y,
      opacity: 0,
      duration: REVEAL.duration,
      ease: REVEAL.ease,
      scrollTrigger: { trigger: el, start: REVEAL.start },
    })
  })
}

/** Reveals a group of elements together with the shared stagger, triggered by `trigger`. */
export function revealGroup(targets: gsap.TweenTarget, trigger: gsap.DOMTarget, extra: gsap.TweenVars = {}) {
  gsap.from(targets, {
    y: REVEAL.y,
    opacity: 0,
    duration: REVEAL.duration,
    ease: REVEAL.ease,
    stagger: REVEAL.stagger,
    scrollTrigger: { trigger, start: REVEAL.start },
    ...extra,
  })
}
