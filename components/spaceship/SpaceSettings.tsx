"use client"

import { useState } from "react"
import { Settings, X } from "lucide-react"

const PRESET_COLORS = [
  "#4F46E5", "#7C3AED", "#EC4899", "#EF4444",
  "#F59E0B", "#10B981", "#06B6D4", "#8B5CF6",
  "#F97316", "#84CC16", "#14B8A6", "#6366F1",
]

interface SpaceSettingsProps {
  playerData: { username: string; color: string } | null
  onUpdate: (username: string, color: string) => void
}

export function SpaceSettings({ playerData, onUpdate }: SpaceSettingsProps) {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState(playerData?.username ?? "")
  const [color, setColor] = useState(playerData?.color ?? "#4F46E5")

  const handleSave = () => {
    if (username.trim()) {
      onUpdate(username.trim(), color)
      setOpen(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => {
          setUsername(playerData?.username ?? "")
          setColor(playerData?.color ?? "#4F46E5")
          setOpen(true)
        }}
        className="absolute bottom-4 left-4 z-[60] bg-gray-800/70 hover:bg-gray-700/80 text-white p-3 rounded-full backdrop-blur-sm border border-gray-600/40 transition-all duration-200 hover:scale-110"
        title="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="absolute bottom-4 left-4 z-[60] w-72 bg-gray-900/95 backdrop-blur-md rounded-xl border border-gray-700/60 p-4 shadow-2xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-200">Space Settings</h3>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Username */}
      <div className="mb-3">
        <label className="text-xs text-gray-400 mb-1 block">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={20}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          placeholder="Your name..."
        />
      </div>

      {/* Color */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 mb-1 block">Ship Color</label>
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-8 h-8 rounded-full border-2 border-gray-500 shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs text-gray-400">{color}</span>
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                color === c ? "border-white scale-110" : "border-gray-600"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded border border-gray-600 bg-transparent cursor-pointer"
          />
          <span className="text-xs text-gray-500">Custom</span>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={!username.trim()}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
      >
        Save Changes
      </button>
    </div>
  )
}
