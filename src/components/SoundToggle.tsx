import { useEffect, useState } from 'react'
import { disable, enable, hover, isEnabled, thock, tick } from '../lib/audio'
import { onSceneChange } from '../lib/scroll'

const STORAGE_KEY = 'pp-sound'
const INTERACTIVE = 'a, button'

function readPref() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'on'
  } catch {
    return false
  }
}

function writePref(on: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off')
  } catch {
    /* storage unavailable: preference just won't persist */
  }
}

/** The toggle is hidden on small screens, so never start audio there. */
function isHiddenViewport() {
  return window.matchMedia('(max-width: 640px)').matches
}

/** Fixed HUD toggle (bottom-left) for the synthesized ambient sound layer. */
export default function SoundToggle() {
  const [on, setOn] = useState(readPref)
  const [live, setLive] = useState(false)

  // while ON: arm audio on the first gesture (autoplay policy), wire scene ticks + UI blips
  useEffect(() => {
    if (!on) return

    const arm = () => {
      window.removeEventListener('pointerdown', arm)
      window.removeEventListener('keydown', arm)
      if (isEnabled() || isHiddenViewport()) return
      void enable().then(ok => setLive(ok))
    }
    if (!isEnabled()) {
      window.addEventListener('pointerdown', arm)
      window.addEventListener('keydown', arm)
    }

    // onSceneChange reports the current scene immediately; only actual scene changes should tick
    let primed = false
    const offScene = onSceneChange(scene => {
      if (!primed) {
        primed = true
        return
      }
      if (scene) tick()
    })

    const onOver = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest?.(INTERACTIVE)
      if (!target) return
      const from = (e.relatedTarget as Element | null)?.closest?.(INTERACTIVE)
      if (target !== from) hover()
    }
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.(INTERACTIVE)) thock()
    }
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('click', onClick, { passive: true })

    return () => {
      window.removeEventListener('pointerdown', arm)
      window.removeEventListener('keydown', arm)
      offScene()
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('click', onClick)
    }
  }, [on])

  // silence everything if the toggle unmounts
  useEffect(() => () => disable(), [])

  const toggle = () => {
    const next = !on
    setOn(next)
    writePref(next)
    if (next) {
      void enable().then(ok => {
        setLive(ok)
        if (ok) tick()
      })
    } else {
      disable()
      setLive(false)
    }
  }

  return (
    <button
      type="button"
      className={`sound-toggle${on ? ' is-on' : ''}${live ? ' is-live' : ''}`}
      onClick={toggle}
      aria-pressed={on}
      aria-label="Ambient sound"
      data-cursor="Sound"
    >
      <span className="sound-eq" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="sound-label" aria-hidden="true">
        SND {on ? 'ON' : 'OFF'}
      </span>
    </button>
  )
}
