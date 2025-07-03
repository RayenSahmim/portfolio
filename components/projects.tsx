"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Star, ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react"
import Image from "next/image"
import { MetallicTitle } from "./metallic-title"
import projectsData from "@/data/projects.json"
import { gsap } from "gsap"
import * as SimpleIcons from "react-icons/si"
import { ProjectCard } from "./ProjectCard"

type SortOption = "order" | "featured" | "title"

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

export function Projects() {
  const [visibleCount, setVisibleCount] = useState(4)
  const [isAnimating, setIsAnimating] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("order")
  const projectsRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

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

  // Sort projects based on selected option
  const sortedProjects = useMemo(() => {
    const projects = [...projectsData.projects]

    switch (sortBy) {
      case "order":
        return projects.sort((a, b) => a.order - b.order)
      case "featured":
        return projects.sort((a, b) => {
          // Featured projects first, then by order
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return a.order - b.order
        })
      case "title":
        return projects.sort((a, b) => a.title.localeCompare(b.title))
      default:
        return projects.sort((a, b) => a.order - b.order)
    }
  }, [sortBy])

  const totalProjects = sortedProjects.length
  const hasMoreProjects = visibleCount < totalProjects

  const handleSortChange = (newSort: SortOption) => {
    if (isAnimating || newSort === sortBy) return

    setIsAnimating(true)

    // Simple fade out animation
    const allProjects = projectsRef.current?.querySelectorAll(".project-card")

    if (allProjects) {
      gsap.to(allProjects, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          setSortBy(newSort)
          setVisibleCount(4) // Reset to show first 4 projects

          // Wait for DOM update, then fade in new projects
          setTimeout(() => {
            const newProjects = projectsRef.current?.querySelectorAll(".project-card")

            if (newProjects) {
              gsap.fromTo(
                newProjects,
                { opacity: 0 },
                {
                  opacity: 1,
                  duration: 0.5,
                  stagger: 0.1,
                  ease: "power2.out",
                  onComplete: () => setIsAnimating(false),
                },
              )
            } else {
              setIsAnimating(false)
            }
          }, 50)
        },
      })
    } else {
      setSortBy(newSort)
      setVisibleCount(4)
      setIsAnimating(false)
    }
  }

  const handleShowMore = () => {
    if (isAnimating) return

    setIsAnimating(true)
    const currentCount = visibleCount
    const newCount = Math.min(visibleCount + 4, totalProjects)

    // Simple button animation
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      })
    }

    // Update count first
    setVisibleCount(newCount)

    // Wait for DOM update, then animate new projects
    setTimeout(() => {
      const allProjects = projectsRef.current?.querySelectorAll(".project-card")

      if (allProjects) {
        // Get the new projects that just appeared
        const newProjects = Array.from(allProjects).slice(currentCount, newCount)

        // Simple fade in animation
        gsap.fromTo(
          newProjects,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            onComplete: () => setIsAnimating(false),
          },
        )
      } else {
        setIsAnimating(false)
      }
    }, 50)
  }

  const handleShowLess = () => {
    if (isAnimating) return

    setIsAnimating(true)

    // Get projects that will be hidden
    const allProjects = projectsRef.current?.querySelectorAll(".project-card")

    if (allProjects) {
      const hidingProjects = Array.from(allProjects).slice(4)

      // Simple fade out animation
      gsap.to(hidingProjects, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.in",
        onComplete: () => {
          setVisibleCount(4)
          setIsAnimating(false)
        },
      })
    } else {
      setVisibleCount(4)
      setIsAnimating(false)
    }
  }

  // Initial simple animation for first 4 projects
  useEffect(() => {
    const timer = setTimeout(() => {
      const initialProjects = projectsRef.current?.querySelectorAll(".project-card")

      if (initialProjects) {
        // Simple fade in animation
        gsap.fromTo(
          initialProjects,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          },
        )
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="projects" className="py-20 px-4 relative">
      {/* Section Spotlight */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-purple-500/15 via-indigo-500/8 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <MetallicTitle className="text-5xl md:text-6xl font-bold mb-6 neon-title">{projectsData.title}</MetallicTitle>
          <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 mx-auto professional-line"></div>
          <p className="text-gray-400 mt-4">
            Showing {visibleCount} of {totalProjects} projects
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/40 rounded-full border border-indigo-500/20">
            <ArrowUpDown className="h-4 w-4 text-indigo-400" />
            <span className="text-sm text-gray-400 mr-2">Sort by:</span>
            <div className="flex space-x-1">
              {[
                { key: "order" as SortOption, label: "Order" },
                { key: "featured" as SortOption, label: "Featured" },
                { key: "title" as SortOption, label: "Title" },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleSortChange(option.key)}
                  disabled={isAnimating}
                  className={`px-3 py-1 rounded-full text-xs transition-all duration-300 ${
                    sortBy === option.key
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                      : "text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div ref={projectsRef} className="grid md:grid-cols-2 gap-8 mb-12">
          {sortedProjects.slice(0, visibleCount).map((project, index) => (
            <ProjectCard key={index} project={project} sortBy={sortBy} />
          ))}
        </div>

        {/* Show More/Less Button */}
        <div className="text-center">
          {hasMoreProjects ? (
            <Button
              ref={buttonRef}
              onClick={handleShowMore}
              disabled={isAnimating}
              className="professional-button-primary group relative overflow-hidden"
              size="lg"
            >
              <div className="flex items-center">
                <ChevronDown
                  className={`h-5 w-5 mr-2 transition-transform duration-300 ${isAnimating ? "animate-pulse" : "group-hover:translate-y-1"}`}
                />
                <span className="relative z-10">
                  {isAnimating
                    ? "Loading..."
                    : `Show More Projects (${Math.min(4, totalProjects - visibleCount)} more)`}
                </span>
              </div>

              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Button>
          ) : visibleCount > 4 ? (
            <Button
              ref={buttonRef}
              onClick={handleShowLess}
              disabled={isAnimating}
              className="professional-button group relative overflow-hidden"
              size="lg"
              variant="outline"
            >
              <div className="flex items-center">
                <ChevronUp
                  className={`h-5 w-5 mr-2 transition-transform duration-300 ${isAnimating ? "animate-pulse" : "group-hover:-translate-y-1"}`}
                />
                <span className="relative z-10">{isAnimating ? "Hiding..." : "Show Less"}</span>
              </div>

              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Button>
          ) : null}
        </div>

        {/* Projects Counter */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/40 rounded-full border border-indigo-500/20">
            <div className="flex space-x-1">
              {Array.from({ length: Math.ceil(totalProjects / 4) }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index < Math.ceil(visibleCount / 4)
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                      : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400 ml-2">
              {Math.ceil(visibleCount / 4)} of {Math.ceil(totalProjects / 4)} pages
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
