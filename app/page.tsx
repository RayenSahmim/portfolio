import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Skills } from "@/components/skills"
import { Projects } from "@/components/projects"
import { Certificates } from "@/components/certificates"
import { AIAssistant } from "@/components/ai-assistant"
import { Contact } from "@/components/contact"
import { Navigation } from "@/components/navigation"
import { BackgroundEffects } from "@/components/background-effects"
import { ScrollToTop } from "@/components/scroll-to-top"

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <BackgroundEffects />
      <Navigation />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Certificates />
        <AIAssistant />
        <Contact />
      </main>
      <ScrollToTop />
    </div>
  )
}
