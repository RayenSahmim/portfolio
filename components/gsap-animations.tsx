"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function GSAPAnimations() {
  const metalRef = useRef<HTMLDivElement>(null)
  const lightBeamRef = useRef<HTMLDivElement>(null)
  const reflectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    // Metallic reflection animation
    const tl = gsap.timeline({ repeat: -1 })

    tl.to(".metal-reflection", {
      x: "200vw",
      duration: 3,
      ease: "power2.inOut",
      stagger: 0.2,
    }).to(".metal-reflection", {
      x: "-100vw",
      duration: 0,
    })

    // Floating light orbs
    gsap.to(".floating-orb", {
      y: "random(-50, 50)",
      x: "random(-30, 30)",
      rotation: "random(-180, 180)",
      duration: "random(3, 6)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        amount: 2,
        from: "random",
      },
    })

    // Pulsing energy rings
    gsap.to(".energy-ring", {
      scale: "random(1.2, 2)",
      opacity: "random(0.1, 0.3)",
      rotation: 360,
      duration: "random(4, 8)",
      repeat: -1,
      ease: "none",
      stagger: 0.5,
    })

    // Scanning light beam
    const scanTl = gsap.timeline({ repeat: -1, repeatDelay: 2 })
    scanTl
      .to(".scan-beam", {
        scaleX: 1,
        opacity: 0.8,
        duration: 0.1,
      })
      .to(".scan-beam", {
        x: "100vw",
        duration: 2,
        ease: "power2.inOut",
      })
      .to(".scan-beam", {
        opacity: 0,
        duration: 0.1,
      })
      .set(".scan-beam", {
        x: "-10vw",
        scaleX: 0,
      })

    return () => {
      tl.kill()
      scanTl.kill()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Metallic Reflections */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="metal-reflection absolute top-0 w-2 h-full opacity-30"
          style={{
            left: `${-10 + i * 25}%`,
            background: `linear-gradient(90deg, 
              transparent 0%, 
              rgba(255, 255, 255, 0.1) 20%, 
              rgba(255, 255, 255, 0.8) 50%, 
              rgba(255, 255, 255, 0.1) 80%, 
              transparent 100%)`,
            transform: `skewX(-20deg)`,
            filter: `blur(${i * 0.5}px)`,
          }}
        />
      ))}

      {/* Floating Energy Orbs */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="floating-orb absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${20 + Math.random() * 40}px`,
            height: `${20 + Math.random() * 40}px`,
            background: `radial-gradient(circle, 
              rgba(99, 102, 241, 0.6) 0%, 
              rgba(139, 92, 246, 0.3) 50%, 
              transparent 100%)`,
            filter: `blur(${Math.random() * 2}px)`,
          }}
        />
      ))}

      {/* Energy Rings */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="energy-ring absolute rounded-full border-2"
          style={{
            left: `${20 + i * 20}%`,
            top: `${20 + i * 15}%`,
            width: `${100 + i * 50}px`,
            height: `${100 + i * 50}px`,
            borderColor: `rgba(${99 + i * 20}, ${102 + i * 15}, 241, 0.2)`,
            borderImage: `conic-gradient(
              from 0deg,
              rgba(99, 102, 241, 0.8),
              rgba(139, 92, 246, 0.4),
              rgba(168, 85, 247, 0.8),
              rgba(99, 102, 241, 0.8)
            ) 1`,
          }}
        />
      ))}

      {/* Scanning Light Beam */}
      <div
        className="scan-beam absolute top-0 h-full w-1 opacity-0"
        style={{
          left: "-10vw",
          background: `linear-gradient(90deg,
            transparent 0%,
            rgba(99, 102, 241, 0.8) 50%,
            transparent 100%)`,
          boxShadow: `
            0 0 20px rgba(99, 102, 241, 0.8),
            0 0 40px rgba(139, 92, 246, 0.6),
            0 0 60px rgba(168, 85, 247, 0.4)
          `,
          transform: "scaleX(0)",
        }}
      />

      {/* Prismatic Light Dispersions */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${10 + i * 15}%`,
            top: `${10 + i * 12}%`,
            width: "200px",
            height: "2px",
            background: `linear-gradient(90deg,
              rgba(255, 0, 150, 0.6),
              rgba(0, 255, 255, 0.6),
              rgba(255, 255, 0, 0.6),
              rgba(150, 0, 255, 0.6)
            )`,
            transform: `rotate(${i * 30}deg)`,
            filter: "blur(1px)",
            animation: `prismatic-${i} ${3 + i}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  )
}
