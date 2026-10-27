import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, prefersReducedMotion, scrollState } from '../lib/scroll'

type MarqueeProps = {
  items: string[]
  reverse?: boolean
  giant?: boolean
  bordered?: boolean
  duration?: number
}

/** Infinite marquee whose speed and direction follow scroll velocity. */
export default function Marquee({ items, reverse = false, giant = false, bordered = false, duration = 34 }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const row = [...items, ...items, ...items, ...items]

  useGSAP(
    () => {
      const track = trackRef.current
      if (!track) return
      const tween = gsap.fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, ease: 'none', duration, repeat: -1 }
      )
      if (prefersReducedMotion()) return

      let ts = 1
      const tick = () => {
        const v = scrollState.velocity
        const dir = v < -0.4 ? -1 : 1
        const target = (1 + Math.min(Math.abs(v) * 0.07, 5)) * dir
        ts += (target - ts) * 0.08
        tween.timeScale(ts)
      }
      gsap.ticker.add(tick)
      return () => gsap.ticker.remove(tick)
    },
    { dependencies: [reverse, duration] }
  )

  return (
    <div className={`marquee ${giant ? 'marquee-giant' : ''} ${bordered ? 'marquee-bordered' : ''}`} aria-hidden="true">
      <div className="marquee-track" ref={trackRef}>
        {row.map((item, index) => (
          <span key={`${item}-${index}`} className="marquee-item">
            {item}
            <span className="marquee-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
