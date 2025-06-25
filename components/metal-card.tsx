"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card } from "@/components/ui/card"

interface MetalCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function MetalCard({ children, className = "", delay = 0 }: MetalCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const card = cardRef.current
    const shine = shineRef.current

    if (!card || !shine) return

    // Metal shine animation
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3, delay })

    tl.set(shine, { x: "-100%", opacity: 0 })
      .to(shine, { opacity: 1, duration: 0.1 })
      .to(shine, { x: "100%", duration: 1.5, ease: "power2.inOut" })
      .to(shine, { opacity: 0, duration: 0.1 })

    // Hover effects
    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.02,
        rotationY: 5,
        rotationX: 2,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        rotationY: 0,
        rotationX: 0,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    card.addEventListener("mouseenter", handleMouseEnter)
    card.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      tl.kill()
      card.removeEventListener("mouseenter", handleMouseEnter)
      card.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [delay])

  return (
    <Card ref={cardRef} className={`relative overflow-hidden ${className}`} style={{ perspective: "1000px" }}>
      <div
        ref={shineRef}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 20%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0.1) 80%,
            transparent 100%
          )`,
          transform: "skewX(-20deg)",
        }}
      />
      {children}
    </Card>
  )
}
