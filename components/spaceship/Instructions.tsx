"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { ChevronDown } from "lucide-react"

interface InstructionsProps {
  onExit?: () => void
  playerCount?: number
}

// Section definitions matching Portfolio3DGallery
const SECTIONS = [
  { name: "Hero", z: 160, color: "#6366f1" },
  { name: "About", z: 90, color: "#06b6d4" },
  { name: "Skills", z: 20, color: "#10b981" },
  { name: "Projects", z: -60, color: "#f59e0b" },
  { name: "Certificates", z: -190, color: "#8b5cf6" },
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
  // Calculate overall journey progress (z goes from 195 to -220)
  const progress = Math.max(0, Math.min(100, ((195 - z) / 415) * 100))
  return { name: closest.name, color: closest.color, progress }
}

export function Instructions({ onExit, playerCount }: InstructionsProps) {
  const [sectionInfo, setSectionInfo] = useState({ name: "Hero", color: "#6366f1", progress: 0 })
  const [showIdleHint, setShowIdleHint] = useState(false)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dismissedRef = useRef(false)
  const lastZRef = useRef<number | null>(null)

  const dismissHint = useCallback(() => {
    setShowIdleHint(false)
    dismissedRef.current = true
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const spaceship = (window as any).__spaceshipZ
      if (spaceship !== undefined) {
        setSectionInfo(getCurrentSection(spaceship))

        // Auto-dismiss hint when user moves (z changes noticeably from start)
        if (showIdleHint && lastZRef.current !== null && Math.abs(spaceship - lastZRef.current) > 2) {
          dismissHint()
        }

        // Track idle: if still near start and hasn't been dismissed
        if (!dismissedRef.current && !showIdleHint) {
          if (spaceship > 190) {
            // Near start — start/restart idle timer
            if (!idleTimerRef.current) {
              idleTimerRef.current = setTimeout(() => {
                setShowIdleHint(true)
                lastZRef.current = spaceship
              }, 5000)
            }
          } else {
            // Moved away from start — cancel timer and mark dismissed
            dismissedRef.current = true
            if (idleTimerRef.current) {
              clearTimeout(idleTimerRef.current)
              idleTimerRef.current = null
            }
          }
        }
      }
    }, 200)
    return () => {
      clearInterval(interval)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [showIdleHint, dismissHint])

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

      {/* Idle hint — appears when user stays still at start */}
      {showIdleHint && (
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 z-50 animate-[fadeSlideUp_0.4s_ease-out]">
          <div className="bg-black/70 backdrop-blur-sm border border-indigo-500/30 rounded-xl px-6 py-4 text-center max-w-xs">
            <div className="flex justify-center mb-3">
              <div className="w-9 h-9 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                <ChevronDown className="w-5 h-5 text-indigo-400 animate-bounce" />
              </div>
            </div>
            <p className="text-white text-sm font-medium mb-1">Press a key to explore</p>
            <p className="text-gray-400 text-xs mb-3">
              <kbd className="bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded text-[10px] text-indigo-300 mx-0.5">Q</kbd>
              or
              <kbd className="bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded text-[10px] text-indigo-300 mx-0.5">↑</kbd>
              to go forward ·
              <kbd className="bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded text-[10px] text-cyan-300 mx-0.5">S</kbd>
              or
              <kbd className="bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded text-[10px] text-cyan-300 mx-0.5">↓</kbd>
              to reverse
            </p>
            <button
              onClick={dismissHint}
              className="text-xs text-gray-500 hover:text-white border border-gray-700 hover:border-gray-600 rounded-md px-3 py-1 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}
