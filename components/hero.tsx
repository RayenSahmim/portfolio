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
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Hero Spotlights */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-violet-500/15 via-indigo-500/8 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* 3D Portfolio Object */}
      <Portfolio3D />

      <div className="text-center z-10 px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="text-6xl md:text-8xl font-bold mb-6 animated-text-gradient">{personalData.name}</div>
          <div className="text-2xl md:text-3xl text-gray-300 h-10 professional-subtitle">
            {text}
            <span className="animate-pulse text-indigo-400">|</span>
          </div>
        </div>

        <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
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

        <div className="flex justify-center space-x-6 mb-12">
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
                className="professional-button group"
                onClick={handleSocialClick}
              >
                <IconComponent className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                {link.name}
              </Button>
            )
          })}
        </div>

        <div className="flex justify-center space-x-4">
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
                className={button.type === "primary" ? "professional-button-primary group" : "professional-button"}
                variant={button.type === "outline" ? "outline" : "default"}
              >
                {IconComponent && (
                  <IconComponent className="h-5 w-5 mr-2 group-hover:-translate-y-1 transition-transform" />
                )}
                {button.text}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-indigo-400 drop-shadow-glow" />
      </div>
    </section>
  )
}
