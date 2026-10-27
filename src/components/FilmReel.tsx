import { useEffect, useRef, useState } from 'react'
import { gsap, scrollState, prefersReducedMotion, isFinePointer } from '../lib/scroll'
import '../styles/film-reel.css'

/** Sprocket travel per px of page scroll. 120px of scroll = one 48px frame = one frame number. */
const FILM_SPEED = 0.4
const FRAME_PX = 48
const SCROLL_PER_FRAME = 120

function formatFrame(n: number) {
  return String(Math.max(0, n) % 10000).padStart(4, '0')
}

function readProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
}

/** Fixed vertical film strip on the right edge: sprockets run with scroll, playhead marks progress. */
export default function FilmReel() {
  // reactive: the reel appears/disappears as the viewport crosses 900px or the pointer type changes
  const [enabled, setEnabled] = useState(
    () => typeof window !== 'undefined' && isFinePointer() && window.innerWidth >= 900
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px) and (pointer: fine)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  const holesRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!enabled) return
    const holes = holesRef.current
    const head = headRef.current
    const frame = frameRef.current
    if (!holes || !head || !frame) return

    const reduced = prefersReducedMotion()
    let travel = 0
    const measure = () => {
      travel = Math.max(0, window.innerHeight - head.offsetHeight)
    }
    measure()

    let lastBg = NaN
    let lastHead = NaN
    let lastFrame = -1

    const write = (progress: number, moveFilm: boolean) => {
      const y = window.scrollY
      if (moveFilm) {
        const bg = -((y * FILM_SPEED) % FRAME_PX)
        if (bg !== lastBg) {
          holes.style.backgroundPositionY = `${bg.toFixed(2)}px`
          lastBg = bg
        }
      }
      const hy = Math.round(progress * travel * 10) / 10
      if (hy !== lastHead) {
        head.style.transform = `translate3d(0, ${hy}px, 0)`
        lastHead = hy
      }
      const f = Math.floor(y / SCROLL_PER_FRAME)
      if (f !== lastFrame) {
        frame.textContent = formatFrame(f)
        lastFrame = f
      }
    }

    const onResize = () => {
      measure()
      lastHead = NaN
      write(reduced ? readProgress() : scrollState.progress, !reduced)
    }
    window.addEventListener('resize', onResize, { passive: true })

    if (reduced) {
      // static strip: no film motion, the playhead and frame count just reflect the position
      const onScroll = () => write(readProgress(), false)
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onResize)
      }
    }

    const tick = () => write(scrollState.progress, true)
    tick()
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', onResize)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="film-reel" aria-hidden="true">
      <div className="film-reel-holes" ref={holesRef} />
      <div className="film-reel-head" ref={headRef}>
        <span className="film-reel-mark" />
        <span className="film-reel-frame" ref={frameRef}>
          0000
        </span>
      </div>
    </div>
  )
}
