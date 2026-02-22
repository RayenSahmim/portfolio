"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { KeyboardControls, Environment, Stars } from "@react-three/drei"
import * as THREE from "three"
import { usePlayers } from "@/hooks/use-players"
import { MultiplayerPlayers } from "./multiplayer-players"
import { SpaceBackgroundEffects } from "./spaceship/SpaceBackgroundEffects"
import { Spaceship } from "./spaceship/Spaceship"
import { FollowCamera } from "./spaceship/FollowCamera"
import { JoystickControls } from "./spaceship/JoystickControls"
import { Instructions } from "./spaceship/Instructions"
import { DebugInfo } from "./spaceship/DebugInfo"
import { Portfolio3DGallery } from "./spaceship/Portfolio3DGallery"
import { ProjectDetailModal } from "./spaceship/ProjectDetailModal"
import { SpaceSettings } from "./spaceship/SpaceSettings"

// Generate deterministic star positions based on index

/* --------------------------------- PAGE ---------------------------------- */
interface PlayerData {
  username: string
  color: string
}

export default function SpaceshipGame({
  onExit,
  playerData,
  onPlayerUpdate,
}: {
  onExit?: () => void
  playerData?: PlayerData | null
  onPlayerUpdate?: (username: string, color: string) => void
}) {
  const { playersMap, updatePlayerPosition, connected, setIsInSpaceExplorer } = usePlayers()
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const spaceshipRef = useRef<THREE.Group>(null)

  // Set the space explorer state when the component mounts
  useEffect(() => {
    setIsInSpaceExplorer(true)
    return () => {
      setIsInSpaceExplorer(false)
    }
  }, [])

  // Handle escape key to close project modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedProject) {
          setSelectedProject(null)
        } else if (onExit) {
          onExit()
        }
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [selectedProject, onExit])

  const handleProjectSelect = (project: any) => {
    setSelectedProject(project)
  }

  return (
    <div className="h-screen w-full relative">
      {/* Portfolio Background Effects */}
      <SpaceBackgroundEffects />

      {/* Debug info */}
      <DebugInfo connected={connected} playersMap={playersMap} playerData={playerData} />

      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "q", "Q"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: [] }, // Disabled
          { name: "right", keys: [] }, // Disabled
          { name: "up", keys: [] }, // Disabled
          { name: "down", keys: [] }, // Disabled
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
          <Spaceship updatePlayerPosition={updatePlayerPosition} shipRef={spaceshipRef} />

          {/* other players */}
          <MultiplayerPlayers playersMap={playersMap} />

          {/* 3D Portfolio Gallery - Complete Journey */}
          <Portfolio3DGallery onProjectSelect={handleProjectSelect} spaceshipRef={spaceshipRef} />

          {/* auto-follow cam */}
          <FollowCamera />

          {/* atmosphere */}
          <fog attach="fog" args={["#000011", 50, 300]} />
        </Canvas>
      </KeyboardControls>

      <Instructions onExit={onExit} playerCount={playersMap.size} />
      <JoystickControls onExit={onExit} />

      {/* In-game settings panel (change name / color) */}
      <SpaceSettings
        playerData={playerData ?? null}
        onUpdate={(username, color) => onPlayerUpdate?.(username, color)}
      />

      {/* Project Detail Modal */}
      <ProjectDetailModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  )
}
