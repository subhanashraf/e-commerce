import { type NextRequest, NextResponse } from "next/server"
import { deleteProduct } from "@/lib/actions"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("🗑️ API: Delete product request for ID:", params.id)

    const result = await deleteProduct(params.id)

    if (result.success) {
      console.log("✅ API: Product deleted successfully")
      return NextResponse.json({ success: true })
    } else {
      console.log("❌ API: Delete failed:", result.error)
      return NextResponse.json({ error: result.error, success: false }, { status: 400 })
    }
  } catch (error) {
    console.error("❌ API: Delete product error:", error)
    return NextResponse.json({ error: "Internal server error", success: false }, { status: 500 })
  }
}
