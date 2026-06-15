import { Suspense, lazy } from 'react'
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

export default function App() {
  return (
    <div
      style={{
        background: '#0A0A0F',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {/* Custom cursor */}
      <CustomCursor />

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main>
        {/* Hero loads immediately */}
        <Hero />

        {/* Below-fold sections lazy loaded */}
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
