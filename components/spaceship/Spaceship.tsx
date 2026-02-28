"use client"

import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF, useKeyboardControls } from "@react-three/drei"
import * as THREE from "three"
import { TrailLine } from "./TrailLine"

interface SpaceshipProps {
  updatePlayerPosition?: (
    position: THREE.Vector3,
    rotation: THREE.Euler,
    velocity: THREE.Vector3,
    isMovingForward: boolean,
  ) => void
  shipRef?: React.RefObject<THREE.Group | null>
}

export function Spaceship({ updatePlayerPosition, shipRef: externalShipRef }: SpaceshipProps) {
  const { scene } = useGLTF("/models/spaceship.glb")
  const internalShipRef = useRef<THREE.Group>(null)
  const shipRef = externalShipRef || internalShipRef
  const [, getKeys] = useKeyboardControls()
  const fireRefs = useRef<THREE.Group[]>([])
  const flame = useRef(0)
  const vel = useRef(new THREE.Vector3())
  const rot = useRef(new THREE.Euler())

  // Set initial position at the start of the portfolio journey
  useEffect(() => {
    if (shipRef.current) {
      // Start at the beginning of the portfolio journey
      shipRef.current.position.set(0, 0, 195) // Start at portfolio beginning
    }
  }, [])

  useFrame((_, dt) => {
    if (!shipRef.current) return

    // Check for reset signal (from completion retry)
    if ((window as any).__spaceshipReset) {
      ;(window as any).__spaceshipReset = false
      shipRef.current.position.set(0, 0, 195)
      vel.current.set(0, 0, 0)
      flame.current = 0
      return
    }

    const { forward, backward, left, right, up, down } = getKeys()
    const touchControls = (window as any).touchControls || {}

    // Define path boundaries for the complete portfolio journey
    const START_BOUNDARY = 195
    const END_BOUNDARY = -220  // Stop at end of portfolio journey

    const isForward = forward || touchControls.forward
    const isBackward = backward || touchControls.backward

    // Smooth movement along Z-axis
    if (isForward && shipRef.current.position.z > END_BOUNDARY) {
      vel.current.z -= 2.5 * dt
      flame.current = Math.min(flame.current + dt * 2, 1)
      shipRef.current.userData.isMovingForward = true
    } else if (isBackward && shipRef.current.position.z < START_BOUNDARY) {
      vel.current.z += 2 * dt
      flame.current = Math.max(flame.current - dt * 1.5, 0)
      shipRef.current.userData.isMovingForward = false
    } else {
      flame.current = Math.max(flame.current - dt * 1.5, 0)
      shipRef.current.userData.isMovingForward = false
    }

    // Apply only Z-axis velocity
    shipRef.current.position.z += vel.current.z

    // Enforce both boundaries
    if (shipRef.current.position.z > START_BOUNDARY) {
      shipRef.current.position.z = START_BOUNDARY
      vel.current.z = 0
    }
    if (shipRef.current.position.z < END_BOUNDARY) {
      shipRef.current.position.z = END_BOUNDARY
      vel.current.z = 0
    }

    // Gradual slowdown near boundaries (soft brake)
    const distToEnd = shipRef.current.position.z - END_BOUNDARY
    const distToStart = START_BOUNDARY - shipRef.current.position.z
    if (distToEnd < 15 && vel.current.z < 0) {
      vel.current.z *= 0.92 + (distToEnd / 15) * 0.06
    }
    if (distToStart < 15 && vel.current.z > 0) {
      vel.current.z *= 0.92 + (distToStart / 15) * 0.06
    }

    // Reset X and Y movement to keep on straight line
    vel.current.x = 0
    vel.current.y = 0

    // Keep spaceship centered on straight path
    shipRef.current.position.x = 0
    shipRef.current.position.y = 0

    // Smooth damping
    vel.current.z *= 0.94

    // Limit speed
    const maxSpeed = 0.6
    if (Math.abs(vel.current.z) > maxSpeed) {
      vel.current.z = vel.current.z > 0 ? maxSpeed : -maxSpeed
    }

    // Store velocity for other systems
    shipRef.current.userData.velocity = vel.current.clone()

    // Expose position for HUD section indicator
    if (typeof window !== "undefined") {
      ;(window as any).__spaceshipZ = shipRef.current.position.z
    }

    // Gentle nose tilt based on velocity for visual feedback
    const tiltX = -vel.current.z * 0.15
    shipRef.current.rotation.x = THREE.MathUtils.lerp(shipRef.current.rotation.x, tiltX, 0.06)
    shipRef.current.rotation.y = 0
    shipRef.current.rotation.z = 0

    // Engine flame effects
    fireRefs.current.forEach((f, i) => {
      if (!f) return
      if (flame.current < 0.15) {
        f.visible = false
        f.scale.setScalar(0)
      } else {
        f.visible = true
        const oscillation = Math.sin(_.clock.elapsedTime * 4 + i * 0.8) * 0.1
        const scale = flame.current * (0.9 + oscillation)
        f.scale.setScalar(scale)
      }
    })

    if (updatePlayerPosition) {
      updatePlayerPosition(
        shipRef.current.position.clone(),
        shipRef.current.rotation.clone(),
        vel.current.clone(),
        shipRef.current.userData.isMovingForward,
      )
    }
  })

  return (
    <>
      <group ref={shipRef} name="spaceship">
        <primitive object={scene} scale={0.3} />
        {[...Array(4)].map((_, i) => (
          <group key={i} ref={(el) => (fireRefs.current[i] = el!)} position={[-0.6 + i * 0.3, 0.5, 2.2]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.3, 2, 8]} />
              <meshBasicMaterial color="#0088ff" transparent opacity={0.7} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.25]}>
              <coneGeometry args={[0.15, 1.5, 6]} />
              <meshBasicMaterial color="#00aaff" transparent opacity={0.8} />
            </mesh>
            <pointLight color="#0099ff" intensity={0.8} distance={8} />
          </group>
        ))}
        <TrailLine spaceshipRef={shipRef} />
      </group>
    </>
  )
}
