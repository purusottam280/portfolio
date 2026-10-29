import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import Marquee from './Marquee'
import { gsap, prefersReducedMotion, registerScene } from '../lib/scroll'
import { REVEAL, revealEach } from '../lib/reveal'
import { splitChars } from '../lib/text'
import { initTilt } from '../lib/tilt'

const skillGroups = [
  {
    title: 'Foundations and ML',
    accent: '#e9ff4b',
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
    accent: '#ff5a1f',
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
    accent: '#ffdd00',
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

const chipsA = ['Python', 'PyTorch', 'LangGraph', 'RAG', 'FastAPI', 'Docker', 'Pinecone', 'TensorFlow']
const chipsB = ['Streamlit', 'CrewAI', 'OpenCV', 'GitHub Actions', 'PostgreSQL', 'Groq', 'Gemini', 'LLaMA 3']

export default function Skills() {
  const scope = useRef<HTMLElement>(null)

  useEffect(() => registerScene(scope.current, { index: '06', label: 'Capabilities' }), [])
  // the stacking scrub owns scale on these cards, so tilt only rotates
  useEffect(() => initTilt(scope.current, '.skill-card', { scale: 1 }), [])

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const title = splitChars('.skills-title')
      gsap.from(title.chars, {
        yPercent: 110,
        duration: 1,
        stagger: 0.02,
        ease: REVEAL.ease,
        scrollTrigger: { trigger: '.skills-head', start: REVEAL.start },
      })

      revealEach(scope.current, '.skills-fade')

      // --- stacking cards: each card pins, the next one slides over and pushes it back in depth ---
      const cards = gsap.utils.toArray<HTMLElement>('.skill-card')
      cards.forEach((card, i) => {
        const next = cards[i + 1]
        if (next) {
          // push back in depth: scale on the card, darkening on a child overlay (opacity, not a repainting filter)
          const push = { trigger: next, start: 'top bottom', end: 'top 12%', scrub: true }
          gsap.fromTo(card, { scale: 1, yPercent: 0 }, { scale: 0.92 - i * 0.015, yPercent: -4, ease: 'none', scrollTrigger: push })
          const dim = card.querySelector('.skill-card-dim')
          if (dim) gsap.fromTo(dim, { opacity: 0 }, { opacity: 0.55, ease: 'none', scrollTrigger: push })
        }

        gsap.from(card, {
          y: 80,
          rotateX: 10,
          transformPerspective: 1000,
          transformOrigin: '50% 100%',
          opacity: 0,
          duration: REVEAL.duration,
          ease: REVEAL.ease,
          scrollTrigger: { trigger: card, start: REVEAL.start },
        })

        const fills = card.querySelectorAll<HTMLElement>('.skill-bar-fill')
        gsap.fromTo(
          fills,
          { scaleX: 0 },
          {
            scaleX: (_, el: HTMLElement) => Number(el.dataset.level ?? 100) / 100,
            duration: 1.3,
            stagger: 0.08,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: card, start: 'top 70%' },
          }
        )

        const levels = card.querySelectorAll<HTMLElement>('.skill-item-level')
        levels.forEach(el => {
          const target = Number(el.dataset.level ?? 0)
          const state = { v: 0 }
          gsap.to(state, {
            v: target,
            duration: 1.3,
            ease: 'power3.out',
            onUpdate: () => {
              el.textContent = `${Math.round(state.v)}%`
            },
            scrollTrigger: { trigger: card, start: 'top 70%' },
          })
        })
      })

      return () => title.revert()
    },
    { scope }
  )

  return (
    <section id="skills" className="section skills" ref={scope}>
      <div className="section-head skills-head">
        <div>
          <span className="kicker skills-fade">
            <span className="kicker-index">006</span> Capabilities
          </span>
          <h2 className="display-lg skills-title" style={{ marginTop: 16 }}>
            The stack behind the machine.
          </h2>
        </div>
        <p className="copy skills-fade" style={{ maxWidth: 420 }}>
          A practical stack across ML, orchestration, APIs, and delivery — tuned to work as one system.
        </p>
      </div>

      <div className="skills-marquees skills-fade">
        <Marquee items={chipsA} bordered duration={30} />
        <Marquee items={chipsB} bordered reverse duration={36} />
      </div>

      <div className="skills-stack">
        {skillGroups.map((group, index) => (
          <article
            key={group.title}
            className="skill-card"
            style={{ '--i': index, '--accent-c': group.accent } as React.CSSProperties}
          >
            <div className="skill-card-dim" aria-hidden="true" />
            <div className="skill-card-head">
              <span className="skill-row-index">
                {String(index + 1).padStart(2, '0')} / {String(skillGroups.length).padStart(2, '0')}
              </span>
              <h3 className="skill-row-title">{group.title}</h3>
              <p className="skill-row-desc">{group.description}</p>
            </div>
            <div className="skill-card-list">
              {group.skills.map(skill => (
                <div key={skill.name} className="skill-item">
                  <div className="skill-item-top">
                    <span className="skill-item-name">{skill.name}</span>
                    <span className="skill-item-level" data-level={skill.level}>
                      {skill.level}%
                    </span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-bar-fill" data-level={skill.level} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="skills-quote skills-fade">
        <div className="display-md" style={{ maxWidth: 720 }}>
          Fast to build. Clear to understand. Hard to break.
        </div>
        <div className="skills-quote-steps">
          {['Design', 'Build', 'Test', 'Ship'].map(step => (
            <span key={step} className="tag-chip">
              {step}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
