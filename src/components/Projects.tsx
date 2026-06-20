import { motion, useMotionValue, useTransform, useInView } from 'framer-motion'
import { useState, useRef, useMemo } from 'react'
import { GithubIcon } from './Icons'

const easeSmooth = [0.22, 1, 0.36, 1] as [number, number, number, number]

interface Project {
  title: string
  subtitle: string
  description: string
  tags: string[]
  glowColor: string
  accentColor: string
  accentBg: string
  accentBorder: string
  icon: string
  github: string
  featured: boolean
  metric: string
  metricLabel: string
  image?: string
}

const projects: Project[] = [
  {
    title: 'Hiring Signals & Recruiter Crawler',
    subtitle: 'Autonomous Agentic Scraping Pipeline',
    description:
      'Engineered an end-to-end recruitment crawling pipeline using FastAPI, Celery, and Redis. It fetches jobs from LinkedIn (JobSpy) and ATS (Lever, Greenhouse) with Stealth Playwright fallbacks. The system runs an autonomous enrichment loop using Llama 3.1 8B (via Groq) to extract recruiter profiles, contact details, and synthesize email patterns from crawled pages, backed by automated prompt evaluations.',
    tags: ['FastAPI', 'Celery', 'Redis', 'Llama 3.1', 'Playwright Stealth', 'PostgreSQL', 'Docker'],
    glowColor: 'rgba(6,182,212,0.3)',
    accentColor: '#06B6D4',
    accentBg: 'rgba(6,182,212,0.08)',
    accentBorder: 'rgba(6,182,212,0.22)',
    icon: '🕵️‍♂️',
    github: 'https://github.com/purusottam280',
    featured: true,
    metric: 'LLaMA-3.1',
    metricLabel: 'Entity Parser',
    image: '/hiring_signals.png',
  },
  {
    title: 'Hiring Intelligence & ATS Platform',
    subtitle: 'End-to-End Recruitment Automation',
    description:
      'Built an end-to-end recruitment platform covering resume parsing, ATS scoring, and candidate pipeline management — supporting PDF, DOCX, and scanned image resumes via Groq LLaMA-3.3-70b, Tesseract OCR, and NLP-based fallback mechanisms.',
    tags: ['Groq LLaMA-3.3', 'FastAPI', 'PostgreSQL', 'Docker', 'React', 'Tesseract OCR', 'GitHub Actions'],
    glowColor: 'rgba(99,102,241,0.3)',
    accentColor: '#6366F1',
    accentBg: 'rgba(99,102,241,0.1)',
    accentBorder: 'rgba(99,102,241,0.25)',
    icon: '🤖',
    github: 'https://github.com/purusottam280',
    featured: true,
    metric: 'LLaMA-3.3',
    metricLabel: 'Groq Engine',
  },
  {
    title: 'Multilingual Financial Q&A (RAG)',
    subtitle: 'Cross-lingual Knowledge Retrieval',
    description:
      'Designed a RAG-powered financial document analysis tool using Gemini 2.0 + LangChain + Pinecone to summarize Indian Budget PDFs, with multilingual support across English and 10 Indian languages via SpeechRecognition, gTTS, and Deep Translator.',
    tags: ['Gemini 2.0', 'LangChain', 'Pinecone', 'Streamlit', 'SpeechRecognition', 'gTTS', 'Python'],
    glowColor: 'rgba(6,182,212,0.3)',
    accentColor: '#06B6D4',
    accentBg: 'rgba(6,182,212,0.08)',
    accentBorder: 'rgba(6,182,212,0.22)',
    icon: '🌐',
    github: 'https://github.com/purusottam280',
    featured: true,
    metric: '10+',
    metricLabel: 'Indian Languages',
  },
  {
    title: 'Agentic Travel Itinerary Planner',
    subtitle: 'StateGraph Travel Orchestration',
    description:
      'Engineered a multi-step agentic travel planner using LangGraph and Groq LLaMA-3.1 with specialized nodes for user profile analysis, hotel/place recommendations, cost estimation, and itinerary generation with controlled, multi-hop reasoning.',
    tags: ['LangGraph', 'Groq LLaMA-3.1', 'StateGraph', 'Python', 'Travel Planning'],
    glowColor: 'rgba(139,92,246,0.3)',
    accentColor: '#8B5CF6',
    accentBg: 'rgba(139,92,246,0.08)',
    accentBorder: 'rgba(139,92,246,0.22)',
    icon: '✈️',
    github: 'https://github.com/purusottam280',
    featured: true,
    metric: 'LLaMA 3.1',
    metricLabel: 'Groq Engine',
  },
]


function ProjectCard({ project, index, isVisible }: { project: Project; index: number; isVisible: boolean }) {
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

  // Stable random fly-in configuration for "Avengers Assemble" scroll entrance
  // Uses primary vertical offset with minor horizontal shift to avoid expanding slider width
  const flightConfig = useMemo(() => {
    return {
      x: index % 2 === 0 ? -30 : 30,
      y: 500 + Math.random() * 200,
      rotate: -15 + (index * 10) + (Math.random() * 5),
      scale: 0.75,
    }
  }, [index])

  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          x: flightConfig.x,
          y: flightConfig.y,
          rotate: flightConfig.rotate,
          scale: flightConfig.scale,
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
      animate={isVisible ? "visible" : "hidden"}
      transition={{
        type: 'spring',
        stiffness: 22,
        damping: 12,
        mass: 1.2,
        delay: index * 0.15,
      }}
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
          cursor: 'inherit',
          display: 'flex',
          flexDirection: 'row',
          height: '100%',
        }}
      >
        {/* Colored top stripe */}
        {/* Left Side: Photo or Placeholder */}
        <div style={{
          position: 'relative',
          width: '45%',
          overflow: 'hidden',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
          background: 'rgba(0,0,0,0.2)',
        }}>
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
                transform: hovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 12,
              background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02) 10px, transparent 10px, transparent 20px)'
            }}>
              <span style={{ fontSize: 32 }}>🚧</span>
              <span style={{ 
                fontFamily: 'Space Grotesk, sans-serif', 
                fontSize: 14, 
                color: 'rgba(255,255,255,0.5)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.15em',
                fontWeight: 600
              }}>
                Under Development
              </span>
            </div>
          )}
          {/* Dark gradient overlay on image */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(12,12,22,0.2) 0%, rgba(12,12,22,0.8) 100%)',
          }} />
        </div>

        {/* Card Content (Right Side) */}
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 0, flex: 1, overflowY: 'auto' }}>

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

const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
)

function HiTechSlider() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [sliderHover, setSliderHover] = useState(false)
  const [prevHover, setPrevHover] = useState(false)
  const [nextHover, setNextHover] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const hasDragged = useRef(false)

  // Detect when the entire slider wrapper is in view to trigger the card animations!
  const containerRef = useRef<HTMLDivElement>(null)
  const isVisible = useInView(containerRef, { once: true, margin: '-100px' })

  const handleScroll = () => {
    if (!scrollRef.current || isDown.current) return
    const currentScrollLeft = scrollRef.current.scrollLeft
    const width = scrollRef.current.clientWidth
    const index = Math.round(currentScrollLeft / width)
    if (index !== activeIdx && index >= 0 && index < projects.length) {
      setActiveIdx(index)
    }
  }

  const onMouseDown = (e: React.MouseEvent) => {
    // Only drag with left click, and don't drag if clicking buttons/links
    const target = e.target as HTMLElement
    if (target.closest('a') || target.closest('button')) return
    if (e.button !== 0) return

    isDown.current = true
    hasDragged.current = false
    if (!scrollRef.current) return
    
    startX.current = e.pageX - scrollRef.current.offsetLeft
    scrollLeft.current = scrollRef.current.scrollLeft
    
    // Disable scroll snap and smooth scrolling for instant response during drag
    scrollRef.current.style.scrollSnapType = 'none'
    scrollRef.current.style.scrollBehavior = 'auto'
    setIsDragging(true)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return
    e.preventDefault()
    
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5 // speed multiplier
    
    if (Math.abs(walk) > 5) {
      hasDragged.current = true
    }
    
    scrollRef.current.scrollLeft = scrollLeft.current - walk
  }

  const snapToNearest = () => {
    if (!scrollRef.current) return
    
    // Re-enable smooth scroll and scroll snap
    scrollRef.current.style.scrollBehavior = 'smooth'
    scrollRef.current.style.scrollSnapType = 'x mandatory'
    
    const currentScrollLeft = scrollRef.current.scrollLeft
    const width = scrollRef.current.clientWidth
    
    const index = Math.round(currentScrollLeft / width)
    const targetIdx = Math.max(0, Math.min(projects.length - 1, index))
    
    scrollRef.current.scrollTo({ left: targetIdx * width, behavior: 'smooth' })
    setActiveIdx(targetIdx)
  }

  const onMouseUp = () => {
    if (!isDown.current) return
    isDown.current = false
    setIsDragging(false)
    snapToNearest()
  }

  const onMouseLeave = () => {
    if (!isDown.current) return
    isDown.current = false
    setIsDragging(false)
    snapToNearest()
  }

  const onClickCapture = (e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault()
      e.stopPropagation()
      hasDragged.current = false
    }
  }

  const handlePrev = () => {
    if (!scrollRef.current) return
    const nextIdx = Math.max(0, activeIdx - 1)
    const width = scrollRef.current.clientWidth
    scrollRef.current.scrollTo({ left: nextIdx * width, behavior: 'smooth' })
    setActiveIdx(nextIdx)
  }

  const handleNext = () => {
    if (!scrollRef.current) return
    const nextIdx = Math.min(projects.length - 1, activeIdx + 1)
    const width = scrollRef.current.clientWidth
    scrollRef.current.scrollTo({ left: nextIdx * width, behavior: 'smooth' })
    setActiveIdx(nextIdx)
  }

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setSliderHover(true)}
      onMouseLeave={() => setSliderHover(false)}
      style={{ 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        position: 'relative',
        userSelect: isDragging ? 'none' : 'auto',
      }}
    >
      
      {/* Scrollable Container */}
      <style>{`
        .project-slider::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onClickCapture={onClickCapture}
        className="project-slider"
        style={{
          width: '100%',
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          padding: '0 24px', // padding on left and right
          gap: 24, // space between cards
          paddingBottom: 20,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {projects.map((project, i) => (
          <div 
            key={project.title}
            style={{
              flex: '0 0 calc(100% - 48px)', // full width minus padding
              scrollSnapAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              height: 480,
            }}
          >
            <ProjectCard project={project} index={i} isVisible={isVisible} />
          </div>
        ))}
      </div>

      {/* Navigation Buttons (Desktop only or visible on hover/touch) */}
      <button 
        onClick={handlePrev}
        disabled={activeIdx === 0}
        onMouseEnter={() => setPrevHover(true)}
        onMouseLeave={() => setPrevHover(false)}
        style={{
          position: 'absolute',
          left: '12px',
          top: '240px', // vertically centered over the 480px height slider
          transform: `translateY(-50%) scale(${sliderHover ? 1 : 0.95})`,
          zIndex: 10,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: prevHover && activeIdx !== 0 ? 'rgba(99, 102, 241, 0.25)' : 'rgba(18, 18, 30, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: `1px solid ${prevHover && activeIdx !== 0 ? 'rgba(99, 102, 241, 0.45)' : 'rgba(255, 255, 255, 0.08)'}`,
          color: activeIdx === 0 ? 'rgba(255, 255, 255, 0.15)' : '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: activeIdx === 0 ? 'not-allowed' : 'pointer',
          opacity: activeIdx === 0 ? 0.15 : (sliderHover ? 1 : 0.4),
          pointerEvents: activeIdx === 0 ? 'none' : 'auto',
          transition: 'all 0.3s ease',
          boxShadow: prevHover && activeIdx !== 0 ? '0 0 15px rgba(99, 102, 241, 0.3)' : '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <ChevronLeftIcon />
      </button>

      <button 
        onClick={handleNext}
        disabled={activeIdx === projects.length - 1}
        onMouseEnter={() => setNextHover(true)}
        onMouseLeave={() => setNextHover(false)}
        style={{
          position: 'absolute',
          right: '12px',
          top: '240px',
          transform: `translateY(-50%) scale(${sliderHover ? 1 : 0.95})`,
          zIndex: 10,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: nextHover && activeIdx !== projects.length - 1 ? 'rgba(99, 102, 241, 0.25)' : 'rgba(18, 18, 30, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: `1px solid ${nextHover && activeIdx !== projects.length - 1 ? 'rgba(99, 102, 241, 0.45)' : 'rgba(255, 255, 255, 0.08)'}`,
          color: activeIdx === projects.length - 1 ? 'rgba(255, 255, 255, 0.15)' : '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: activeIdx === projects.length - 1 ? 'not-allowed' : 'pointer',
          opacity: activeIdx === projects.length - 1 ? 0.15 : (sliderHover ? 1 : 0.4),
          pointerEvents: activeIdx === projects.length - 1 ? 'none' : 'auto',
          transition: 'all 0.3s ease',
          boxShadow: nextHover && activeIdx !== projects.length - 1 ? '0 0 15px rgba(99, 102, 241, 0.3)' : '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <ChevronRightIcon />
      </button>

      {/* Dots Indicator (Moved outside the overflow container to not be hidden) */}
      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        {projects.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: activeIdx === i ? 24 : 8,
              backgroundColor: activeIdx === i ? '#6366F1' : 'rgba(255,255,255,0.2)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              height: 8,
              borderRadius: 4,
              cursor: 'pointer',
            }}
            onClick={() => {
              if (scrollRef.current) {
                const width = scrollRef.current.clientWidth
                // Scroll to the specific card
                scrollRef.current.scrollTo({ left: i * width, behavior: 'smooth' })
                setActiveIdx(i)
              }
            }}
          />
        ))}
      </div>
    </div>
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

        {/* ── Cards Slider ─────────────────────────────────── */}
        <HiTechSlider />

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
