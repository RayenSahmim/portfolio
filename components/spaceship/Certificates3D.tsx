"use client"

import { useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Text, Html } from "@react-three/drei"
import * as THREE from "three"
import { Calendar, Award, ExternalLink, Shield } from "lucide-react"
import certificatesData from "@/data/certificates.json"

interface Certificates3DProps {
  position: [number, number, number]
}

export function Certificates3D({ position }: Certificates3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hoveredCert, setHoveredCert] = useState<number | null>(null)
  const revealRef = useRef(0.1)
  const glowRef = useRef<THREE.Mesh>(null)
  const [isNearby, setIsNearby] = useState(false)
  const { scene } = useThree()


  useFrame((state) => {
    if (!groupRef.current) return

    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + 3) * 0.1

    // Proximity-based reveal
    const spaceship = scene.getObjectByName("spaceship")
    if (spaceship) {
      const dist = Math.abs(spaceship.position.z - position[2])
      const target = THREE.MathUtils.clamp(1 - (dist - 8) / 35, 0.05, 1)
      revealRef.current = THREE.MathUtils.lerp(revealRef.current, target, 0.06)
      groupRef.current.scale.setScalar(revealRef.current)
      const nearby = dist < 30
      if (nearby !== isNearby) setIsNearby(nearby)
    }

    if (glowRef.current && glowRef.current.material instanceof THREE.MeshBasicMaterial) {
      glowRef.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 1.5 + 3) * 0.1
    }
  })

  const handleCertificateClick = (url: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank')
    }
  }

  return (
    <group ref={groupRef} position={position}>
      {/* Background panel */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[19, 15]} />
        <meshBasicMaterial color={0x1e1b4b} transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>

      {/* Glow border */}
      <mesh ref={glowRef} position={[0, 0, -0.06]}>
        <planeGeometry args={[19.4, 15.4]} />
        <meshBasicMaterial color={0x8b5cf6} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Certificates Grid — only visible when nearby */}
      {isNearby && <Html
        position={[0, 0.5, 0.2]}
        center
        transform
        sprite
        style={{ width: "820px", pointerEvents: "auto" }}
      >
        <div className="grid grid-cols-2 gap-5">
          {certificatesData.certificates.map((cert, index) => (
            <div
              key={index}
              className={`bg-gray-900/70 border rounded-xl p-5 backdrop-blur-sm transition-all duration-200 cursor-pointer shadow-[0_0_12px_rgba(139,92,246,0.08)] ${
                hoveredCert === index
                  ? 'border-purple-400/80 bg-gray-800/80 scale-[1.03]'
                  : 'border-purple-400/35 hover:border-purple-400/60'
              }`}
              onMouseEnter={() => setHoveredCert(index)}
              onMouseLeave={() => setHoveredCert(null)}
              onClick={() => handleCertificateClick(cert.verificationUrl)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/25 rounded-lg">
                    <Award className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm leading-tight">{cert.title}</h3>
                    <p className="text-purple-300 text-xs mt-0.5">{cert.issuer}</p>
                  </div>
                </div>
                {cert.verificationUrl && cert.verificationUrl !== '#' && (
                  <ExternalLink className="w-4 h-4 text-purple-400 opacity-50 shrink-0" />
                )}
              </div>

              <p className="text-gray-300 text-xs mb-2 line-clamp-2">{cert.description}</p>

              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <Calendar className="w-3 h-3" />
                <span>{cert.date}</span>
              </div>

              {cert.skills && cert.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {cert.skills.slice(0, 3).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] rounded border border-purple-400/30"
                    >
                      {skill}
                    </span>
                  ))}
                  {cert.skills.length > 3 && (
                    <span className="px-2 py-0.5 bg-gray-600/30 text-gray-400 text-[10px] rounded">
                      +{cert.skills.length - 3}
                    </span>
                  )}
                </div>
              )}

              {cert.verificationUrl && (
                <div className="flex items-center gap-1.5 text-[10px] text-green-400 mt-2">
                  <Shield className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Html>}


    </group>
  )
}
