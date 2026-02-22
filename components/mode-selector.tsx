"use client"

import { useState, useEffect } from "react"
import { FileText, Rocket } from "lucide-react"
import { useSpaceExplorer } from "@/contexts/space-explorer-context"
import { useSocket } from "@/contexts/socket-context"
import SpaceshipGame from "./spaceship"

const VISITOR_COLORS = [
  "#4F46E5", "#7C3AED", "#EC4899", "#EF4444",
  "#F59E0B", "#10B981", "#06B6D4", "#8B5CF6",
  "#F97316", "#84CC16", "#14B8A6", "#6366F1",
]

function generateVisitorId() {
  return `Visitor-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
}

function randomColor() {
  return VISITOR_COLORS[Math.floor(Math.random() * VISITOR_COLORS.length)]
}

export function ModeSelector() {
  const [showDialog, setShowDialog] = useState(false)
  const {
    isExploring,
    setIsExploring,
    playerData,
    setPlayerData,
  } = useSpaceExplorer()
  const { socket } = useSocket()

  // Show the mode dialog on first page load
  useEffect(() => {
    // Small delay so the portfolio is painted behind the overlay
    const t = setTimeout(() => setShowDialog(true), 400)
    return () => clearTimeout(t)
  }, [])

  const handleChoose2D = () => {
    setShowDialog(false)
  }

  const handleChoose3D = () => {
    // Auto-generate visitor data
    const username = generateVisitorId()
    const color = randomColor()
    const newPlayerData = { username, color }
    setPlayerData(newPlayerData)

    if (socket) {
      socket.emit("join-space-explorer", {
        username,
        color,
        timestamp: Date.now(),
      })
    }

    setShowDialog(false)
    setIsExploring(true)
  }

  const handleExitSpace = () => {
    if (socket && playerData) {
      socket.emit("leave-space-explorer", {
        username: playerData.username,
        timestamp: Date.now(),
      })
    }
    setIsExploring(false)
  }

  return (
    <>
      {/* ====== MODE CHOICE OVERLAY ====== */}
      {showDialog && !isExploring && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
          {/* Starfield background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(80)].map((_, i) => (
              <div
                key={i}
                className="absolute w-[2px] h-[2px] bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          {/* Card container */}
          <div className="relative z-10 w-full max-w-2xl mx-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-2">
              Welcome to My Portfolio
            </h2>
            <p className="text-gray-400 text-center mb-8">
              How would you like to explore?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* 2D option */}
              <button
                onClick={handleChoose2D}
                className="group relative rounded-2xl border border-gray-700/60 bg-gray-900/80 backdrop-blur-sm p-6 text-left transition-all duration-300 hover:border-indigo-500/60 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:scale-[1.03] active:scale-[0.98]"
              >
                <div className="mb-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 inline-flex">
                  <FileText className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  2D Portfolio
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Classic scrollable portfolio with smooth animations, project
                  cards, certificates and more.
                </p>
                <div className="mt-4 text-xs text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  Scroll &amp; click →
                </div>
              </button>

              {/* 3D option */}
              <button
                onClick={handleChoose3D}
                className="group relative rounded-2xl border border-gray-700/60 bg-gray-900/80 backdrop-blur-sm p-6 text-left transition-all duration-300 hover:border-cyan-500/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:scale-[1.03] active:scale-[0.98]"
              >
                <div className="mb-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 inline-flex">
                  <Rocket className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  3D Space Explorer
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Pilot a spaceship through a 3D universe and discover my work
                  along the journey.
                </p>
                <div className="mt-4 text-xs text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  Fly &amp; explore →
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== FULL-SCREEN 3D EXPLORER ====== */}
      {isExploring && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Exit / switch-to-2D button */}
          <button
            onClick={handleExitSpace}
            className="absolute top-4 right-4 z-[60] flex items-center gap-1.5 bg-gray-800/80 hover:bg-gray-700 text-white px-3 py-2 rounded-full backdrop-blur-sm border border-gray-600/40 transition-all duration-200 hover:scale-105 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
            </svg>
            2D Mode
          </button>

          {/* Player info badge */}
          {playerData && (
            <div className="absolute top-6 left-6 z-[60] bg-black/50 text-white p-3 rounded-lg backdrop-blur-sm border border-gray-600/30">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-gray-400"
                  style={{ backgroundColor: playerData.color }}
                />
                <span className="text-sm font-medium">{playerData.username}</span>
              </div>
            </div>
          )}

          {/* Spaceship Game */}
          <SpaceshipGame
            onExit={handleExitSpace}
            playerData={playerData}
            onPlayerUpdate={(username, color) => {
              const updated = { username, color }
              setPlayerData(updated)
              if (socket) {
                socket.emit("update-player", {
                  username,
                  color,
                  timestamp: Date.now(),
                })
              }
            }}
          />
        </div>
      )}
    </>
  )
}
