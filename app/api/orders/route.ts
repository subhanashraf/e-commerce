import { NextResponse } from "next/server"
import { getOrders } from "@/lib/data-store"
import Stripe from "stripe"
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



export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10", // Or your Stripe API version
})
    const body = await req.json()
    const { session_id } = body

    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
    }

    // ✅ Use mock data or real Stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "customer"],
    })

    // MOCK session response
    
const customer = session.customer_details
const lineItems = session.line_items?.data || []
    console.log(customer,lineItems,"customer,lineItems");
    
const newOrder = {
  id: Date.now().toString(),
  user: {
    name: customer?.name || "Unknown",
    email: customer?.email || "Unknown",
    phone: customer?.phone || "N/A",
    address: customer?.address?.line1 || "",
    country: customer?.address?.country || "",
    zip: customer?.address?.postal_code || "",
  },
  items: lineItems,
  total: lineItems.reduce((acc, item: any) => acc + (item.amount_total || 0), 0) / 100,
  createdAt: new Date().toISOString(),
}


   



    return NextResponse.json({ success: true, message: "Order saved", order: newOrder })
  } catch (error) {
    console.error("Error saving order:", error)
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 })
  }
}
