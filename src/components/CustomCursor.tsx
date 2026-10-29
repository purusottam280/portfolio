import { useEffect, useRef } from 'react'
import { isFinePointer, prefersReducedMotion } from '../lib/scroll'

/** Dot + trailing ring cursor. Elements with `data-cursor="Label"` expand the ring and show the label. */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    document.documentElement.classList.add('has-cursor')

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let ringX = targetX
    let ringY = targetY
    let targetScale = 1
    let scale = 1
    let visible = false
    let raf = 0

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      if (!visible) {
        visible = true
        ringX = targetX
        ringY = targetY
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const labelled = target?.closest<HTMLElement>('[data-cursor]')
      const interactive = target?.closest('a, button, [data-cursor]')
      if (labelled) {
        label.textContent = labelled.dataset.cursor ?? ''
        ring.classList.add('is-label')
        targetScale = 2.6
      } else {
        ring.classList.remove('is-label')
        targetScale = interactive ? 1.8 : 1
      }
      ring.classList.toggle('is-hover', Boolean(interactive))
    }

    const onDown = () => {
      targetScale *= 0.75
    }
    const onUp = () => {
      targetScale /= 0.75
    }
    const onLeave = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
      visible = false
    }

    const loop = () => {
      raf = requestAnimationFrame(loop)
      const dx = targetX - ringX
      const dy = targetY - ringY
      const ds = targetScale - scale
      // settled: skip the write so an idle cursor costs no style work per frame
      if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05 && Math.abs(ds) < 0.001) return
      ringX += dx * 0.16
      ringY += dy * 0.16
      scale += ds * 0.16
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${scale})`
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span ref={labelRef} className="cursor-label" />
      </div>
    </>
  )
}
