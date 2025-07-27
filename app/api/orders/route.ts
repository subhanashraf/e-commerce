import { NextResponse } from "next/server"
import { getOrders } from "@/lib/data-store"

export async function GET() {
  try {
    const orders = getOrders()

    // Sort orders by creation date (newest first)
    const sortedOrders = orders.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return NextResponse.json(sortedOrders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
