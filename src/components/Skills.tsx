import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

const easeSmooth = [0.22, 1, 0.36, 1] as [number, number, number, number]

const skillGroups = [
  {
    category: 'Foundations & ML',
    color: '#6366F1',
    bg: 'rgba(99,102,241,0.06)',
    border: 'rgba(99,102,241,0.15)',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'ML & Data Analysis (NumPy, Pandas, Scikit-learn)', level: 90 },
      { name: 'Deep Learning (PyTorch, TensorFlow)', level: 82 },
      { name: 'Computer Vision (OpenCV, YOLO)', level: 83 },
      { name: 'NLP (SpaCy, NLTK)', level: 85 },
    ],
  },
  {
    category: 'GenAI & Agentic Systems',
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.05)',
    border: 'rgba(6,182,212,0.15)',
    skills: [
      { name: 'LLMs & GenAI (GPT-4, LLaMA, Gemini)', level: 95 },
      { name: 'LangGraph / LangChain', level: 92 },
      { name: 'CrewAI / AutoGen', level: 82 },
      { name: 'RAG & Vector Databases (Pinecone, ChromaDB)', level: 90 },
      { name: 'Hugging Face Transformers', level: 87 },
    ],
  },
  {
    category: 'Web, APIs & MLOps',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.05)',
    border: 'rgba(139,92,246,0.15)',
    skills: [
      { name: 'FastAPI / Flask', level: 88 },
      { name: 'Streamlit / Gradio', level: 85 },
      { name: 'MLOps & CI/CD (MLflow, GitHub Actions)', level: 78 },
      { name: 'Docker / Kubernetes', level: 75 },
      { name: 'Databases (MySQL, PostgreSQL, Git)', level: 85 },
    ],
  },
]

const orbSkills = [
  { name: 'Python', color: '#6366F1', size: 70, delay: 0 },
  { name: 'PyTorch', color: '#EF4444', size: 65, delay: 0.4 },
  { name: 'YOLOv8', color: '#F97316', size: 62, delay: 0.8 },
  { name: 'HuggingFace', color: '#FBBF24', size: 60, delay: 1.2 },
  { name: 'GPT-4', color: '#8B5CF6', size: 64, delay: 0.2 },
  { name: 'LangGraph', color: '#6366F1', size: 72, delay: 0.6 },
  { name: 'CrewAI', color: '#8B5CF6', size: 62, delay: 1.0 },
  { name: 'RAG', color: '#06B6D4', size: 68, delay: 0.3 },
  { name: 'ChromaDB', color: '#6366F1', size: 58, delay: 0.7 },
  { name: 'FastAPI', color: '#06B6D4', size: 60, delay: 1.1 },
  { name: 'Streamlit', color: '#06B6D4', size: 60, delay: 0.5 },
  { name: 'Docker', color: '#06B6D4', size: 58, delay: 0.9 },
]

function SkillOrb({ orb, index }: { orb: typeof orbSkills[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      className="skill-orb"
      style={{
        width: hovered ? orb.size * 1.18 : orb.size,
        height: hovered ? orb.size * 1.18 : orb.size,
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
        color: '#fff',
        fontSize: hovered ? '0.68rem' : '0.6rem',
        background: `radial-gradient(circle at 35% 35%, ${orb.color}55, ${orb.color}22)`,
        border: `1px solid ${orb.color}44`,
        boxShadow: hovered ? `0 0 28px ${orb.color}60, 0 0 56px ${orb.color}20` : `0 0 10px ${orb.color}30`,
        animationDelay: `${orb.delay}s`,
        cursor: 'default',
        transition: 'width 0.3s ease, height 0.3s ease, box-shadow 0.3s ease, font-size 0.3s ease',
        willChange: 'transform',
        flexShrink: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 200, damping: 20 }}
    >
      {orb.name}
    </motion.div>
  )
}

function ProgressBar({ skill, color, isVisible }: { skill: { name: string; level: number }; color: string; isVisible: boolean }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(220,220,235,0.8)', fontWeight: 500 }}>
          {skill.name}
        </span>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color, fontWeight: 600 }}>
          {skill.level}%
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div
          className="progress-bar-fill"
          style={{
            width: isVisible ? `${skill.level}%` : '0%',
            background: `linear-gradient(90deg, ${color}, ${color}99)`,
            boxShadow: `0 0 8px ${color}55`,
          }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  const progressRef = useRef<HTMLDivElement>(null)
  const isVisible = useInView(progressRef, { once: true, margin: '-100px' })

  return (
    <section
      id="skills"
      style={{ position: 'relative', padding: '112px 24px', overflow: 'hidden' }}
    >
      <div
        className="aurora-orb"
        style={{
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
          top: '5%', right: '-5%',
          animation: 'auroraFloat3 24s ease-in-out infinite',
        }}
      />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Section Header (centered) ─── */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: 64 }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: easeSmooth }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 24, height: 1, background: 'rgba(99,102,241,0.5)' }} />
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase' as const,
              background: 'linear-gradient(90deg, #6366F1, #06B6D4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Skills</span>
            <div style={{ width: 24, height: 1, background: 'rgba(6,182,212,0.5)' }} />
          </div>

          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 16,
          }}>
            The tech stack{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              powering my work
            </span>
          </h2>

          <div style={{
            width: 56, height: 3,
            background: 'linear-gradient(90deg, #6366F1, #06B6D4)',
            borderRadius: 2, margin: '0 auto',
            boxShadow: '0 0 10px rgba(99,102,241,0.5)',
          }} />
        </motion.div>

        {/* ── Floating Orbs ─── */}
        <motion.div
          style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 72 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {orbSkills.map((orb, i) => (
            <SkillOrb key={orb.name} orb={orb} index={i} />
          ))}
        </motion.div>

        {/* ── Progress Bars ─── */}
        <div
          ref={progressRef}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}
        >
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.category}
              style={{
                background: 'rgba(13,13,22,0.85)',
                border: `1px solid ${group.border}`,
                borderRadius: 20,
                padding: '28px 24px',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.15, duration: 0.6, ease: easeSmooth }}
            >
              {/* Category header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{
                  width: 4, height: 22, borderRadius: 2,
                  background: `linear-gradient(180deg, ${group.color}, ${group.color}44)`,
                }} />
                <h3 style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 15, fontWeight: 600, color: '#fff',
                }}>
                  {group.category}
                </h3>
              </div>

              {group.skills.map(skill => (
                <ProgressBar key={skill.name} skill={skill} color={group.color} isVisible={isVisible} />
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
