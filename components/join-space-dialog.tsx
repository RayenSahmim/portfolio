import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Sparkles, Rocket } from 'lucide-react'

interface JoinSpaceDialogProps {
  isOpen: boolean
  handleOpenChange: (open: boolean) => void
  onJoinSpace: (username: string, color: string) => void
}

const JoinSpaceDialog = ({ isOpen, handleOpenChange, onJoinSpace }: JoinSpaceDialogProps) => {
  const [username, setUsername] = useState('')
  const [selectedColor, setSelectedColor] = useState('#4F46E5')

  const predefinedColors = [
    '#4F46E5', '#7C3AED', '#EC4899', '#EF4444', 
    '#F59E0B', '#10B981', '#06B6D4', '#8B5CF6',
    '#F97316', '#84CC16', '#14B8A6', '#6366F1'
  ]

  const handleJoin = () => {
    if (username.trim()) {
      onJoinSpace(username.trim(), selectedColor)
      handleOpenChange(false)
      // Reset form
      setUsername('')
      setSelectedColor('#4F46E5')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && username.trim()) {
      handleJoin()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md w-full bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-bold flex items-center gap-2 justify-center">
            <Rocket className="h-6 w-6 text-purple-400" />
            Join Space Explorer
            <Sparkles className="h-6 w-6 text-purple-400" />
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-white text-sm font-medium">
              Choose your space explorer name:
            </label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your username..."
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
              maxLength={20}
            />
          </div>

          {/* Color Picker */}
          <div className="space-y-3">
            <label className="text-white text-sm font-medium">
              Choose your spaceship color:
            </label>
            
            {/* Color Preview */}
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full border-2 border-gray-600 shadow-lg"
                style={{ backgroundColor: selectedColor }}
              />
              <span className="text-gray-300 text-sm">{selectedColor}</span>
            </div>

            {/* Predefined Colors Grid */}
            <div className="grid grid-cols-6 gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                    selectedColor === color 
                      ? 'border-white shadow-lg' 
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Custom Color Input */}
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-10 h-10 rounded border-2 border-gray-600 bg-transparent cursor-pointer"
              />
              <span className="text-gray-400 text-sm">Custom color</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => handleOpenChange(false)}
              variant="outline"
              className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleJoin}
              disabled={!username.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold"
            >
              🚀 Launch into Space
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default JoinSpaceDialog
