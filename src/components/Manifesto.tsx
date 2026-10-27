import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, prefersReducedMotion, registerScene } from '../lib/scroll'
import { splitWords } from '../lib/text'

export default function Manifesto() {
  const scope = useRef<HTMLElement>(null)

  useEffect(() => registerScene(scope.current, { index: '02', label: 'Principles' }), [])

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const el = scope.current
      if (!el) return

      const split = splitWords('.manifesto-text')

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.5 },
      })

      tl.fromTo('.manifesto-bg', { xPercent: -36, yPercent: -50 }, { xPercent: -64, yPercent: -50, duration: 1 }, 0)
        .fromTo(split.words, { opacity: 0.1, filter: 'blur(6px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.4, stagger: { each: 0.018 } }, 0.04)
        .from('.manifesto-meta', { opacity: 0, y: 16, duration: 0.1 }, 0.5)
        .fromTo('.manifesto-line', { scaleX: 0 }, { scaleX: 1, duration: 0.5 }, 0.04)
        // zoom-through into the next scene
        .to('.manifesto-text, .manifesto-meta', { scale: 1.9, opacity: 0, filter: 'blur(10px)', duration: 0.18, ease: 'power2.in' }, 0.82)
        .to('.manifesto-bg', { opacity: 0, duration: 0.15 }, 0.85)

      return () => split.revert()
    },
    { scope }
  )

  return (
    <section className="manifesto" ref={scope}>
      <div className="manifesto-sticky">
        <div className="manifesto-bg" aria-hidden="true">
          VISION
        </div>
        <div className="manifesto-line" />
        <p className="manifesto-text">
          Complex systems should feel <span className="accent-text">calm</span>. I build AI that is fast to trust,
          hard to break, and engineered to <span className="accent-text">ship</span>.
        </p>
        <div className="manifesto-meta mono-meta">Operating principles — Transmission 002</div>
      </div>
    </section>
  )
}
