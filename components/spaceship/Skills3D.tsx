"use client"

import { useRef, useMemo, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Text, Html } from "@react-three/drei"
import * as THREE from "three"
import * as SimpleIcons from "react-icons/si"
import skillsData from "@/data/skills.json"

interface Skills3DProps {
  position: [number, number, number]
}

export function Skills3D({ position }: Skills3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const revealRef = useRef(0.1)
  const glowRef = useRef<THREE.Mesh>(null)
  const [isNearby, setIsNearby] = useState(false)
  const { scene } = useThree()

  // Deterministic orbiting particles
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => {
      const angle = (i / 20) * Math.PI * 2
      const r = 8 + (i % 3) * 0.6
      return {
        pos: [Math.cos(angle) * r, Math.sin(angle) * r * 0.55, 0.2 + (i % 3) * 0.1] as [number, number, number],
        color: [0x10b981, 0x059669, 0x34d399, 0x6ee7b7][i % 4],
      }
    }), []
  )

  useFrame((state) => {
    if (!groupRef.current) return

    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.35 + 2) * 0.1

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
      glowRef.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 1.6 + 2) * 0.1
    }
  })

  const getIcon = (iconName: string) => {
    const IconComponent = (SimpleIcons as any)[iconName]
    return IconComponent || SimpleIcons.SiCoder
  }

  const getIconColor = (skill: any) => {
    const darkIcons = ["Next.js", "Express.js", "Socket.IO", "Git/GitHub"]
    if (darkIcons.includes(skill.name)) return "#ffffff"
    return skill.color
  }

  return (
    <group ref={groupRef} position={position}>
      {/* Background panel */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[17, 13]} />
        <meshBasicMaterial color={0x0f172a} transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>

      {/* Glow border */}
      <mesh ref={glowRef} position={[0, 0, -0.06]}>
        <planeGeometry args={[17.4, 13.4]} />
        <meshBasicMaterial color={0x10b981} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Section Title */}
      <Text
        position={[0, 5.5, 0.1]}
        fontSize={0.75}
        color="#10b981"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#064e3b"
      >
        TECHNICAL SKILLS
      </Text>

      {/* Skills Grid — only visible when nearby */}
      {isNearby && <Html
        position={[0, 0.5, 0.2]}
        center
        transform
        sprite
        style={{ width: "720px", pointerEvents: "none" }}
      >
        <div className="space-y-5">
          {skillsData.categories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-emerald-400 font-bold text-base mb-2 text-center drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]">
                {category.title}
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {category.skills.map((skill, skillIndex) => {
                  const IconComponent = getIcon(skill.icon)
                  return (
                    <div
                      key={skillIndex}
                      className="bg-gray-900/70 border border-emerald-400/35 rounded-lg p-3 backdrop-blur-sm text-center shadow-[0_0_10px_rgba(16,185,129,0.08)] hover:border-emerald-400/60 transition-all duration-200"
                    >
                      <div className="flex justify-center mb-2">
                        <IconComponent
                          className="w-6 h-6"
                          style={{ color: getIconColor(skill) }}
                        />
                      </div>
                      <h4 className="text-white font-medium text-xs mb-1">{skill.name}</h4>
                      <div className="w-full bg-gray-700/80 rounded-full h-1.5 mb-1">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-1.5 rounded-full"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      <span className="text-emerald-300 text-xs font-medium">{skill.level}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </Html>}

      {/* Orbiting particles */}
      {particles.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <sphereGeometry args={[0.04]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  )
}
