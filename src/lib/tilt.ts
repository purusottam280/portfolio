import { gsap, isFinePointer, prefersReducedMotion } from './scroll'

type TiltOptions = {
  /** Max rotation in degrees (default 6). */
  max?: number
  /** Hover scale (default 1.01). Pass 1 for elements whose scale is already driven by a scroll scrub. */
  scale?: number
  /** Inject a pointer-following glare layer (default true). Styled by src/styles/tilt.css. */
  glare?: boolean
}

/**
 * 3D pointer tilt (+ optional glare) for every `selector` match inside `root`.
 * Transforms go through GSAP so they compose with any GSAP-managed scale / rotate scrubs
 * already on the element. Returns a cleanup function.
 */
export function initTilt(root: HTMLElement | null, selector: string, opts: TiltOptions = {}) {
  if (!root || !isFinePointer() || prefersReducedMotion()) return () => {}

  const max = opts.max ?? 6
  const hoverScale = opts.scale ?? 1.01
  const useScale = hoverScale !== 1
  const useGlare = opts.glare ?? true

  const els = Array.from(root.querySelectorAll<HTMLElement>(selector))
  const cleanups = els.map(el => {
    gsap.set(el, { transformPerspective: 1000 })

    const quick = { duration: 0.6, ease: 'power3.out' }
    const rxTo = gsap.quickTo(el, 'rotateX', quick)
    const ryTo = gsap.quickTo(el, 'rotateY', quick)
    const sTo = useScale ? gsap.quickTo(el, 'scale', quick) : null
    let settle: gsap.core.Tween | null = null

    let glare: HTMLSpanElement | null = null
    let restorePosition = false
    if (useGlare) {
      if (getComputedStyle(el).position === 'static') {
        el.style.position = 'relative'
        restorePosition = true
      }
      glare = document.createElement('span')
      glare.className = 'tilt-glare'
      glare.setAttribute('aria-hidden', 'true')
      el.appendChild(glare)
    }

    const current = (prop: string) => Number(gsap.getProperty(el, prop)) || 0

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) return
      // -1..1 from the element centre
      const nx = gsap.utils.clamp(-1, 1, ((e.clientX - r.left) / r.width) * 2 - 1)
      const ny = gsap.utils.clamp(-1, 1, ((e.clientY - r.top) / r.height) * 2 - 1)

      if (settle) {
        settle.kill()
        settle = null
      }
      // pass the live value as the start so quickTo never jumps after the elastic settle moved things
      rxTo(-ny * max, current('rotateX'))
      ryTo(nx * max, current('rotateY'))
      if (sTo) sTo(hoverScale, current('scale'))

      if (glare) {
        glare.style.setProperty('--gx', `${((nx + 1) * 50).toFixed(1)}%`)
        glare.style.setProperty('--gy', `${((ny + 1) * 50).toFixed(1)}%`)
      }
    }

    const onEnter = () => el.classList.add('is-tilting')

    const onLeave = () => {
      el.classList.remove('is-tilting')
      rxTo.tween.pause()
      ryTo.tween.pause()
      sTo?.tween.pause()
      settle?.kill()
      settle = gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        ...(useScale ? { scale: 1 } : {}),
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
      })
    }

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)

    return () => {
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      el.classList.remove('is-tilting')
      settle?.kill()
      rxTo.tween.kill()
      ryTo.tween.kill()
      sTo?.tween.kill()
      gsap.set(el, { rotateX: 0, rotateY: 0, ...(useScale ? { scale: 1 } : {}) })
      glare?.remove()
      if (restorePosition) el.style.position = ''
    }
  })

  return () => cleanups.forEach(fn => fn())
}
