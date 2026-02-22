"use client"

import { useState } from "react"
import { Html } from "@react-three/drei"
import { ExternalLink, Github, X, Star, Bot } from "lucide-react"

interface Project {
  order: number
  title: string
  description: string
  image: string
  technologies: string[]
  live: string
  featured: boolean
  github?: string
  repositories?: {
    frontend?: string
    backend?: string
  }
}

interface ProjectDetailModalProps {
  project: Project | null
  onClose: () => void
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  if (!project) return null

  return (
    <Html
      center
      transform={false}
      style={{
        width: "90vw",
        maxWidth: "600px",
        pointerEvents: "auto",
        zIndex: 1000,
      }}
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gray-900/95 border border-indigo-400/50 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">{project.title}</h2>
              {project.featured && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 text-white" />
                  <span className="text-white text-xs font-medium">FEATURED</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Project Image */}
          {project.image && project.image !== "/placeholder.svg?height=300&width=400" && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Description */}
          <p className="text-gray-300 mb-6 leading-relaxed">{project.description}</p>

          {/* Technologies */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-sm rounded-full border border-indigo-400/30"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {/* Single repository */}
            {project.github && (
              <button
                onClick={() => window.open(project.github, '_blank')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <Github className="w-5 h-5" />
                View Code
              </button>
            )}

            {/* Multiple repositories */}
            {project.repositories && (
              <>
                {project.repositories.frontend && (
                  <button
                    onClick={() => window.open(project.repositories?.frontend, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    Frontend
                  </button>
                )}
                {project.repositories.backend && (
                  <button
                    onClick={() => window.open(project.repositories?.backend, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    Backend
                  </button>
                )}
              </>
            )}

            {/* Live Demo */}
            {project.live && project.live !== '#' && (
              <button
                onClick={() => window.open(project.live, '_blank')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-all"
              >
                <ExternalLink className="w-5 h-5" />
                Live Demo
              </button>
            )}

            {/* Ask AI Button */}
            <button
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/50 hover:border-purple-400 text-purple-300 rounded-lg transition-all"
            >
              <Bot className="w-5 h-5" />
              Ask AI
            </button>
          </div>

          {/* Close instruction */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm text-center">
              Press ESC or click outside to close • Click and drag to move around
            </p>
          </div>
        </div>
      </div>
    </Html>
  )
}
