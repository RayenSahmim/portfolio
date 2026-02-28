"use client"

import { useEffect, useRef } from "react"

interface NetworkSphereProps {
  className?: string
}

interface Node {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
}

export function NetworkSphere({ className }: NetworkSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let width = 0
    let height = 0

    const NODE_COUNT = 60
    const SPHERE_RADIUS = 140
    const CONNECTION_DIST = 80
    const ROTATION_SPEED = 0.0008

    // Initialize nodes on a sphere surface
    const nodes: Node[] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      // Fibonacci sphere distribution for even spacing
      const phi = Math.acos(1 - (2 * (i + 0.5)) / NODE_COUNT)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i

      nodes.push({
        x: SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta),
        y: SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta),
        z: SPHERE_RADIUS * Math.cos(phi),
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        vz: (Math.random() - 0.5) * 0.15,
      })
    }

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener("resize", resize)

    let angle = 0

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      angle += ROTATION_SPEED

      const cosA = Math.cos(angle)
      const sinA = Math.sin(angle)

      // Project 3D → 2D with Y-axis rotation
      const projected = nodes.map((n) => {
        // Slight drift
        n.x += n.vx
        n.y += n.vy
        n.z += n.vz

        // Pull back toward sphere surface
        const dist = Math.sqrt(n.x * n.x + n.y * n.y + n.z * n.z)
        const pull = (SPHERE_RADIUS - dist) * 0.01
        n.x += (n.x / dist) * pull
        n.y += (n.y / dist) * pull
        n.z += (n.z / dist) * pull

        // Rotate around Y axis
        const rx = n.x * cosA - n.z * sinA
        const rz = n.x * sinA + n.z * cosA

        // Perspective projection
        const fov = 400
        const scale = fov / (fov + rz)

        return {
          sx: width / 2 + rx * scale,
          sy: height / 2 + n.y * scale,
          scale,
          depth: rz,
        }
      })

      // Draw connections
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i]
          const b = projected[j]
          const dx = a.sx - b.sx
          const dy = a.sy - b.sy
          const d = Math.sqrt(dx * dx + dy * dy)

          if (d < CONNECTION_DIST) {
            const opacity = (1 - d / CONNECTION_DIST) * 0.25 * Math.min(a.scale, b.scale)
            ctx.beginPath()
            ctx.moveTo(a.sx, a.sy)
            ctx.lineTo(b.sx, b.sy)
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      for (const p of projected) {
        const r = 1.5 * p.scale
        const opacity = 0.15 + p.scale * 0.35
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(129, 140, 248, ${opacity})`
        ctx.fill()
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block" }}
    />
  )
}
