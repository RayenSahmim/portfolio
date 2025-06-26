"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Sparkles } from "lucide-react"
import { MetallicTitle } from "./metallic-title"
import { ChatMessages } from "@/components/ui/chat-messages"
import { ChatInput } from "@/components/ui/chat-input"
import { QuickQuestions } from "@/components/ui/quick-questions"
import aiData from "@/data/ai-responses.json"
import { sendAIResponse } from "@/app/actions/Ai.action"
import type { Content } from "@google/generative-ai"

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
  const [conversationHistory, setConversationHistory] = useState<Content[]>([])
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
  }, [messages]) // Trigger when messages array changes

 

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
      const stream = await sendAIResponse(currentInput, conversationHistory)
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
      e.preventDefault() // Prevent any default behavior
      handleSendMessage()
    }
  }

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
      const stream = await sendAIResponse(question, conversationHistory)
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
    <section id="ai-assistant" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/20 relative">
      {/* Section Spotlight */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-radial from-purple-500/15 via-indigo-500/8 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <MetallicTitle className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            <span className="flex items-center justify-center gap-2 sm:gap-3">
              <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-indigo-400" />
              <span className="text-center">{aiData.title}</span>
              <Bot className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-purple-400" />
            </span>
          </MetallicTitle>
          <div className="w-24 sm:w-28 lg:w-32 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 mx-auto professional-line"></div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto mt-4 sm:mt-6 px-2">{aiData.description}</p>
        </div>

        <Card className="professional-card-hover max-w-3xl mx-auto">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-white text-lg sm:text-xl lg:text-2xl professional-subtitle flex items-center">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-indigo-400" />
              Chat with AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Chat Messages */}
            <ChatMessages 
              ref={chatContainerRef}
              messages={messages}
              isTyping={isTyping}
            />

            {/* Quick Questions */}
            <QuickQuestions 
              questions={aiData.quickQuestions}
              onQuestionClick={handleQuickQuestionClick}
            />

            {/* Input */}
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSendMessage}
              onKeyPress={handleKeyPress}
              placeholder={aiData.placeholder}
              disabled={isTyping}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
