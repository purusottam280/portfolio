import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { GithubIcon, LinkedinIcon } from './Icons'

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <footer
      style={{
        position: 'relative',
        padding: '40px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: '#07070B',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          textAlign: isMobile ? 'center' : 'left',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
          <span
            className="gradient-text"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '1.125rem',
            }}
          >
            Purusottam Patel
          </span>
          {!isMobile && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem' }}>·</span>}
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.875rem',
            }}
          >
            Agentic AI Engineer
          </span>
        </div>

        {/* Made with */}
        <p
          style={{
            color: 'rgba(161,161,170,0.4)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            margin: 0,
          }}
        >
          Built with <Heart size={12} color="#6366F1" fill="#6366F1" /> using React + Vite + Framer Motion
        </p>

        {/* Socials */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {[
            { Icon: GithubIcon, href: 'https://github.com/purusottam280', label: 'GitHub' },
            { Icon: LinkedinIcon, href: 'https://linkedin.com/in/purusottampatel', label: 'LinkedIn' },
          ].map(({ Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              whileHover={{
                scale: 1.1,
                backgroundColor: 'rgba(99,102,241,0.15)',
                borderColor: 'rgba(99,102,241,0.35)',
              }}
            >
              <Icon size={14} color="rgba(255,255,255,0.5)" />
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  )
}
