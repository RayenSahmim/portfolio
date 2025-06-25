"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { TextPlugin } from "gsap/TextPlugin"

if (typeof window !== "undefined") {
  gsap.registerPlugin(TextPlugin)
}

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
}

export function AnimatedText({ text, className = "", delay = 0 }: AnimatedTextProps) {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !textRef.current) return

    const chars = text.split("")
    textRef.current.innerHTML = chars
      .map((char, i) => `<span class="char" style="display: inline-block;">${char === " " ? "&nbsp;" : char}</span>`)
      .join("")

    const tl = gsap.timeline({ delay })

    tl.from(".char", {
      opacity: 0,
      y: 50,
      rotationX: -90,
      transformOrigin: "0% 50% -50",
      duration: 0.1,
      stagger: 0.02,
      ease: "back.out(1.7)",
    }).to(
      ".char",
      {
        textShadow: "0 0 20px rgba(99, 102, 241, 0.8), 0 0 40px rgba(139, 92, 246, 0.6)",
        duration: 0.5,
        stagger: 0.02,
        ease: "power2.out",
      },
      "-=0.5",
    )

    return () => {
      tl.kill()
    }
  }, [text, delay])

  return <div ref={textRef} className={className} />
}
