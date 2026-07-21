import { motion } from 'motion/react'

const skillGroups = [
  {
    title: 'Foundations and ML',
    accent: '#7c3aed',
    description: 'Core machine learning and computer vision toolkit.',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'ML and Data Analysis', level: 90 },
      { name: 'Deep Learning', level: 82 },
      { name: 'Computer Vision', level: 83 },
      { name: 'NLP', level: 85 },
    ],
  },
  {
    title: 'GenAI and Agents',
    accent: '#22d3ee',
    description: 'Agent orchestration, retrieval, and LLM application design.',
    skills: [
      { name: 'LLMs and GenAI', level: 95 },
      { name: 'LangGraph / LangChain', level: 92 },
      { name: 'CrewAI / AutoGen', level: 82 },
      { name: 'RAG and Vector DBs', level: 90 },
      { name: 'Transformers', level: 87 },
    ],
  },
  {
    title: 'APIs and Delivery',
    accent: '#f59e0b',
    description: 'Shipping systems that are deployable and maintainable.',
    skills: [
      { name: 'FastAPI / Flask', level: 88 },
      { name: 'Streamlit / Gradio', level: 85 },
      { name: 'MLOps / CI/CD', level: 78 },
      { name: 'Docker / Kubernetes', level: 75 },
      { name: 'Databases', level: 85 },
    ],
  },
]

const chips = [
  'Python',
  'PyTorch',
  'LangGraph',
  'RAG',
  'FastAPI',
  'Docker',
  'Pinecone',
  'TensorFlow',
  'Streamlit',
  'CrewAI',
  'OpenCV',
  'GitHub Actions',
]

export default function Skills() {
  return (
    <section id="skills" className="section-frame">
      <div className="ambient-orb orb-c" style={{ right: '-10%', top: '-6%' }} />

      <div className="section-grid">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.55 }}
          style={{ maxWidth: 760, marginBottom: 28 }}
        >
          <div className="section-kicker" style={{ marginBottom: 18 }}>Capabilities</div>
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            The stack that powers
            <span style={{ display: 'block', background: 'linear-gradient(135deg, #fff 0%, #22d3ee 52%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              the whole machine.
            </span>
          </h2>
          <p className="section-copy" style={{ maxWidth: 640 }}>
            A practical stack across ML, agentic orchestration, APIs, and deployment. Each layer is optimized
            to work together so the end product feels unified.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.55 }}
          className="glass-panel holo-border brutal-panel"
          style={{ borderRadius: 16, padding: 18, marginBottom: 18 }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {chips.map(chip => (
              <span key={chip} className="tag-chip">
                {chip}
              </span>
            ))}
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 18 }}>
          {skillGroups.map((group, index) => (
            <motion.div
              key={group.title}
              className="skill-card glass-panel-strong holo-border brutal-panel"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-120px' }}
              transition={{ duration: 0.65, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              style={{ padding: 22, transform: 'skewX(-0.4deg)' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
                <div>
                  <div className="project-meta" style={{ marginBottom: 10 }}>{group.description}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '-0.04em', marginBottom: 0 }}>{group.title}</h3>
                </div>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: group.accent, boxShadow: `0 0 20px ${group.accent}88`, flexShrink: 0, marginTop: 6 }} />
              </div>

              <div style={{ display: 'grid', gap: 14 }}>
                {group.skills.map(skill => (
                  <div key={skill.name}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                      <span style={{ color: 'rgba(247,249,252,0.86)', fontSize: '0.94rem' }}>{skill.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.1em', color: group.accent }}>
                        {skill.level}%
                      </span>
                    </div>
                    <div className="skill-meter">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true, margin: '-120px' }}
                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                        style={{ width: `${skill.level}%`, background: `linear-gradient(90deg, ${group.accent}, rgba(255,255,255,0.72))` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.55 }}
          className="glass-panel holo-border brutal-panel"
          style={{ borderRadius: 16, padding: 22, marginTop: 18 }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, alignItems: 'center' }}>
            <div>
              <div className="project-meta" style={{ marginBottom: 8 }}>How I work</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', letterSpacing: '-0.04em' }}>
                I like systems that are fast to build, clear to understand, and hard to break.
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Design', 'Build', 'Test', 'Ship'].map(step => (
                <span key={step} className="metric-pill">{step}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
