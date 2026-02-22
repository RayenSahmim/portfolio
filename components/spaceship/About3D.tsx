"use client"

import { useRef, useMemo, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Text, Html } from "@react-three/drei"
import * as THREE from "three"
import { Code, Palette, Rocket } from "lucide-react"
import personalData from "@/data/personal.json"

interface About3DProps {
  position: [number, number, number]
}

export function About3D({ position }: About3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const revealRef = useRef(0.1)
  const glowRef = useRef<THREE.Mesh>(null)
  const [isNearby, setIsNearby] = useState(false)
  const { scene } = useThree()

  // Deterministic particle positions
  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => {
      const angle = (i / 18) * Math.PI * 2
      const r = 7 + (i % 4) * 0.5
      return [Math.cos(angle) * r, Math.sin(angle) * r * 0.65, 0.2] as [number, number, number]
    }), []
  )

  useFrame((state) => {
    if (!groupRef.current) return

    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4 + 1) * 0.12

    // Proximity-based reveal
    const spaceship = scene.getObjectByName("spaceship")
    if (spaceship) {
      const dist = Math.abs(spaceship.position.z - position[2])
      const target = THREE.MathUtils.clamp(1 - (dist - 6) / 28, 0.08, 1)
      revealRef.current = THREE.MathUtils.lerp(revealRef.current, target, 0.04)
      groupRef.current.scale.setScalar(revealRef.current)
      const nearby = dist < 20
      if (nearby !== isNearby) setIsNearby(nearby)
    }

    if (glowRef.current && glowRef.current.material instanceof THREE.MeshBasicMaterial) {
      glowRef.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 1.8 + 1) * 0.1
    }
  })

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Code": return Code
      case "Palette": return Palette
      case "Rocket": return Rocket
      default: return Code
    }
  }

  return (
    <group ref={groupRef} position={position}>
      {/* Background panel */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[15, 11]} />
        <meshBasicMaterial color={0x0f172a} transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>

      {/* Glow border */}
      <mesh ref={glowRef} position={[0, 0, -0.06]}>
        <planeGeometry args={[15.4, 11.4]} />
        <meshBasicMaterial color={0x06b6d4} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Section Title */}
      <Text
        position={[0, 4.5, 0.1]}
        fontSize={0.75}
        color="#06b6d4"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#083344"
      >
        ABOUT ME
      </Text>

      {/* Intro text */}
      <Text
        position={[0, 2.8, 0.1]}
        fontSize={0.22}
        color="#e2e8f0"
        anchorX="center"
        anchorY="middle"
        maxWidth={13}
        textAlign="center"
        lineHeight={1.4}
      >
        {personalData.about.intro}
      </Text>

      {/* Secondary text */}
      <Text
        position={[0, 0.8, 0.1]}
        fontSize={0.18}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
        maxWidth={13}
        textAlign="center"
        lineHeight={1.4}
      >
        {personalData.about.secondary}
      </Text>

      {/* Stats — only visible when nearby */}
      {isNearby && <Html
        position={[0, -1.2, 0.2]}
        center
        transform
        sprite
        style={{ width: "500px", pointerEvents: "none" }}
      >
        <div className="flex justify-center gap-10">
          {personalData.about.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">{stat.number}</div>
              <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </Html>}

      {/* Values cards — only visible when nearby */}
      {isNearby && <Html
        position={[0, -3.5, 0.2]}
        center
        transform
        sprite
        style={{ width: "620px", pointerEvents: "none" }}
      >
        <div className="grid grid-cols-3 gap-4">
          {personalData.about.values.map((value, index) => {
            const IconComponent = getIcon(value.icon)
            return (
              <div
                key={index}
                className="bg-gray-900/70 border border-cyan-400/40 rounded-xl p-5 backdrop-blur-sm text-center shadow-[0_0_15px_rgba(6,182,212,0.1)]"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <IconComponent className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{value.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{value.description}</p>
              </div>
            )
          })}
        </div>
      </Html>}

      {/* Orbiting particles */}
      {particles.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.04, 0.04, 0.04]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? 0x06b6d4 : i % 3 === 1 ? 0x0891b2 : 0x22d3ee}
            transparent
            opacity={0.45}
          />
        </mesh>
      ))}
    </group>
  )
}
