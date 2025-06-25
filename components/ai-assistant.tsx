"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Send, User, Sparkles } from "lucide-react"
import { MetallicTitle } from "./metallic-title"
import aiData from "@/data/ai-responses.json"

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: aiData.initialMessage,
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    // Scroll within the chat container, not the entire page
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  // Only scroll when new messages are added (not on initial mount)
  useEffect(() => {
    // Only scroll if there's more than just the initial message
    if (messages.length > 1) {
      scrollToBottom()
    }
  }, [messages.length]) // Only trigger when message count changes

  const getResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("experience") || lowerQuestion.includes("work") || lowerQuestion.includes("years")) {
      return aiData.responses.experience
    } else if (
      lowerQuestion.includes("skill") ||
      lowerQuestion.includes("technology") ||
      lowerQuestion.includes("tech")
    ) {
      return aiData.responses.skills
    } else if (
      lowerQuestion.includes("project") ||
      lowerQuestion.includes("portfolio") ||
      lowerQuestion.includes("work")
    ) {
      return aiData.responses.projects
    } else if (
      lowerQuestion.includes("contact") ||
      lowerQuestion.includes("reach") ||
      lowerQuestion.includes("email")
    ) {
      return aiData.responses.contact
    } else if (
      lowerQuestion.includes("education") ||
      lowerQuestion.includes("study") ||
      lowerQuestion.includes("learn")
    ) {
      return aiData.responses.education
    } else {
      return aiData.responses.default
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: getResponse(inputValue),
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault() // Prevent any default behavior
      handleSendMessage()
    }
  }

  return (
    <section id="ai-assistant" className="py-20 px-4 bg-gray-800/20 relative">
      {/* Section Spotlight */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-purple-500/15 via-indigo-500/8 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <MetallicTitle className="text-5xl md:text-6xl font-bold mb-6">
            <span className="flex items-center justify-center gap-3">
              <Sparkles className="h-12 w-12 text-indigo-400" />
              {aiData.title}
              <Bot className="h-12 w-12 text-purple-400" />
            </span>
          </MetallicTitle>
          <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 mx-auto professional-line"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mt-6">{aiData.description}</p>
        </div>

        <Card className="professional-card-hover max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white text-2xl professional-subtitle flex items-center">
              <Bot className="h-6 w-6 mr-2 text-indigo-400" />
              Chat with AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Chat Messages - Fixed Height Container */}
            <div 
              ref={chatContainerRef}
              className="h-80 overflow-y-auto p-4 bg-gray-900/50 rounded-lg border border-indigo-500/20 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-800"
            >
              <div className="space-y-4 min-h-full flex flex-col">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`w-fit max-w-[75%] px-4 py-3 rounded-lg ${
                        message.isUser
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-sm"
                          : "bg-gray-700 text-gray-200 rounded-bl-sm"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {!message.isUser && <Bot className="h-4 w-4 mt-0.5 text-indigo-400 flex-shrink-0" />}
                        {message.isUser && <User className="h-4 w-4 mt-0.5 text-white flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm break-words hyphens-auto leading-relaxed whitespace-pre-wrap">
                            {message.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700 text-gray-200 px-4 py-3 rounded-lg rounded-bl-sm w-fit">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Questions */}
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {aiData.quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="professional-button-small text-xs"
                    onClick={() => setInputValue(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress} // Changed from onKeyPress to onKeyDown
                placeholder={aiData.placeholder}
                className="professional-input flex-1"
                autoComplete="off" // Prevent autocomplete suggestions
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="professional-button-primary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
