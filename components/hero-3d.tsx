"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"

function AnimatedSphere() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2
      meshRef.current.rotation.y += 0.01
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <Sphere ref={meshRef} args={[1, 100, 200]} scale={1.2}>
      <MeshDistortMaterial color="#6366f1" attach="material" distort={0.3} speed={2} roughness={0.1} metalness={0.8} />
    </Sphere>
  )
}

export function Hero3D() {
  return (
    <div className="absolute right-10 top-1/2 transform -translate-y-1/2 w-80 h-80 hidden lg:block">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#8b5cf6" />
        <pointLight position={[5, 5, 5]} intensity={0.6} color="#6366f1" />
        <AnimatedSphere />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
