"use client"

import { useState, useEffect } from "react"
import { Menu, X, Rocket, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSpaceExplorer } from "@/contexts/space-explorer-context"
import { useSocket } from "@/contexts/socket-context"
import navigationData from "@/data/navigation.json"

const VISITOR_COLORS = [
  "#4F46E5", "#7C3AED", "#EC4899", "#EF4444",
  "#F59E0B", "#10B981", "#06B6D4", "#8B5CF6",
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isExploring, setIsExploring, playerData, setPlayerData } = useSpaceExplorer()
  const { socket } = useSocket()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleToggle3D = () => {
    if (isExploring) {
      // Switch to 2D
      if (socket && playerData) {
        socket.emit("leave-space-explorer", {
          username: playerData.username,
          timestamp: Date.now(),
        })
      }
      setIsExploring(false)
    } else {
      // Switch to 3D — auto-generate visitor if needed
      if (!playerData) {
        const username = `Visitor-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        const color = VISITOR_COLORS[Math.floor(Math.random() * VISITOR_COLORS.length)]
        setPlayerData({ username, color })
        if (socket) {
          socket.emit("join-space-explorer", { username, color, timestamp: Date.now() })
        }
      }
      setIsExploring(true)
    }
  }

  // Hide navigation when space exploring
  if (isExploring) {
    return null
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-gray-900/80 backdrop-blur-md border-b border-indigo-500/30" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold professional-brand">{navigationData.brand}</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationData.navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}

            {/* 2D / 3D Toggle */}
            <button
              onClick={handleToggle3D}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-sm font-medium transition-all duration-200 hover:scale-105"
              title="Switch to 3D Space Explorer"
            >
              <Rocket className="w-4 h-4" />
              <span>3D</span>
            </button>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={handleToggle3D}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-xs font-medium"
              title="Switch to 3D"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>3D</span>
            </button>
            <Button variant="ghost" size="icon" className="text-white" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden bg-gray-800/95 backdrop-blur-md rounded-lg mt-2 p-4 border border-indigo-500/30">
            {navigationData.navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block py-2 text-gray-300 hover:text-indigo-400 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
