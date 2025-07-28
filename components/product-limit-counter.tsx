"use client"

import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

export function ProductLimitCounter() {
  const [stats, setStats] = useState({ current: 0, limit: 20, remaining: 20 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/product-stats")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching product stats:", error)
      }
    }

    fetchStats()

    // Refresh every 10 seconds
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  const getVariant = () => {
    if (stats.remaining === 0) return "destructive"
    if (stats.remaining <= 3) return "secondary"
    return "default"
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline text-sm font-medium">Products</span>
      <Badge variant={getVariant()} className="text-xs">
        {stats.current}/{stats.limit}
      </Badge>
    </div>
  )
}
