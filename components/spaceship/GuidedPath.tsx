"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface GuidedPathProps {
  spaceshipRef: React.RefObject<THREE.Group | null>
  pathPoints: THREE.Vector3[]
  showPath?: boolean
}

export function GuidedPath({ spaceshipRef, pathPoints, showPath = true }: GuidedPathProps) {
  const completedPathRef = useRef<THREE.Mesh>(null)
  const uncompletedPathRef = useRef<THREE.Mesh>(null)
  
  // Create materials
  const activeMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0x00ff88, // Bright green for completed path
    transparent: true,
    opacity: 0.8,
  }), [])

  const inactiveMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0x222222, // Very dark gray for uncompleted path
    transparent: true,
    opacity: 0.3,
  }), [])

  // Calculate path dimensions
  const startZ = pathPoints[0]?.z || -50
  const endZ = pathPoints[pathPoints.length - 1]?.z || 50
  const pathLength = endZ - startZ
  const centerZ = (startZ + endZ) / 2

  // Create the curve for smooth movement (keeping this for spaceship navigation)
  const curve = new THREE.CatmullRomCurve3(pathPoints, false, 'catmullrom', 0.1)
  
  useFrame((state) => {
    if (!spaceshipRef.current || !completedPathRef.current || !uncompletedPathRef.current) return

    const spaceshipZ = spaceshipRef.current.position.z
    
    // Calculate progress (0 to 1)
    const progress = Math.max(0, Math.min(1, (spaceshipZ - startZ) / pathLength))

    // Update completed path scale and position
    completedPathRef.current.scale.z = progress
    completedPathRef.current.position.z = startZ + (pathLength * progress) / 2

    // Update uncompleted path scale and position
    const remainingProgress = 1 - progress
    uncompletedPathRef.current.scale.z = remainingProgress
    uncompletedPathRef.current.position.z = spaceshipZ + (pathLength * remainingProgress) / 2

    // Animate the active material with a subtle glow
    activeMaterial.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 3) * 0.1
  })

  // Helper function to get closest point on curve
  const getClosestPointOnCurve = (position: THREE.Vector3) => {
    let closestT = 0
    let minDistance = Infinity
    
    // Sample the curve to find closest point
    for (let t = 0; t <= 1; t += 0.001) {
      const point = curve.getPoint(t)
      const distance = position.distanceTo(point)
      if (distance < minDistance) {
        minDistance = distance
        closestT = t
      }
    }
    
    return { t: closestT, point: curve.getPoint(closestT), distance: minDistance }
  }

  // Expose utility functions globally for spaceship to use
  if (typeof window !== 'undefined') {
    (window as any).guidedPath = {
      curve,
      getClosestPointOnCurve,
      constrainToPath: (position: THREE.Vector3, maxDistance: number = 5) => {
        const closest = getClosestPointOnCurve(position)
        if (closest.distance > maxDistance) {
          // Gradually pull back to path
          const direction = closest.point.clone().sub(position).normalize()
          return position.clone().add(direction.multiplyScalar(0.1))
        }
        return position
      }
    }
  }

  if (!showPath) return null

  return (
    <group>
      {/* Uncompleted path (dark/inactive) */}
      <mesh ref={uncompletedPathRef} position={[0, 0, centerZ]}>
        <boxGeometry args={[0.3, 0.1, pathLength]} />
        <primitive object={inactiveMaterial} attach="material" />
      </mesh>

      {/* Completed path (bright/active) */}
      <mesh ref={completedPathRef} position={[0, 0.05, startZ]}>
        <boxGeometry args={[0.4, 0.15, pathLength]} />
        <primitive object={activeMaterial} attach="material" />
      </mesh>
    </group>
  )
}
