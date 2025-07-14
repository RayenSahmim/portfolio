"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface PlayerData {
  username: string
  color: string
}

interface SpaceExplorerContextType {
  isExploring: boolean
  setIsExploring: (value: boolean) => void
  showJoinDialog: boolean
  setShowJoinDialog: (value: boolean) => void
  playerData: PlayerData | null
  setPlayerData: (data: PlayerData | null) => void
}

const SpaceExplorerContext = createContext<SpaceExplorerContextType | undefined>(undefined)

export function SpaceExplorerProvider({ children }: { children: ReactNode }) {
  const [isExploring, setIsExploring] = useState(false)
  const [showJoinDialog, setShowJoinDialog] = useState(false)
  const [playerData, setPlayerData] = useState<PlayerData | null>(null)

  return (
    <SpaceExplorerContext.Provider value={{ 
      isExploring, 
      setIsExploring,
      showJoinDialog,
      setShowJoinDialog,
      playerData,
      setPlayerData
    }}>
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
