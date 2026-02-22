"use client"

import { useRef, useState, useMemo, useEffect } from "react"
import { useFrame, useThree, useLoader } from "@react-three/fiber"
import { Text, Html } from "@react-three/drei"
import * as THREE from "three"
import { ExternalLink, Github, Star, Bot } from "lucide-react"

interface Project {
  order: number
  title: string
  description: string
  image: string
  technologies: string[]
  live: string
  featured: boolean
  github?: string
  repositories?: {
    frontend?: string
    backend?: string
  }
}

interface Project3DCardProps {
  project: Project
  position: [number, number, number]
  onInteract?: (project: Project) => void
}

export function Project3DCard({ project, position, onInteract }: Project3DCardProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [showDetailsOverlay, setShowDetailsOverlay] = useState(false)
  const { camera, scene } = useThree()
  const revealRef = useRef(0.1)

  // Calculate distance from camera for LOD
  const [distance, setDistance] = useState(0)
  
  // Stable hover timeout to prevent flickering
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load project image as texture
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  useEffect(() => {
    if (project.image && project.image !== "/placeholder.svg") {
      const loader = new THREE.TextureLoader()
      loader.load(
        project.image,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace
          setTexture(tex)
        },
        undefined,
        () => setTexture(null) // on error, fallback to color
      )
    }
  }, [project.image])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return

    // Calculate distance from camera
    const dist = camera.position.distanceTo(meshRef.current.position)
    setDistance(dist)

    // Gentle floating animation
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.2

    // Gentle rotation
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2 + position[0]) * 0.1

    // Scale based on interaction
    const targetScale = hovered ? 1.1 : clicked ? 0.9 : 1
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

    // Always face the camera slightly
    const lookAtPosition = camera.position.clone()
    lookAtPosition.y = meshRef.current.position.y // Keep same Y level
    meshRef.current.lookAt(lookAtPosition)

    // Proximity-based reveal
    const spaceship = scene.getObjectByName("spaceship")
    if (spaceship) {
      const dist = Math.abs(spaceship.position.z - position[2])
      const target = THREE.MathUtils.clamp(1 - (dist - 5) / 20, 0.05, 1)
      revealRef.current = THREE.MathUtils.lerp(revealRef.current, target, 0.05)
      // Apply to the parent group via the mesh
      if (meshRef.current.parent) {
        meshRef.current.parent.scale.setScalar(revealRef.current)
      }
    }
  })

  // Create material with project image or holographic fallback
  const cardMaterial = useMemo(() => {
    if (texture) {
      return new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
      })
    }
    return new THREE.MeshBasicMaterial({
      color: project.featured ? 0x6366f1 : 0x3b82f6,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    })
  }, [project.featured, texture])

  // Create glow material for border
  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: project.featured ? 0x8b5cf6 : 0x06b6d4,
      transparent: true,
      opacity: hovered ? 0.6 : 0.3,
      side: THREE.BackSide,
    })
  }, [project.featured, hovered])

  const handleClick = () => {
    setClicked(true)
    setTimeout(() => setClicked(false), 150)
    if (onInteract) {
      onInteract(project)
    }
  }

  // Stable hover handlers to prevent flickering
  const handlePointerOver = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setHovered(true)
    if (distance < 15) {
      setShowDetailsOverlay(true)
    }
  }

  const handlePointerOut = () => {
    setHovered(false)
    // Delay hiding details to prevent flickering
    hoverTimeoutRef.current = setTimeout(() => {
      setShowDetailsOverlay(false)
    }, 200)
  }

  // Only show detailed content if close enough
  const showDetails = distance < 15
  const showTitle = distance < 25

  return (
    <group position={position}>
      {/* Main card mesh */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[4, 2.5]} />
        <primitive object={cardMaterial} attach="material" />
      </mesh>

      {/* Glow effect */}
      <mesh position={[0, 0, -0.01]} scale={[1.05, 1.05, 1.05]}>
        <planeGeometry args={[4, 2.5]} />
        <primitive object={glowMaterial} attach="material" />
      </mesh>

      {/* Featured star indicator */}
      {project.featured && (
        <mesh position={[1.5, 1, 0.1]}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color={0xffd700} />
        </mesh>
      )}

      {/* 3D Text Title (visible from medium distance) — below the card */}
      {showTitle && (
        <Text
          position={[0, -1.6, 0.1]}
          fontSize={0.22}
          color={project.featured ? "#8b5cf6" : "#06b6d4"}
          anchorX="center"
          anchorY="middle"
          maxWidth={3.8}
          outlineWidth={0.015}
          outlineColor="#000000"
        >
          {project.title}
        </Text>
      )}

      {/* Detailed HTML overlay (visible from close distance) */}
      {showDetailsOverlay && (
        <Html
          position={[0, 0, 0.2]}
          center
          transform
          sprite
          style={{
            width: "300px",
            pointerEvents: "auto",
          }}
          onPointerEnter={handlePointerOver}
          onPointerLeave={handlePointerOut}
        >
          <div className="bg-gray-900/95 backdrop-blur-sm border border-indigo-400/50 rounded-lg p-4 text-white text-sm">
            <h3 className="font-bold text-indigo-400 mb-2">{project.title}</h3>
            <p className="text-gray-300 text-xs mb-3 line-clamp-3">{project.description}</p>
            
            {/* Technologies */}
            <div className="flex flex-wrap gap-1 mb-3">
              {project.technologies.slice(0, 4).map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-indigo-500/20 text-xs rounded border border-indigo-400/30"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="px-2 py-1 bg-gray-500/20 text-xs rounded">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 text-xs">
              {project.github && (
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded">
                  <Github className="w-3 h-3" />
                  <span>Code</span>
                </div>
              )}
              {project.repositories && (
                <>
                  {project.repositories.frontend && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded">
                      <Github className="w-3 h-3" />
                      <span>Frontend</span>
                    </div>
                  )}
                  {project.repositories.backend && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded">
                      <Github className="w-3 h-3" />
                      <span>Backend</span>
                    </div>
                  )}
                </>
              )}
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-600/50 rounded">
                <ExternalLink className="w-3 h-3" />
                <span>Demo</span>
              </div>
            </div>

            {/* Interaction hint */}
            <div className="text-center mt-3 text-yellow-400 text-xs animate-pulse">
              Click to view details
            </div>
          </div>
        </Html>
      )}

      {/* Distance indicator (for close projects) */}
      {distance < 10 && (
        <Text
          position={[0, -1.5, 0.1]}
          fontSize={0.15}
          color="#10b981"
          anchorX="center"
          anchorY="middle"
        >
          {`${distance.toFixed(1)}m`}
        </Text>
      )}

      {/* Interaction particles when hovered */}
      {hovered && (
        <>
          {[...Array(8)].map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 8) * Math.PI * 2) * 2.5,
                Math.sin((i / 8) * Math.PI * 2) * 1.5,
                0.2,
              ]}
            >
              <sphereGeometry args={[0.02]} />
              <meshBasicMaterial
                color={project.featured ? 0x8b5cf6 : 0x06b6d4}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}
