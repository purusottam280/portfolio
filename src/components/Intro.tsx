import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { Flip } from 'gsap/Flip'
import { gsap, prefersReducedMotion } from '../lib/scroll'

gsap.registerPlugin(Flip)

const COLS = 6

type Props = {
  /** Fired when the hero should take over (scroll unlocks, hero entry plays). */
  onDone: () => void
  /** Fired a beat later, once the flown-in name has cross-faded into the hero title; unmount here. */
  onExit: () => void
}

export default function Intro({ onDone, onExit }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const done = useRef(false)
  const exited = useRef(false)

  // Preload the portrait so the hero shader can light up immediately after the shutter.
  useEffect(() => {
    const img = new Image()
    img.src = '/profile.jpg'
  }, [])

  useGSAP(
    () => {
      const handOff = () => {
        if (done.current) return
        done.current = true
        onDone()
      }
      const finish = () => {
        if (exited.current) return
        exited.current = true
        handOff()
        onExit()
      }

      if (prefersReducedMotion()) {
        finish()
        return
      }

      const counter = { v: 0 }
      const tl = gsap.timeline({ defaults: { ease: 'cine' } })

      tl.from('.intro-corner', { opacity: 0, y: 12, duration: 0.6, stagger: 0.08 }, 0)
        .from('.intro-name-word', { opacity: 0, duration: 0.3, stagger: 0.2 }, 0.1)
        .to(
          '.intro-name-word',
          {
            duration: 1.4,
            scrambleText: { text: '{original}', chars: 'upperCase', speed: 0.6, revealDelay: 0.25 },
            stagger: 0.2,
          },
          0.1
        )
        .from('.intro-sub', { opacity: 0, y: 10, duration: 0.6 }, 0.7)
        .to(
          counter,
          {
            v: 100,
            duration: 1.9,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
              if (barRef.current) barRef.current.style.transform = `scaleX(${counter.v / 100})`
            },
          },
          0.1
        )
        .fromTo('.intro-scan', { yPercent: -100 }, { yPercent: 100, duration: 1.6, ease: 'none' }, 0.3)
        // exit: chrome lifts, the shutter columns slide away, and the name flies into its hero position
        .to('.intro-corner, .intro-sub, .intro-bottom', { opacity: 0, y: -18, duration: 0.4, ease: 'power2.in' }, '+=0.15')
        .to(
          '.intro-col',
          {
            yPercent: -101,
            duration: 0.95,
            ease: 'cine',
            stagger: { each: 0.07, from: 'start' },
          },
          '-=0.1'
        )
        .add(() => {
          const heroA = document.querySelector<HTMLElement>('.hero-word-a')
          const heroB = document.querySelector<HTMLElement>('.hero-word-b')
          const introA = root.current?.querySelector<HTMLElement>('.intro-name-word-a')
          const introB = root.current?.querySelector<HTMLElement>('.intro-name-word-b')
          if (!heroA || !heroB || !introA || !introB) {
            finish()
            return
          }
          const fly = gsap.timeline({
            onComplete: () => {
              // hero words are now visible underneath; fade ours out over them
              gsap.to([introA, introB], { opacity: 0, duration: 0.35, ease: 'power2.out', onComplete: finish })
            },
          })
          fly
            .add(Flip.fit(introA, heroA, { duration: 1.15, ease: 'cine', scale: true }) as gsap.core.Tween, 0)
            .add(Flip.fit(introB, heroB, { duration: 1.15, ease: 'cine', scale: true }) as gsap.core.Tween, 0.06)
            // word B becomes the outlined one in the hero: hollow it out on the way
            .to(introB, { color: 'rgba(245,244,232,0)', webkitTextStroke: '1.5px rgba(245,244,232,0.9)', duration: 0.5, ease: 'power2.in' }, 0.6)
            .add(handOff, 1.05)
        }, '-=0.75')
    },
    { scope: root }
  )

  return (
    <div className="intro" ref={root} aria-hidden="true">
      <div className="intro-cols">
        {Array.from({ length: COLS }).map((_, i) => (
          <div
            key={i}
            className="intro-col"
            style={{ left: `${(i / COLS) * 100}%`, width: `${100 / COLS + 0.2}%` }}
          />
        ))}
      </div>

      <div className="intro-content">
        <div className="intro-scan" />
        <div className="intro-top">
          <span className="mono-meta intro-corner">PP — Portfolio / Vol. 01</span>
          <span className="mono-meta intro-corner">Scene 00 / Loading</span>
        </div>

        <div className="intro-center">
          <h2 className="intro-name">
            <span className="intro-name-word intro-name-word-a">Purusottam</span>
            <span className="intro-name-word intro-name-word-b">Patel</span>
          </h2>
          <div className="intro-sub">AI Engineer — Agentic Systems — 2026</div>
        </div>

        <div className="intro-bottom">
          <div className="intro-bar">
            <div className="intro-bar-fill" ref={barRef} />
          </div>
          <div className="intro-count" ref={countRef}>
            000
          </div>
        </div>
      </div>
    </div>
  )
}
