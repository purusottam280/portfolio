import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { SCRUB, gsap, prefersReducedMotion, registerScene } from '../lib/scroll'
import { REVEAL, revealEach } from '../lib/reveal'
import { splitLines } from '../lib/text'
import { initTilt } from '../lib/tilt'

type Project = {
  name: string
  period: string
  blurb: string
  tags: string[]
}

type Role = {
  index: string
  company: string
  title: string
  period: string
  mode: string
  live: boolean
  summary: string
  points: string[]
  projects?: Project[]
  stack: string[]
}

const roles: Role[] = [
  {
    index: '01',
    company: 'Handshake AI',
    title: 'AI Benchmark Task Author — Projects Dynamo & Insight',
    period: 'Jul 2026 — Present',
    mode: 'Contract / Remote · since 12 Jul 2026',
    live: true,
    summary:
      'Authoring frontier coding benchmarks that measure how well AI agents do real professional work in a terminal. Every task ships as a Dockerized environment with a concise brief, a reference solution, and hardened behavioural verifiers.',
    points: [
      'Design tasks that pass the pen-and-paper test: multi-step problems a domain expert would be paid to solve, never refactors, bug fixes, or one-shot generations.',
      'Write reference solutions and pytest verifiers that test behaviour only, with fork-isolated workers and CI workflows for validation, trial runs, and review.',
      'Score every task against the programme rubric and diversity taxonomy so difficulty comes from expertise, never from ambiguity.',
      'Shipped 40+ task repositories across ML serving, formal reasoning, hardware CAD and RTL, chemistry, applied mathematics, geosciences, materials, and operations research.',
    ],
    projects: [
      {
        name: 'Project Dynamo',
        period: 'Jul 2026 →',
        blurb:
          'Agentic coding benchmark tasks. Example: a deadline-aware, idempotent dynamic batch router with tenant fairness, cancellation, and drain-safe model hot reloads for a multi-model inference gateway.',
        tags: ['ML serving', 'asyncio', 'Computational geometry', 'Release management'],
      },
      {
        name: 'Project Insight',
        period: 'Sep 2026 →',
        blurb:
          'Terminal-Bench 3 (Frontier Bench) tasks rooted in paid professional work across STEM, operations, and media domains, taken from draft through CI to Ready-to-Deliver. Joined 12 Sep 2026.',
        tags: ['Hardware CAD / RTL', 'Chemistry', 'Applied maths', 'Geosciences', 'Operations research'],
      },
    ],
    stack: ['Python', 'pytest', 'Docker', 'GitHub Actions', 'Benchmark Design', 'Terminal-Bench'],
  },
  {
    index: '02',
    company: 'Intellativ India Pvt Ltd',
    title: 'Associate — Hiring Intelligence & ATS Automation',
    period: 'Feb 2026 — Present',
    mode: 'Full-time',
    live: true,
    summary:
      'End-to-end recruitment platform covering resume parsing, ATS scoring, and candidate pipeline management with LLM-grade context.',
    points: [
      'Supported PDF, DOCX, and scanned resumes via Groq LLaMA-3.3-70b, Tesseract OCR, and NLP fallback mechanisms.',
      'Designed scalable backend services with FastAPI, async SQLAlchemy, and PostgreSQL as Dockerized microservices.',
      'Implemented ATS matching and candidate ranking through semantic similarity, keyword extraction, and GenAI evaluation workflows.',
      'Shipped CI/CD via GitHub Actions with Docker + NGINX deployment on DigitalOcean, plus a React + Vite recruiter dashboard.',
    ],
    stack: ['Groq LLaMA-3.3', 'FastAPI', 'PostgreSQL', 'Docker', 'React', 'GitHub Actions'],
  },
]

export default function Experience() {
  const scope = useRef<HTMLElement>(null)

  useEffect(() => registerScene(scope.current, { index: '04', label: 'Experience' }), [])
  useEffect(() => initTilt(scope.current, '.exp-card'), [])

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      // the timeline spine draws itself as you travel down
      gsap.fromTo(
        '.exp-spine-fill',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.exp-list', start: 'top 70%', end: 'bottom 60%', scrub: SCRUB } }
      )

      gsap.fromTo('.exp-bg', { xPercent: -20 }, {
        xPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: scope.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })

      gsap.from('.exp-head-line', {
        yPercent: 110,
        duration: REVEAL.duration,
        stagger: REVEAL.stagger,
        ease: REVEAL.ease,
        scrollTrigger: { trigger: '.exp-head', start: REVEAL.start },
      })

      revealEach(scope.current, '.exp-fade')

      const splits = gsap.utils.toArray<HTMLElement>('.exp-item').map(item => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: REVEAL.start }, defaults: { ease: REVEAL.ease } })
        const node = item.querySelector('.exp-node')
        const summary = item.querySelector('.exp-summary')
        const split = summary ? splitLines(summary) : null

        tl.from(node, { scale: 0, duration: 0.5, ease: 'back.out(2.5)' }, 0)
          .from(item.querySelector('.exp-period'), { x: -24, opacity: 0, duration: 0.7 }, 0.05)
          .from(item.querySelector('.exp-company'), { yPercent: 110, duration: 0.9 }, 0.1)
          .from(item.querySelector('.exp-title'), { y: 16, opacity: 0, duration: 0.7 }, 0.3)
        if (split) tl.from(split.lines, { yPercent: 105, duration: 0.8, stagger: 0.06 }, 0.35)
        tl.from(item.querySelectorAll('.exp-point'), { x: -18, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.5)
          .from(item.querySelectorAll('.exp-project'), { y: 24, opacity: 0, duration: 0.7, stagger: 0.12 }, 0.65)
          .from(item.querySelectorAll('.exp-stack .tag-chip'), { y: 12, opacity: 0, duration: 0.5, stagger: 0.05 }, 0.8)
          .from(item.querySelector('.exp-card-line'), { scaleX: 0, duration: 1, ease: 'cine' }, 0.2)

        return split
      })

      return () => splits.forEach(s => s?.revert())
    },
    { scope }
  )

  return (
    <section id="experience" className="section experience" ref={scope}>
      <div className="exp-bg" aria-hidden="true">
        FIELD
      </div>
      <div className="section-inner">
        <div className="section-head exp-head">
          <div>
            <span className="kicker exp-fade">
              <span className="kicker-index">004</span> Experience
            </span>
            <h2 className="display-lg" style={{ marginTop: 16 }}>
              <span className="line">
                <span className="exp-head-line line-inner">Where the work</span>
              </span>
              <span className="line">
                <span className="exp-head-line line-inner">
                  gets <span className="accent-text">real.</span>
                </span>
              </span>
            </h2>
          </div>
          <p className="copy exp-fade" style={{ maxWidth: 420 }}>
            Two live engagements running in parallel: authoring the benchmarks frontier agents are measured against
            on one side, shipping production AI systems on the other.
          </p>
        </div>

        <div className="exp-list">
          <div className="exp-spine" aria-hidden="true">
            <div className="exp-spine-fill" />
          </div>

          {roles.map(role => (
            <article key={role.index} className="exp-item">
              <div className="exp-left">
                <span className="exp-node" aria-hidden="true" />
                <span className="exp-period mono-meta">
                  {role.period}
                  <span className="exp-mode">{role.mode}</span>
                </span>
              </div>

              <div className="exp-card">
                <span className="exp-card-line" aria-hidden="true" />
                <div className="exp-card-top">
                  <span className="exp-index">{role.index}</span>
                  {role.live && (
                    <span className="exp-live">
                      <span className="exp-live-dot" /> Live
                    </span>
                  )}
                </div>
                <div className="line">
                  <h3 className="exp-company line-inner">{role.company}</h3>
                </div>
                <div className="exp-title">{role.title}</div>
                <p className="exp-summary copy-lg">{role.summary}</p>
                <ul className="exp-points">
                  {role.points.map(point => (
                    <li key={point} className="exp-point">
                      {point}
                    </li>
                  ))}
                </ul>
                {role.projects && (
                  <div className="exp-projects">
                    {role.projects.map(project => (
                      <div key={project.name} className="exp-project">
                        <div className="exp-project-head">
                          <span className="exp-project-name">{project.name}</span>
                          <span className="exp-project-period mono-meta">{project.period}</span>
                        </div>
                        <p className="exp-project-blurb">{project.blurb}</p>
                        <div className="exp-project-tags">
                          {project.tags.map(tag => (
                            <span key={tag} className="tag-chip">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="exp-stack">
                  {role.stack.map(tag => (
                    <span key={tag} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
