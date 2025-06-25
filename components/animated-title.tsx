"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface AnimatedTitleProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedTitle({ children, className = "" }: AnimatedTitleProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const title = titleRef.current
    if (!title) return

    const handleMouseEnter = () => {
      title.style.transform = "scale(1.02)"
    }

    const handleMouseLeave = () => {
      title.style.transform = "scale(1)"
    }

    title.addEventListener("mouseenter", handleMouseEnter)
    title.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      title.removeEventListener("mouseenter", handleMouseEnter)
      title.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <h1 ref={titleRef} className={`animated-text-gradient transition-transform duration-300 ${className}`}>
      {children}
    </h1>
  )
}
