"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone, Send, MessageCircle } from "lucide-react"
import { MetallicTitle } from "./metallic-title"
import personalData from "@/data/personal.json"
import { toast } from "sonner"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentYear = new Date().getFullYear()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/Messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      })

      if (response.ok) {
        toast.success("Message sent successfully! I'll get back to you soon.")
        setFormData({
          name: "",
          email: "",
          message: "",
        })
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section id="contact" className="py-20 px-4 bg-gray-800/20 relative">
      {/* Section Spotlights */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-indigo-500/15 via-purple-500/8 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-radial from-violet-500/12 via-indigo-500/6 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <MetallicTitle className="text-5xl md:text-6xl font-bold mb-6">GET IN TOUCH</MetallicTitle>
          <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 mx-auto professional-line"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-6">
            {personalData.contact.description.split(" ").map((word, index) => {
              if (word.includes("extraordinary")) {
                return (
                  <span key={index} className="professional-highlight">
                    {word}{" "}
                  </span>
                )
              }
              return word + " "
            })}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-white readable-title">LET'S CONNECT</h3>
              <p className="text-gray-300 mb-8 text-lg">{personalData.contact.connectMessage}</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 group">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform professional-icon">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">Email</div>
                  <div className="text-indigo-400">{personalData.contact.email}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform professional-icon">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">Phone</div>
                  <div className="text-purple-400">{personalData.contact.phone}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform professional-icon">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">Location</div>
                  <div className="text-violet-400">{personalData.contact.location}</div>
                </div>
              </div>
            </div>
          </div>

          <Card className="professional-card-hover">
            <CardHeader>
              <CardTitle className="text-white text-2xl readable-title flex items-center">
                <MessageCircle className="h-6 w-6 mr-2 text-indigo-400" />
                SEND MESSAGE
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="professional-input"
                    required
                  />
                </div>

                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="professional-input"
                    required
                  />
                </div>

                <div>
                  <Textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="professional-input resize-none"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full professional-button-primary group"
                  disabled={isSubmitting}
                >
                  <Send className={`h-5 w-5 mr-2 transition-transform ${isSubmitting ? 'animate-pulse' : 'group-hover:-translate-y-1'}`} />
                  {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16 pt-8 border-t border-indigo-500/30">
          <p className="text-gray-400 text-lg">
            © {currentYear} <span className="professional-highlight">RAYEN SAHMIM</span>. Crafted with passion using
            Next.js & Tailwind CSS.
          </p>
        </div>
      </div>
    </section>
  )
}
