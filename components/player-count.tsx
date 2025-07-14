"use client"

import { useState, useEffect } from "react"
import { useSocket } from "@/contexts/socket-context"

interface PlayerCountData {
  totalPlayers: number
  connectedUsers: number
}

export function PlayerCount() {
  const [playerCount, setPlayerCount] = useState<PlayerCountData>({
    totalPlayers: 0,
    connectedUsers: 0
  })
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    const handlePlayerCountUpdate = (data: PlayerCountData) => {
      setPlayerCount(data)
    }

    socket.on("player-count-update", handlePlayerCountUpdate)

    return () => {
      socket.off("player-count-update", handlePlayerCountUpdate)
    }
  }, [socket])

  return (
    <div className="fixed bottom-24 right-6 z-40 bg-black/50 backdrop-blur-sm border border-gray-600/30 rounded-lg p-4 text-white">
      <div className="text-sm space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-medium">{playerCount.totalPlayers}</span>
          <span className="text-gray-400">space explorers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span className="font-medium">{playerCount.connectedUsers}</span>
          <span className="text-gray-400">visitors online</span>
        </div>
      </div>
    </div>
  )
}
