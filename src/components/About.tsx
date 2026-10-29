import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { Brain, Compass, Layers3, Workflow } from 'lucide-react'
import { SCRUB, gsap, prefersReducedMotion, registerScene } from '../lib/scroll'
import { REVEAL, revealEach } from '../lib/reveal'
import { splitLines } from '../lib/text'

const principles = [
  { icon: Brain, title: 'Systems first', desc: 'Every model sits inside a product loop, with context, guardrails, and clear UX.' },
  { icon: Workflow, title: 'Composable flows', desc: 'I break AI products into small orchestration layers that are easier to scale and debug.' },
  { icon: Layers3, title: 'Interface matters', desc: 'A good AI stack should feel calm to use, even if the logic underneath is complex.' },
  { icon: Compass, title: 'Outcome driven', desc: 'I optimize for measurable workflows, not just impressive demos or flashy model usage.' },
]

const stats = [
  { value: '10+', label: 'projects shipped' },
  { value: '5+', label: 'agent frameworks' },
  { value: '3+', label: 'years in ML' },
  { value: '100%', label: 'production bias' },
]

const STRIPS = 6

export default function About() {
  const scope = useRef<HTMLElement>(null)

  useEffect(() => registerScene(scope.current, { index: '03', label: 'Profile' }), [])

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      // --- portrait: sliced strips slide in from alternating sides, then colour bleeds in ---
      const strips = gsap.utils.toArray<HTMLElement>('.about-strip')
      gsap.fromTo(
        strips,
        { xPercent: i => (i % 2 === 0 ? -70 : 70), opacity: 0 },
        {
          xPercent: 0,
          opacity: 1,
          ease: 'none',
          stagger: 0.04,
          scrollTrigger: { trigger: '.about-portrait', start: 'top 92%', end: 'top 30%', scrub: SCRUB },
        }
      )
      // colour bleeds in by fading a pre-filtered mono copy (opacity is compositor-only; a scrubbed filter repaints)
      const bleed = { trigger: scope.current, start: 'top 40%', end: 'bottom 90%', scrub: SCRUB }
      gsap.fromTo('.about-portrait-inner', { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: bleed })
      gsap.fromTo('.about-strip-mono', { opacity: 1 }, { opacity: 0, ease: 'none', scrollTrigger: bleed })
      gsap.from('.about-portrait-corner', {
        scale: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: 'cineOut',
        scrollTrigger: { trigger: '.about-portrait', start: 'top 60%' },
      })

      // --- big index drifting behind ---
      gsap.fromTo('.about-bg-index', { yPercent: 20 }, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: { trigger: scope.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })

      // --- headline lines ---
      gsap.from('.about-line-inner', {
        yPercent: 110,
        duration: REVEAL.duration,
        stagger: REVEAL.stagger,
        ease: REVEAL.ease,
        scrollTrigger: { trigger: '.about-head', start: REVEAL.start },
      })

      // --- lead copy: masked line reveal ---
      const lead = splitLines('.about-lead')
      gsap.from(lead.lines, {
        yPercent: 105,
        duration: REVEAL.duration,
        stagger: REVEAL.stagger,
        ease: REVEAL.ease,
        scrollTrigger: { trigger: '.about-lead', start: REVEAL.start },
      })

      revealEach(scope.current, '.about-fade')

      // --- counters ---
      gsap.utils.toArray<HTMLElement>('.about-stat-value').forEach(el => {
        const raw = el.dataset.value ?? '0'
        const match = raw.match(/^([\d.]+)(.*)$/)
        const target = match ? parseFloat(match[1]) : 0
        const suffix = match ? match[2] : ''
        const state = { val: 0 }
        gsap.to(state, {
          val: target,
          duration: 1.8,
          ease: 'power3.out',
          onUpdate: () => {
            el.textContent = `${Math.round(state.val)}${suffix}`
          },
          scrollTrigger: { trigger: el, start: REVEAL.start },
        })
      })

      // --- principle cards tilt in from 3D space ---
      gsap.from('.about-principle', {
        rotateX: 42,
        y: 50,
        opacity: 0,
        transformPerspective: 900,
        transformOrigin: '50% 0%',
        duration: REVEAL.duration,
        stagger: REVEAL.stagger,
        ease: REVEAL.ease,
        scrollTrigger: { trigger: '.about-principles', start: REVEAL.start },
      })

      return () => lead.revert()
    },
    { scope }
  )

  return (
    <section id="about" className="section about" ref={scope}>
      <div className="about-bg-index" aria-hidden="true">
        03
      </div>
      <div className="section-inner about-grid">
        <div className="about-sticky">
          <div className="about-head">
            <span className="kicker about-fade">
              <span className="kicker-index">003</span> About
            </span>
            <h2 className="display-lg" style={{ marginTop: 18 }}>
              <span className="line">
                <span className="about-line-inner line-inner">Product design</span>
              </span>
              <span className="line">
                <span className="about-line-inner line-inner">for intelligent</span>
              </span>
              <span className="line">
                <span className="about-line-inner line-inner accent-text">systems.</span>
              </span>
            </h2>
          </div>

          <div className="about-portrait" data-cursor="Me">
            <div className="about-portrait-inner">
              {Array.from({ length: STRIPS }).map((_, i) => (
                <div key={i} className="about-strip" style={{ height: `${100 / STRIPS}%` }}>
                  <img
                    src="/profile.jpg"
                    alt={i === 0 ? 'Purusottam Patel portrait' : ''}
                    aria-hidden={i !== 0}
                    style={{ height: `${STRIPS * 100}%`, top: `-${i * 100}%` }}
                  />
                  <img
                    src="/profile.jpg"
                    alt=""
                    aria-hidden
                    className="about-strip-mono"
                    style={{ height: `${STRIPS * 100}%`, top: `-${i * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <span className="about-portrait-corner tl" />
            <span className="about-portrait-corner tr" />
            <span className="about-portrait-corner bl" />
            <span className="about-portrait-corner br" />
            <div className="about-portrait-meta">
              {['Autonomy', 'Retrieval', 'Deployment'].map(tag => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>
            <div className="about-portrait-tag mono-meta">Subject / P. Patel — Take 02</div>
          </div>
        </div>

        <div className="about-right">
          <p className="copy-lg about-lead">
            I treat AI engineering like product design: every model sits inside a product loop, with context,
            guardrails, and clear UX. I break AI products into small orchestration layers that are easier to scale
            and debug. A good AI stack should feel calm to use, even if the logic underneath is complex. I optimize
            for measurable workflows, not just impressive demos or flashy model usage.
          </p>

          <p className="copy about-fade">
            To learn more about what I'm building, keep scrolling and select a project from the archive.
          </p>

          <div className="about-stats about-fade">
            {stats.map(stat => (
              <div key={stat.label} className="about-stat">
                <div className="about-stat-value" data-value={stat.value}>
                  {stat.value}
                </div>
                <div className="mono-meta">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="about-principles">
            {principles.map(({ icon: Icon, title, desc }, index) => (
              <div key={title} className="about-principle">
                <div className="about-principle-mark">
                  <Icon size={18} />
                </div>
                <div>
                  <div className="about-principle-title">
                    {String(index + 1).padStart(2, '0')} — {title}
                  </div>
                  <div className="about-principle-desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
