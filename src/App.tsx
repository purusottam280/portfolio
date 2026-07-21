import { Suspense, lazy } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'

// Lazy-load below-fold sections for performance
const About = lazy(() => import('./components/About'))
const Projects = lazy(() => import('./components/Projects'))
const Skills = lazy(() => import('./components/Skills'))
const Contact = lazy(() => import('./components/Contact'))

function SectionFallback() {
  return (
    <div
      className="flex items-center justify-center py-32"
      style={{ background: 'transparent' }}
    >
      <div
        className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{
          borderColor: 'rgba(99,102,241,0.2)',
          borderTopColor: '#6366F1',
        }}
      />
    </div>
  )
}

function ScrollTelemetry() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.22 })

  return <motion.div className="scroll-telemetry" style={{ scaleX }} aria-hidden="true" />
}

export default function App() {
  return (
    <div className="site-shell">
      <ScrollTelemetry />
      <div className="page-noise" />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<SectionFallback />}>
          <About />
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
