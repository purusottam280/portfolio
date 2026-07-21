import { motion } from 'motion/react'
import { Brain, Compass, Layers3, Workflow } from 'lucide-react'

const principles = [
  {
    icon: Brain,
    title: 'Systems first',
    desc: 'Every model sits inside a product loop, with context, guardrails, and clear UX.',
  },
  {
    icon: Workflow,
    title: 'Composable flows',
    desc: 'I break AI products into small orchestration layers that are easier to scale and debug.',
  },
  {
    icon: Layers3,
    title: 'Interface matters',
    desc: 'A good AI stack should feel calm to use, even if the logic underneath is complex.',
  },
  {
    icon: Compass,
    title: 'Outcome driven',
    desc: 'I optimize for measurable workflows, not just impressive demos or flashy model usage.',
  },
]

const stats = [
  { value: '10+', label: 'projects shipped' },
  { value: '5+', label: 'agent frameworks' },
  { value: '3+', label: 'years in ML' },
  { value: '100%', label: 'production bias' },
]

export default function About() {
  return (
    <section id="about" className="section-frame">
      <div className="ambient-orb orb-b" style={{ top: '-8%', right: '-10%' }} />

      <div className="section-grid">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 720, marginBottom: 34 }}
        >
          <div className="section-kicker" style={{ marginBottom: 18 }}>About</div>
          <h2 className="section-title" style={{ maxWidth: 760, marginBottom: 18 }}>
            I treat AI engineering like
            <span style={{ display: 'block', background: 'linear-gradient(135deg, #fff 0%, #67e8f9 45%, #c4b5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              product design for intelligent systems.
            </span>
          </h2>
          <p className="section-copy" style={{ maxWidth: 680 }}>
            I build multi-agent workflows, RAG products, and automation tools that balance speed,
            reliability, and clean interfaces. The goal is not to make AI look complex. It is to make
            complex systems feel simple, controlled, and polished.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            gap: 16,
            alignItems: 'stretch',
          }}
        >
          <motion.div
            className="glass-panel-strong holo-border brutal-panel"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.7 }}
            style={{ borderRadius: 18, padding: 24, minHeight: '100%', transform: 'skewX(-0.6deg)' }}
          >
            <div className="project-meta" style={{ marginBottom: 14 }}>Field notes</div>
            <div style={{ display: 'grid', gap: 18 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', letterSpacing: '-0.05em', marginBottom: 8 }}>Purusottam Patel</div>
                <p className="section-copy" style={{ marginBottom: 0 }}>
                  AI/ML Engineer focused on turning model capability into products people can actually ship,
                  trust, and reuse.
                </p>
              </div>

              <div
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <img
                  src="/profile.jpg"
                  alt="Purusottam Patel"
                  style={{
                    width: '100%',
                    height: 300,
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    filter: 'contrast(1.04) saturate(1.06)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(4,5,7,0.08) 0%, rgba(4,5,7,0.6) 100%)',
                  }}
                />
                <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['Autonomy', 'Retrieval', 'Deployment'].map(tag => (
                    <span key={tag} className="tag-chip">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
              {stats.map(stat => (
                <motion.div
                  key={stat.label}
                  className="glass-panel holo-border brutal-panel"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5 }}
                  style={{ borderRadius: 14, padding: 20 }}
                >
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '-0.05em', marginBottom: 6 }}>{stat.value}</div>
                  <div className="project-meta">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="glass-panel-strong holo-border brutal-panel"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7 }}
              style={{ borderRadius: 18, padding: 24, transform: 'skewX(0.4deg)' }}
            >
              <div className="project-meta" style={{ marginBottom: 16 }}>Operating principles</div>
              <div style={{ display: 'grid', gap: 12 }}>
                {principles.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="glass-panel brutal-panel" style={{ borderRadius: 12, padding: 16, display: 'grid', gridTemplateColumns: '36px 1fr', gap: 14, alignItems: 'start' }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        display: 'grid',
                        placeItems: 'center',
                        background: 'rgba(34,211,238,0.08)',
                        border: '1px solid rgba(34,211,238,0.14)',
                      }}
                    >
                      <Icon size={16} color="var(--accent-2)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{title}</div>
                      <div style={{ color: 'rgba(247,249,252,0.68)', lineHeight: 1.6, fontSize: '0.95rem' }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
