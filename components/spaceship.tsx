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
import { Trophy, RotateCcw, LogOut, Timer, Flag, Zap } from "lucide-react"

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
  const [completed, setCompleted] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const startTimeRef = useRef(Date.now())
  const completedRef = useRef(false)

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

  // Detect when spaceship crosses the finish line
  useEffect(() => {
    const interval = setInterval(() => {
      if (completedRef.current) return
      const z = (window as any).__spaceshipZ
      if (z !== undefined && z <= -205) {
        completedRef.current = true
        const seconds = Math.round((Date.now() - startTimeRef.current) / 1000)
        setElapsedSeconds(seconds)
        setCompleted(true)
      }
    }, 300)
    return () => clearInterval(interval)
  }, [])

  const handleRetry = () => {
    // Reset spaceship to start
    ;(window as any).__spaceshipZ = 195
    ;(window as any).__spaceshipReset = true
    startTimeRef.current = Date.now()
    completedRef.current = false
    setCompleted(false)
    setElapsedSeconds(0)
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
          <fog attach="fog" args={["#000011", 80, 450]} />
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

      {/* Completion overlay */}
      {completed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="relative bg-gray-950 border border-gray-800 rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
            {/* Top accent line */}
            <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />

            {/* Icon — trophy for world record, flag for normal */}
            <div className="mb-5 flex justify-center">
              {elapsedSeconds <= 10 ? (
                <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-amber-400" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                  <Flag className="w-7 h-7 text-indigo-400" />
                </div>
              )}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-1">
              {elapsedSeconds <= 10 ? "World Record!" : "Journey Complete"}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {elapsedSeconds <= 10
                ? "You set the fastest exploration time!"
                : "You explored the entire space portfolio"}
            </p>

            {/* Time card */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Timer className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-gray-500 text-xs uppercase tracking-wider">Your Time</span>
              </div>
              <div className="text-3xl font-mono font-bold text-white">
                {Math.floor(elapsedSeconds / 60) > 0 && (
                  <span>{Math.floor(elapsedSeconds / 60)}<span className="text-gray-600 text-xl">m </span></span>
                )}
                {elapsedSeconds % 60}<span className="text-gray-600 text-xl">s</span>
              </div>
            </div>

            {/* World record badge */}
            {elapsedSeconds <= 10 && (
              <div className="flex items-center justify-center gap-1.5 mb-6 text-amber-400 text-xs font-medium">
                <Zap className="w-3.5 h-3.5" />
                <span>Fastest possible — 10s</span>
              </div>
            )}

            {/* Best time reference */}
            {elapsedSeconds > 10 && (
              <div className="flex items-center justify-center gap-1.5 mb-6 text-gray-600 text-xs">
                <Trophy className="w-3 h-3" />
                <span>World record: 10s</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleRetry}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-150"
              >
                <RotateCcw className="w-4 h-4" />
                Retry
              </button>
              <button
                onClick={onExit}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-150"
              >
                <LogOut className="w-4 h-4" />
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
