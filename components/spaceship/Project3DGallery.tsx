"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import * as THREE from "three"
import { Project3DCard } from "./Project3DCard"
import { GuidedPath } from "./GuidedPath"
import { ProgressLine } from "./ProgressLine"
import projectsData from "@/data/projects.json"

interface Project3DGalleryProps {
  onProjectSelect?: (project: any) => void
  spaceshipRef?: React.RefObject<THREE.Group | null>
}

export function Project3DGallery({ onProjectSelect, spaceshipRef }: Project3DGalleryProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  // Create a straight path for projects along Z-axis
  const createProjectPath = () => {
    const points: THREE.Vector3[] = []
    const pathPoints: THREE.Vector3[] = []
    
    projectsData.projects.forEach((_, index) => {
      // Simple straight line along Z-axis, starting from positive Z and going to negative Z
      const z = 30 - (index * 10) // Start at Z=30 and move toward negative values
      const x = 0 // Keep on center line
      const y = 0 // Keep at same height
      
      const position = new THREE.Vector3(x, y, z)
      points.push(position)
    })
    
    // Create extended straight path for smooth spaceship movement
    const extendedPath: THREE.Vector3[] = []
    
    // Add start extension (straight line before first project)
    const firstPoint = points[0]
    for (let i = 3; i >= 1; i--) {
      extendedPath.push(new THREE.Vector3(0, 0, firstPoint.z + i * 10))
    }
    
    // Add all project points
    extendedPath.push(...points)
    
    // Add intermediate points for smoother path visualization
    for (let i = 0; i < points.length - 1; i++) {
      const currentZ = points[i].z
      const nextZ = points[i + 1].z
      const midZ = (currentZ + nextZ) / 2
      pathPoints.push(new THREE.Vector3(0, 0, midZ))
    }
    
    // Add end extension (straight line after last project)
    const lastPoint = points[points.length - 1]
    for (let i = 1; i <= 3; i++) {
      extendedPath.push(new THREE.Vector3(0, 0, lastPoint.z - i * 10))
    }
    
    return { projectPositions: points, pathPoints: extendedPath }
  }

  const { projectPositions, pathPoints } = createProjectPath()

  // No rotation - keep projects static for easier navigation
  useFrame(() => {
    // Optional: gentle floating animation for the entire gallery
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(Date.now() * 0.0005) * 0.1
    }
  })

  const handleProjectInteract = (project: any) => {
    setSelectedProject(project)
    if (onProjectSelect) {
      onProjectSelect(project)
    }
    
    // Don't automatically open links - let the modal handle user choice
    // Modal will provide buttons for users to choose what they want to open
  }

  return (
    <group ref={groupRef}>
      {/* Guided path for spaceship */}
      <GuidedPath 
        spaceshipRef={spaceshipRef || { current: null }} 
        pathPoints={pathPoints}
        showPath={true}
      />

      {/* Progress visualization */}
      <ProgressLine
        spaceshipRef={spaceshipRef || { current: null }}
        pathPoints={pathPoints}
      />

      {/* Central title above the path */}
      <Text
        position={[0, 8, 50]} 
        fontSize={2}
        color="#6366f1"
        anchorX="center"
        anchorY="middle"
      >
        PROJECT GALLERY
      </Text>

      <Text
        position={[0, 5, 50]}
        fontSize={0.8}
        color="#8b5cf6"
        anchorX="center"
        anchorY="middle"
        maxWidth={20}
      >
        Follow the glowing path to explore projects
      </Text>

      {/* Project cards along the curved path */}
      {projectsData.projects.map((project, index) => (
        <Project3DCard
          key={project.order}
          project={project}
          position={[projectPositions[index].x, projectPositions[index].y, projectPositions[index].z]}
          onInteract={handleProjectInteract}
        />
      ))}

      {/* Path markers/indicators */}
      {projectPositions.map((position, index) => (
        <group key={`marker-${index}`} position={[position.x, position.y - 6, position.z]}>
          <mesh>
            <cylinderGeometry args={[0.15, 0.15, 0.5]} />
            <meshBasicMaterial
              color={0x10b981}
              transparent
              opacity={0.6}
            />
          </mesh>
          <Text
            position={[0, -1, 0]}
            fontSize={0.3}
            color="#10b981"
            anchorX="center"
            anchorY="middle"
          >
            {`${index + 1}`}
          </Text>
        </group>
      ))}

      {/* Start and end indicators */}
      <Text
        position={[pathPoints[0].x, pathPoints[0].y + 2, pathPoints[0].z]}
        fontSize={0.8}
        color="#10b981"
        anchorX="center"
        anchorY="middle"
      >
        START
      </Text>

      <Text
        position={[pathPoints[pathPoints.length - 1].x, pathPoints[pathPoints.length - 1].y + 2, pathPoints[pathPoints.length - 1].z]}
        fontSize={0.8}
        color="#ef4444"
        anchorX="center"
        anchorY="middle"
      >
        END
      </Text>
    </group>
  )
}
