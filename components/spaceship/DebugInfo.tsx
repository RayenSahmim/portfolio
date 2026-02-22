"use client"

interface DebugInfoProps {
  connected: boolean
  playersMap: Map<string, any>
  playerData?: { username: string; color: string } | null
}

export function DebugInfo({ connected, playersMap, playerData }: DebugInfoProps) {
  return (
    <div className="absolute top-20 right-4 bg-black/70 text-white p-2 rounded font-mono text-xs">
      <p>Connection: {connected ? "🟢 Connected" : "🔴 Disconnected"}</p>
      <p>Other Players: {playersMap.size}</p>
      {Array.from(playersMap.values()).map((player) => (
        <p key={player.id} className="text-cyan-400">
          Player: {playerData?.username}
        </p>
      ))}
    </div>
  )
}
