import { useEffect, useRef } from 'react'
import { ArrowUp, Heart } from 'lucide-react'
import Marquee from './Marquee'
import { GithubIcon, LinkedinIcon } from './Icons'
import { initMagnetic } from '../lib/magnetic'
import { scrollToSection } from '../lib/scroll'

export default function Footer() {
  const root = useRef<HTMLElement>(null)
  useEffect(() => initMagnetic(root.current, 0.3, 40), [])

  return (
    <footer className="footer" ref={root}>
      <Marquee giant items={['Purusottam Patel', 'AI Engineer', "Let's build", 'Agentic systems']} duration={48} />
      <div className="footer-grid" data-skew>
        <div>
          <div className="footer-col-title">Profile</div>
          <p className="copy" style={{ maxWidth: 320 }}>
            AI engineer building production-first agentic systems, retrieval engines, and applied ML.
          </p>
          <div className="footer-socials" style={{ marginTop: 22 }}>
            <a className="footer-social magnetic" href="https://github.com/purusottam280" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <GithubIcon size={16} />
            </a>
            <a className="footer-social magnetic" href="https://linkedin.com/in/purusottampatel" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedinIcon size={16} />
            </a>
          </div>
        </div>

        <div>
          <div className="footer-col-title">Index</div>
          <div className="footer-links">
            {[
              ['About', '#about'],
              ['Experience', '#experience'],
              ['Work', '#projects'],
              ['Stack', '#skills'],
              ['Contact', '#contact'],
            ].map(([label, href]) => (
              <a
                key={href}
                className="footer-link"
                href={href}
                onClick={e => {
                  e.preventDefault()
                  scrollToSection(href)
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="footer-col-title">Elsewhere</div>
          <div className="footer-links">
            <a className="footer-link" href="https://github.com/purusottam280" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a className="footer-link" href="https://linkedin.com/in/purusottampatel" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a className="footer-link" href="/Purusottam_Patel_exp.pdf" target="_blank" rel="noopener noreferrer">
              Resume
            </a>
          </div>
        </div>

        <div>
          <div className="footer-col-title">Direct line</div>
          <a className="footer-email" href="mailto:purusottampatel2001@gmail.com">
            purusottampatel2001@gmail.com
          </a>
          <button
            type="button"
            className="footer-top magnetic"
            onClick={() => scrollToSection('#hero')}
            aria-label="Back to top"
            data-cursor="Top"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>

      <div className="footer-base">
        <span className="mono-meta">© 2026 Purusottam Patel</span>
        <span className="mono-meta" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          Crafted with <Heart size={11} color="var(--accent-2)" fill="var(--accent-2)" /> in India
        </span>
        <span className="mono-meta">React / GSAP / Lenis / Three</span>
      </div>
    </footer>
  )
}
