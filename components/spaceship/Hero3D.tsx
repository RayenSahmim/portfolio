"use client"

import { useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Text, Html } from "@react-three/drei"
import * as THREE from "three"
import { Github, Linkedin, Mail, Download } from "lucide-react"
import personalData from "@/data/personal.json"
import navigationData from "@/data/navigation.json"

interface Hero3DProps {
  position: [number, number, number]
}

export function Hero3D({ position }: Hero3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const revealRef = useRef(0.1)
  const glowRef = useRef<THREE.Mesh>(null)
  const [isNearby, setIsNearby] = useState(false)
  const { scene } = useThree()

  useFrame((state) => {
    if (!groupRef.current) return

    // Gentle floating animation
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.15

    // Proximity-based reveal
    const spaceship = scene.getObjectByName("spaceship")
    if (spaceship) {
      const dist = Math.abs(spaceship.position.z - position[2])
      const target = THREE.MathUtils.clamp(1 - (dist - 8) / 35, 0.05, 1)
      revealRef.current = THREE.MathUtils.lerp(revealRef.current, target, 0.06)
      groupRef.current.scale.setScalar(revealRef.current)
      // Only show Html overlays when spaceship is close enough
      const nearby = dist < 30
      if (nearby !== isNearby) setIsNearby(nearby)
    }

    // Pulse glow border
    if (glowRef.current && glowRef.current.material instanceof THREE.MeshBasicMaterial) {
      glowRef.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank')
  }

  const handleDownloadCV = () => {
    const link = document.createElement('a')
    link.href = '/cv/cv rayen.pdf'
    link.download = 'Rayen_Sahmim_CV.pdf'
    link.click()
  }

  return (
    <group ref={groupRef} position={position}>
      {/* Background panel */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[14, 9]} />
        <meshBasicMaterial
          color={0x1e1b4b}
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Animated glow border */}
      <mesh ref={glowRef} position={[0, 0, -0.06]}>
        <planeGeometry args={[14.4, 9.4]} />
        <meshBasicMaterial
          color={0x6366f1}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Hero Name */}
      <Text
        position={[0, 3, 0.1]}
        fontSize={1.1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={12}
        outlineWidth={0.03}
        outlineColor="#6366f1"
      >
        {personalData.name}
      </Text>

      {/* Title */}
      <Text
        position={[0, 1.6, 0.1]}
        fontSize={0.45}
        color="#a78bfa"
        anchorX="center"
        anchorY="middle"
        maxWidth={12}
      >
        {personalData.title}
      </Text>

      {/* Description */}
      <Text
        position={[0, 0.2, 0.1]}
        fontSize={0.22}
        color="#e2e8f0"
        anchorX="center"
        anchorY="middle"
        maxWidth={10}
        textAlign="center"
        lineHeight={1.4}
      >
        {personalData.description}
      </Text>

      {/* Interactive buttons — only visible when nearby */}
      {isNearby && <Html
        position={[0, -2, 0.2]}
        center
        transform
        sprite
        style={{
          width: "420px",
          pointerEvents: "auto",
        }}
      >
        <div className="flex flex-wrap gap-3 justify-center">
          {navigationData.socialLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => handleLinkClick(link.url)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600/90 hover:bg-indigo-500 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-indigo-400/40 hover:scale-105"
            >
              {link.icon === 'Github' && <Github className="w-4 h-4" />}
              {link.icon === 'Linkedin' && <Linkedin className="w-4 h-4" />}
              {link.icon === 'Mail' && <Mail className="w-4 h-4" />}
              <span className="text-sm font-medium">{link.name}</span>
            </button>
          ))}
          <button
            onClick={handleDownloadCV}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-purple-400/40 hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Download CV</span>
          </button>
        </div>
      </Html>}


    </group>
  )
}
