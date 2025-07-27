"use client"

import { useEffect, useState } from "react"

export function TopBanner() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Get message from environment variable or use default
    const envMessage = process.env.NEXT_PUBLIC_TOP_BANNER_MESSAGE
    if (envMessage) {
      setMessage(envMessage)
    } else {
      setMessage("🎉 Welcome to DarkStore - Premium E-commerce Experience! Free shipping on orders over $50!")
    }
  }, [])

  if (!message) return null

  return (
    <div className="w-full h-4 bg-green-500 flex items-center justify-center text-white text-xs font-medium overflow-hidden">
      <div className="animate-pulse">{message}</div>
    </div>
  )
}
