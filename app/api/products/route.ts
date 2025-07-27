import { NextResponse } from "next/server"
import { getProducts } from "@/lib/data-store"

export async function GET() {
  try {
    const products = getProducts()
    return NextResponse.json({ products })
  } catch (error) {
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 })
  }
}
