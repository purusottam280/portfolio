import { useEffect, useRef } from 'react'
import { gsap, getActiveScene } from '../lib/scroll'

const FPS = 24
const TOTAL_SECONDS = 142 // fake "runtime" of the film the scroll traverses

function pad(n: number) {
  return String(n).padStart(2, '0')
}

/** Fixed cinematic HUD: REC dot, rolling timecode driven by scroll progress, active scene label. */
export default function Timecode() {
  const tcRef = useRef<HTMLSpanElement>(null)
  const sceneRef = useRef<HTMLSpanElement>(null)
  const indexRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let shown = 0
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      shown += (progress - shown) * 0.12
      const totalFrames = Math.round(shown * TOTAL_SECONDS * FPS)
      const frames = totalFrames % FPS
      const seconds = Math.floor(totalFrames / FPS)
      const minutes = Math.floor(seconds / 60)
      if (tcRef.current) {
        tcRef.current.textContent = `00:${pad(minutes)}:${pad(seconds % 60)}:${pad(frames)}`
      }
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  useEffect(() => {
    let current = ''
    const tick = () => {
      const scene = getActiveScene()
      if (!scene || scene.label === current) return
      current = scene.label
      if (sceneRef.current) {
        sceneRef.current.textContent = scene.label
        gsap.fromTo(sceneRef.current, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'cineOut' })
      }
      if (indexRef.current) indexRef.current.textContent = `SC ${scene.index}`
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  return (
    <div className="timecode" aria-hidden="true">
      <span className="timecode-rec">
        <span className="timecode-dot" /> REC
      </span>
      <span className="timecode-tc" ref={tcRef}>
        00:00:00:00
      </span>
      <span className="timecode-scene">
        <span ref={indexRef}>SC 01</span>
        <span className="timecode-scene-label" ref={sceneRef}>
          Opening
        </span>
      </span>
    </div>
  )
}
