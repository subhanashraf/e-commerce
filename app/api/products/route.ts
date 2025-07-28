import { NextResponse } from "next/server"
import { getProducts } from "@/lib/data-store"

export async function GET() {
  try {
    console.log("📡 API: Getting products...")
    const data = await getProducts()
    const products = data
    console.log(`📦 API: Found ${products.length} products`)
    return NextResponse.json({ products, success: true })
  } catch (error) {
    console.error("❌ API: Error loading products:", error)
    return NextResponse.json({ error: "Failed to load products", success: false }, { status: 500 })
  }
}
