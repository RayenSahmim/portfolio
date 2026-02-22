"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function TrailLine({
  spaceshipRef,
}: {
  spaceshipRef: React.RefObject<THREE.Group | null>
}) {
  const groupRef = useRef<THREE.Group>(null)
  const trailPositions = useRef<THREE.Vector3[]>([])
  const maxTrailLength = 30

  // Create pipe-shaped trail materials
  const pipeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      }),
    [],
  )

  const pipeGlowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x0088ff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      }),
    [],
  )

  // Create trail segments
  const trailSegments = useMemo(() => {
    const segments: { pipe: THREE.Mesh; glow: THREE.Mesh }[] = []
    
    for (let i = 0; i < maxTrailLength; i++) {
      // Main pipe
      const pipeGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.8, 8)
      const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial)
      
      // Glow effect
      const glowGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.9, 8)
      const glow = new THREE.Mesh(glowGeometry, pipeGlowMaterial)
      
      segments.push({ pipe, glow })
    }
    
    return segments
  }, [pipeMaterial, pipeGlowMaterial])

  useFrame((state) => {
    if (!groupRef.current || !spaceshipRef.current) return

    const isMovingForward = spaceshipRef.current.userData.isMovingForward ?? false
    const vel: THREE.Vector3 = spaceshipRef.current.userData.velocity ?? new THREE.Vector3()
    const speed = vel.length()

    // Only show trail when moving forward with sufficient speed
    groupRef.current.visible = isMovingForward && speed > 0.1

    if (!groupRef.current.visible) {
      trailPositions.current = [] // Clear trail when not moving
      return
    }

    // Add current spaceship position to trail (behind the spaceship)
    const currentPos = spaceshipRef.current.position.clone()
    currentPos.z += 2.5 // Position trail behind spaceship
    currentPos.y -= 0.3 // Position trail below spaceship
    
    trailPositions.current.unshift(currentPos)
    
    // Limit trail length
    if (trailPositions.current.length > maxTrailLength) {
      trailPositions.current.pop()
    }

    // Update trail segments
    trailSegments.forEach((segment, i) => {
      if (i < trailPositions.current.length - 1) {
        const currentPoint = trailPositions.current[i]
        const nextPoint = trailPositions.current[i + 1]
        
        // Calculate position and rotation for pipe segment
        const midPoint = new THREE.Vector3().lerpVectors(currentPoint, nextPoint, 0.5)
        const direction = new THREE.Vector3().subVectors(nextPoint, currentPoint).normalize()
        
        // Position the segment
        segment.pipe.position.copy(midPoint)
        segment.glow.position.copy(midPoint)
        
        // Align pipe with direction of movement
        const up = new THREE.Vector3(0, 1, 0)
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction)
        segment.pipe.setRotationFromQuaternion(quaternion)
        segment.glow.setRotationFromQuaternion(quaternion)
        
        // Fade effect based on distance from spaceship
        const fadeFactor = 1 - (i / maxTrailLength)
        const speedFactor = Math.min(speed / 2, 1)
        
        // Type-safe material opacity updates
        const pipeOpacity = 0.6 * fadeFactor * speedFactor
        const glowOpacity = 0.3 * fadeFactor * speedFactor
        
        if (segment.pipe.material instanceof THREE.Material) {
          segment.pipe.material.opacity = pipeOpacity
        }
        if (segment.glow.material instanceof THREE.Material) {
          segment.glow.material.opacity = glowOpacity
        }
        
        // Scale based on speed and position
        const scale = 0.5 + (speedFactor * 0.5) + (fadeFactor * 0.3)
        segment.pipe.scale.setScalar(scale)
        segment.glow.scale.setScalar(scale * 1.2)
        
        segment.pipe.visible = true
        segment.glow.visible = true
      } else {
        segment.pipe.visible = false
        segment.glow.visible = false
      }
    })

    // Animate material colors
    const time = state.clock.elapsedTime
    const colorIntensity = 0.5 + Math.sin(time * 3) * 0.3
    pipeMaterial.color.setRGB(0, colorIntensity * 0.7, colorIntensity)
    pipeGlowMaterial.color.setRGB(0, colorIntensity * 0.5, colorIntensity * 0.8)
  })

  return (
    <group ref={groupRef}>
      {trailSegments.map((segment, i) => (
        <group key={i}>
          <primitive object={segment.glow} />
          <primitive object={segment.pipe} />
        </group>
      ))}
    </group>
  )
}
