import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    const onResize = () => {
      const mobile = window.innerWidth < 840
      setIsMobile(mobile)
      if (!mobile) setMobileMenuOpen(false)
    }

    onScroll()
    onResize()
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    const sections = ['about', 'projects', 'skills', 'contact']
    const observers: IntersectionObserver[] = []

    sections.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { threshold: 0.45 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach(observer => observer.disconnect())
  }, [])

  useEffect(() => {
    const index = navLinks.findIndex(link => link.href === `#${activeSection}`)
    if (index < 0 || !navRef.current || !linkRefs.current[index] || isMobile) return

    const navRect = navRef.current.getBoundingClientRect()
    const linkRect = linkRefs.current[index]!.getBoundingClientRect()
    setIndicatorStyle({
      left: linkRect.left - navRect.left,
      width: linkRect.width,
    })
  }, [activeSection, isMobile])

  return (
    <div className="nav-shell">
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`glass-panel-strong holo-border brutal-panel`}
        style={{
          borderRadius: 18,
          position: 'relative',
          overflow: 'hidden',
          transform: 'skewX(-0.8deg)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            padding: '14px 18px',
          }}
        >
          <motion.a
            href="#hero"
            whileHover={{ scale: 1.03 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              textDecoration: 'none',
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(124,58,237,0.95), rgba(34,211,238,0.92))',
                display: 'grid',
                placeItems: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                letterSpacing: '-0.05em',
                color: '#fff',
                boxShadow: '0 10px 30px rgba(34, 211, 238, 0.18)',
              }}
            >
              PP
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  color: '#fff',
                  lineHeight: 1.1,
                  textTransform: 'uppercase',
                }}
              >
                Purusottam Patel
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  color: 'rgba(247,249,252,0.55)',
                  letterSpacing: '0.26em',
                  textTransform: 'uppercase',
                }}
              >
                AI Engineer
              </div>
            </div>
          </motion.a>

          {!isMobile && (
            <nav
              ref={navRef}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 28,
              }}
            >
              {navLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  ref={el => {
                    linkRefs.current[index] = el
                  }}
                  className={`nav-link ${activeSection === link.href.slice(1) ? 'active' : ''}`}
                >
                  {link.label}
                </a>
              ))}
              {activeSection !== 'hero' && (
                <motion.div
                  className="nav-indicator"
                  animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
                  transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                />
              )}
            </nav>
          )}

          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <a href="/Purusottam_Patel_exp.pdf" target="_blank" rel="noopener noreferrer" className="button-secondary brutal-panel">
                Resume
              </a>
              <a href="#contact" className="button-primary brutal-panel">
                Book a Call
              </a>
            </div>
          )}

          {isMobile && (
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(v => !v)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>

        <AnimatePresence>
          {isMobile && mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -12, height: 0 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              style={{
                borderTop: '1px solid rgba(255,255,255,0.07)',
                padding: '16px 18px 18px',
                display: 'grid',
                gap: 12,
              }}
            >
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="nav-link"
                  style={{ fontSize: '0.95rem' }}
                >
                  {link.label}
                </a>
              ))}
              <div style={{ display: 'grid', gap: 10, marginTop: 6 }}>
                <a
                  href="/Purusottam_Patel_exp.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-secondary brutal-panel"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Resume
                </a>
                <a href="#contact" className="button-primary brutal-panel" onClick={() => setMobileMenuOpen(false)}>
                  Book a Call
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <div
        style={{
          height: 1,
          marginTop: 12,
          background: scrolled ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' : 'transparent',
        }}
      />
    </div>
  )
}
