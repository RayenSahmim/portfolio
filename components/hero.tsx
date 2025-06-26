"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Github, Linkedin, Mail, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Portfolio3D } from "./portfolio-3d"
import personalData from "@/data/personal.json"
import navigationData from "@/data/navigation.json"
import { toast } from "sonner"

export function Hero() {
  const [text, setText] = useState("")
  const fullText = personalData.title

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      setText(fullText.slice(0, index))
      index++
      if (index > fullText.length) {
        clearInterval(timer)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [fullText])

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Github":
        return Github
      case "Linkedin":
        return Linkedin
      case "Mail":
        return Mail
      case "Download":
        return Download
      default:
        return Github
    }
  }

  // Function to download CV
  const downloadCV = () => {
    const link = document.createElement('a')
    link.href = '/cv/cv rayen.pdf'
    link.download = 'cv rayen.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("CV downloaded successfully! 📄✨", {
      description: "Your resume has been downloaded and is ready to view.",
      duration: 4000,
    })
  }

  // Function to scroll to projects section
  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects')
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden py-8 sm:py-16">
      {/* Hero Spotlights */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-radial from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-gradient-radial from-violet-500/15 via-indigo-500/8 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* 3D Portfolio Object */}
      <div className="hidden md:block">
        <Portfolio3D />
      </div>

      <div className="text-center z-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 animated-text-gradient leading-tight">{personalData.name}</div>
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 min-h-[2rem] sm:min-h-[2.5rem] md:min-h-[3rem] professional-subtitle">
            {text}
            <span className="animate-pulse text-indigo-400">|</span>
          </div>
        </div>

        <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-10 lg:mb-12 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-2">
          {personalData.description.split(" ").map((word, index) => {
            if (personalData.highlights.includes(word.toLowerCase().replace(/[.,]/g, ""))) {
              const colorClass =
                personalData.highlights.indexOf(word.toLowerCase().replace(/[.,]/g, "")) === 0
                  ? "text-indigo-400"
                  : personalData.highlights.indexOf(word.toLowerCase().replace(/[.,]/g, "")) === 1
                    ? "text-purple-400"
                    : "text-violet-400"
              return (
                <span key={index} className={`${colorClass} font-semibold`}>
                  {word}{" "}
                </span>
              )
            }
            return word + " "
          })}
        </p>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-10 lg:mb-12 px-2">
          {personalData.socialLinks.map((link, index) => {
            const IconComponent = getIcon(link.icon)
            
            const handleSocialClick = () => {
              window.open(link.url, '_blank', 'noopener,noreferrer')
            }
            
            return (
              <Button 
                key={index} 
                variant="outline" 
                size="lg" 
                className="professional-button group text-sm sm:text-base min-w-0 flex-shrink-0"
                onClick={handleSocialClick}
              >
                <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">{link.name}</span>
                <span className="sm:hidden">{link.name.split(' ')[0]}</span>
              </Button>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-2">
          {navigationData.buttons.map((button, index) => {
            const IconComponent = button.icon ? getIcon(button.icon) : null
            
            // Define click handlers based on button text
            const handleClick = () => {
              if (button.text === "Download CV") {
                downloadCV()
              } else if (button.text === "View Projects") {
                scrollToProjects()
              }
            }
            
            return (
              <Button
                key={index}
                size="lg"
                onClick={handleClick}
                className={`${button.type === "primary" ? "professional-button-primary group" : "professional-button"} text-sm sm:text-base w-full sm:w-auto min-w-0`}
                variant={button.type === "outline" ? "outline" : "default"}
              >
                {IconComponent && (
                  <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 group-hover:-translate-y-1 transition-transform" />
                )}
                {button.text}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400 drop-shadow-glow" />
      </div>
    </section>
  )
}
