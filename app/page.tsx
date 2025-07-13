import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/projects";
import { Certificates } from "@/components/certificates";
import { AIAssistant } from "@/components/ai-assistant";
import { Contact } from "@/components/contact";
import { SpaceExplorer } from "@/components/space-explorer";
import { BackgroundEffects } from "@/components/background-effects";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <BackgroundEffects />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Certificates />
        <AIAssistant />
        <Contact />
        <SpaceExplorer />
      </main>
    </div>
  );
}
