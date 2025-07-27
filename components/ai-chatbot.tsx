"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react" // Import useEffect and useRef
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User, MessageCircle, X } from "lucide-react"

interface ChatMessage {
  id: string
  type: "user" | "bot"
  content: string
}

// --- Constants for API Limiting ---
const DAILY_CALL_LIMIT = 20 // Max calls per 24 hours
const LAST_RESET_TIMESTAMP_KEY = "chat_api_last_reset"
const REMAINING_CALLS_KEY = "chat_api_remaining_calls"

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hi! I'm your AI shopping assistant for DarkStore. I can help you find products, answer questions about our store, provide recommendations, or help with shipping and returns. What can I help you with today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // --- New state for API call count ---
  const [remainingCalls, setRemainingCalls] = useState(DAILY_CALL_LIMIT)

  // Ref to keep ScrollArea scrolled to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // --- useEffect to initialize/reset daily call count ---
  useEffect(() => {
    const lastResetTimestamp = localStorage.getItem(LAST_RESET_TIMESTAMP_KEY)
    const storedRemainingCalls = localStorage.getItem(REMAINING_CALLS_KEY)

    const now = Date.now()
    const oneDayInMs = 24 * 60 * 60 * 1000

    if (lastResetTimestamp && (now - parseInt(lastResetTimestamp, 10)) < oneDayInMs) {
      // Less than 24 hours since last reset, load stored count
      setRemainingCalls(storedRemainingCalls ? parseInt(storedRemainingCalls, 10) : DAILY_CALL_LIMIT)
    } else {
      // More than 24 hours or no timestamp, reset
      setRemainingCalls(DAILY_CALL_LIMIT)
      localStorage.setItem(REMAINING_CALLS_KEY, DAILY_CALL_LIMIT.toString())
      localStorage.setItem(LAST_RESET_TIMESTAMP_KEY, now.toString())
    }
  }, []) // Empty dependency array means this runs once on mount

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return

    // --- Check for API limit before sending ---
    if (remainingCalls <= 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content:
            "You've reached your daily query limit for the AI assistant. Please try again tomorrow, or feel free to browse our products!",
        },
      ])
      setInput("")
      return // Stop the function here
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: currentInput, type: "user" }),
      })

      const data = await response.json()

      if (response.ok) {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: data.answer,
        }
        setMessages((prev) => [...prev, botMessage])

        // --- Decrement remaining calls on successful API response ---
        setRemainingCalls((prev) => {
          const newCount = prev - 1;
          localStorage.setItem(REMAINING_CALLS_KEY, newCount.toString());
          return newCount;
        });

      } else {
        throw new Error(data.error || "Failed to get response")
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or browse our products directly!",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col border-2 border-primary/20 bg-gradient-to-b from-card to-card/95">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-primary/10 to-purple-600/10 border-b">
        <CardTitle className="flex items-center gap-2 text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          <Bot className="h-5 w-5 text-primary" />
          AI Shopping Assistant
        </CardTitle>
        {/* Display remaining calls here */}
        <span className="text-sm text-muted-foreground mr-auto ml-4">
          Calls left today: {remainingCalls}
        </span>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-destructive/10">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4 mb-4 h-full">
          <div className="space-y-4 min-h-0">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-2 max-w-[85%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className="flex-shrink-0">
                    {message.type === "user" ? (
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-secondary to-secondary/80 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 text-sm break-words overflow-wrap-anywhere ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground"
                        : "bg-gradient-to-r from-muted to-muted/80 border border-border/50"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {/* Ref for auto-scrolling */}
            <div ref={messagesEndRef} />
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-secondary to-secondary/80 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-gradient-to-r from-muted to-muted/80 rounded-lg p-3 border border-border/50">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2 flex-shrink-0">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about our products..."
            disabled={isLoading || remainingCalls <= 0} // Disable input if loading or limit reached
            className="flex-1 bg-gradient-to-r from-background to-background/95 border-primary/20 focus:border-primary/40"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim() || remainingCalls <= 0} // Disable send if loading, empty input, or limit reached
            size="icon"
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}