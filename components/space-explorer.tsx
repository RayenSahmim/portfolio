"use client"

import { useState, useEffect } from "react"
import { useSpaceExplorer } from "@/contexts/space-explorer-context"
import { useSocket } from "@/contexts/socket-context"
import SpaceshipGame from "./spaceship"
import JoinSpaceDialog from "./join-space-dialog"
import { PlayerCount } from "./player-count"

export function SpaceExplorer() {
  const [showPrompt, setShowPrompt] = useState(false)
  const { 
    isExploring, 
    setIsExploring, 
    showJoinDialog, 
    setShowJoinDialog,
    playerData,
    setPlayerData
  } = useSpaceExplorer()
  const { socket } = useSocket()

  const handleJoinSpace = (username: string, color: string) => {
    const newPlayerData = { username, color }
    setPlayerData(newPlayerData)
    
    // Send socket event to join space explorer
    if (socket) {
      socket.emit("join-space-explorer", {
        username,
        color,
        timestamp: Date.now()
      })
    }
    
    setIsExploring(true)
  }

  const handleExitSpace = () => {
    // Send socket event to leave space explorer
    if (socket && playerData) {
      socket.emit("leave-space-explorer", {
        username: playerData.username,
        timestamp: Date.now()
      })
    }
    
    setIsExploring(false)
    setPlayerData(null)
  }

  // Add custom styles for animations


  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // Show prompt when user is near the bottom (within 200px)
      if (documentHeight - scrollPosition < 200) {
        setShowPrompt(true)
      } else {
        setShowPrompt(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && showPrompt && !isExploring) {
        setShowJoinDialog(true)
      }
      if (e.key === 'Escape' && isExploring) {
        handleExitSpace()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showPrompt, isExploring, setShowJoinDialog])

  return (
    <>
      <style  />
      {/* Space Exploration Trigger Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-indigo-900 to-black overflow-hidden">
        {/* Animated stars background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Floating spaceship preview */}
        <div className="absolute top-1/4 right-1/4 animate-bounce">
          <div className="w-32 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full opacity-80 blur-sm" />
          <div className="absolute top-2 left-4 w-24 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
          <div className="absolute top-4 right-2 w-4 h-2 bg-orange-400 rounded-full animate-pulse" />
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center text-white px-8">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 animated-text-gradient">
            Ready for an Adventure?
          </h2>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-300 animate-fade-in-up">
            Take control of a spaceship and explore the vast universe
          </p>

          {/* Interactive prompt */}
          {showPrompt && (
            <div className="bg-black/50 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-6 mb-8 animate-scale-in">
              <div className="text-cyan-400 text-lg mb-2 animate-pulse">
                Press ENTER to join space exploration
              </div>
              <div className="text-sm text-gray-400">
                Choose your username and spaceship color • Use WASD or arrow keys to fly • ESC to return
              </div>
            </div>
          )}

          {/* Manual trigger button */}
          <button
            onClick={() => setShowJoinDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full border border-cyan-400/30 transition-all duration-300 shadow-lg hover:shadow-cyan-400/20 hover:scale-105 active:scale-95"
          >
            🚀 Join Space Explorer
          </button>
        </div>

        {/* Scroll indicator */}
        {!showPrompt && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="text-white/60 text-sm mb-2">Scroll to bottom</div>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce" />
            </div>
          </div>
        )}
      </section>

      {/* Player Count Display */}
      <PlayerCount />

      {/* Full-screen Space Explorer */}
      {isExploring && (
        <div className="fixed inset-0 z-50 bg-black animate-fade-in">
          {/* Exit button */}
          <button
            onClick={handleExitSpace}
            className="absolute top-6 right-6 z-60 bg-red-600/80 hover:bg-red-600 text-white p-3 rounded-full backdrop-blur-sm border border-red-400/30 transition-all duration-300 animate-slide-down"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Player info */}
          {playerData && (
            <div className="absolute top-6 left-6 z-60 bg-black/50 text-white p-3 rounded-lg backdrop-blur-sm border border-gray-600/30 animate-slide-right">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border border-gray-400"
                  style={{ backgroundColor: playerData.color }}
                />
                <span className="text-sm font-medium">{playerData.username}</span>
              </div>
            </div>
          )}

          {/* ESC hint */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-60 bg-black/50 text-white p-3 rounded-lg backdrop-blur-sm border border-gray-600/30 animate-slide-down">
            <div className="text-sm">Press <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">ESC</kbd> to exit</div>
          </div>

          {/* Spaceship Game */}
          <SpaceshipGame 
            onExit={handleExitSpace} 
            playerData={playerData}
          />
        </div>
      )}

      {/* Join Space Dialog */}
      <JoinSpaceDialog
        isOpen={showJoinDialog}
        handleOpenChange={setShowJoinDialog}
        onJoinSpace={handleJoinSpace}
      />
    </>
  )
}
