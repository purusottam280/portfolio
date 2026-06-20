import { useEffect, useState, useMemo } from 'react'
import Particles, { ParticlesProvider } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './Icons'
import type { Engine } from '@tsparticles/engine'
import CanvasBackground from './CanvasBackground'

const ROLES = [
  'AI / ML Engineer',
  'Agentic Systems Builder',
  'Multi-Agent Architect',
  'RAG Pipeline Specialist',
  'LLM Applications Developer',
]



function useTypewriter(words: string[], speed = 75, pauseMs = 2200) {
  const [idx, setIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[idx]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed)
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pauseMs)
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2)
    } else {
      timeout = setTimeout(() => {
        setDeleting(false)
        setCharIdx(0)
        setIdx(i => (i + 1) % words.length)
      }, 0)
    }

    return () => clearTimeout(timeout)
  }, [charIdx, deleting, idx, words, speed, pauseMs])

  return words[idx].slice(0, charIdx)
}


const particleOptions = {
  fullScreen: false,
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  particles: {
    number: { value: 70, density: { enable: true } },
    color: { value: ['#6366F1', '#06B6D4', '#8B5CF6'] },
    shape: { type: 'circle' },
    opacity: {
      value: { min: 0.2, max: 0.6 },
      animation: { enable: true, speed: 1 },
    },
    size: { value: { min: 1, max: 3 } },
    links: {
      enable: true,
      color: '#6366F1',
      opacity: 0.25,
      width: 1,
      distance: 140,
    },
    move: {
      enable: true,
      speed: 0.8,
      direction: 'none' as const,
      random: true,
      straight: false,
      outModes: { default: 'bounce' as const },
    },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: 'grab' },
      onClick: { enable: true, mode: 'push' },
    },
    modes: {
      grab: { distance: 140, links: { opacity: 0.5 } },
      push: { quantity: 2 },
    },
  },
  detectRetina: true,
} as const

async function initEngine(engine: Engine) {
  await loadSlim(engine)
}

export default function Hero() {
  const role = useTypewriter(ROLES, 75, 2200)

  // Avengers Assemble character animations configuration
  const words = useMemo(() => {
    return "Purusottam Patel".split(" ").map((word) => {
      const letters = word.split("").map((char) => {
        // Random angle for flight path
        const angle = Math.random() * Math.PI * 2
        // Random distance to fly in from (well outside screen boundaries)
        const distance = 800 + Math.random() * 500
        
        return {
          char,
          initialX: Math.cos(angle) * distance,
          initialY: Math.sin(angle) * distance,
          initialRotate: -360 + Math.random() * 720, // Spin -360 to +360 degrees
          initialScale: 0.1 + Math.random() * 2,     // Dynamic scaling
          delay: 0.2 + Math.random() * 0.5,         // Staggered assembly times
        }
      })
      return { word, letters }
    })
  }, [])

  return (
    <ParticlesProvider init={initEngine}>
      <section
        id="hero"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '80px 24px',
        }}
      >
        {/* Aurora orbs */}
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />

        {/* Particles background */}
        <Particles
          id="tsparticles"
          options={particleOptions}
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        />

        {/* 3D WebGL Element positioned absolutely on the right */}
        <div className="hero-3d-container">
          <motion.div
            style={{ width: '100%', height: '100%' }}
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <CanvasBackground style={{ width: '100%', height: '100%' }} />
          </motion.div>
        </div>

        {/* Main Wrapper to hold row + scroll down */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Hero Row Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '60px',
              maxWidth: 1300,
              width: '100%',
              margin: '0 auto',
              flexWrap: 'wrap',
            }}
          >
            {/* Left Side: Sexy Profile Image Container */}
            <motion.div
              style={{
                position: 'relative',
                width: 340,
                height: 340,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 60px rgba(99, 102, 241, 0.3)',
                marginBottom: 0,
                flexShrink: 0,
              }}
              initial={{ opacity: 0, scale: 0.8, x: -50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(99, 102, 241, 0.5)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 80px rgba(6, 182, 212, 0.5)',
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, transparent 100%)',
                zIndex: 1,
                pointerEvents: 'none',
              }} />
              <img
                src="/profile.jpg"
                alt="Purusottam Patel"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  filter: 'contrast(1.05) saturate(1.1)',
                }}
              />
            </motion.div>

            {/* Right Side: Texts & CTAs */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              flex: 1,
              minWidth: 320,
            }}>
              {/* Availability Badge */}
              <motion.div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 16px',
                  borderRadius: 9999,
                  background: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#6366F1',
                  marginBottom: 32,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#4ade80',
                    display: 'inline-block',
                    boxShadow: '0 0 8px #4ade80',
                  }}
                  className="animate-pulse"
                />
                Available for opportunities
              </motion.div>

              {/* Avengers Assemble Animated Name */}
              <h1
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1.1,
                  marginBottom: 16,
                  letterSpacing: '-0.02em',
                }}
              >
                {words.map((w, wi) => (
                  <span
                    key={wi}
                    style={{
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                      marginRight: wi < words.length - 1 ? '0.28em' : 0,
                    }}
                  >
                    {w.letters.map((item, li) => (
                      <motion.span
                        key={li}
                        style={{
                          display: 'inline-block',
                          background: 'linear-gradient(135deg, #fff 30%, #a5b4fc 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          transformStyle: 'preserve-3d',
                        }}
                        initial={{
                          opacity: 0,
                          x: item.initialX,
                          y: item.initialY,
                          rotate: item.initialRotate,
                          scale: item.initialScale,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          y: 0,
                          rotate: 0,
                          scale: 1,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 22,
                          damping: 12,
                          mass: 1.2,
                          delay: item.delay,
                        }}
                      >
                        {item.char}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </h1>

              {/* Typewriter text */}
              <motion.div
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                  fontWeight: 500,
                  marginBottom: 24,
                  minHeight: '2.5rem',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <span className="gradient-text">{role}</span>
                <span className="typewriter-cursor" />
              </motion.div>

              {/* Tagline */}
              <motion.p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                  lineHeight: 1.8,
                  color: 'rgba(200, 200, 215, 0.8)',
                  maxWidth: 600,
                  margin: '0 0 40px 0',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6 }}
              >
                Building autonomous AI systems that think, adapt, and deliver —
                from LangGraph agents to multilingual RAG pipelines and beyond.
              </motion.p>

              {/* CTAs */}
              <motion.div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 16,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
              </motion.div>
            </div>


          </div>

          {/* Scroll down indicator */}
          <motion.div
            style={{
              marginTop: 96,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                color: 'rgba(161, 161, 170, 0.4)',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.1em',
              }}
            >
              scroll down
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronDown size={16} color="rgba(161, 161, 170, 0.4)" />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </ParticlesProvider>
  )
}
