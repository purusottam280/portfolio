import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { gsap, prefersReducedMotion, scrollToSection } from '../lib/scroll'

const navLinks = [
  { label: 'About', href: '#about', index: '01' },
  { label: 'Experience', href: '#experience', index: '02' },
  { label: 'Work', href: '#projects', index: '03' },
  { label: 'Stack', href: '#skills', index: '04' },
  { label: 'Contact', href: '#contact', index: '05' },
]

export default function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [mobileOpen, setMobileOpen] = useState(false)
  const lastY = useRef(window.scrollY)

  const handleNavClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToSection(href)
    setMobileOpen(false)
  }

  // decode the label (not the index number) on hover; the tween always resolves back to the original text
  const scrambleLabel = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion()) return
    const label = e.currentTarget.querySelector<HTMLElement>('.nav-link-label')
    if (!label || gsap.isTweening(label)) return
    gsap.to(label, {
      duration: 0.5,
      ease: 'none',
      scrambleText: { text: '{original}', chars: 'upperCase', speed: 0.6, revealDelay: 0.05 },
    })
  }

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 32)
      setHidden(y > lastY.current && y > 240 && !mobileOpen)
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mobileOpen])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const sections = ['about', 'experience', 'projects', 'skills', 'contact']
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { threshold: 0.5 }
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach(obs => obs.disconnect())
  }, [])

  return (
    <header className={`nav ${hidden ? 'nav-hidden' : ''} ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#hero" className="nav-brand" data-cursor="Top" onClick={handleNavClick('#hero')}>Purusottam Patel <sup>©26</sup></a>
        <nav className="nav-links">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link ${activeSection === link.href.slice(1) ? 'active' : ''}`}
              aria-label={link.label}
              onClick={handleNavClick(link.href)}
              onMouseEnter={scrambleLabel}
            >
              <span className="nav-link-index" aria-hidden="true">{link.index}</span>
              <span className="nav-link-label">{link.label}</span>
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <a href="/Purusottam_Patel_exp.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Resume</a>
          <a href="#contact" className="btn btn-solid magnetic" onClick={handleNavClick('#contact')}>Start a project</a>
        </div>
        <button type="button" className="nav-burger" aria-label="Toggle menu" onClick={() => setMobileOpen(v => !v)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="nav-mobile"
            style={{ overflow: 'hidden', background: 'rgba(8,9,7,0.92)', backdropFilter: 'blur(18px)' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
          >
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="nav-mobile-link"
                onClick={handleNavClick(link.href)}
              >
                <span className="nav-link-index">{link.index}</span>{link.label}
              </a>
            ))}
            <div className="nav-mobile-actions">
              <a href="/Purusottam_Patel_exp.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-line" onClick={() => setMobileOpen(false)}>
                Resume
              </a>
              <a href="#contact" className="btn btn-solid" onClick={handleNavClick('#contact')}>
                Start a project
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}