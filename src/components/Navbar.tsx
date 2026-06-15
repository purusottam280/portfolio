import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Intersection observer for active section
  useEffect(() => {
    const sections = ['about', 'projects', 'skills', 'contact']
    const observers: IntersectionObserver[] = []

    sections.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { threshold: 0.4 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  // Slide indicator under active link
  useEffect(() => {
    const idx = navLinks.findIndex(l => l.href === `#${activeSection}`)
    if (idx >= 0 && linkRefs.current[idx] && navRef.current && !isMobile) {
      const navRect = navRef.current.getBoundingClientRect()
      const linkRect = linkRefs.current[idx]!.getBoundingClientRect()
      setIndicatorStyle({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
      })
    }
  }, [activeSection, isMobile])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? 'rgba(10, 10, 15, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
        transition: 'background 0.3s ease, border-bottom 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Logo */}
        <motion.a
          href="#"
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <span className="gradient-text">PP</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)', margin: '0 6px' }}>·</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem', fontWeight: 500 }}>AI Engineer</span>
        </motion.a>

        {/* Desktop Nav Links */}
        {!isMobile && (
          <nav
            ref={navRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 32,
              position: 'relative',
            }}
          >
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                ref={el => { linkRefs.current[i] = el }}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  position: 'relative',
                  paddingBottom: 4,
                  color: activeSection === link.href.slice(1) ? '#fff' : 'rgba(161, 161, 170, 0.8)',
                  transition: 'color 0.2s',
                }}
              >
                {link.label}
              </a>
            ))}

            {/* Sliding indicator */}
            {activeSection && (
              <motion.div
                className="nav-indicator"
                animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </nav>
        )}

        {/* Desktop CTA */}
        {!isMobile && (
          <motion.a
            href="#contact"
            className="btn-shimmer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 18px',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#fff',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Hire Me
          </motion.a>
        )}

        {/* Mobile menu toggle */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 60,
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'rgba(10, 10, 15, 0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: activeSection === link.href.slice(1) ? '#6366F1' : 'rgba(255, 255, 255, 0.8)',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-shimmer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px',
                borderRadius: 10,
                fontSize: '1rem',
                fontWeight: 600,
                color: '#fff',
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
                marginTop: 8,
                textAlign: 'center',
              }}
            >
              Hire Me
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
