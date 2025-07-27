import { NextResponse } from "next/server"
import { getAnalytics } from "@/lib/data-store"

export async function GET() {
  try {
    const analytics = getAnalytics()
    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error loading analytics:", error)
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 })
  }
}
