import { NextResponse } from "next/server"
import { getAnalytics } from "@/lib/data-store"

export async function GET() {
  try {
    const data = getAnalytics()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 })
  }
}
