import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useGSAP } from '@gsap/react'
import { AlertCircle, ArrowUpRight, CheckCircle, Mail, Send } from 'lucide-react'
import { gsap, prefersReducedMotion, registerScene } from '../lib/scroll'
import { splitChars } from '../lib/text'
import { initMagnetic } from '../lib/magnetic'
import { initTilt } from '../lib/tilt'
import { GithubIcon, LinkedinIcon } from './Icons'

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
    <label className="field" htmlFor={id}>
      <span className="field-label">{label}</span>
      {multiline ? (
        <textarea id={id} rows={4} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="field-input" required />
      ) : (
        <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="field-input" required />
      )}
      <span className="field-line" />
    </label>
  )
}

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const scope = useRef<HTMLElement>(null)

  useEffect(() => registerScene(scope.current, { index: '07', label: 'Transmission' }), [])
  useEffect(() => initMagnetic(scope.current), [status])
  useEffect(() => initTilt(scope.current, '.contact-form'), [status])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return
    setStatus('sending')
    try {
      const response = await fetch('https://formsubmit.co/ajax/purusottampatel2001@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
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
      window.setTimeout(() => setStatus('idle'), 3500)
    }
  }

  const items = [
    { icon: Mail, label: 'Email', value: 'purusottampatel2001@gmail.com', href: 'mailto:purusottampatel2001@gmail.com' },
    { icon: GithubIcon, label: 'GitHub', value: 'github.com/purusottam280', href: 'https://github.com/purusottam280', external: true },
    { icon: LinkedinIcon, label: 'LinkedIn', value: 'linkedin.com/in/purusottampatel', href: 'https://linkedin.com/in/purusottampatel', external: true },
  ]

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const title = splitChars('.contact-title')
      gsap.from(title.chars, {
        yPercent: 110,
        rotate: 4,
        duration: 1,
        stagger: 0.018,
        ease: 'cineOut',
        scrollTrigger: { trigger: '.contact-title', start: 'top 82%' },
      })

      gsap.utils.toArray<HTMLElement>('.contact-fade').forEach(el => {
        gsap.from(el, { y: 36, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%' } })
      })

      gsap.from('.channel', {
        x: -40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'cineOut',
        scrollTrigger: { trigger: '.contact-channels', start: 'top 85%' },
      })

      gsap.from('.contact-bg', {
        xPercent: 30,
        ease: 'none',
        scrollTrigger: { trigger: scope.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })

      return () => title.revert()
    },
    { scope }
  )

  return (
    <section id="contact" className="section contact" ref={scope}>
      <div className="contact-bg" aria-hidden="true">
        TALK
      </div>
      <div className="section-inner" data-skew>
        <div className="section-head">
          <div>
            <span className="kicker contact-fade">
              <span className="kicker-index">006</span> Contact
            </span>
            <h2 className="display-lg contact-title" style={{ marginTop: 16 }}>
              Let's build something from the future.
            </h2>
          </div>
          <p className="copy contact-fade" style={{ maxWidth: 400 }}>
            Have an AI product idea, an automation problem, or a collaboration in mind? Send it over and I'll respond
            with a clear next step, not generic fluff.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-channels">
              {items.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="channel"
                  data-cursor="Open"
                >
                  <span className="channel-icon">{item.icon && <item.icon size={18} />}</span>
                  <span>
                    <span className="mono-meta" style={{ display: 'block', marginBottom: 4 }}>
                      {item.label}
                    </span>
                    <span className="channel-value">{item.value}</span>
                  </span>
                  <span className="channel-arrow">
                    <ArrowUpRight size={18} />
                  </span>
                </a>
              ))}
            </div>

            <div className="contact-note contact-fade">
              <div className="mono-meta" style={{ marginBottom: 8 }}>
                Availability
              </div>
              <p className="copy">Open for select freelance work, product collaborations, and AI engineering roles.</p>
            </div>
          </div>

          <div className="contact-form-wrap contact-fade">
            {status === 'success' ? (
              <div className="contact-success">
                <CheckCircle size={54} color="var(--accent)" style={{ marginBottom: 16 }} />
                <div className="display-md">Message sent.</div>
                <p className="copy" style={{ maxWidth: 460 }}>
                  Thanks for reaching out. I'll get back to you with a thoughtful reply as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-row">
                  <Field label="Name" id="name" value={name} onChange={setName} placeholder="Your name" />
                  <Field label="Email" id="email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
                </div>
                <Field label="Message" id="message" multiline value={message} onChange={setMessage} placeholder="Tell me what you want to build..." />

                {status === 'error' && (
                  <div className="contact-error">
                    <AlertCircle size={16} /> Something went wrong. Please try again.
                  </div>
                )}

                <button type="submit" className="btn btn-solid contact-submit magnetic" disabled={status === 'sending'} data-cursor="Send">
                  {status === 'sending' ? 'Transmitting...' : 'Launch the conversation'}
                  <Send size={15} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
