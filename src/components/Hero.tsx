import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { createAvatarCtrl } from '../lib/avatar'
import { SCRUB, gsap, prefersReducedMotion, registerScene, scrollToSection } from '../lib/scroll'
import { splitChars } from '../lib/text'

// three.js + the shader live in their own chunk so the intro can play while they download
const AvatarCanvas = lazy(() => import('./AvatarCanvas'))

const roles = ['Agentic Systems', 'RAG Architecture', 'Production ML', 'LLM Orchestration']

export default function Hero({ play }: { play: boolean }) {
  const scope = useRef<HTMLElement>(null)
  const [ctrl] = useState(() => createAvatarCtrl())
  const [roleIndex, setRoleIndex] = useState(0)
  const [entered, setEntered] = useState(false)
  // the WebGL portrait only renders while the opening scene is on screen
  const [onStage, setOnStage] = useState(true)

  useEffect(() => {
    const timer = window.setInterval(() => setRoleIndex(i => (i + 1) % roles.length), 2800)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => registerScene(scope.current, { index: '01', label: 'Opening' }), [])

  // ---- entry choreography (runs once the intro shutter has cleared) ----
  useGSAP(
    () => {
      if (!play) return
      if (prefersReducedMotion()) {
        gsap.set(ctrl, { reveal: 1, rgb: 0, gray: 0.15, zoom: 1 })
        setEntered(true)
        return
      }

      const titleA = splitChars('.hero-word-a')
      const titleB = splitChars('.hero-word-b')

      const tl = gsap.timeline({ defaults: { ease: 'cineOut' }, onComplete: () => setEntered(true) })

      tl.to(ctrl, { reveal: 1, duration: 2.6, ease: 'power2.inOut' }, 0)
        .to(ctrl, { rgb: 0.08, duration: 2.2, ease: 'power3.out' }, 0.6)
        .to(ctrl, { zoom: 1, duration: 3, ease: 'power3.out' }, 0)
        .to(ctrl, { gray: 0.12, duration: 1.8, ease: 'power2.inOut' }, 1.4)
        .fromTo('.letterbox', { scaleY: 1.8 }, { scaleY: 1, duration: 1.6, ease: 'cine' }, 0)
        // the intro name has just flown into these exact positions: settle the characters instead of re-revealing them
        .from([...titleA.chars, ...titleB.chars], { filter: 'blur(10px)', opacity: 0.2, duration: 0.9, stagger: { each: 0.012, from: 'random' } }, 0)
        .from('.hero-fade', { y: 26, opacity: 0, duration: 1, stagger: 0.08 }, 1.4)
        .from('.hero-rail-line', { scaleX: 0, duration: 1.2, ease: 'cine' }, 1.5)

      return () => {
        titleA.revert()
        titleB.revert()
      }
    },
    { scope, dependencies: [play] }
  )

  // ---- scroll-scrubbed exit: pinned scene, words split apart, avatar zooms & shatters into particles ----
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const el = scope.current
      if (!el) return

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=170%',
          pin: true,
          scrub: SCRUB,
          onLeave: () => setOnStage(false),
          onEnterBack: () => setOnStage(true),
        },
      })

      tl.to('.letterbox', { scaleY: 0, duration: 0.3 }, 0)
        .to('.hero-word-a', { xPercent: -46, duration: 1 }, 0)
        .to('.hero-word-b', { xPercent: 46, duration: 1 }, 0)
        .to('.hero-title', { opacity: 0, duration: 0.3 }, 0.6)
        .to('.hero-fade, .hero-rail', { opacity: 0, y: -30, duration: 0.3, stagger: 0.02 }, 0)
        .to('.hero-avatar', { scale: 1.75, yPercent: -6, duration: 1 }, 0)
        .to(ctrl, { gray: 1, rgb: 0.9, duration: 0.5 }, 0.3)
        .to(ctrl, { offsetY: -0.06, duration: 1 }, 0)
        .to(ctrl, { shatter: 1, duration: 0.6, immediateRender: false }, 0.3)
        .to('.hero-stage', { opacity: 0, duration: 0.15 }, 0.85)
    },
    { scope }
  )

  return (
    <section id="hero" className={`hero ${entered ? 'is-entered' : ''} ${play ? '' : 'hero-pending'}`} ref={scope}>
      <div className="hero-stage">
        <div className="hero-avatar-wrap">
          <div className="hero-avatar">
            <Suspense fallback={null}>
              <AvatarCanvas src="/profile.jpg" ctrl={ctrl} active={onStage} alt="Purusottam Patel" />
            </Suspense>
          </div>
        </div>

        <h1 className="hero-title" aria-label="Purusottam Patel">
          <span className="hero-word hero-word-a">Purusottam</span>
          <span className="hero-word hero-word-b">Patel</span>
        </h1>

        <div className="hero-rail hero-rail-top">
          <span className="kicker hero-fade">
            <span className="kicker-index">001</span> AI Engineer — Portfolio
          </span>
          <span className="mono-meta hero-fade">Based in India / Working worldwide</span>
        </div>

        <div className="hero-side hero-side-left hero-fade">
          <span className="mono-meta">Now shipping</span>
          <div className="hero-role">
            <span className="hero-role-dot" />
            <span className="hero-role-text" key={roleIndex}>
              {roles[roleIndex]}
            </span>
          </div>
          <p className="hero-sub">
            Autonomous systems with teeth — agentic workflows, retrieval engines, and production ML that hold up
            under pressure.
          </p>
        </div>

        <div className="hero-side hero-side-right hero-fade">
          <a
            href="#projects"
            className="btn btn-solid"
            data-cursor="Go"
            onClick={e => {
              e.preventDefault()
              scrollToSection('#projects')
            }}
          >
            Selected work <ArrowDown size={14} className="btn-arrow" />
          </a>
          <a
            href="/Purusottam_Patel_exp.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-line"
            data-cursor="PDF"
          >
            Resume <ArrowUpRight size={14} className="btn-arrow" />
          </a>
        </div>

        <div className="hero-rail hero-rail-bottom">
          <span className="hero-rail-line" />
          <span className="mono-meta hero-fade hero-scroll-cue">
            Scroll to begin <span className="hero-scroll-bar" />
          </span>
          <span className="mono-meta hero-fade">Agent stack: LangGraph / FastAPI / RAG</span>
        </div>

        <div className="letterbox letterbox-top" />
        <div className="letterbox letterbox-bottom" />
      </div>
    </section>
  )
}
