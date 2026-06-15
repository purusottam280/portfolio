import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './Icons'

const easeSmooth = [0.22, 1, 0.36, 1] as [number, number, number, number]

type Status = 'idle' | 'sending' | 'success' | 'error'

function GlowInput({
  label, id, type = 'text', multiline = false, value, onChange, placeholder,
}: {
  label: string; id: string; type?: string; multiline?: boolean;
  value: string; onChange: (v: string) => void; placeholder: string;
}) {
  const [focused, setFocused] = useState(false)

  const sharedStyle: React.CSSProperties = {
    background: 'transparent',
    color: '#fff',
    outline: 'none',
    width: '100%',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.9rem',
    padding: '12px 0',
    border: 'none',
    resize: 'none' as const,
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.75rem',
          fontWeight: 600,
          marginBottom: 8,
          color: focused ? '#6366F1' : 'rgba(161,161,170,0.6)',
          transition: 'color 0.2s ease',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </label>
      <div
        style={{
          position: 'relative',
          borderBottom: `1px solid ${focused ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.12)'}`,
          transition: 'border-color 0.3s ease',
        }}
      >
        {multiline ? (
          <textarea
            id={id}
            rows={4}
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            style={sharedStyle}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            style={sharedStyle}
          />
        )}
        {/* Animated bottom line */}
        <div
          style={{
            position: 'absolute',
            bottom: -1,
            left: focused ? 0 : '50%',
            width: focused ? '100%' : '0%',
            height: 2,
            background: 'linear-gradient(90deg, #6366F1, #06B6D4)',
            transition: 'width 0.3s ease, left 0.3s ease',
            borderRadius: 2,
            boxShadow: '0 0 8px rgba(99,102,241,0.5)',
          }}
        />
      </div>
    </div>
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
    const checkMobile = () => setIsMobile(window.innerWidth < 992)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return
    setStatus('sending')
    await new Promise(r => setTimeout(r, 1800))
    setStatus('success')
    setName(''); setEmail(''); setMessage('')
    setTimeout(() => setStatus('idle'), 4000)
  }

  const contactItems = [
    {
      Icon: Mail,
      label: 'Email',
      value: 'purusottam280@gmail.com',
      href: 'mailto:purusottam280@gmail.com',
      color: '#6366F1',
    },
    {
      CustomIcon: GithubIcon,
      label: 'GitHub',
      value: 'github.com/purusottam280',
      href: 'https://github.com/purusottam280',
      color: '#8B5CF6',
    },
    {
      CustomIcon: LinkedinIcon,
      label: 'LinkedIn',
      value: 'linkedin.com/in/purusottampatel',
      href: 'https://linkedin.com/in/purusottampatel',
      color: '#06B6D4',
    },
  ] as Array<{
    Icon?: typeof Mail;
    CustomIcon?: typeof GithubIcon;
    label: string; value: string; href: string; color: string;
  }>

  return (
    <section
      id="contact"
      style={{ position: 'relative', padding: '112px 24px', overflow: 'hidden' }}
    >
      {/* Aurora */}
      <div
        className="aurora-orb"
        style={{
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          bottom: '-10%', left: '20%',
          animation: 'auroraFloat1 20s ease-in-out infinite',
        }}
      />

      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>

        {/* ── Section Header (centered) ─── */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: 72 }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easeSmooth }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 24, height: 1, background: 'rgba(99,102,241,0.5)' }} />
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase' as const,
              background: 'linear-gradient(90deg, #6366F1, #06B6D4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Contact</span>
            <div style={{ width: 24, height: 1, background: 'rgba(6,182,212,0.5)' }} />
          </div>

          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 16,
          }}>
            Let's build something{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              extraordinary
            </span>
          </h2>

          <div style={{
            width: 56, height: 3,
            background: 'linear-gradient(90deg, #6366F1, #06B6D4)',
            borderRadius: 2, margin: '0 auto',
            boxShadow: '0 0 10px rgba(99,102,241,0.5)',
          }} />
        </motion.div>

        {/* ── Grid Layout ─── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 64,
            alignItems: 'start',
          }}
        >
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: easeSmooth }}
            style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
          >
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1.05rem',
                lineHeight: 1.8,
                color: 'rgba(200,200,215,0.75)',
              }}
            >
              I'm always open to exciting AI projects, collaborations, and opportunities.
              Whether you need an autonomous agent system, a custom RAG pipeline, or a full-stack LLM product — let's connect and design the future together.
            </p>

            {/* Info Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {contactItems.map(item => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '18px 24px',
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.06)',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  whileHover={{
                    borderColor: `${item.color}40`,
                    backgroundColor: `${item.color}0A`,
                    x: 6,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: `${item.color}20`,
                      border: `1px solid ${item.color}33`,
                    }}
                  >
                    {item.Icon
                      ? <item.Icon size={20} color={item.color} />
                      : item.CustomIcon
                        ? <item.CustomIcon size={20} color={item.color} />
                        : null
                    }
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.4)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      marginBottom: 2,
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      color: 'rgba(255,255,255,0.85)',
                    }}>
                      {item.value}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Availability Badge */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 9999,
                  background: 'rgba(34,197,94,0.08)',
                  border: '1px solid rgba(34,197,94,0.2)',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#22c55e',
                    boxShadow: '0 0 10px #22c55e',
                  }}
                  className="animate-pulse"
                />
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.85rem',
                  color: '#22c55e',
                  fontWeight: 500,
                }}>
                  Available for freelance &amp; full-time roles
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Message Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: easeSmooth }}
          >
            <div
              className="glass-card"
              style={{
                borderRadius: 24,
                padding: isMobile ? '28px 20px' : '40px 36px',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {status === 'success' ? (
                <motion.div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '48px 0',
                    textAlign: 'center',
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <CheckCircle size={56} color="#22C55E" style={{ marginBottom: 16 }} />
                  <h3 style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: 8,
                  }}>
                    Message Sent Successfully!
                  </h3>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.5)',
                  }}>
                    Thank you for reaching out. I'll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                  <GlowInput label="Full Name" id="contact-name" value={name} onChange={setName} placeholder="John Doe" />
                  <GlowInput label="Email Address" id="contact-email" type="email" value={email} onChange={setEmail} placeholder="john@example.com" />
                  <GlowInput label="Message" id="contact-message" multiline value={message} onChange={setMessage} placeholder="Tell me about your project..." />

                  {status === 'error' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 16,
                      color: '#f87171',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                    }}>
                      <AlertCircle size={16} />
                      Something went wrong. Please try again.
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn-shimmer btn-pulse"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '14px 24px',
                      borderRadius: 12,
                      fontWeight: 600,
                      color: '#fff',
                      background: status === 'sending'
                        ? 'rgba(99,102,241,0.5)'
                        : 'linear-gradient(135deg, #6366F1, #06B6D4)',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.95rem',
                      boxShadow: '0 0 30px rgba(99,102,241,0.25)',
                      cursor: status === 'sending' ? 'wait' : 'pointer',
                      border: 'none',
                      marginTop: 8,
                    }}
                    whileHover={{ scale: status === 'idle' ? 1.02 : 1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {status === 'sending' ? (
                      <>
                        <motion.div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTopColor: '#fff',
                          }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
