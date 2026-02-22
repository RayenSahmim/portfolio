"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import * as THREE from "three"
import { Hero3D } from "./Hero3D"
import { About3D } from "./About3D"
import { Skills3D } from "./Skills3D"
import { Project3DCard } from "./Project3DCard"
import { Certificates3D } from "./Certificates3D"
import projectsData from "@/data/projects.json"

interface Portfolio3DGalleryProps {
  onProjectSelect?: (project: any) => void
  spaceshipRef?: React.RefObject<THREE.Group | null>
}

// Section definitions with colors
const SECTIONS = [
  { name: "Hero", z: 80, color: 0x6366f1 },
  { name: "About", z: 55, color: 0x06b6d4 },
  { name: "Skills", z: 30, color: 0x10b981 },
  { name: "Projects", z: 5, color: 0xf59e0b },
  { name: "Certificates", z: -60, color: 0x8b5cf6 },
] as const

export function Portfolio3DGallery({ onProjectSelect, spaceshipRef }: Portfolio3DGalleryProps) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRefs = useRef<THREE.Mesh[]>([])

  // Project positions along the main path — alternating left/right but close to center
  const projectPositions = useMemo(() =>
    projectsData.projects.map((_, index) => {
      const side = index % 2 === 0 ? -1 : 1
      return [side * 4.5, 0, 5 - index * 12] as [number, number, number]
    }), []
  )

  useFrame((state) => {
    // Animate ring gates — gentle rotation + pulse
    ringRefs.current.forEach((ring, i) => {
      if (!ring) return
      ring.rotation.z = state.clock.elapsedTime * 0.15 + i * 0.5
      const pulse = 0.3 + Math.sin(state.clock.elapsedTime * 1.2 + i) * 0.12
      if (ring.material instanceof THREE.MeshBasicMaterial) {
        ring.material.opacity = pulse
      }
    })
  })

  return (
    <group ref={groupRef}>
      {/* ===== WELCOME GATE ===== */}
      <Text
        position={[0, 5, 100]}
        fontSize={1.8}
        color="#6366f1"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#1e1b4b"
      >
        PORTFOLIO JOURNEY
      </Text>
      <Text
        position={[0, 2.8, 100]}
        fontSize={0.5}
        color="#a5b4fc"
        anchorX="center"
        anchorY="middle"
        maxWidth={18}
        textAlign="center"
      >
        Fly forward to explore · Press Q/↑ to move · S/↓ to reverse
      </Text>

      {/* Ring gate portals between sections */}
      {SECTIONS.map((section, i) => (
        <mesh
          key={`ring-${i}`}
          ref={(el) => { if (el) ringRefs.current[i] = el }}
          position={[0, 0, section.z]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[9, 0.08, 16, 80]} />
          <meshBasicMaterial color={section.color} transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* ===== SECTION CONTENT ===== */}
      <Hero3D position={[0, 0, 80]} />
      <About3D position={[0, 0, 55]} />
      <Skills3D position={[0, 0, 30]} />

      {/* Projects section title */}
      <Text
        position={[0, 6, 15]}
        fontSize={1.2}
        color="#f59e0b"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#451a03"
      >
        PROJECTS
      </Text>
      <Text
        position={[0, 4, 15]}
        fontSize={0.4}
        color="#fcd34d"
        anchorX="center"
        anchorY="middle"
        maxWidth={16}
        textAlign="center"
      >
        Fly through the corridor to discover each project
      </Text>

      {/* Project cards along the path — alternating left/right */}
      {projectsData.projects.map((project: any, index: number) => (
        <Project3DCard
          key={project.title}
          project={project}
          position={projectPositions[index]}
          onInteract={() => onProjectSelect?.(project)}
        />
      ))}

      {/* Certificates Section */}
      <Certificates3D position={[0, 0, -60]} />

      {/* ===== SECTION LANE MARKERS ===== */}
      {SECTIONS.map((section, index) => (
        <group key={`marker-${index}`}>
          {/* Side beacon left */}
          <mesh position={[-11, -2, section.z]}>
            <cylinderGeometry args={[0.15, 0.15, 3, 8]} />
            <meshBasicMaterial color={section.color} transparent opacity={0.5} />
          </mesh>
          <Text
            position={[-11, 1.2, section.z]}
            fontSize={0.4}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {section.name.toUpperCase()}
          </Text>
          {/* Side beacon right */}
          <mesh position={[11, -2, section.z]}>
            <cylinderGeometry args={[0.15, 0.15, 3, 8]} />
            <meshBasicMaterial color={section.color} transparent opacity={0.5} />
          </mesh>
        </group>
      ))}

      {/* Journey start / end labels */}
      <Text position={[0, 2.5, 108]} fontSize={0.65} color="#10b981" anchorX="center" anchorY="middle">
        ▶ START
      </Text>
      <Text position={[0, 2.5, -78]} fontSize={0.65} color="#ef4444" anchorX="center" anchorY="middle">
        ■ END
      </Text>

      {/* Section ambient lights */}
      {SECTIONS.map((section, index) => (
        <pointLight
          key={`light-${index}`}
          position={[0, 3, section.z]}
          color={section.color}
          intensity={0.5}
          distance={20}
        />
      ))}
    </group>
  )
}
