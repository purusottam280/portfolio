import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './Icons'

const roles = [
  'AI Engineer',
  'Agentic System Designer',
  'RAG Architect',
  'Production ML Builder',
]

const metrics = [
  { value: '10+', label: 'projects shipped' },
  { value: '5+', label: 'agent stacks' },
  { value: '1', label: 'focus: production AI' },
]

const chips = ['Agentic AI', 'LLM Systems', 'RAG', 'FastAPI', 'Multi-Agent', 'MLOps']

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRoleIndex(i => (i + 1) % roles.length)
    }, 2600)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section id="hero" className="section-frame" style={{ minHeight: '100svh', display: 'flex', alignItems: 'center' }}>
      <div className="ambient-orb orb-a" style={{ top: '4%', left: '-8%' }} />
      <div className="ambient-orb orb-b" style={{ right: '-10%', top: '8%' }} />
      <div className="ambient-orb orb-c" style={{ left: '32%', bottom: '-18%' }} />
      <div className="scanline" />

      <div className="section-grid" style={{ width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.12fr) minmax(320px, 0.88fr)',
            gap: 'clamp(28px, 5vw, 68px)',
            alignItems: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -76, y: 24, rotate: -2.5, skewX: -1.5 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: 0, skewX: 0 }}
            transition={{ type: 'spring', stiffness: 108, damping: 18, mass: 0.8 }}
            style={{ position: 'relative', zIndex: 2 }}
          >
            <div className="pill brutal-panel" style={{ marginBottom: 22, width: 'fit-content' }}>
              <span className="reactor-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 14px rgba(233,255,75,0.95)' }} />
              Node P-01 / online
            </div>

            <h1
              className="section-title"
              style={{
                maxWidth: 860,
                marginBottom: 18,
                textTransform: 'uppercase',
              }}
            >
              AI FOR THE
              <span className="glitch" data-text="UNSTABLE FUTURE" style={{ display: 'block', color: 'var(--accent)' }}>
                UNSTABLE FUTURE
              </span>
            </h1>

            <div className="signal-rule" style={{ maxWidth: 620, marginBottom: 18 }} />

            <p className="section-copy" style={{ maxWidth: 680, fontSize: '1.05rem', marginBottom: 22 }}>
              I build agentic systems with teeth: autonomous operators, retrieval engines, and production AI that moves fast under pressure.
            </p>

            <div style={{ marginBottom: 22, minHeight: 46 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={roles[roleIndex]}
                  initial={{ opacity: 0, x: -24, skewX: -8 }}
                  animate={{ opacity: 1, x: 0, skewX: 0 }}
                  exit={{ opacity: 0, x: 20, skewX: 8 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 22, mass: 0.55 }}
                  className="metric-pill brutal-panel"
                  style={{ display: 'inline-flex', borderRadius: 10 }}
                >
                  <span style={{ color: 'var(--accent)' }}>Signal:</span>
                  {roles[roleIndex]}
                </motion.div>
              </AnimatePresence>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 26 }}>
              <a href="#projects" className="button-primary">
                View selected work
              </a>
              <a href="/Purusottam_Patel_exp.pdf" target="_blank" rel="noopener noreferrer" className="button-secondary">
                Download resume
              </a>
              <a href="#contact" className="button-ghost">
                Start a conversation
              </a>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 14,
                maxWidth: 760,
              }}
            >
              {metrics.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="glass-panel holo-border brutal-panel"
                  initial={{ opacity: 0, y: 30, scaleX: 0.78 }}
                  animate={{ opacity: 1, y: 0, scaleX: 1 }}
                  transition={{ delay: 0.34 + index * 0.09, type: 'spring', stiffness: 150, damping: 17 }}
                  style={{ borderRadius: 14, padding: '18px 16px', transformOrigin: 'left center' }}
                >
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '-0.06em', lineHeight: 1, marginBottom: 6 }}>
                    {item.value}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(247,249,252,0.56)' }}>
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 96, y: -14, rotate: 3.5, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 90, damping: 16, mass: 0.9, delay: 0.08 }}
            whileHover={{ y: -8, rotate: -0.6, transition: { type: 'spring', stiffness: 280, damping: 20 } }}
            style={{ position: 'relative', zIndex: 2 }}
          >
            <div className="hero-card glass-panel-strong holo-border brutal-panel motion-float" style={{ padding: 18 }}>
              <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', minHeight: 560 }}>
                <img
                  src="/profile.jpg"
                  alt="Purusottam Patel"
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: 560,
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    filter: 'contrast(1.04) saturate(1.08) brightness(0.94)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(8,9,7,0.04) 0%, rgba(8,9,7,0.82) 100%), linear-gradient(112deg, transparent 0 48%, rgba(233,255,75,0.1) 49%, transparent 50%), radial-gradient(circle at top right, rgba(255,90,31,0.2), transparent 36%)',
                  }}
                />
                <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(233,255,75,0.2)', borderRadius: 16 }} />
                <div className="hazard-stripe" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
                <div className="data-strip" style={{ position: 'absolute', top: 24, left: 18, padding: '8px 10px', background: 'rgba(8,9,7,0.78)', border: '1px solid rgba(233,255,75,0.32)' }}>
                  live visual feed / 2100.07
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: 18,
                    right: 18,
                    bottom: 18,
                    display: 'grid',
                    gap: 12,
                  }}
                >
                  <div className="glass-panel brutal-panel" style={{ borderRadius: 12, padding: '14px 16px' }}>
                    <div className="project-meta" style={{ marginBottom: 6, color: 'var(--accent)' }}>Active build queue</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.4 }}>
                      Building systems people can trust when the interface disappears and the agent takes over.
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="glass-panel brutal-panel" style={{ borderRadius: 12, padding: '14px 16px' }}>
                      <div className="project-meta" style={{ marginBottom: 8 }}>System loadout</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {['LangGraph', 'FastAPI', 'RAG', 'Docker'].map(tag => (
                          <span key={tag} className="tag-chip">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="glass-panel brutal-panel" style={{ borderRadius: 12, padding: '14px 16px' }}>
                      <div className="project-meta" style={{ marginBottom: 8 }}>Channel status</div>
                      <div style={{ fontSize: '0.98rem', color: 'rgba(247,249,252,0.88)' }}>
                        Available for select roles and freelance builds.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.66, type: 'spring', stiffness: 120, damping: 18 }}
          style={{
            marginTop: 28,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {chips.map(chip => (
            <span key={chip} className="pill brutal-panel" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              {chip}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.92, type: 'spring', stiffness: 120, damping: 18 }}
          style={{
            marginTop: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span className="project-meta">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 0.8, repeat: 2, ease: 'easeInOut' }}>
            <ChevronDown size={18} color="rgba(247,249,252,0.55)" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
