/** Mutable control object — tween its fields with GSAP, the shader reads them every frame. */
export type AvatarCtrl = {
  reveal: number // 0 = hidden in noise, 1 = fully emerged
  zoom: number // uv zoom (1 = cover)
  gray: number // 0 = colour, 1 = mono
  rgb: number // chromatic aberration amount
  glow: number // strength of the accent burn edge / particle glow
  offsetY: number // vertical uv drift for parallax
  shatter: number // 0 = solid portrait, 1 = fully blown apart into particles
}

export function createAvatarCtrl(partial: Partial<AvatarCtrl> = {}): AvatarCtrl {
  return { reveal: 0, zoom: 1.2, gray: 0.85, rgb: 1, glow: 1, offsetY: 0, shatter: 0, ...partial }
}
