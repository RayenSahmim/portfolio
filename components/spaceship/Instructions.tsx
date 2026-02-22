"use client"

import { useEffect, useState } from "react"

interface InstructionsProps {
  onExit?: () => void
  playerCount?: number
}

// Section definitions matching Portfolio3DGallery
const SECTIONS = [
  { name: "Hero", z: 80, color: "#6366f1" },
  { name: "About", z: 55, color: "#06b6d4" },
  { name: "Skills", z: 30, color: "#10b981" },
  { name: "Projects", z: 5, color: "#f59e0b" },
  { name: "Certificates", z: -60, color: "#8b5cf6" },
]

function getCurrentSection(z: number): { name: string; color: string; progress: number } {
  // Find the closest section
  let closest = SECTIONS[0]
  let minDist = Infinity
  for (const s of SECTIONS) {
    const dist = Math.abs(z - s.z)
    if (dist < minDist) {
      minDist = dist
      closest = s
    }
  }
  // Calculate overall journey progress (z goes from 110 to -85)
  const progress = Math.max(0, Math.min(100, ((110 - z) / 195) * 100))
  return { name: closest.name, color: closest.color, progress }
}

export function Instructions({ onExit, playerCount }: InstructionsProps) {
  const [sectionInfo, setSectionInfo] = useState({ name: "Hero", color: "#6366f1", progress: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      const spaceship = (window as any).__spaceshipZ
      if (spaceship !== undefined) {
        setSectionInfo(getCurrentSection(spaceship))
      }
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Section indicator HUD — top center */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
        <div
          className="bg-black/60 backdrop-blur-sm text-white px-5 py-2 rounded-full border font-mono text-sm flex items-center gap-3"
          style={{ borderColor: sectionInfo.color + "60" }}
        >
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: sectionInfo.color }}
          />
          <span className="font-semibold" style={{ color: sectionInfo.color }}>
            {sectionInfo.name.toUpperCase()}
          </span>
          <span className="text-gray-400 text-xs">
            {Math.round(sectionInfo.progress)}%
          </span>
        </div>
        {/* Mini progress bar */}
        <div className="w-40 h-1 bg-gray-800/60 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${sectionInfo.progress}%`,
              backgroundColor: sectionInfo.color,
            }}
          />
        </div>
      </div>

      {/* Desktop controls — bottom left */}
      <div className="hidden md:block absolute bottom-20 left-4 bg-black/60 text-white p-3 rounded-lg font-mono text-xs backdrop-blur-sm border border-gray-600/30">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-indigo-400">Q/↑</span>
          <span className="text-gray-400">Forward</span>
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-cyan-400">S/↓</span>
          <span className="text-gray-400">Backward</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-400">Hover</span>
          <span className="text-gray-400">View details</span>
        </div>
        {playerCount !== undefined && playerCount > 0 && (
          <div className="mt-2 text-green-300 text-[10px]">
            👥 {playerCount} other explorer{playerCount === 1 ? "" : "s"}
          </div>
        )}
      </div>

      {/* ESC hint */}
      {onExit && (
        <div className="hidden md:block absolute bottom-4 left-4 bg-black/50 text-gray-400 p-2 rounded font-mono text-[10px]">
          Press <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-[9px] mx-0.5">ESC</kbd> to return
        </div>
      )}
    </>
  )
}
