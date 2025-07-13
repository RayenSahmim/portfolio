"use client"

import type React from "react"

import { useMemo, useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF, KeyboardControls, useKeyboardControls, Environment, Stars } from "@react-three/drei"
import * as THREE from "three"

/* --------------------------- PORTFOLIO BACKGROUND EFFECTS --------------------------- */
// Generate deterministic star positions based on index
const generateStarData = (index: number) => {
  // Use index as seed for deterministic "random" values
  const seed = index * 1234.5678
  const random1 = (Math.sin(seed) + 1) / 2
  const random2 = (Math.sin(seed * 2) + 1) / 2
  const random3 = (Math.sin(seed * 3) + 1) / 2
  const random4 = (Math.sin(seed * 4) + 1) / 2
  const random5 = (Math.sin(seed * 5) + 1) / 2
  const random6 = (Math.sin(seed * 6) + 1) / 2
  
  // Create clusters and avoid center area where content will be
  let left, top
  
  if (index < 10) {
    // Top area stars
    left = random1 * 100
    top = random2 * 25 // Top 25% of screen
  } else if (index < 20) {
    // Side area stars (left and right edges)
    if (random3 > 0.5) {
      left = random1 * 20 // Left 20% of screen
      top = 25 + random2 * 50 // Middle 50% vertically
    } else {
      left = 80 + random1 * 20 // Right 20% of screen
      top = 25 + random2 * 50 // Middle 50% vertically
    }
  } else {
    // Bottom area stars
    left = random1 * 100
    top = 75 + random2 * 25 // Bottom 25% of screen
  }
  
  // Vary star sizes slightly
  const size = random5 > 0.7 ? 2 : random5 > 0.4 ? 1.5 : 1
  const opacity = 0.2 + random6 * 0.4 // Opacity between 0.2 and 0.6
  
  return {
    left,
    top,
    size,
    opacity,
    animationDelay: random3 * 4, // Extended delay range
    animationDuration: 2 + random4 * 4, // Extended duration range (2-6s)
  }
}

function SpaceBackgroundEffects() {
  const stars = useMemo(() => 
    [...Array(50)].map((_, i) => ({
      id: i,
      ...generateStarData(i)
    })), 
    []
  )

  return (
    <>
      {/* Fixed Background matching portfolio exactly */}
      <div className="fixed inset-0 bg-gray-900"></div>

      {/* Animated Stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size * 4}px`,
              height: `${star.size * 4}px`,
              backgroundColor: `rgba(255, 255, 255, ${star.opacity})`,
              animationDelay: `${star.animationDelay}s`,
              animationDuration: `${star.animationDuration}s`,
              boxShadow: `0 0 ${star.size * 4}px rgba(255, 255, 255, ${star.opacity * 0.5})`,
            }}
          />
        ))}
      </div>

      {/* Static Spotlights */}
      <div 
        className="fixed top-20 left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 100%)'
        }}
      ></div>
      <div 
        className="fixed bottom-20 right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 100%)'
        }}
      ></div>
      <div 
        className="fixed top-1/2 left-1/2 w-64 h-64 rounded-full blur-2xl animate-pulse pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 100%)',
          transform: 'translate(-50%, -50%)'
        }}
      ></div>
    </>
  )
}

/* --------------------------- SUPERSONIC TRAIL LINES --------------------------- */
function TrailLine({ spaceshipRef }: { spaceshipRef: React.RefObject<THREE.Group | null> }) {
  const groupRef = useRef<THREE.Group>(null)
  const forwardTime = useRef(0)

  /* Create trail line material */
  const trailMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      }),
    []
  )

  /* Create multiple trail line geometries */
  const trailGeometries = useMemo(() => {
    const geoms: THREE.BufferGeometry[] = []
    for (let i = 0; i < 80; i++) {
      const geo = new THREE.BufferGeometry()
      // Two points per line
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3))
      geoms.push(geo)
    }
    return geoms
  }, [])

  useFrame((_, dt) => {
    if (!groupRef.current || !spaceshipRef.current) return

    const isMovingForward = spaceshipRef.current.userData.isMovingForward ?? false
    
    if (isMovingForward) {
      forwardTime.current += dt
    } else {
      forwardTime.current = 0
    }

    // Show supersonic trail lines after 2 seconds of forward movement
    groupRef.current.visible = forwardTime.current >= 2

    if (!groupRef.current.visible) return

    // Animate the trail lines
    trailGeometries.forEach((geo, i) => {
      const pos = geo.attributes.position as THREE.BufferAttribute
      const arr = pos.array as Float32Array

      // Random positions around the camera view
      const angle = (i / trailGeometries.length) * Math.PI * 2 + _.clock.elapsedTime * 0.5
      const radius = 50 + Math.random() * 100
      const x = Math.cos(angle) * radius
      const y = (Math.random() - 0.5) * 100
      const z = Math.sin(angle) * radius

      // Create long lines that streak past
      const lineLength = 5 + Math.random() * 8 // much shorter lines
      const direction = new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        -1
      ).normalize()

      // Start point
      arr[0] = x
      arr[1] = y
      arr[2] = z + 100

      // End point
      arr[3] = x + direction.x * lineLength
      arr[4] = y + direction.y * lineLength
      arr[5] = z + direction.z * lineLength - 50 // reduced distance

      pos.needsUpdate = true
    })

    // Fade trail lines based on speed
    const vel: THREE.Vector3 = spaceshipRef.current.userData.velocity ?? new THREE.Vector3()
    const speed = vel.length()
    trailMaterial.opacity = Math.min(speed / 8, 0.8)
  })

  return (
    <group ref={groupRef}>
      {trailGeometries.map((geo, i) => (
        <line key={i}>
          <primitive object={geo} attach="geometry" />
          <primitive object={trailMaterial} attach="material" />
        </line>
      ))}
    </group>
  )
}

/* ----------------------------- SPACESHIP MESH ----------------------------- */
function Spaceship() {
  const { scene } = useGLTF("/models/spaceship.glb")
  const shipRef = useRef<THREE.Group>(null)
  const [, getKeys] = useKeyboardControls()

  /* Engine-fire refs & helpers */
  const fireRefs = useRef<THREE.Group[]>([])
  const flame = useRef(0)

  /* Movement state */
  const vel = useRef(new THREE.Vector3())
  const rot = useRef(new THREE.Euler())

  useFrame((_, dt) => {
    if (!shipRef.current) return
    const { forward, backward, left, right, up, down } = getKeys()
    
    // Get touch controls if available
    const touchControls = (window as any).touchControls || {}
    
    // Combine keyboard and touch controls
    const isForward = forward || touchControls.forward
    const isBackward = backward || touchControls.backward
    const isLeft = left || touchControls.left
    const isRight = right || touchControls.right
    const isUp = up || touchControls.up
    const isDown = down || touchControls.down

    /* --- rotation --- */
    const turnSpeed = 2
    if (isLeft) rot.current.y += turnSpeed * dt
    if (isRight) rot.current.y -= turnSpeed * dt
    if (isUp) rot.current.x += turnSpeed * dt
    if (isDown) rot.current.x -= turnSpeed * dt

    /* --- thrust --- */
    const thrust = 12
    const dir = new THREE.Vector3(0, 0, -1).applyEuler(rot.current)

    if (isForward) {
      vel.current.addScaledVector(dir, thrust * dt)
      flame.current = Math.min(flame.current + dt * 5, 1)
      // Track forward movement for trail
      shipRef.current.userData.isMovingForward = true
    } else {
      flame.current = Math.max(flame.current - dt * 3, 0)
      shipRef.current.userData.isMovingForward = false
    }

    if (isBackward) vel.current.addScaledVector(dir, -thrust * dt * 0.5)

    /* damping & update pos */
    vel.current.multiplyScalar(0.98) // increased damping to slow down faster
    
    /* limit maximum speed */
    const maxSpeed = 8
    if (vel.current.length() > maxSpeed) {
      vel.current.normalize().multiplyScalar(maxSpeed)
    }
    
    shipRef.current.position.add(vel.current)

    /* expose velocity for camera / speed-lines */
    shipRef.current.userData.velocity = vel.current.clone()

    /* apply rotation & roll */
    shipRef.current.rotation.copy(rot.current)
    const bank = 0.3
    if (isLeft) shipRef.current.rotation.z = THREE.MathUtils.clamp(shipRef.current.rotation.z + bank * dt, -bank, bank)
    else if (isRight)
      shipRef.current.rotation.z = THREE.MathUtils.clamp(shipRef.current.rotation.z - bank * dt, -bank, bank)
    else shipRef.current.rotation.z *= 0.95

    /* animate flames */
    fireRefs.current.forEach((f, i) => {
      if (!f) return
      const scale = flame.current * (0.9 + Math.sin(_.clock.elapsedTime * 10 + i) * 0.2)
      f.visible = scale > 0.05
      f.scale.setScalar(scale)
    })
  })

  /* Helper sub-component for each engine flame */
  const EngineFire = ({ pos, idx }: { pos: [number, number, number]; idx: number }) => {
    const ref = useRef<THREE.Group>(null)
    /* register ref */
    useFrame(() => {
      if (ref.current) fireRefs.current[idx] = ref.current
    })
    return (
      <group ref={ref} position={pos}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.3, 2, 8]} />
          <meshBasicMaterial color="#0088ff" transparent opacity={0.8} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.25]}>
          <coneGeometry args={[0.15, 1.5, 6]} />
          <meshBasicMaterial color="#00aaff" transparent opacity={0.9} />
        </mesh>
        <pointLight color="#0099ff" intensity={1} distance={8} />
      </group>
    )
  }

  return (
    <>
      <group ref={shipRef} name="spaceship">
        <primitive object={scene} scale={0.5} />
        {/* 4 flames positioned to match the blue engine dots */}
        <EngineFire pos={[-0.6, 0.5, 2.2]} idx={0} />
        <EngineFire pos={[-0.3, 0.5, 2.2]} idx={1} />
        <EngineFire pos={[0.3, 0.5, 2.2]} idx={2} />
        <EngineFire pos={[0.6, 0.5, 2.2]} idx={3} />
        {/* trail line after 2 seconds of forward movement */}
        <TrailLine spaceshipRef={shipRef} />
      </group>
      {/* speed streaks */}
    </>
  )
}

/* ------------------------------ FOLLOW CAMERA ----------------------------- */
function FollowCamera() {
  const { camera, scene } = useThree()
  const shipRef = useRef<THREE.Object3D | null>(null)

  useFrame(() => {
    /* discover the ship once */
    if (!shipRef.current) {
      shipRef.current = scene.getObjectByName("spaceship") ?? null
      if (!shipRef.current) return
    }

    /* completely fixed offset – no speed influence at all */
    const offset = new THREE.Vector3(0, 1.5, 3)
    offset.applyQuaternion(shipRef.current.quaternion)
    const targetPos = shipRef.current.position.clone().add(offset)

    camera.position.lerp(targetPos, 0.1)

    /* look directly at the spaceship */
    camera.lookAt(shipRef.current.position)
  })

  return null
}

/* --------------------------- TOUCH CONTROLS --------------------------- */
function TouchControls({ onExit }: { onExit?: () => void }) {
  const [touchState, setTouchState] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
  })

  const handleTouchStart = (key: keyof typeof touchState) => {
    setTouchState(prev => ({ ...prev, [key]: true }))
  }

  const handleTouchEnd = (key: keyof typeof touchState) => {
    setTouchState(prev => ({ ...prev, [key]: false }))
  }

  // Expose touch state globally for spaceship controls
  useEffect(() => {
    (window as any).touchControls = touchState
  }, [touchState])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Movement Controls - Left Side */}
      <div className="absolute left-4 bottom-20 pointer-events-auto md:hidden">
        <div className="relative w-32 h-32">
          {/* Forward */}
          <button
            onTouchStart={() => handleTouchStart('forward')}
            onTouchEnd={() => handleTouchEnd('forward')}
            onMouseDown={() => handleTouchStart('forward')}
            onMouseUp={() => handleTouchEnd('forward')}
            onMouseLeave={() => handleTouchEnd('forward')}
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full border-2 border-white/30 backdrop-blur-sm flex items-center justify-center text-white font-bold ${
              touchState.forward ? 'bg-blue-500/50 border-blue-400' : 'bg-black/30'
            }`}
          >
            ↑
          </button>
          
          {/* Left */}
          <button
            onTouchStart={() => handleTouchStart('left')}
            onTouchEnd={() => handleTouchEnd('left')}
            onMouseDown={() => handleTouchStart('left')}
            onMouseUp={() => handleTouchEnd('left')}
            onMouseLeave={() => handleTouchEnd('left')}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full border-2 border-white/30 backdrop-blur-sm flex items-center justify-center text-white font-bold ${
              touchState.left ? 'bg-blue-500/50 border-blue-400' : 'bg-black/30'
            }`}
          >
            ←
          </button>
          
          {/* Right */}
          <button
            onTouchStart={() => handleTouchStart('right')}
            onTouchEnd={() => handleTouchEnd('right')}
            onMouseDown={() => handleTouchStart('right')}
            onMouseUp={() => handleTouchEnd('right')}
            onMouseLeave={() => handleTouchEnd('right')}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full border-2 border-white/30 backdrop-blur-sm flex items-center justify-center text-white font-bold ${
              touchState.right ? 'bg-blue-500/50 border-blue-400' : 'bg-black/30'
            }`}
          >
            →
          </button>
          
          {/* Backward */}
          <button
            onTouchStart={() => handleTouchStart('backward')}
            onTouchEnd={() => handleTouchEnd('backward')}
            onMouseDown={() => handleTouchStart('backward')}
            onMouseUp={() => handleTouchEnd('backward')}
            onMouseLeave={() => handleTouchEnd('backward')}
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full border-2 border-white/30 backdrop-blur-sm flex items-center justify-center text-white font-bold ${
              touchState.backward ? 'bg-blue-500/50 border-blue-400' : 'bg-black/30'
            }`}
          >
            ↓
          </button>
        </div>
      </div>

      {/* Vertical Controls - Right Side */}
      <div className="absolute right-4 bottom-20 pointer-events-auto md:hidden">
        <div className="flex flex-col gap-4">
          {/* Up */}
          <button
            onTouchStart={() => handleTouchStart('up')}
            onTouchEnd={() => handleTouchEnd('up')}
            onMouseDown={() => handleTouchStart('up')}
            onMouseUp={() => handleTouchEnd('up')}
            onMouseLeave={() => handleTouchEnd('up')}
            className={`w-12 h-12 rounded-full border-2 border-white/30 backdrop-blur-sm flex items-center justify-center text-white font-bold ${
              touchState.up ? 'bg-orange-500/50 border-orange-400' : 'bg-black/30'
            }`}
          >
            ⬆
          </button>
          
          {/* Down */}
          <button
            onTouchStart={() => handleTouchStart('down')}
            onTouchEnd={() => handleTouchEnd('down')}
            onMouseDown={() => handleTouchStart('down')}
            onMouseUp={() => handleTouchEnd('down')}
            onMouseLeave={() => handleTouchEnd('down')}
            className={`w-12 h-12 rounded-full border-2 border-white/30 backdrop-blur-sm flex items-center justify-center text-white font-bold ${
              touchState.down ? 'bg-orange-500/50 border-orange-400' : 'bg-black/30'
            }`}
          >
            ⬇
          </button>
        </div>
      </div>

      {/* Exit Button for Mobile */}
      {onExit && (
        <button
          onClick={onExit}
          className="absolute top-4 right-4 pointer-events-auto md:hidden w-12 h-12 rounded-full bg-red-500/70 border-2 border-red-400 backdrop-blur-sm flex items-center justify-center text-white font-bold"
        >
          ✕
        </button>
      )}
    </div>
  )
}

/* --------------------------- HUD / INSTRUCTIONS --------------------------- */
function Instructions({ onExit }: { onExit?: () => void }) {
  return (
    <>
      <div className="absolute top-4 left-4 bg-black/70 text-white p-4 rounded font-mono text-sm">
        <h3 className="font-bold mb-2">Controls</h3>
        <p className="hidden md:block">↑ ↓ ← → or W A S D – fly</p>
        <p className="md:hidden">Use touch controls to fly</p>
        <p className="text-orange-400">Thrust shows engine flames</p>
        <p className="text-cyan-400">Speed lines appear when going fast</p>
        {onExit && (
          <p className="text-red-400 mt-2 hidden md:block">ESC – return to portfolio</p>
        )}
      </div>
      
      {onExit && (
        <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded font-mono text-sm">
          <p className="text-yellow-400">🚀 Space Explorer Mode</p>
          <p className="text-gray-300 text-xs mt-1">Enjoying the ride? Press ESC when ready to return</p>
        </div>
      )}
    </>
  )
}

/* --------------------------------- PAGE ---------------------------------- */
export default function SpaceshipGame({ onExit }: { onExit?: () => void }) {
  return (
    <div className="h-screen w-full relative">
      {/* Portfolio Background Effects */}
      <SpaceBackgroundEffects />
      
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "up", keys: ["q", "Q"] },
          { name: "down", keys: ["e", "E"] },
        ]}
      >
        <Canvas camera={{ position: [0, 2, 4], fov: 75 }} shadows>
          {/* lighting */}
          <ambientLight intensity={0.25} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

          {/* backdrop */}
          <Stars radius={300} depth={60} count={20000} factor={7} />
          <Environment preset="night" />

          {/* main actor */}
          <Spaceship />

          {/* auto-follow cam */}
          <FollowCamera />

          {/* atmosphere */}
          <fog attach="fog" args={["#000011", 50, 300]} />
        </Canvas>
      </KeyboardControls>

      <Instructions onExit={onExit} />
      <TouchControls onExit={onExit} />
    </div>
  )
}
