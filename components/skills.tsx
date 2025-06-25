import { Card, CardContent } from "@/components/ui/card"
import { MetallicTitle } from "./metallic-title"
import skillsData from "@/data/skills.json"
import * as SimpleIcons from "react-icons/si"

export function Skills() {
  const getIcon = (iconName: string) => {
    const IconComponent = (SimpleIcons as any)[iconName]
    return IconComponent || SimpleIcons.SiCoder
  }

  const getIconColor = (skill: any) => {
    // For dark icons, use a lighter color in dark theme
    const darkIcons = ["Next.js", "Express.js", "Socket.IO", "Git/GitHub"]
    if (darkIcons.includes(skill.name)) {
      return "#ffffff" // White for dark icons
    }
    return skill.color
  }

  const getContainerStyle = (skill: any) => {
    // For dark icons, use a different background approach
    const darkIcons = ["Next.js", "Express.js", "Socket.IO", "Git/GitHub"]
    if (darkIcons.includes(skill.name)) {
      return {
        backgroundColor: "#374151", // Gray background for dark icons
        border: "2px solid #6366f1", // Indigo border for dark icons
        boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)",
      }
    }
    return {
      backgroundColor: `${skill.color}15`,
      border: `2px solid ${skill.color}30`,
      boxShadow: `0 0 20px ${skill.color}20`,
    }
  }

  const getSmallContainerStyle = (skill: any) => {
    const darkIcons = ["Next.js", "Express.js", "Socket.IO", "Git/GitHub"]
    if (darkIcons.includes(skill.name)) {
      return {
        backgroundColor: "#374151",
        border: "1px solid #6366f1",
      }
    }
    return {
      backgroundColor: `${skill.color}20`,
      border: `1px solid ${skill.color}40`,
    }
  }

  return (
    <section id="skills" className="py-20 px-4 bg-gray-800/20 relative">
      {/* Section Spotlights */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-radial from-indigo-500/15 via-purple-500/8 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-radial from-violet-500/12 via-indigo-500/6 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <MetallicTitle className="text-5xl md:text-6xl font-bold mb-6 neon-title">{skillsData.title}</MetallicTitle>
          <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 mx-auto professional-line"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {skillsData.categories.map((category, index) => (
            <Card key={index} className="professional-card-hover group">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-center mb-8 professional-subtitle">{category.title}</h3>
                <div className="space-y-6">
                  {category.skills.map((skill, skillIndex) => {
                    const IconComponent = getIcon(skill.icon)

                    return (
                      <div key={skillIndex} className="group/skill">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover/skill:scale-110"
                              style={getSmallContainerStyle(skill)}
                            >
                              <IconComponent
                                className="w-5 h-5 transition-colors duration-300"
                                color={getIconColor(skill)}
                              />
                            </div>
                            <span className="text-gray-300 font-medium group-hover/skill:text-indigo-400 transition-colors">
                              {skill.name}
                            </span>
                          </div>
                          <span className="professional-number-small">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-3 rounded-full transition-all duration-1000 ease-out professional-progress relative overflow-hidden"
                            style={{
                              width: `${skill.level}%`,
                              background:
                                skill.name === "Next.js" ||
                                skill.name === "Express.js" ||
                                skill.name === "Socket.IO" ||
                                skill.name === "Git/GitHub"
                                  ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
                                  : `linear-gradient(90deg, ${skill.color}80, ${skill.color})`,
                            }}
                          >
                            {/* Animated shine effect */}
                            <div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse"
                              style={{ animationDuration: "2s", animationDelay: `${skillIndex * 0.2}s` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technology Showcase */}
        <div className="mt-16 text-center">
          <h4 className="text-2xl font-bold text-white mb-8 readable-title">TECHNOLOGY STACK</h4>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {skillsData.categories
              .flatMap((category) => category.skills)
              .map((skill, index) => {
                const IconComponent = getIcon(skill.icon)

                return (
                  <div key={index} className="group relative">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-2 cursor-pointer"
                      style={getContainerStyle(skill)}
                    >
                      <IconComponent
                        className="w-8 h-8 transition-all duration-300 group-hover:scale-110"
                        color={getIconColor(skill)}
                      />
                    </div>

                    {/* Tooltip */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                      {skill.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </section>
  )
}
