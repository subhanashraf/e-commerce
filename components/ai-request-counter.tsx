"use client"

import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

export function AIRequestCounter() {
  const [stats, setStats] = useState({ used: 0, limit: 10, remaining: 10 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/ai-stats")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching AI stats:", error)
      }
    }

    fetchStats()

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const getVariant = () => {
    if (stats.remaining === 0) return "destructive"
    if (stats.remaining <= 2) return "secondary"
    return "default"
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline text-sm font-medium">AI Shopping Assistant</span>
      <Badge variant={getVariant()} className="text-xs">
        {stats.used}/{stats.limit}
      </Badge>
    </div>
  )
}
