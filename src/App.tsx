import { Suspense, lazy, useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import Intro from './components/Intro'
import Footer from './components/Footer'
import Timecode from './components/Timecode'
import FilmReel from './components/FilmReel'
import SoundToggle from './components/SoundToggle'
import './styles/sound.css'
import './styles/tilt.css'
import { initScroll, stopScroll, startScroll, ScrollTrigger, gsap, scrollState, prefersReducedMotion } from './lib/scroll'

// Lazy-load below-fold sections for performance
// the WebGL background shares the three.js chunk with the hero avatar instead of bloating the main bundle
const Atmosphere = lazy(() => import('./components/Atmosphere'))
const About = lazy(() => import('./components/About'))
const Experience = lazy(() => import('./components/Experience'))
const Projects = lazy(() => import('./components/Projects'))
const Skills = lazy(() => import('./components/Skills'))
const Contact = lazy(() => import('./components/Contact'))

function SectionFallback() {
  return (
    <div className="flex items-center justify-center py-32" style={{ background: 'transparent' }}>
      <div
        className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(233,255,75,0.2)', borderTopColor: '#e9ff4b' }}
      />
    </div>
  )
}

function ScrollTelemetry() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.22 })
  return <motion.div className="scroll-telemetry" style={{ scaleX }} aria-hidden="true" />
}

/** Velocity-driven skew: every [data-skew] block leans into the scroll direction and settles back. */
function useVelocitySkew() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    let setters: ((v: number) => void)[] = []
    const collect = () => {
      setters = gsap.utils.toArray<HTMLElement>('[data-skew]').map(el => gsap.quickSetter(el, 'skewY', 'deg') as (v: number) => void)
    }
    collect()
    const observer = new MutationObserver(collect)
    observer.observe(document.body, { childList: true, subtree: true })

    let current = 0
    const tick = () => {
      const target = gsap.utils.clamp(-5, 5, scrollState.velocity * 0.06)
      current += (target - current) * 0.12
      if (Math.abs(current) < 0.01 && Math.abs(target) < 0.01) return
      setters.forEach(set => set(current))
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      observer.disconnect()
    }
  }, [])
}

export default function App() {
  const [introDone, setIntroDone] = useState(false)
  const [introGone, setIntroGone] = useState(false)

  useEffect(() => {
    const cleanupScroll = initScroll()
    stopScroll()
    return () => cleanupScroll()
  }, [])

  useVelocitySkew()

  const handleIntroDone = () => {
    setIntroDone(true)
    startScroll()
    window.setTimeout(() => ScrollTrigger.refresh(), 120)
  }

  return (
    <div className="site-shell">
      <Suspense fallback={null}>
        <Atmosphere />
      </Suspense>
      {!introGone && <Intro onDone={handleIntroDone} onExit={() => setIntroGone(true)} />}
      <ScrollTelemetry />
      <div className="page-grain" aria-hidden="true" />
      <div className="page-vignette" aria-hidden="true" />
      <CustomCursor />
      <Timecode />
      <FilmReel />
      <SoundToggle />
      <Navbar />
      <main>
        <Hero play={introDone} />
        <Manifesto />
        <Suspense fallback={<SectionFallback />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Experience />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
