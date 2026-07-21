import { motion } from 'motion/react'
import { Heart } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './Icons'

export default function Footer() {
  return (
    <footer className="section-frame" style={{ paddingTop: 48, paddingBottom: 42 }}>
      <div className="section-grid brutal-panel" style={{ padding: '18px 0 0' }}>
        <div className="footer-line" style={{ marginBottom: 28 }} />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 18,
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', letterSpacing: '-0.04em', marginBottom: 6 }}>
              Purusottam Patel
            </div>
            <div className="project-meta">AI Engineer building production-first systems</div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <a href="#about" className="button-ghost brutal-panel" style={{ padding: '11px 16px' }}>About</a>
            <a href="#projects" className="button-ghost brutal-panel" style={{ padding: '11px 16px' }}>Projects</a>
            <a href="#contact" className="button-ghost brutal-panel" style={{ padding: '11px 16px' }}>Contact</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
                whileHover={{ y: -2 }}
                className="glass-panel brutal-panel"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  display: 'grid',
                  placeItems: 'center',
                  textDecoration: 'none',
                }}
              >
                <Icon size={16} color="rgba(247,249,252,0.74)" />
              </motion.a>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: 24,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            color: 'rgba(247,249,252,0.52)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          <span>Built with React, Motion, and a lot of iteration.</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Crafted with <Heart size={12} color="var(--accent-2)" fill="var(--accent-2)" /> from India
          </span>
        </div>
      </div>
    </footer>
  )
}
