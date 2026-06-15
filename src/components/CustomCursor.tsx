import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    let ringX = 0, ringY = 0
    let dotX = 0, dotY = 0
    let animFrame: number

    const onMove = (e: MouseEvent) => {
      dotX = e.clientX
      dotY = e.clientY
    }

    const animate = () => {
      // Ring trails with easing
      ringX += (dotX - ringX) * 0.12
      ringY += (dotY - ringY) * 0.12

      if (dotRef.current) {
        dotRef.current.style.left = `${dotX}px`
        dotRef.current.style.top = `${dotY}px`
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`
        ringRef.current.style.top = `${ringY}px`
      }

      animFrame = requestAnimationFrame(animate)
    }

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.matches('a, button, [role="button"], input, textarea, .project-card, .skill-orb, label')
      ) {
        setHovering(true)
      }
    }

    const onLeave = () => setHovering(false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onEnter)
    window.addEventListener('mouseout', onLeave)
    animFrame = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onEnter)
      window.removeEventListener('mouseout', onLeave)
      cancelAnimationFrame(animFrame)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className={`cursor-ring${hovering ? ' hovering' : ''}`} />
    </>
  )
}
