"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import * as THREE from "three"

interface WormholePortalProps {
  position: [number, number, number]
  color: number
  label: string
  /** Accent color hex string for text, e.g. "#6366f1" */
  accent: string
}

/**
 * Minimal, elegant section gate.
 * One thin ring, subtle frame lines, a drifting scan-line and corner accents.
 * Designed to frame — never obscure — the content behind it.
 */
export function WormholePortal({ position, color, label, accent }: WormholePortalProps) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const neonLightRef = useRef<THREE.PointLight>(null)
  const scanLineRef = useRef<THREE.Mesh>(null)

  const brightColor = useMemo(() => new THREE.Color(color).multiplyScalar(1.4), [color])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Ring — slow rotation
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.05
    }

    // Orbiting light travels along the ring path (XZ plane)
    // This illuminates the ring segment it passes — no extra geometry
    const angle = t * 0.5
    const nx = Math.cos(angle) * 9
    const nz = Math.sin(angle) * 9
    if (neonLightRef.current) {
      neonLightRef.current.position.set(nx, 0, nz)
      // Subtle intensity pulse
      neonLightRef.current.intensity = 3 + Math.sin(t * 3) * 0.8
    }

    // Scan line drifts gently up/down
    if (scanLineRef.current) {
      scanLineRef.current.position.y = Math.sin(t * 0.35) * 5
      if (scanLineRef.current.material instanceof THREE.MeshBasicMaterial) {
        scanLineRef.current.material.opacity = 0.12 + Math.sin(t * 1.8) * 0.05
      }
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Ring — uses StandardMaterial so it responds to the orbiting light */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[9, 0.1, 16, 120]} />
        <meshStandardMaterial
          color={brightColor}
          emissive={brightColor}
          emissiveIntensity={0.15}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* Orbiting point light — brightens the ring where it passes */}
      <pointLight ref={neonLightRef} color={color} intensity={3} distance={4} decay={2} />

      {/* Vertical frame lines */}
      <mesh position={[-10, 0, 0]}>
        <boxGeometry args={[0.05, 16, 0.05]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>
      <mesh position={[10, 0, 0]}>
        <boxGeometry args={[0.05, 16, 0.05]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>

      {/* Top beam */}
      <mesh position={[0, 8, 0]}>
        <boxGeometry args={[20, 0.05, 0.05]} />
        <meshBasicMaterial color={brightColor} transparent opacity={0.4} />
      </mesh>

      {/* Drifting scan line */}
      <mesh ref={scanLineRef}>
        <boxGeometry args={[18, 0.025, 0.025]} />
        <meshBasicMaterial color={brightColor} transparent opacity={0.15} />
      </mesh>

      {/* Soft ambient point light */}
      <pointLight color={color} intensity={0.8} distance={22} decay={2} />

      {/* Section label — bold and readable */}
      <Text
        position={[0, 9.8, 0]}
        fontSize={1}
        color={accent}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#000000"
        letterSpacing={0.12}
      >
        {label}
      </Text>

      {/* Label underline */}
      <mesh position={[0, 8.9, 0]}>
        <boxGeometry args={[label.length * 0.55, 0.03, 0.03]} />
        <meshBasicMaterial color={brightColor} transparent opacity={0.45} />
      </mesh>
    </group>
  )
}

/**
 * Decorative nebula clouds + floating crystals scattered between sections.
 * Pass a z-range and it will fill the space with eye-candy.
 */
export function SpaceDecor({
  startZ,
  endZ,
  seed = 0,
  color = 0x6366f1,
}: {
  startZ: number
  endZ: number
  seed?: number
  color?: number
}) {
  // Deterministic "random" using seed
  const items = useMemo(() => {
    const result: {
      type: "nebula" | "crystal" | "dust"
      pos: [number, number, number]
      scale: number
      color: number
      rotSpeed: number
    }[] = []

    const range = Math.abs(endZ - startZ)
    const minZ = Math.min(startZ, endZ)
    // Reduced density for a cleaner look
    const count = Math.max(3, Math.floor(range / 12))

    for (let i = 0; i < count; i++) {
      // Pseudo-random from seed+index
      const s = seed * 137.5 + i * 97.3
      const px = Math.sin(s) * 18 + Math.cos(s * 1.3) * 8
      const py = Math.cos(s * 0.7) * 6 + Math.sin(s * 1.1) * 3
      const pz = minZ + (i / count) * range + Math.sin(s * 2.1) * 3

      if (i % 5 === 0) {
        result.push({
          type: "nebula",
          pos: [px, py, pz],
          scale: 2 + Math.abs(Math.sin(s * 0.3)) * 3,
          color,
          rotSpeed: 0.015 + Math.abs(Math.sin(s)) * 0.02,
        })
      } else if (i % 5 === 1) {
        result.push({
          type: "crystal",
          pos: [px * 0.8, py * 0.6, pz],
          scale: 0.25 + Math.abs(Math.sin(s * 1.7)) * 0.35,
          color,
          rotSpeed: 0.06 + Math.abs(Math.cos(s)) * 0.08,
        })
      } else {
        // Skip dust spheres — keep space clean
        continue
      }
    }

    return result
  }, [startZ, endZ, seed, color])

  const meshRefs = useRef<(THREE.Mesh | null)[]>([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    items.forEach((item, i) => {
      const mesh = meshRefs.current[i]
      if (!mesh) return
      if (item.type === "nebula") {
        mesh.rotation.y = t * item.rotSpeed
        mesh.rotation.x = t * item.rotSpeed * 0.7
        if (mesh.material instanceof THREE.MeshBasicMaterial) {
          mesh.material.opacity = 0.03 + Math.sin(t * 0.6 + i) * 0.015
        }
      } else if (item.type === "crystal") {
        mesh.rotation.y = t * item.rotSpeed
        mesh.rotation.z = t * item.rotSpeed * 0.5
        mesh.position.y = item.pos[1] + Math.sin(t * 0.4 + i * 2) * 0.2
      }
    })
  })

  return (
    <group>
      {items.map((item, i) => {
        if (item.type === "nebula") {
          return (
            <mesh
              key={`decor-${i}`}
              ref={(el) => { meshRefs.current[i] = el }}
              position={item.pos}
            >
              <icosahedronGeometry args={[item.scale, 1]} />
              <meshBasicMaterial
                color={item.color}
                transparent
                opacity={0.03}
                side={THREE.DoubleSide}
                wireframe
              />
            </mesh>
          )
        }
        if (item.type === "crystal") {
          return (
            <mesh
              key={`decor-${i}`}
              ref={(el) => { meshRefs.current[i] = el }}
              position={item.pos}
            >
              <octahedronGeometry args={[item.scale]} />
              <meshBasicMaterial
                color={item.color}
                transparent
                opacity={0.2}
              />
            </mesh>
          )
        }
        // Only nebula and crystal remain — skip anything else
        return null
      })}
    </group>
  )
}
