"use client"

import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

export function FollowCamera() {
  const { camera, scene } = useThree()
  const shipRef = useRef<THREE.Object3D | null>(null)
  const initialFOV = 75

  useFrame((_, dt) => {
    if (!shipRef.current) {
      shipRef.current = scene.getObjectByName("spaceship") ?? null
      if (!shipRef.current) return
    }

    const isMovingForward = shipRef.current.userData.isMovingForward ?? false
    const velocity = shipRef.current.userData.velocity ?? new THREE.Vector3()
    const speed = velocity.length()

    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFOV = initialFOV + speed * 2.5
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFOV, dt * 1.2)
      camera.updateProjectionMatrix()
    }

    let shakeIntensity = 0
    if (isMovingForward && speed > 1.0) {
      shakeIntensity = Math.min(speed / 40, 0.01)
    }

    const shake = new THREE.Vector3(
      (Math.random() - 0.5) * shakeIntensity,
      (Math.random() - 0.5) * shakeIntensity,
      (Math.random() - 0.5) * shakeIntensity,
    )

    const offset = new THREE.Vector3(0, 3, 6)
    offset.applyQuaternion(shipRef.current.quaternion)

    const targetPos = shipRef.current.position.clone().add(offset).add(shake)
    camera.position.lerp(targetPos, 0.035)

    // Smooth look-at with slight ahead offset
    const lookTarget = shipRef.current.position.clone()
    lookTarget.z -= 2
    camera.lookAt(lookTarget)
  })

  return null
}
