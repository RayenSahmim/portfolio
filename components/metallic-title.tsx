"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface MetallicTitleProps {
  children: React.ReactNode
  className?: string
}

export function MetallicTitle({ children, className = "" }: MetallicTitleProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const title = titleRef.current
    if (!title) return

    const handleMouseEnter = () => {
      title.style.transform = "scale(1.02)"
      const shine = title.querySelector(".metallic-shine") as HTMLElement
      if (shine) {
        shine.style.transform = "translateX(100%) skewX(12deg)"
      }
    }

    const handleMouseLeave = () => {
      title.style.transform = "scale(1)"
      const shine = title.querySelector(".metallic-shine") as HTMLElement
      if (shine) {
        shine.style.transform = "translateX(-100%) skewX(12deg)"
      }
    }

    title.addEventListener("mouseenter", handleMouseEnter)
    title.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      title.removeEventListener("mouseenter", handleMouseEnter)
      title.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <h1
      ref={titleRef}
      className={`metallic-title-enhanced relative overflow-hidden transition-transform duration-300 ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <div className="metallic-shine absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 transition-transform duration-700"></div>
    </h1>
  )
}
