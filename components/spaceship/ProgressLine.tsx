"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface ProgressLineProps {
  spaceshipRef: React.RefObject<THREE.Group | null>
  pathPoints: THREE.Vector3[]
}

export function ProgressLine({ spaceshipRef, pathPoints }: ProgressLineProps) {
  const completedBarRef = useRef<THREE.Mesh>(null)

  // Create materials
  const completedMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0x00ff88, // Bright green for completed path
    transparent: true,
    opacity: 0.8,
  }), [])

  // Calculate path dimensions
  const startZ = pathPoints[0]?.z || -50
  const endZ = pathPoints[pathPoints.length - 1]?.z || 50
  const pathLength = endZ - startZ
  const centerZ = (startZ + endZ) / 2

  useFrame((state) => {
    if (!spaceshipRef.current || !completedBarRef.current) return

    const spaceshipZ = spaceshipRef.current.position.z
    
    // Calculate progress (0 to 1)
    const progress = Math.max(0, Math.min(1, (spaceshipZ - startZ) / pathLength))

    // Update completed bar scale
    completedBarRef.current.scale.z = progress
    completedBarRef.current.position.z = startZ + (pathLength * progress) / 2

    // Animate materials
    completedMaterial.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.2
  })

  return (
    <group>
      {/* Completed progress bar */}
      <mesh ref={completedBarRef} position={[0, 3, startZ]}>
        <boxGeometry args={[0.4, 0.2, pathLength]} />
        <primitive object={completedMaterial} attach="material" />
      </mesh>

      {/* Start marker */}
      <mesh position={[0, 3.5, startZ]}>
        <cylinderGeometry args={[0.15, 0.15, 0.5]} />
        <meshBasicMaterial color={0x00ff00} transparent opacity={0.6} />
      </mesh>

      {/* End marker */}
      <mesh position={[0, 3.5, endZ]}>
        <cylinderGeometry args={[0.15, 0.15, 0.5]} />
        <meshBasicMaterial color={0xff0000} transparent opacity={0.6} />
      </mesh>
    </group>
  )
}
