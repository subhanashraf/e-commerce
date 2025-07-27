"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react" // Import useEffect and useRef
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { addProductFromAI } from "@/lib/actions"

interface ChatMessage {
  id: string
  type: "user" | "bot"
  content: string
  extractedData?: any
}

// --- Constants for API Limiting ---
const DAILY_PRODUCT_CHAT_LIMIT = 20 // Max calls per 24 hours for this specific API
const PRODUCT_CHAT_LAST_RESET_TIMESTAMP_KEY = "product_chat_api_last_reset"
const PRODUCT_CHAT_REMAINING_CALLS_KEY = "product_chat_api_remaining_calls"

export function ProductChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hi! I'm your AI assistant for adding products. Describe a product you'd like to add and I'll help extract the details. For example: 'I want to add red wireless earbuds priced at $79.99 with 20% discount, 75 in stock'",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  // --- New state for API call count ---
  const [remainingCalls, setRemainingCalls] = useState(DAILY_PRODUCT_CHAT_LIMIT)

  // Ref to keep ScrollArea scrolled to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // --- useEffect to initialize/reset daily call count ---
  useEffect(() => {
    const lastResetTimestamp = localStorage.getItem(PRODUCT_CHAT_LAST_RESET_TIMESTAMP_KEY)
    const storedRemainingCalls = localStorage.getItem(PRODUCT_CHAT_REMAINING_CALLS_KEY)

    const now = Date.now()
    const oneDayInMs = 24 * 60 * 60 * 1000

    if (lastResetTimestamp && (now - parseInt(lastResetTimestamp, 10)) < oneDayInMs) {
      // Less than 24 hours since last reset, load stored count
      setRemainingCalls(storedRemainingCalls ? parseInt(storedRemainingCalls, 10) : DAILY_PRODUCT_CHAT_LIMIT)
    } else {
      // More than 24 hours or no timestamp, reset
      setRemainingCalls(DAILY_PRODUCT_CHAT_LIMIT)
      localStorage.setItem(PRODUCT_CHAT_REMAINING_CALLS_KEY, DAILY_PRODUCT_CHAT_LIMIT.toString())
      localStorage.setItem(PRODUCT_CHAT_LAST_RESET_TIMESTAMP_KEY, now.toString())
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
            "You've reached your daily product query limit for the AI assistant. Please try again tomorrow or manually add products using the form.",
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
      const response = await fetch("/api/product-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: currentInput }),
      })

      const data = await response.json()

      if (response.ok) {
        let botResponse = ""
        let extractedData = null

        if (data.success && data.extractedData) {
          extractedData = data.extractedData
          botResponse = "I've analyzed your input and extracted the following product details:\n\n"

          Object.entries(extractedData).forEach(([key, value]) => {
            botResponse += `• ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}\n`
          })

          if (extractedData.name && extractedData.price) {
            botResponse += "\n🎯 This looks complete! Would you like me to add this product to your store?"
          } else {
            botResponse += "\n⚠️ Some details are missing. Please provide more information."
          }
        } else {
          botResponse =
            data.message ||
            "I couldn't extract specific product details. Please provide more information like product type, price, and stock quantity."
        }

        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: botResponse,
          extractedData: extractedData,
        }

        setMessages((prev) => [...prev, botMessage])

        // --- Decrement remaining calls on successful API response ---
        setRemainingCalls((prev) => {
          const newCount = prev - 1;
          localStorage.setItem(PRODUCT_CHAT_REMAINING_CALLS_KEY, newCount.toString());
          return newCount;
        });

      } else {
        throw new Error(data.error || "Failed to process request")
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content:
          "I'm having trouble processing your request. Please try describing your product with details like name, price, and quantity.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProduct = async (extractedData: any) => {
    // This function doesn't directly call the /api/product-chat,
    // so it doesn't need to decrement the `remainingCalls`.
    // It's calling `addProductFromAI` which is a server action, not the chat API.

    if (!extractedData.name || !extractedData.price) {
      toast({
        title: "Missing Information",
        description: "Product name and price are required to add the product.",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await addProductFromAI(extractedData)

      if (result.success) {
        toast({
          title: "Product added successfully!",
          description: `${extractedData.name} has been added to your store.`,
        })

        // Add success message to chat
        const successMessage: ChatMessage = {
          id: Date.now().toString(),
          type: "bot",
          content: `✅ Great! I've successfully added "${extractedData.name}" to your store. The product is now available for customers to purchase.`,
        }
        setMessages((prev) => [...prev, successMessage])
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error adding product",
        description: "There was an error adding the product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="h-[600px] flex flex-col hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-card/95 border border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-600/10 border-b flex-shrink-0">
        <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent text-sm sm:text-base">
          <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
          <span className="truncate">AI Product Assistant</span>
        </CardTitle>
        {/* Display remaining calls here */}
        <span className="text-sm text-muted-foreground ml-auto pr-2">
          Calls left today: {remainingCalls}
        </span>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-2 sm:p-4 overflow-hidden min-h-0">
        <ScrollArea className="flex-1 pr-2 mb-4 min-h-0">
          <div className="space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 sm:gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-2 max-w-[90%] sm:max-w-[85%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className="flex-shrink-0">
                    {message.type === "user" ? (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-secondary to-secondary/80 rounded-full flex items-center justify-center">
                        <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                      </div>
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-2 sm:p-3 text-xs sm:text-sm break-words min-w-0 ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground"
                        : "bg-gradient-to-r from-muted to-muted/80 border border-border/50"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words leading-relaxed word-wrap overflow-wrap-anywhere">
                      {message.content}
                    </p>
                    {message.extractedData && (
                      <div className="mt-2 sm:mt-3 space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(message.extractedData).map(([key, value]) => (
                            <Badge
                              key={key}
                              variant="secondary"
                              className="text-xs bg-gradient-to-r from-primary/20 to-purple-600/20 break-all"
                            >
                              <span className="truncate max-w-[100px] sm:max-w-none">
                                {key}: {String(value)}
                              </span>
                            </Badge>
                          ))}
                        </div>
                        {message.extractedData.name && message.extractedData.price && (
                          <Button
                            size="sm"
                            onClick={() => handleAddProduct(message.extractedData)}
                            className="mt-2 hover:scale-105 transition-transform bg-gradient-to-r from-primary to-purple-600 text-xs sm:text-sm w-full sm:w-auto"
                          >
                            Add This Product
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* Ref for auto-scrolling */}
            <div ref={messagesEndRef} />
            {isLoading && (
              <div className="flex gap-2 sm:gap-3 justify-start">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-secondary to-secondary/80 rounded-full flex items-center justify-center">
                  <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                </div>
                <div className="bg-gradient-to-r from-muted to-muted/80 rounded-lg p-2 sm:p-3 border border-border/50">
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
            placeholder="Describe your product..."
            disabled={isLoading || remainingCalls <= 0} // Disable input if loading or limit reached
            className="transition-all focus:scale-105 bg-gradient-to-r from-background to-background/95 border-primary/20 focus:border-primary/40 text-xs sm:text-sm min-w-0"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim() || remainingCalls <= 0} // Disable send if loading, empty input, or limit reached
            className="hover:scale-110 transition-transform bg-gradient-to-r from-primary to-purple-600 flex-shrink-0"
            size="sm"
          >
            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}