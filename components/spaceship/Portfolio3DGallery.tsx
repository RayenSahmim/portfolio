"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import * as THREE from "three"
import { Hero3D } from "./Hero3D"
import { About3D } from "./About3D"
import { Skills3D } from "./Skills3D"
import { Project3DCard } from "./Project3DCard"
import { Certificates3D } from "./Certificates3D"
import { WormholePortal, SpaceDecor } from "./WormholePortal"
import projectsData from "@/data/projects.json"

interface Portfolio3DGalleryProps {
  onProjectSelect?: (project: any) => void
  spaceshipRef?: React.RefObject<THREE.Group | null>
}

// ---- SECTION LAYOUT ----
// Generous spacing so you truly explore the void between each zone.
const SECTIONS = [
  { name: "Hero",         z: 160, color: 0x6366f1, accent: "#818cf8" },
  { name: "About",        z: 90,  color: 0x06b6d4, accent: "#22d3ee" },
  { name: "Skills",       z: 20,  color: 0x10b981, accent: "#34d399" },
  { name: "Projects",     z: -60, color: 0xf59e0b, accent: "#fbbf24" },
  { name: "Certificates", z: -190, color: 0x8b5cf6, accent: "#a78bfa" },
] as const

/* ---- FINISH LINE with proximity reveal ---- */
function FinishLine({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)
  const revealRef = useRef(0)
  const { scene } = useThree()

  // Banner dimensions: wide rectangle
  const cols = 14
  const rows = 4
  const cellSize = 0.9
  const bannerWidth = cols * cellSize
  const bannerHeight = rows * cellSize
  const poleHeight = bannerHeight + 3 // poles extend below and above banner
  const bannerCenterY = 4 // vertical center of the banner

  useFrame(() => {
    if (!groupRef.current) return
    const spaceship = scene.getObjectByName("spaceship")
    if (spaceship) {
      const dist = Math.abs(spaceship.position.z - position[2])
      const target = THREE.MathUtils.clamp(1 - (dist - 8) / 35, 0, 1)
      revealRef.current = THREE.MathUtils.lerp(revealRef.current, target, 0.06)
      groupRef.current.scale.setScalar(revealRef.current)
      groupRef.current.visible = revealRef.current > 0.02
    }
  })

  const checkerBoxes = useMemo(() => {
    const boxes: { pos: [number, number, number]; isWhite: boolean }[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        boxes.push({
          pos: [
            (c - (cols - 1) / 2) * cellSize,
            (r - (rows - 1) / 2) * cellSize + bannerCenterY,
            0,
          ],
          isWhite: (r + c) % 2 === 0,
        })
      }
    }
    return boxes
  }, [])

  const poleX = bannerWidth / 2 + 0.3

  return (
    <group ref={groupRef} position={position}>
      {/* Left pole */}
      <mesh position={[-poleX, bannerCenterY, 0]}>
        <cylinderGeometry args={[0.12, 0.12, poleHeight, 8]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Right pole */}
      <mesh position={[poleX, bannerCenterY, 0]}>
        <cylinderGeometry args={[0.12, 0.12, poleHeight, 8]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Horizontal bar top */}
      <mesh position={[0, bannerCenterY + bannerHeight / 2 + 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, bannerWidth + poleX * 0.4, 8]} />
        <meshStandardMaterial color="#999999" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Horizontal bar bottom */}
      <mesh position={[0, bannerCenterY - bannerHeight / 2 - 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, bannerWidth + poleX * 0.4, 8]} />
        <meshStandardMaterial color="#999999" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Checkered banner */}
      {checkerBoxes.map((box, i) => (
        <mesh key={`checker-${i}`} position={box.pos}>
          <boxGeometry args={[cellSize * 0.95, cellSize * 0.95, 0.08]} />
          <meshStandardMaterial
            color={box.isWhite ? "#ffffff" : "#111111"}
            emissive={box.isWhite ? "#ffffff" : "#000000"}
            emissiveIntensity={0.12}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
      ))}

      {/* FINISH label */}
      <Text
        position={[0, bannerCenterY + bannerHeight / 2 + 1.2, 0]}
        fontSize={1}
        color="#ef4444"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#7f1d1d"
      >
        FINISH
      </Text>
    </group>
  )
}

export function Portfolio3DGallery({ onProjectSelect, spaceshipRef }: Portfolio3DGalleryProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Project positions — alternating left/right, starting at Projects section z and spaced 16 units
  // Project positions — straight line along the path, centered
  const projectPositions = useMemo(() =>
    projectsData.projects.map((_, index) => {
      return [0, 0, -60 - index * 16] as [number, number, number]
    }), []
  )
  // Last project z = -60 - 5*16 = -140

  return (
    <group ref={groupRef}>
      {/* ===== WELCOME GATE ===== */}
      <Text
        position={[0, 5, 180]}
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
        position={[0, 2.8, 180]}
        fontSize={0.5}
        color="#a5b4fc"
        anchorX="center"
        anchorY="middle"
        maxWidth={18}
        textAlign="center"
      >
        Fly forward to explore · Press Q/↑ to move · S/↓ to reverse
      </Text>

      {/* ===== WORMHOLE PORTALS — replace old rings ===== */}
      {SECTIONS.map((section, i) => (
        <WormholePortal
          key={`portal-${i}`}
          position={[0, 0, section.z]}
          color={section.color}
          label={section.name.toUpperCase()}
          accent={section.accent}
        />
      ))}

      {/* ===== SPACE DECOR between sections ===== */}
      {/* Between Welcome → Hero */}
      <SpaceDecor startZ={180} endZ={165} seed={1} color={0x6366f1} />
      {/* Between Hero → About */}
      <SpaceDecor startZ={155} endZ={95} seed={2} color={0x4f46e5} />
      {/* Between About → Skills */}
      <SpaceDecor startZ={85} endZ={25} seed={3} color={0x0891b2} />
      {/* Between Skills → Projects */}
      <SpaceDecor startZ={15} endZ={-55} seed={4} color={0x059669} />
      {/* Between last project → Certificates */}
      <SpaceDecor startZ={-145} endZ={-185} seed={5} color={0x7c3aed} />
      {/* After Certificates */}
      <SpaceDecor startZ={-195} endZ={-220} seed={6} color={0x6d28d9} />

      {/* ===== SECTION CONTENT ===== */}
      <Hero3D position={[0, 0, 160]} />
      <About3D position={[0, 0, 90]} />
      <Skills3D position={[0, 0, 20]} />

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
      <Certificates3D position={[0, 0, -190]} />



      {/* Journey start / end labels */}
      <Text position={[0, 2.5, 190]} fontSize={0.65} color="#10b981" anchorX="center" anchorY="middle">
        ▶ START
      </Text>
      {/* Marathon checkered finish line with proximity reveal */}
      <FinishLine position={[0, 0, -210]} />

      {/* Section ambient lights (in addition to portal point lights) */}
      {SECTIONS.map((section, index) => (
        <pointLight
          key={`light-${index}`}
          position={[0, 5, section.z]}
          color={section.color}
          intensity={0.6}
          distance={35}
        />
      ))}
    </group>
  )
}
