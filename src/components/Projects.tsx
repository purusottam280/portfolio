import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { GithubIcon } from './Icons'

type Project = {
  title: string
  subtitle: string
  description: string
  tags: string[]
  accent: string
  metric: string
  metricLabel: string
  image: string
  index: string
}

const projects: Project[] = [
  {
    title: 'Hiring Signals',
    subtitle: 'Autonomous intelligence pipeline',
    description: 'A recruitment intelligence engine that crawls, enriches, and parses hiring data across job boards and ATS platforms.',
    tags: ['FastAPI', 'Celery', 'Redis', 'Playwright', 'PostgreSQL'],
    accent: '#e9ff4b',
    metric: 'LLaMA 3.1',
    metricLabel: 'entity parser',
    image: '/hiring_signals.png',
    index: '01',
  },
  {
    title: 'Hiring Intelligence',
    subtitle: 'Recruitment operating system',
    description: 'A resilient ATS platform for resume parsing, scoring, OCR, and candidate pipeline decisions with LLM-grade context.',
    tags: ['Groq', 'FastAPI', 'React', 'Tesseract', 'GitHub Actions'],
    accent: '#ff5a1f',
    metric: 'LLaMA 3.3',
    metricLabel: 'inference engine',
    image: '/profile.jpg',
    index: '02',
  },
  {
    title: 'Multilingual Finance',
    subtitle: 'Cross-language retrieval engine',
    description: 'A RAG analysis tool for budget data that serves voice and text answers across English and Indian languages.',
    tags: ['Gemini 2.0', 'LangChain', 'Pinecone', 'gTTS', 'Python'],
    accent: '#ffdd00',
    metric: '10+',
    metricLabel: 'languages',
    image: '/hiring_signals.png',
    index: '03',
  },
  {
    title: 'Agentic Travel',
    subtitle: 'StateGraph orchestration',
    description: 'A multi-step itinerary engine that reasons through profiles, budget logic, destination ranking, and controlled actions.',
    tags: ['LangGraph', 'Groq', 'Python', 'StateGraph', 'Travel AI'],
    accent: '#fc314d',
    metric: 'Multi-step',
    metricLabel: 'planning flow',
    image: '/profile.jpg',
    index: '04',
  },
]

const deckVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 110 : -110, rotate: direction > 0 ? 2 : -2, scale: 0.96 }),
  center: { opacity: 1, x: 0, rotate: 0, scale: 1 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -90 : 90, rotate: direction > 0 ? -1.5 : 1.5, scale: 0.98 }),
}

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const scanRef = useRef<HTMLDivElement>(null)
  const project = projects[activeIndex]

  useEffect(() => {
    if (!scanRef.current) return
    animate(scanRef.current, {
      x: ['-110%', '110%'],
      opacity: [0, 0.85, 0],
      duration: 620,
      ease: 'out(4)',
    })
  }, [activeIndex])

  const changeProject = (nextDirection: number) => {
    setDirection(nextDirection)
    setActiveIndex(current => (current + nextDirection + projects.length) % projects.length)
  }

  return (
    <section id="projects" className="section-frame">
      <div className="ambient-orb orb-a" style={{ left: '-12%', top: '0%' }} />
      <div className="ambient-orb orb-b" style={{ right: '-12%', bottom: '-10%' }} />

      <div className="section-grid">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 24, flexWrap: 'wrap', marginBottom: 34 }}>
          <div style={{ maxWidth: 720 }}>
            <div className="section-kicker" style={{ marginBottom: 18 }}>Selected work / live archive</div>
            <h2 className="section-title">
              SYSTEMS THAT
              <span style={{ display: 'block', color: 'var(--accent)' }}>DON'T SIT STILL.</span>
            </h2>
          </div>
          <div className="data-strip">Archive / {String(activeIndex + 1).padStart(2, '0')} of {projects.length}</div>
        </div>

        <div className="project-deck brutal-panel">
          <div ref={scanRef} className="project-deck-scan" aria-hidden="true" />
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.article
              key={project.index}
              custom={direction}
              variants={deckVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 135, damping: 19, mass: 0.86 }}
              className="project-deck-content"
            >
              <div className="project-deck-image">
                <img src={project.image} alt={project.title} />
                <div className="project-deck-image-shade" />
                <div className="project-deck-index">{project.index}</div>
                <div className="project-deck-caption">classified build / {project.subtitle}</div>
              </div>

              <div className="project-deck-copy">
                <div className="project-meta" style={{ color: project.accent }}>{project.subtitle}</div>
                <h3 className="project-title project-deck-title">{project.title}</h3>
                <p className="section-copy">{project.description}</p>

                <div className="project-deck-metric" style={{ borderColor: `${project.accent}88` }}>
                  <span>{project.metric}</span>
                  <small>{project.metricLabel}</small>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {project.tags.map(tag => <span key={tag} className="tag-chip">{tag}</span>)}
                </div>

                <a href="https://github.com/purusottam280" target="_blank" rel="noopener noreferrer" className="project-deck-source">
                  <GithubIcon size={16} color="currentColor" /> Inspect source
                </a>
              </div>
            </motion.article>
          </AnimatePresence>

          <div className="project-deck-controls">
            <button type="button" onClick={() => changeProject(-1)} aria-label="Show previous project"><ArrowLeft size={20} /></button>
            <div className="project-deck-dots" aria-label="Project selection">
              {projects.map((item, index) => (
                <button
                  key={item.index}
                  type="button"
                  aria-label={`Show ${item.title}`}
                  className={index === activeIndex ? 'active' : ''}
                  onClick={() => {
                    setDirection(index > activeIndex ? 1 : -1)
                    setActiveIndex(index)
                  }}
                >
                  {item.index}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => changeProject(1)} aria-label="Show next project"><ArrowRight size={20} /></button>
          </div>
        </div>
      </div>
    </section>
  )
}
