import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useState, useRef } from 'react'
import { GithubIcon } from './Icons'

const easeSmooth = [0.22, 1, 0.36, 1] as [number, number, number, number]

const projects = [
  {
    title: 'LangGraph ATS System',
    subtitle: 'Autonomous Recruitment Intelligence',
    description:
      'Autonomous Applicant Tracking System powered by LangGraph agents — resume parsing, candidate ranking, interview generation, and personalized feedback with zero human intervention.',
    tags: ['LangGraph', 'Python', 'FastAPI', 'LLM', 'Multi-Agent', 'PostgreSQL'],
    glowColor: 'rgba(99,102,241,0.3)',
    accentColor: '#6366F1',
    accentBg: 'rgba(99,102,241,0.1)',
    accentBorder: 'rgba(99,102,241,0.25)',
    icon: '🤖',
    github: 'https://github.com/purusottam280',
    featured: true,
    metric: '6+',
    metricLabel: 'Agents',
  },
  {
    title: 'Multilingual RAG Pipeline',
    subtitle: 'Cross-lingual Knowledge Retrieval',
    description:
      'Production-grade RAG system with hybrid BM25 + dense retrieval, cross-lingual re-ranking, and knowledge graph for complex multi-hop reasoning across 12+ languages.',
    tags: ['RAG', 'LangChain', 'ChromaDB', 'FastAPI', 'Transformers', 'Docker'],
    glowColor: 'rgba(6,182,212,0.3)',
    accentColor: '#06B6D4',
    accentBg: 'rgba(6,182,212,0.08)',
    accentBorder: 'rgba(6,182,212,0.22)',
    icon: '🌐',
    github: 'https://github.com/purusottam280',
    featured: true,
    metric: '12+',
    metricLabel: 'Languages',
  },
  {
    title: 'Multi-Agent Travel Planner',
    subtitle: 'Collaborative Agent Orchestration',
    description:
      'Orchestrated travel planning with specialized agents — flight researcher, hotel curator, itinerary builder, and budget optimizer delivering complete travel plans autonomously.',
    tags: ['CrewAI', 'GPT-4', 'Serper API', 'Streamlit', 'LangChain', 'Python'],
    glowColor: 'rgba(139,92,246,0.3)',
    accentColor: '#8B5CF6',
    accentBg: 'rgba(139,92,246,0.08)',
    accentBorder: 'rgba(139,92,246,0.22)',
    icon: '✈️',
    github: 'https://github.com/purusottam280',
    featured: false,
    metric: '4',
    metricLabel: 'Agents',
  },
  {
    title: 'Smart Surveillance AI',
    subtitle: 'Real-time Vision Intelligence',
    description:
      'Real-time computer vision surveillance with YOLOv8 detection, DeepSORT multi-object tracking, and LLM-powered natural language anomaly narration.',
    tags: ['YOLOv8', 'OpenCV', 'DeepSORT', 'FastAPI', 'WebSocket', 'LLM'],
    glowColor: 'rgba(249,115,22,0.28)',
    accentColor: '#F97316',
    accentBg: 'rgba(249,115,22,0.07)',
    accentBorder: 'rgba(249,115,22,0.2)',
    icon: '👁️',
    github: 'https://github.com/purusottam280',
    featured: false,
    metric: '30+',
    metricLabel: 'FPS',
  },
]

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useTransform(my, [-0.5, 0.5], [4, -4])
  const rotateY = useTransform(mx, [-0.5, 0.5], [-4, 4])

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onMouseLeave = () => {
    mx.set(0); my.set(0); setHovered(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.12, duration: 0.65, ease: easeSmooth }}
      style={{ perspective: '1200px' }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          borderRadius: 20,
          background: 'linear-gradient(145deg, rgba(18,18,30,0.95) 0%, rgba(12,12,22,0.98) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: `1px solid ${hovered ? project.accentBorder : 'rgba(255,255,255,0.07)'}`,
          boxShadow: hovered
            ? `0 0 40px ${project.glowColor}, 0 20px 60px rgba(0,0,0,0.5)`
            : '0 2px 20px rgba(0,0,0,0.4)',
          transition: 'border-color 0.3s ease, box-shadow 0.35s ease',
          overflow: 'hidden',
          cursor: 'default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* Colored top stripe */}
        <div style={{
          height: 3,
          background: hovered
            ? `linear-gradient(90deg, ${project.accentColor}, transparent 80%)`
            : `linear-gradient(90deg, rgba(255,255,255,0.1), transparent 80%)`,
          transition: 'background 0.4s ease',
        }} />

        {/* Card Content */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>

          {/* ROW 1: Icon | Metric + Featured badge */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
            {/* Icon */}
            <div style={{
              width: 50, height: 50,
              borderRadius: 14,
              background: project.accentBg,
              border: `1px solid ${project.accentBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
              flexShrink: 0,
            }}>
              {project.icon}
            </div>

            {/* Right side: metric + badge */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              {project.featured && (
                <span style={{
                  fontSize: 10,
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: project.accentColor,
                  background: project.accentBg,
                  border: `1px solid ${project.accentBorder}`,
                  borderRadius: 20,
                  padding: '3px 10px',
                }}>
                  ★ Featured
                </span>
              )}
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: 22, fontWeight: 700,
                  fontFamily: 'Space Grotesk, sans-serif',
                  color: project.accentColor,
                  lineHeight: 1,
                }}>
                  {project.metric}
                </div>
                <div style={{
                  fontSize: 10, color: 'rgba(161,161,170,0.5)',
                  fontFamily: 'Inter, sans-serif', marginTop: 2,
                }}>
                  {project.metricLabel}
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: Title */}
          <h3 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 20,
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: 4,
            lineHeight: 1.25,
          }}>
            {project.title}
          </h3>

          {/* ROW 3: Subtitle */}
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: project.accentColor,
            opacity: 0.85,
            marginBottom: 14,
          }}>
            {project.subtitle}
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 14 }} />

          {/* ROW 4: Description */}
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 13.5,
            lineHeight: 1.7,
            color: 'rgba(195,195,210,0.72)',
            marginBottom: 18,
            flex: 1,
          }}>
            {project.description}
          </p>

          {/* ROW 5: Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
            {project.tags.map((tag, ti) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 + ti * 0.04, duration: 0.25 }}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: 'rgba(200,200,215,0.65)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 7,
                  padding: '4px 10px',
                  whiteSpace: 'nowrap',
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* ROW 6: Footer links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                fontWeight: 500,
                color: 'rgba(161,161,170,0.6)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(161,161,170,0.6)')}
            >
              <GithubIcon size={14} color="currentColor" />
              View Source
            </a>

            <span style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              fontWeight: 500,
              color: 'rgba(161,161,170,0.35)',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8,
              padding: '5px 12px',
            }}>
              ↗ In Progress
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  return (
    <section
      id="projects"
      style={{
        position: 'relative',
        paddingTop: 112,
        paddingBottom: 112,
        paddingLeft: 24,
        paddingRight: 24,
        overflow: 'hidden',
      }}
    >
      {/* Aurora orb */}
      <div
        className="aurora-orb"
        style={{
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
          top: '5%', left: '-12%',
          animation: 'auroraFloat1 22s ease-in-out infinite',
        }}
      />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Section Header ─────────────────────────────── */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: 64 }}
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: easeSmooth }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
          }}>
            <div style={{ width: 24, height: 1, background: 'rgba(99,102,241,0.5)' }} />
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              background: 'linear-gradient(90deg, #6366F1, #06B6D4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Selected Work
            </span>
            <div style={{ width: 24, height: 1, background: 'rgba(6,182,212,0.5)' }} />
          </div>

          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.15,
            marginBottom: 16,
          }}>
            Autonomous systems{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              built to impress
            </span>
          </h2>

          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 15,
            color: 'rgba(161,161,170,0.6)',
            maxWidth: 480,
            margin: '0 auto 24px',
            lineHeight: 1.6,
          }}>
            End-to-end AI products across agentic workflows,
            retrieval pipelines, and computer vision.
          </p>

          {/* Centered underline divider */}
          <div style={{
            width: 56,
            height: 3,
            background: 'linear-gradient(90deg, #6366F1, #06B6D4)',
            borderRadius: 2,
            margin: '0 auto',
            boxShadow: '0 0 10px rgba(99,102,241,0.5)',
          }} />
        </motion.div>

        {/* ── Cards Grid ─────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 20,
        }}>
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        {/* ── GitHub CTA ─────────────────────────────────── */}
        <motion.div
          style={{ textAlign: 'center', marginTop: 48 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <a
            href="https://github.com/purusottam280"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.7)',
              background: 'rgba(99,102,241,0.07)',
              border: '1px solid rgba(99,102,241,0.18)',
              borderRadius: 12,
              padding: '12px 24px',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(99,102,241,0.14)'
              el.style.borderColor = 'rgba(99,102,241,0.35)'
              el.style.color = '#fff'
              el.style.boxShadow = '0 0 24px rgba(99,102,241,0.2)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(99,102,241,0.07)'
              el.style.borderColor = 'rgba(99,102,241,0.18)'
              el.style.color = 'rgba(255,255,255,0.7)'
              el.style.boxShadow = 'none'
            }}
          >
            <GithubIcon size={16} color="currentColor" />
            Explore all projects on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  )
}
