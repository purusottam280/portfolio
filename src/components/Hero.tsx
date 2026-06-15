import { useEffect, useState } from 'react'
import Particles, { ParticlesProvider } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './Icons'
import type { Engine } from '@tsparticles/engine'

const ROLES = [
  'Agentic AI Engineer',
  'LLM Applications Builder',
  'Multi-Agent Architect',
  'RAG Pipeline Specialist',
  'AI Systems Developer',
]

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

function useGlitchText(finalText: string, duration = 800) {
  const [display, setDisplay] = useState('')

  useEffect(() => {
    let frame = 0
    const totalFrames = 24
    const interval = setInterval(() => {
      if (frame >= totalFrames) {
        setDisplay(finalText)
        clearInterval(interval)
        return
      }
      const progress = frame / totalFrames
      const revealed = Math.floor(progress * finalText.length)
      let result = ''
      for (let i = 0; i < finalText.length; i++) {
        if (finalText[i] === ' ') { result += ' '; continue }
        if (i < revealed) {
          result += finalText[i]
        } else {
          result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        }
      }
      setDisplay(result)
      frame++
    }, duration / totalFrames)
    return () => clearInterval(interval)
  }, [finalText, duration])

  return display
}

function useTypewriter(words: string[], speed = 75, pauseMs = 2200) {
  const [idx, setIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [text, setText] = useState('')

  useEffect(() => {
    const current = words[idx]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && charIdx <= current.length) {
      setText(current.slice(0, charIdx))
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed)
    } else if (!deleting && charIdx > current.length) {
      timeout = setTimeout(() => setDeleting(true), pauseMs)
    } else if (deleting && charIdx > 0) {
      setText(current.slice(0, charIdx))
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2)
    } else {
      setDeleting(false)
      setIdx(i => (i + 1) % words.length)
    }

    return () => clearTimeout(timeout)
  }, [charIdx, deleting, idx, words, speed, pauseMs])

  return text
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
  const nameDisplay = useGlitchText('Purusottam Patel', 1000)
  const role = useTypewriter(ROLES, 75, 2200)

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

        {/* Content Container (Perfect Centering) */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            maxWidth: 800,
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
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

          {/* Glitch Name */}
          <motion.h1
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: 16,
              letterSpacing: '-0.02em',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="glitch-text"
              data-text={nameDisplay}
              style={{
                background: 'linear-gradient(135deg, #fff 30%, #a5b4fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {nameDisplay || '\u00A0'}
            </span>
          </motion.h1>

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
              margin: '0 auto 40px',
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
              justifyContent: 'center',
              gap: 16,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <a
              href="#projects"
              className="btn-shimmer btn-pulse"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.95rem',
                fontWeight: 600,
                textDecoration: 'none',
                padding: '14px 28px',
                borderRadius: 12,
                color: '#fff',
                background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35)',
                transition: 'all 0.3s ease',
              }}
            >
              View Projects
            </a>
            <a
              href="#contact"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.95rem',
                fontWeight: 600,
                textDecoration: 'none',
                padding: '14px 28px',
                borderRadius: 12,
                color: 'rgba(255, 255, 255, 0.85)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'
              }}
            >
              Get in Touch
            </a>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 12, marginLeft: 8 }}>
              <a
                href="https://github.com/purusottam280"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)'
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <GithubIcon size={18} color="rgba(255, 255, 255, 0.7)" />
              </a>
              <a
                href="https://linkedin.com/in/purusottampatel"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(6, 182, 212, 0.15)'
                  e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <LinkedinIcon size={18} color="rgba(255, 255, 255, 0.7)" />
              </a>
            </div>
          </motion.div>

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
