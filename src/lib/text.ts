import { SplitText } from './scroll'

/**
 * Splits an element into chars/words/lines wrapped in overflow-hidden masks so they can be
 * revealed with yPercent tweens. Returns the SplitText instance (call .revert() on cleanup).
 */
export function splitLines(target: gsap.DOMTarget) {
  return SplitText.create(target, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
  })
}

export function splitWords(target: gsap.DOMTarget) {
  return SplitText.create(target, {
    type: 'words',
    wordsClass: 'split-word',
  })
}

export function splitChars(target: gsap.DOMTarget) {
  return SplitText.create(target, {
    type: 'chars,words',
    mask: 'chars',
    charsClass: 'split-char',
    wordsClass: 'split-word',
  })
}
