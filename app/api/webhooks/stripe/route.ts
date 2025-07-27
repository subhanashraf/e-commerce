import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { addOrder } from "@/lib/data-store"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed:`, err.message)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  console.log(`🔔 Received webhook event: ${event.type}`)

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session

      try {
        console.log("💳 Processing completed checkout session:", session.id)

        // Get line items from the session
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          expand: ["data.price.product"],
        })

        console.log("📦 Line items:", lineItems.data.length)

        // Extract customer details
        const customerDetails = session.customer_details
        const shippingDetails = session.shipping_details

        // Create order object with all required fields
        const orderData = {
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
          customerEmail: customerDetails?.email || session.metadata?.customerEmail || "unknown@email.com",
          customerName: customerDetails?.name || session.metadata?.customerName || "Unknown Customer",
          customerPhone: customerDetails?.phone || session.metadata?.customerPhone || "No phone provided",
          shippingAddress: shippingDetails?.address
            ? {
                line1: shippingDetails.address.line1 || "",
                line2: shippingDetails.address.line2 || "",
                city: shippingDetails.address.city || "",
                state: shippingDetails.address.state || "",
                postal_code: shippingDetails.address.postal_code || "",
                country: shippingDetails.address.country || "",
              }
            : {
                line1: "No shipping address provided",
                city: "",
                state: "",
                postal_code: "",
                country: "",
              },
          billingAddress: customerDetails?.address
            ? {
                line1: customerDetails.address.line1 || "",
                line2: customerDetails.address.line2 || "",
                city: customerDetails.address.city || "",
                state: customerDetails.address.state || "",
                postal_code: customerDetails.address.postal_code || "",
                country: customerDetails.address.country || "",
              }
            : {
                line1: "No billing address provided",
                city: "",
                state: "",
                postal_code: "",
                country: "",
              },
          items: lineItems.data.map((item) => {
            const product = item.price?.product as Stripe.Product
            return {
              productId: product?.metadata?.productId || `stripe_${item.price?.id}`,
              productName: product?.name || "Unknown Product",
              quantity: item.quantity || 1,
              price: (item.price?.unit_amount || 0) / 100, // Convert from cents
              total: ((item.price?.unit_amount || 0) * (item.quantity || 1)) / 100,
            }
          }),
          total: (session.amount_total || 0) / 100, // Convert from cents
          currency: session.currency || "usd",
          status: "completed" as const,
          paymentStatus: session.payment_status || "paid",
          metadata: session.metadata || {},
        }

        console.log("📝 Order data prepared:", {
          id: "pending",
          customerEmail: orderData.customerEmail,
          customerName: orderData.customerName,
          total: orderData.total,
          itemCount: orderData.items.length,
        })

        // Save order to JSON file
        const savedOrder = addOrder(orderData)

        console.log("✅ Order saved successfully:", savedOrder.id)
        console.log("💰 Order total: $" + savedOrder.total)
        console.log("👤 Customer: " + savedOrder.customerName)
      } catch (error) {
        console.error("❌ Error processing checkout session:", error)
        return NextResponse.json({ error: "Error processing order" }, { status: 500 })
      }

      break

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log("💰 Payment succeeded:", paymentIntent.id, "Amount:", paymentIntent.amount / 100)
      break

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object as Stripe.PaymentIntent
      console.log("❌ Payment failed:", failedPayment.id, "Error:", failedPayment.last_payment_error?.message)
      break

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
