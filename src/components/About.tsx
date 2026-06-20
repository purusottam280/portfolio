import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { Brain, Zap, Code2, Layers } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const easeSmooth = [0.22, 1, 0.36, 1] as [number, number, number, number]

const stats = [
  { value: '10+', label: 'AI Projects Built' },
  { value: '5+', label: 'Agent Frameworks' },
  { value: '3+', label: 'Years Experience' },
  { value: '100%', label: 'Autonomous Focus' },
]

const pillars = [
  {
    icon: Brain,
    title: 'Agentic AI Systems',
    desc: 'Designing autonomous multi-agent pipelines with LangGraph, CrewAI, and AutoGen that plan, reason, and self-correct without human intervention.',
    color: '#6366F1',
    bg: 'rgba(99,102,241,0.1)',
    border: 'rgba(99,102,241,0.18)',
  },
  {
    icon: Layers,
    title: 'RAG Architectures',
    desc: 'Building production-grade Retrieval-Augmented Generation systems with hybrid search, re-ranking, and multilingual capabilities.',
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.08)',
    border: 'rgba(6,182,212,0.18)',
  },
  {
    icon: Zap,
    title: 'LLM Fine-tuning',
    desc: 'Adapting and aligning large language models via LoRA, RLHF, and instruction tuning for domain-specific applications.',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.18)',
  },
  {
    icon: Code2,
    title: 'AI Engineering',
    desc: 'Deploying scalable AI APIs with FastAPI, Docker, and cloud infrastructure — bridging the gap between research and production.',
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.08)',
    border: 'rgba(6,182,212,0.18)',
  },
]

export default function About() {
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLElement>(null)
  const pillarsRef = useRef<HTMLDivElement>(null)
  const isPillarsVisible = useInView(pillarsRef, { once: true, margin: '-100px' })

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useGSAP(() => {
    gsap.to('.aurora-orb-about', {
      yPercent: 100,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    })
  }, { scope: containerRef })

  // Stable random fly-in configurations for About cards
  const pillarFlights = useMemo(() => {
    return pillars.map((_, i) => {
      const angles = [
        Math.PI * 0.8,  // Left-bottom
        Math.PI * 0.2,  // Top-right
        Math.PI * 1.2,  // Bottom-left
        Math.PI * 1.8,  // Bottom-right
      ]
      const angle = angles[i % angles.length]
      const distance = 500 + Math.random() * 200
      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        rotate: -20 + (i * 12),
        scale: 0.8,
        delay: i * 0.12 + 0.2,
      }
    })
  }, [])

  return (
    <section
      id="about"
      ref={containerRef}
      style={{ position: 'relative', padding: '112px 24px', overflow: 'hidden' }}
    >
      {/* Aurora */}
      <div
        className="aurora-orb aurora-orb-about"
        style={{
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          bottom: '-10%', right: '-5%',
          animation: 'auroraFloat2 20s ease-in-out infinite',
        }}
      />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Section Header (centered) ─── */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: 72 }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easeSmooth }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 24, height: 1, background: 'rgba(99,102,241,0.5)' }} />
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase' as const,
              background: 'linear-gradient(90deg, #6366F1, #06B6D4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>About Me</span>
            <div style={{ width: 24, height: 1, background: 'rgba(6,182,212,0.5)' }} />
          </div>

          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 16,
          }}>
            Engineering intelligence,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              one agent at a time
            </span>
          </h2>

          <div style={{
            width: 56, height: 3,
            background: 'linear-gradient(90deg, #6366F1, #06B6D4)',
            borderRadius: 2, margin: '0 auto',
            boxShadow: '0 0 10px rgba(99,102,241,0.5)',
          }} />
        </motion.div>

        {/* ── Two-column layout ─── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 40 : 64,
          alignItems: 'start',
        }}>

          {/* LEFT: Bio + Stats Card */}
          <div
            className="glass-card"
            style={{
              background: 'rgba(13,13,22,0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 24,
              padding: isMobile ? '24px 20px' : '40px',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >

            <motion.p
              style={{
                fontFamily: 'Inter, sans-serif', fontSize: 16, lineHeight: 1.8,
                color: 'rgba(200,200,215,0.8)', marginBottom: 20,
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.7, ease: easeSmooth }}
            >
              I'm <strong style={{ color: '#fff', fontWeight: 600 }}>Purusottam Patel</strong>, an AI/ML Engineer &amp; Agentic Systems Builder passionate about building AI systems that go beyond
              simple prompt-response — systems that plan, execute, and adapt autonomously.
            </motion.p>

            <motion.p
              style={{
                fontFamily: 'Inter, sans-serif', fontSize: 15, lineHeight: 1.8,
                color: 'rgba(161,161,170,0.7)', marginBottom: 40,
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7, ease: easeSmooth }}
            >
              My work spans Hiring Intelligence &amp; ATS automation platforms, multilingual document
              retrieval systems (RAG), and agentic travel itinerary planning. I bridge the gap
              between cutting-edge research and production-ready deployment.
            </motion.p>

            {/* Stats grid */}
            <motion.div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7, ease: easeSmooth }}
            >
              {stats.map(s => (
                <div
                  key={s.label}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(99,102,241,0.15)',
                    borderRadius: 16,
                    padding: '20px 16px',
                    textAlign: 'center',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 30, fontWeight: 700,
                    background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    marginBottom: 4,
                  }}>
                    {s.value}
                  </div>
                  <div style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 12,
                    color: 'rgba(161,161,170,0.6)',
                  }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Expertise pillars */}
          <div 
            ref={pillarsRef}
            style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}
          >
            {pillars.map((p, i) => {
              const flight = pillarFlights[i]
              return (
                <motion.div
                  key={p.title}
                  style={{
                    background: 'rgba(13,13,22,0.8)',
                    border: `1px solid ${p.border}`,
                    borderRadius: 16,
                    padding: '20px',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                  }}
                  variants={{
                    hidden: {
                      opacity: 0,
                      x: flight.x,
                      y: flight.y,
                      rotate: flight.rotate,
                      scale: flight.scale,
                    },
                    visible: {
                      opacity: 1,
                      x: 0,
                      y: 0,
                      rotate: 0,
                      scale: 1,
                    }
                  }}
                  initial="hidden"
                  animate={isPillarsVisible ? "visible" : "hidden"}
                  transition={{
                    type: 'spring',
                    stiffness: 22,
                    damping: 12,
                    mass: 1.2,
                    delay: flight.delay,
                  }}
                  whileHover={{ y: -4, boxShadow: `0 20px 40px ${p.bg}` }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: p.bg, border: `1px solid ${p.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 14,
                  }}>
                    <p.icon size={18} color={p.color} />
                  </div>
                  <h3 style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
                    fontWeight: 600, color: '#fff', marginBottom: 8,
                  }}>
                    {p.title}
                  </h3>
                  <p style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 12.5,
                    lineHeight: 1.65, color: 'rgba(161,161,170,0.65)',
                  }}>
                    {p.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
