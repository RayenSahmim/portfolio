"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MetallicTitle } from "./metallic-title"
import { Badge } from "@/components/ui/badge"
import { Calendar, Award, ExternalLink, Shield } from "lucide-react"
import { useState } from "react"
import certificatesData from "@/data/certificates.json"

export function Certificates() {
  const [hoveredCert, setHoveredCert] = useState<number | null>(null)

  return (
    <section id="certificates" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Section Spotlight */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-radial from-purple-500/15 via-indigo-500/8 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <MetallicTitle className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            CERTIFICATES
          </MetallicTitle>
          <div className="w-24 sm:w-28 lg:w-32 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 mx-auto professional-line"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {certificatesData.certificates.map((cert) => (
            <Card
              key={cert.id}
              className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 hover:border-indigo-500/50 transition-all duration-500 backdrop-blur-sm"
              onMouseEnter={() => setHoveredCert(cert.id)}
              onMouseLeave={() => setHoveredCert(null)}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating particles effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-indigo-400/60 rounded-full animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/60 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-1/4 left-3/4 w-1 h-1 bg-violet-400/60 rounded-full animate-pulse delay-2000"></div>
              </div>

              {/* Glow effect on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-0 transition-opacity duration-500 ${
                hoveredCert === cert.id ? 'opacity-100' : ''
              }`}></div>

              <CardContent className="p-6 sm:p-8 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                        {cert.title}
                      </h3>
                      <p className="text-indigo-400 font-medium">{cert.issuer}</p>
                    </div>
                  </div>
                  {cert.verificationUrl && (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 hover:text-indigo-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <p className="text-gray-300 mb-4 leading-relaxed">
                  {cert.description}
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{cert.date}</span>
                  </div>
                  {cert.credentialId && (
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      <span className="font-mono text-xs">{cert.credentialId}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((skill, skillIndex) => (
                    <Badge
                      key={skillIndex}
                      variant="secondary"
                      className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border-indigo-500/30 hover:from-indigo-500/30 hover:to-purple-500/30 transition-all duration-300"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Metallic shine effect */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                  <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 transition-transform duration-700 ${
                    hoveredCert === cert.id ? 'translate-x-full' : '-translate-x-full'
                  }`}></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
            <Shield className="w-4 h-4" />
            <span>All certificates are verified and publicly accessible</span>
          </div>
        </div>
      </div>
    </section>
  )
}
