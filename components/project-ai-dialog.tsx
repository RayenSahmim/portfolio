"use client"

import React, { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Bot, Sparkles } from "lucide-react"
import { ChatMessages } from "@/components/ui/chat-messages"
import { ChatInput } from "@/components/ui/chat-input"
import { explainProject } from "@/app/actions/Ai.action"
import type { Content } from "@google/generative-ai"
import { cn } from "@/lib/utils"

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

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

interface ProjectAIDialogProps {
  project: Project
  children: React.ReactNode
}

export function ProjectAIDialog({ project, children }: ProjectAIDialogProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<Content[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Component for truncated quick question buttons
  const QuickQuestionButton = ({ question, index }: { question: string; index: number }) => {
    return (
      <Button
        key={index}
        variant="outline"
        size="sm"
        className="professional-button-small text-xs sm:text-sm h-auto min-h-[28px] sm:min-h-[32px] px-2 sm:px-3 max-w-[180px] sm:max-w-[220px] text-left overflow-hidden"
        onClick={() => handleQuickQuestionClick(question)}
        title={question} // Show full text on hover
      >
        <span className="block break-words leading-tight overflow-hidden hyphens-auto">
          {question}
        </span>
      </Button>
    )
  }

  // Initialize with welcome message when dialog opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 1,
        text: `Hi! I'm here to help you learn more about the "${project.title}" project. You can ask me anything about the technologies used, the implementation details, challenges faced, or any other aspects of this project. What would you like to know?`,
        isUser: false,
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, project.title, messages.length])

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom()
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsTyping(true)

    try {
      // Add user message to conversation history
      const userContent: Content = {
        role: "user",
        parts: [{ text: currentInput }]
      }

      // Get AI response stream
      const stream = await explainProject(project, conversationHistory, currentInput)
      const reader = stream.getReader()

      // Create AI message placeholder
      const aiMessage: Message = {
        id: messages.length + 2,
        text: "",
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)

      let fullResponse = ""

      // Read stream chunks
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Decode the Uint8Array to text
        const chunk = new TextDecoder().decode(value)
        fullResponse += chunk

        // Update the AI message with streaming text
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === aiMessage.id 
              ? { ...msg, text: fullResponse }
              : msg
          )
        )
        
        // Small delay for better streaming experience
        await new Promise(resolve => setTimeout(resolve, 10))
      }

      // Update conversation history
      const aiContent: Content = {
        role: "model",
        parts: [{ text: fullResponse }]
      }

      setConversationHistory((prev) => [...prev, userContent, aiContent])

    } catch (error) {
      console.error("Error getting AI response:", error)
      
      // Fallback to mock response
      const aiResponse: Message = {
        id: messages.length + 2,
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or feel free to contact Rayen directly at rayensahmim@gmail.com.",
        isUser: false,
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Reset conversation when dialog closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setMessages([])
      setConversationHistory([])
      setInputValue("")
      setIsTyping(false)
    }
  }

  const quickQuestions = [
    `What technologies were used in ${project.title}?`,
    `What were the main challenges in building ${project.title}?`,
    `Can you explain the architecture of ${project.title}?`,
    `What features make ${project.title} unique?`
  ]

  const handleQuickQuestionClick = async (question: string) => {
    if (isTyping) return // Don't allow new messages while typing

    const userMessage: Message = {
      id: messages.length + 1,
      text: question,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    try {
      // Add user message to conversation history
      const userContent: Content = {
        role: "user",
        parts: [{ text: question }]
      }

      // Get AI response stream
      const stream = await explainProject(project, conversationHistory, question)
      const reader = stream.getReader()

      // Create AI message placeholder
      const aiMessage: Message = {
        id: messages.length + 2,
        text: "",
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)

      let fullResponse = ""

      // Read stream chunks
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Decode the Uint8Array to text
        const chunk = new TextDecoder().decode(value)
        fullResponse += chunk

        // Update the AI message with streaming text
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === aiMessage.id 
              ? { ...msg, text: fullResponse }
              : msg
          )
        )
        
        // Small delay for better streaming experience
        await new Promise(resolve => setTimeout(resolve, 10))
      }

      // Update conversation history
      const aiContent: Content = {
        role: "model",
        parts: [{ text: fullResponse }]
      }

      setConversationHistory((prev) => [...prev, userContent, aiContent])

    } catch (error) {
      console.error("Error getting AI response:", error)
      
      // Fallback to mock response
      const aiResponse: Message = {
        id: messages.length + 2,
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or feel free to contact Rayen directly at rayensahmim@gmail.com.",
        isUser: false,
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-3xl w-full h-[600px] bg-gray-900 border-gray-800 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold flex items-center gap-2 break-words">
            <Bot className="h-6 w-6 text-indigo-400 flex-shrink-0" />
            <span className="break-words">Ask AI about {project.title}</span>
            <Sparkles className="h-5 w-5 text-purple-400 flex-shrink-0" />
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[520px] space-y-4 overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <ChatMessages 
              ref={chatContainerRef}
              messages={messages}
              isTyping={isTyping}
            />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="space-y-2 flex-shrink-0 max-w-full overflow-hidden">
              <p className="text-xs sm:text-sm text-gray-400 break-words">Quick questions:</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 max-w-full overflow-hidden">
                {quickQuestions.map((question, index) => (
                  <QuickQuestionButton 
                    key={index} 
                    question={question} 
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex-shrink-0 overflow-hidden">
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSendMessage}
              onKeyPress={handleKeyPress}
              placeholder={`Ask me anything about ${project.title}...`}
              disabled={isTyping}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
