"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Box } from "@react-three/drei"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Group } from "three"

function FloatingLaptop() {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      {/* Laptop Base */}
      <Box args={[2.5, 0.15, 1.8]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
      </Box>

      {/* Laptop Screen */}
      <Box args={[2.5, 1.5, 0.08]} position={[0, 0.2, -0.85]} rotation={[-0.15, 0, 0]}>
        <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.05} />
      </Box>

      {/* Screen Content */}
      <Box args={[2.2, 1.2, 0.02]} position={[0, 0.2, -0.81]} rotation={[-0.15, 0, 0]}>
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.5} />
      </Box>

      {/* Code Lines */}
      <Box args={[1.8, 0.08, 0.01]} position={[-0.2, 0.4, -0.8]} rotation={[-0.15, 0, 0]}>
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.7} />
      </Box>
      <Box args={[1.5, 0.08, 0.01]} position={[-0.35, 0.25, -0.8]} rotation={[-0.15, 0, 0]}>
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.7} />
      </Box>
      <Box args={[1.9, 0.08, 0.01]} position={[-0.15, 0.1, -0.8]} rotation={[-0.15, 0, 0]}>
        <meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={0.7} />
      </Box>
      <Box args={[1.6, 0.08, 0.01]} position={[-0.3, -0.05, -0.8]} rotation={[-0.15, 0, 0]}>
        <meshStandardMaterial color="#ddd6fe" emissive="#ddd6fe" emissiveIntensity={0.7} />
      </Box>

      {/* Floating Elements */}
      <Box args={[0.4, 0.4, 0.4]} position={[2, 0.8, 0.5]} rotation={[0.5, 0.5, 0]}>
        <meshStandardMaterial
          color="#6366f1"
          metalness={0.8}
          roughness={0.2}
          emissive="#6366f1"
          emissiveIntensity={0.2}
        />
      </Box>
      <Box args={[0.3, 0.3, 0.3]} position={[-1.8, 1.2, 0.3]} rotation={[0.3, 0.8, 0.2]}>
        <meshStandardMaterial
          color="#8b5cf6"
          metalness={0.8}
          roughness={0.2}
          emissive="#8b5cf6"
          emissiveIntensity={0.2}
        />
      </Box>
      <Box args={[0.25, 0.25, 0.25]} position={[1.5, -0.8, 1]} rotation={[0.8, 0.3, 0.5]}>
        <meshStandardMaterial
          color="#a855f7"
          metalness={0.8}
          roughness={0.2}
          emissive="#a855f7"
          emissiveIntensity={0.2}
        />
      </Box>
    </group>
  )
}

export function Portfolio3D() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] hidden lg:block opacity-60">
      <Canvas camera={{ position: [0, 2, 8] }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#8b5cf6" />
        <pointLight position={[10, -5, 5]} intensity={0.6} color="#6366f1" />
        <pointLight position={[0, 10, 0]} intensity={0.4} color="#a855f7" />
        <FloatingLaptop />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
    </div>
  )
}
