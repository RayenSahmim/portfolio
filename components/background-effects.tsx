"use client"

import { useMemo } from "react"

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

export function BackgroundEffects() {
  const stars = useMemo(() => 
    [...Array(50)].map((_, i) => ({
      id: i,
      ...generateStarData(i)
    })), 
    []
  )

  return (
    <>
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-background"></div>

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
