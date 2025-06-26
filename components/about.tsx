import { Card, CardContent } from "@/components/ui/card"
import { Code, Palette, Rocket } from "lucide-react"
import { MetallicTitle } from "./metallic-title"
import personalData from "@/data/personal.json"

export function About() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Code":
        return Code
      case "Palette":
        return Palette
      case "Rocket":
        return Rocket
      default:
        return Code
    }
  }

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Section Spotlight */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-radial from-purple-500/15 via-indigo-500/8 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <MetallicTitle className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">ABOUT ME</MetallicTitle>
          <div className="w-24 sm:w-28 lg:w-32 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 mx-auto professional-line"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6">
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed">
              {personalData.about.intro.split(" ").map((word, index) => {
                if (word.includes("full-stack") || word.includes("developer")) {
                  return (
                    <span key={index} className="professional-highlight">
                      {word}{" "}
                    </span>
                  )
                }
                return word + " "
              })}
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-gray-400 leading-relaxed">{personalData.about.secondary}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10 lg:mt-12">
              {personalData.about.stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center p-3 sm:p-4 rounded-lg bg-gray-800/50 border ${
                    index === 0 ? "border-indigo-500/30" : index === 1 ? "border-purple-500/30" : "border-violet-500/30"
                  } professional-card`}
                >
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold professional-number mb-1 sm:mb-2">{stat.number}</div>
                  <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 mt-8 lg:mt-0">
            {personalData.about.values.map((value, index) => {
              const IconComponent = getIcon(value.icon)
              const gradientClass =
                index === 0
                  ? "from-indigo-500 to-purple-500"
                  : index === 1
                    ? "from-purple-500 to-violet-500"
                    : "from-violet-500 to-indigo-500"

              return (
                <Card key={index} className="professional-card-hover group">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center mb-3 sm:mb-4">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${gradientClass} rounded-lg flex items-center justify-center mr-3 sm:mr-4 group-hover:scale-105 transition-transform duration-300`}
                      >
                        <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-white">{value.title}</h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-300">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
