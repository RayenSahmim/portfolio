"use client"

import { useState, useEffect } from "react"
import { Joystick } from "react-joystick-component"

export function JoystickControls({ onExit }: { onExit?: () => void }) {
  const [joystickState, setJoystickState] = useState({
    forward: false,
    backward: false,
    left: false, // Disabled but kept for compatibility
    right: false, // Disabled but kept for compatibility
    up: false, // Disabled but kept for compatibility
    down: false, // Disabled but kept for compatibility
  })

  const handleMainJoystickMove = (event: any) => {
    if (!event) return

    const { x, y, distance } = event
    const threshold = 10

    if (distance && distance > threshold) {
      // Only handle forward/backward movement
      const newState = {
        forward: false,
        backward: false,
        left: false, // Always false
        right: false, // Always false
        up: false, // Always false
        down: false, // Always false
      }

      // Map joystick direction to spaceship controls - only Y axis
      if (y !== undefined) {
        // Forward/Backward based on Y axis only
        if (y > 0.3) {
          newState.forward = true
        } else if (y < -0.3) {
          newState.backward = true
        }
      }

      setJoystickState(newState)
    } else {
      // Reset all when joystick is in center
      setJoystickState({
        forward: false,
        backward: false,
        left: false,
        right: false,
        up: false,
        down: false,
      })
    }
  }

  const handleMainJoystickStop = () => {
    setJoystickState({
      forward: false,
      backward: false,
      left: false,
      right: false,
      up: false,
      down: false,
    })
  }

  // Expose joystick state globally for spaceship controls
  useEffect(() => {
    ;(window as any).touchControls = joystickState
  }, [joystickState])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Main Movement Joystick - Centered */}
      <div className="absolute left-1/2 bottom-20 transform -translate-x-1/2 pointer-events-auto md:hidden">
        <div className="relative">
          <Joystick
            size={140}
            sticky={false}
            baseColor="rgba(17, 24, 39, 0.7)"
            stickColor="rgba(99, 102, 241, 0.9)"
            move={handleMainJoystickMove}
            stop={handleMainJoystickStop}
          />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
            <div className="text-white text-xs font-bold bg-gray-900/70 backdrop-blur-sm px-2 py-1 rounded border border-indigo-500/30">
              Forward/Back
            </div>
          </div>
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
