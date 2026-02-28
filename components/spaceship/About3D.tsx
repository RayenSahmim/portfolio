"use client"

import { useRef, useState } from "react"
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


  useFrame((state) => {
    if (!groupRef.current) return

    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4 + 1) * 0.12

    // Proximity-based reveal
    const spaceship = scene.getObjectByName("spaceship")
    if (spaceship) {
      const dist = Math.abs(spaceship.position.z - position[2])
      const target = THREE.MathUtils.clamp(1 - (dist - 8) / 35, 0.05, 1)
      revealRef.current = THREE.MathUtils.lerp(revealRef.current, target, 0.06)
      groupRef.current.scale.setScalar(revealRef.current)
      const nearby = dist < 30
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


    </group>
  )
}
