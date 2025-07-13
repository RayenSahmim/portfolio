"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface SpaceExplorerContextType {
  isExploring: boolean
  setIsExploring: (value: boolean) => void
}

const SpaceExplorerContext = createContext<SpaceExplorerContextType | undefined>(undefined)

export function SpaceExplorerProvider({ children }: { children: ReactNode }) {
  const [isExploring, setIsExploring] = useState(false)

  return (
    <SpaceExplorerContext.Provider value={{ isExploring, setIsExploring }}>
      {children}
    </SpaceExplorerContext.Provider>
  )
}

export function useSpaceExplorer() {
  const context = useContext(SpaceExplorerContext)
  if (context === undefined) {
    throw new Error('useSpaceExplorer must be used within a SpaceExplorerProvider')
  }
  return context
}
