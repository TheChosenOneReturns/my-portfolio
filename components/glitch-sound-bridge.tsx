"use client"

import { useEffect, useRef } from "react"
import { useSound } from "@/lib/sound-context"

export function GlitchSoundBridge() {
  const { playGlitch, playWhoosh } = useSound()
  const lastHoverAt = useRef(0)

  useEffect(() => {
    const onPointerOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest(".glitch-hover") : null
      if (!target) return

      const now = window.performance.now()
      if (now - lastHoverAt.current < 130) return
      lastHoverAt.current = now
      playGlitch()
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest(".glitch-hover, a[href^='#']") : null
      if (!target) return
      playWhoosh()
    }

    window.addEventListener("pointerover", onPointerOver, { passive: true })
    window.addEventListener("click", onClick)

    return () => {
      window.removeEventListener("pointerover", onPointerOver)
      window.removeEventListener("click", onClick)
    }
  }, [playGlitch, playWhoosh])

  return null
}
