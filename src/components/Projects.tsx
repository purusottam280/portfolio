import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from 'lucide-react'
import { GithubIcon } from './Icons'
import { SCRUB, gsap, ScrollTrigger, prefersReducedMotion, registerScene, scrollState } from '../lib/scroll'
import { REVEAL, revealGroup } from '../lib/reveal'
import { initTilt } from '../lib/tilt'

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
    image: '/hiring_signals.webp',
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
    image: '/hiring_intelligence.webp',
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
    image: '/multilingual_finance.webp',
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
    image: '/agentic_travel.webp',
    index: '04',
  },
]

export default function Projects() {
  const scope = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => registerScene(scope.current, { index: '05', label: 'Archive' }), [])
  // tilt the body, not .project-panel (its rotateY is a scroll scrub)
  useEffect(() => initTilt(scope.current, '.project-body'), [])

  useGSAP(
    () => {
      if (prefersReducedMotion() || !trackRef.current) return
      const mm = gsap.matchMedia()

      mm.add('(min-width: 901px)', () => {
        const track = trackRef.current
        if (!track) return
        const distance = () => track.scrollWidth - window.innerWidth

        const tween = gsap.to(track, { x: () => -distance(), ease: 'none' })

        const st = ScrollTrigger.create({
          trigger: scope.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: SCRUB,
          animation: tween,
          invalidateOnRefresh: true,
          onUpdate: self => {
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`
            if (counterRef.current) {
              const n = Math.min(projects.length, Math.floor(self.progress * projects.length) + 1)
              counterRef.current.textContent = String(n).padStart(2, '0')
            }
          },
        })

        // velocity skew on the horizontal track (the one place kinetic skew lives); writes only while it moves
        const skewSet = gsap.quickSetter(track, 'skewX', 'deg') as (v: number) => void
        let skew = 0
        let written = 0
        const tick = () => {
          const target = gsap.utils.clamp(-6, 6, scrollState.velocity * 0.08)
          skew += (target - skew) * 0.1
          if (Math.abs(skew) < 0.005) skew = 0
          if (Math.abs(skew - written) < 0.005) return
          written = skew
          skewSet(skew)
        }
        gsap.ticker.add(tick)

        // each panel swings in from 3D space, settles, then leans away as it exits
        gsap.utils.toArray<HTMLElement>('.project-panel').forEach(panel => {
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 100%', end: 'right 0%', scrub: true },
          })
          tl.fromTo(panel, { rotateY: 18, scale: 0.9, opacity: 0.55 }, { rotateY: 0, scale: 1, opacity: 1, duration: 0.38 }, 0)
            .to(panel, { rotateY: -12, scale: 0.94, opacity: 0.7, duration: 0.38 }, 0.62)

          const img = panel.querySelector<HTMLElement>('.project-media img')
          if (img) {
            gsap.fromTo(
              img,
              { xPercent: 6, scale: 1.18 },
              {
                xPercent: -12,
                scale: 1.02,
                ease: 'none',
                scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
              }
            )
          }

          const body = panel.querySelector<HTMLElement>('.project-body')
          if (body) {
            gsap.fromTo(
              body.children,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                stagger: 0.05,
                ease: 'none',
                scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 85%', end: 'left 30%', scrub: true },
              }
            )
          }
        })

        return () => {
          gsap.ticker.remove(tick)
          st.kill()
        }
      })

      mm.add('(max-width: 900px)', () => {
        gsap.utils.toArray<HTMLElement>('.project-panel').forEach(panel => {
          gsap.from(panel, {
            y: REVEAL.y * 2,
            opacity: 0,
            duration: REVEAL.duration,
            ease: REVEAL.ease,
            scrollTrigger: { trigger: panel, start: REVEAL.start },
          })
        })
      })

      revealGroup('.projects-head > *', '.projects-head')
    },
    { scope }
  )

  return (
    <section id="projects" className="projects" ref={scope}>
      <div className="projects-head">
        <div>
          <span className="kicker">
            <span className="kicker-index">005</span> Selected work
          </span>
          <h2 className="display-lg" style={{ marginTop: 16 }}>
            Systems that <span className="accent-text">don't sit still.</span>
          </h2>
        </div>
        <div className="projects-head-meta">
          <span className="projects-counter">
            <span ref={counterRef}>01</span>
            <span className="projects-counter-sep">/</span>
            <span>{String(projects.length).padStart(2, '0')}</span>
          </span>
          <span className="mono-meta projects-hint">Scroll to traverse →</span>
        </div>
      </div>

      <div className="projects-stage">
        <div className="projects-track" ref={trackRef}>
          {projects.map(project => (
            <article key={project.index} className="project-panel" style={{ '--accent-p': project.accent } as React.CSSProperties}>
              <div className="project-index">{project.index}</div>
              <div className="project-media" data-cursor="View">
                <img src={project.image} alt={project.title} loading="eager" decoding="async" />
                <div className="project-media-shade" />
                <div className="project-media-caption mono-meta">Classified build / {project.subtitle}</div>
              </div>
              <div className="project-body">
                <span className="mono-meta" style={{ color: project.accent }}>
                  {project.subtitle}
                </span>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map(tag => (
                    <span key={tag} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="project-metric">
                  <strong>{project.metric}</strong>
                  <span className="mono-meta">{project.metricLabel}</span>
                </div>
                <a className="project-link" href="https://github.com/purusottam280" target="_blank" rel="noopener noreferrer" data-cursor="Open">
                  <GithubIcon size={15} /> Inspect source <ArrowUpRight size={14} className="btn-arrow" />
                </a>
              </div>
            </article>
          ))}

          <article className="project-panel-end">
            <span className="mono-meta">End of archive</span>
            <h3 className="display-md">More on GitHub.</h3>
            <a className="btn btn-line" href="https://github.com/purusottam280" target="_blank" rel="noopener noreferrer" data-cursor="Open">
              <GithubIcon size={15} /> github.com/purusottam280
            </a>
          </article>
        </div>
      </div>

      <div className="projects-progress-wrap">
        <div className="projects-progress">
          <div className="projects-progress-fill" ref={progressRef} />
        </div>
      </div>
    </section>
  )
}
