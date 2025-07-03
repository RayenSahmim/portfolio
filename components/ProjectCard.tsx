"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Star, Bot } from "lucide-react"
import Image from "next/image"
import * as SimpleIcons from "react-icons/si"
import { ProjectAIDialog } from "@/components/project-ai-dialog"


type Project = {
  order: number
  title: string
  description: string
  image: string
  technologies: string[]
  live: string
  featured: boolean
  // Either single repo or multiple repos
  github?: string
  repositories?: {
    frontend?: string
    backend?: string
  }
}

interface ProjectCardProps {
  project: Project
  sortBy: string
}

export function ProjectCard({ project, sortBy }: ProjectCardProps) {
  // Get technology icon
  const getTechIcon = (techName: string) => {
    const iconMap: { [key: string]: any } = {
      "Next.js": SimpleIcons.SiNextdotjs,
      React: SimpleIcons.SiReact,
      "Node.js": SimpleIcons.SiNodedotjs,
      Supabase: SimpleIcons.SiSupabase,
      MongoDB: SimpleIcons.SiMongodb,
      "Socket.IO": SimpleIcons.SiSocketdotio,
      GetStream: SimpleIcons.SiStreamlit, // Using Streamlit icon as GetStream doesn't have a specific icon
      Express: SimpleIcons.SiExpress,
      WebRTC: SimpleIcons.SiWebrtc,
      "Tailwind CSS": SimpleIcons.SiTailwindcss,
      Figma: SimpleIcons.SiFigma,
      RAG: SimpleIcons.SiGooglegemini,
      "Gemini API": SimpleIcons.SiGooglegemini,
      LangChain: SimpleIcons.SiLangchain,
      "Shadcn UI": SimpleIcons.SiShadcnui,
      Analytics: SimpleIcons.SiGoogleanalytics,
      "UI/UX": SimpleIcons.SiAdobe,
    }

    return iconMap[techName] || SimpleIcons.SiCoder
  }

  // Get technology color
  const getTechColor = (techName: string) => {
    const colorMap: { [key: string]: string } = {
      "Next.js": "#000000",
      React: "#61DAFB",
      "Node.js": "#339933",
      Supabase: "#3ECF8E",
      MongoDB: "#47A248",
      "Socket.IO": "#010101",
      GetStream: "#005FFF", // GetStream brand blue
      Express: "#000000",
      WebRTC: "#FF6B6B",
      "Tailwind CSS": "#06B6D4",
      Figma: "#F24E1E",
      RAG: "#4285F4",
      "Gemini API": "#4285F4",
      LangChain: "#1C7A1C",
      "Shadcn UI": "#000000",
      Analytics: "#E37400",
      "UI/UX": "#FF0000",
    }

    return colorMap[techName] || "#6366F1"
  }

  // Check if icon needs white color (for dark icons)
  const needsWhiteColor = (techName: string) => {
    const darkIcons = ["Next.js", "Socket.IO", "Express", "Shadcn UI"]
    return darkIcons.includes(techName)
  }

   

  return (
    <Card
      key={`${project.title}-${project.order}-${sortBy}`}
      className={`project-card professional-card-hover group overflow-hidden transition-all duration-300 flex flex-col h-full ${
        project.featured ? "ring-2 ring-indigo-500/30" : ""
      }`}
    >
      <div className="relative overflow-hidden">
        {project.featured && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center space-x-1 bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 rounded-full">
              <Star className="h-4 w-4 text-white" />
              <span className="text-white text-sm font-medium">FEATURED</span>
            </div>
          </div>
        )}

        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          width={400}
          height={300}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-xl professional-subtitle">{project.title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-grow">
        <p className="text-gray-300 leading-relaxed">{project.description}</p>

        {/* Technology Icons */}
        <div className="flex flex-wrap gap-3">
          {project.technologies.map((tech, techIndex) => {
            const IconComponent = getTechIcon(tech)
            const techColor = getTechColor(tech)
            const iconColor = needsWhiteColor(tech) ? "#ffffff" : techColor

            return (
              <div
                key={techIndex}
                className="group/tech relative flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: `${techColor}15`,
                  borderColor: `${techColor}30`,
                }}
              >
                <IconComponent
                  className="w-4 h-4 transition-all duration-300 group-hover/tech:scale-110"
                  color={iconColor}
                />
                <span className="text-xs font-medium text-gray-300 group-hover/tech:text-white transition-colors">
                  {tech}
                </span>

                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover/tech:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                  {tech}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        <div className="flex justify-between items-center pt-4 w-full">
          {/* Left side - Action buttons */}
          <div className="flex space-x-2 flex-wrap gap-2">
            {/* Handle single repository (like Next.js projects) */}
            {project.github && (
              <Button 
                variant="outline" 
                size="sm" 
                className="professional-button-small group/btn"
                onClick={() => window.open(project.github, '_blank')}
              >
                <Github className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                Code
              </Button>
            )}
            
            {/* Handle multiple repositories (like MERN projects) */}
            {project.repositories && (
              <>
                {project.repositories.frontend && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="professional-button-small group/btn"
                    onClick={() => window.open(project?.repositories?.frontend, '_blank')}
                  >
                    <Github className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                    Frontend
                  </Button>
                )}
                {project.repositories.backend && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="professional-button-small group/btn"
                    onClick={() => window.open(project?.repositories?.backend, '_blank')}
                  >
                    <Github className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                    Backend
                  </Button>
                )}
              </>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="professional-button-small group/btn"
              onClick={() => window.open(project.live, '_blank')}
              disabled={project.live === '#'}
            >
              <ExternalLink className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
              Live Demo
            </Button>
          </div>

          {/* Right side - Ask AI Button */}
          <ProjectAIDialog project={project}>
            <Button 
              variant="outline" 
              size="sm" 
              className="professional-button-small group/btn bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-400/50 hover:border-indigo-400 hover:from-indigo-500/30 hover:to-purple-500/30 shadow-lg shadow-indigo-500/20"
            >
              <Bot className="h-4 w-4 group-hover/btn:scale-110 transition-transform text-indigo-400" />
            </Button>
          </ProjectAIDialog>
        </div>
      </CardFooter>
    </Card>
  )
}
