"use client"

import { useRef, useState } from "react"
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


  useFrame((state) => {
    if (!groupRef.current) return

    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.35 + 2) * 0.1

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


    </group>
  )
}
