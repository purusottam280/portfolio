import { gsap, isFinePointer, prefersReducedMotion } from './scroll'

/**
 * Makes every `.magnetic` element inside `root` lean toward the cursor and snap back
 * with an elastic ease. Returns a cleanup function.
 */
export function initMagnetic(root: HTMLElement | null, strength = 0.38, radius = 90) {
  if (!root || !isFinePointer() || prefersReducedMotion()) return () => {}

  const els = Array.from(root.querySelectorAll<HTMLElement>('.magnetic'))
  const cleanups = els.map(el => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
    let active = false

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      const reach = Math.max(r.width, r.height) / 2 + radius
      if (dist < reach) {
        active = true
        xTo(dx * strength)
        yTo(dy * strength)
      } else if (active) {
        active = false
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' })
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  })

  return () => cleanups.forEach(fn => fn())
}
