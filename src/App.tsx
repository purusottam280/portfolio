import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import Intro from './components/Intro'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Timecode from './components/Timecode'
import FilmReel from './components/FilmReel'
import SoundToggle from './components/SoundToggle'
import './styles/sound.css'
import './styles/tilt.css'
import { initScroll, stopScroll, startScroll, refreshScroll, gsap, scrollState } from './lib/scroll'

// Sections are imported eagerly: they are small, and mounting them together means every ScrollTrigger is created in
// page order with final layout (no spinner-to-content height jumps shifting trigger positions mid-scroll).
// Only the WebGL background is deferred; it shares the three.js chunk with the hero avatar.
const Atmosphere = lazy(() => import('./components/Atmosphere'))

/** Top progress hairline, written from the shared scroll tick (no extra animation loop). */
function ScrollTelemetry() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const set = gsap.quickSetter(el, 'scaleX') as (v: number) => void
    let last = -1
    const tick = () => {
      const p = Math.round(scrollState.progress * 1000) / 1000
      if (p === last) return
      last = p
      set(p)
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])
  return <div ref={ref} className="scroll-telemetry" aria-hidden="true" />
}

export default function App() {
  const [introDone, setIntroDone] = useState(false)
  const [introGone, setIntroGone] = useState(false)

  useEffect(() => {
    const cleanupScroll = initScroll()
    stopScroll()
    return () => cleanupScroll()
  }, [])

  const handleIntroDone = () => {
    setIntroDone(true)
    startScroll()
    // one ordered re-measure once the hero title has its final layout
    requestAnimationFrame(() => requestAnimationFrame(refreshScroll))
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
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
