import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { AlertCircle, CheckCircle, Mail, Send } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './Icons'

type Status = 'idle' | 'sending' | 'success' | 'error'

function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  multiline = false,
  type = 'text',
}: {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  multiline?: boolean
  type?: string
}) {
  return (
    <label style={{ display: 'grid', gap: 10 }}>
      <span className="project-meta">{label}</span>
      {multiline ? (
        <textarea
          id={id}
          rows={5}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            resize: 'vertical',
            minHeight: 150,
            padding: '16px 16px',
            borderRadius: 18,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            color: '#fff',
            outline: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: '0.98rem',
          }}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '16px 16px',
            borderRadius: 18,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            color: '#fff',
            outline: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: '0.98rem',
          }}
        />
      )}
    </label>
  )
}

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [isMobile, setIsMobile] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 960)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return

    setStatus('sending')
    try {
      const response = await fetch('https://formsubmit.co/ajax/purusottampatel2001@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      })

      if (!response.ok) throw new Error('Request failed')
      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
    } catch (error) {
      console.error(error)
      setStatus('error')
    } finally {
      window.setTimeout(() => setStatus('idle'), 3500)
    }
  }

  const items = [
    {
      icon: Mail,
      label: 'Email',
      value: 'purusottampatel2001@gmail.com',
      href: 'mailto:purusottampatel2001@gmail.com',
      accent: '#22d3ee',
    },
    {
      icon: GithubIcon,
      label: 'GitHub',
      value: 'github.com/purusottam280',
      href: 'https://github.com/purusottam280',
      accent: '#a78bfa',
    },
    {
      icon: LinkedinIcon,
      label: 'LinkedIn',
      value: 'linkedin.com/in/purusottampatel',
      href: 'https://linkedin.com/in/purusottampatel',
      accent: '#f59e0b',
    },
  ]

  return (
    <section id="contact" className="section-frame">
      <div className="ambient-orb orb-a" style={{ left: '-10%', bottom: '-10%' }} />

      <div className="section-grid">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.55 }}
          style={{ maxWidth: 760, marginBottom: 28 }}
        >
          <div className="section-kicker" style={{ marginBottom: 18 }}>Contact</div>
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            Let us build something
            <span style={{ display: 'block', background: 'linear-gradient(135deg, #fff 0%, #22d3ee 48%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              that feels from the future.
            </span>
          </h2>
          <p className="section-copy" style={{ maxWidth: 680 }}>
            Have an AI product idea, an automation problem, or a collaboration in mind? Send it over and I’ll
            respond with a clear next step, not generic fluff.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '0.88fr 1.12fr', gap: 18 }}>
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.6 }}
            className="glass-panel-strong holo-border brutal-panel"
            style={{ borderRadius: 18, padding: 24, transform: 'skewX(-0.35deg)' }}
          >
            <div className="project-meta" style={{ marginBottom: 18 }}>Direct lines</div>

            <div style={{ display: 'grid', gap: 14 }}>
              {items.map(item => {
                const Icon = item.icon
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 4 }}
                    className="glass-panel brutal-panel"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '44px 1fr',
                      gap: 14,
                      alignItems: 'center',
                      borderRadius: 12,
                      padding: 16,
                      textDecoration: 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        display: 'grid',
                        placeItems: 'center',
                        background: `${item.accent}18`,
                        border: `1px solid ${item.accent}2b`,
                      }}
                    >
                      <Icon size={18} color={item.accent} />
                    </div>
                    <div>
                      <div className="project-meta" style={{ marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: '0.96rem', color: 'rgba(247,249,252,0.9)' }}>{item.value}</div>
                    </div>
                  </motion.a>
                )
              })}
            </div>

            <div className="glass-panel brutal-panel" style={{ borderRadius: 12, padding: 18, marginTop: 16 }}>
              <div className="project-meta" style={{ marginBottom: 8 }}>Availability</div>
              <div style={{ fontSize: '1rem', lineHeight: 1.7, color: 'rgba(247,249,252,0.84)' }}>
                Open for select freelance work, product collaborations, and AI engineering roles.
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="glass-panel-strong holo-border brutal-panel"
            style={{ borderRadius: 18, padding: 24, transform: 'skewX(0.35deg)' }}
          >
            {status === 'success' ? (
                <div style={{ minHeight: 420, display: 'grid', placeItems: 'center', textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle size={54} color="var(--accent-2)" style={{ marginBottom: 16 }} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '-0.05em', marginBottom: 10 }}>
                  Message sent.
                </div>
                <div className="section-copy" style={{ maxWidth: 460 }}>
                  Thanks for reaching out. I’ll get back to you with a thoughtful reply as soon as possible.
                </div>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                  <Field label="Name" id="name" value={name} onChange={setName} placeholder="Your name" />
                  <Field label="Email" id="email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
                </div>
                <Field label="Message" id="message" multiline value={message} onChange={setMessage} placeholder="Tell me what you want to build..." />

                {status === 'error' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fda4af', fontSize: '0.92rem' }}>
                    <AlertCircle size={16} />
                    Something went wrong. Please try again.
                  </div>
                )}

                <motion.button
                  type="submit"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="button-primary"
                  style={{
                    border: 'none',
                    cursor: status === 'sending' ? 'wait' : 'pointer',
                    justifyContent: 'center',
                    padding: '15px 22px',
                    transform: 'skewX(-1deg)',
                  }}
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending...' : 'Launch the conversation'}
                  <Send size={16} />
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
