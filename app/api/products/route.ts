import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

export async function GET() {
  try {
    const filePath = join(process.cwd(), "data", "products.json")
    const fileContent = await readFile(filePath, "utf8")
    const data = JSON.parse(fileContent)

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 })
  }
}
