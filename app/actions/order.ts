'use server'

import { connect } from "@/lib/dbConnect"
import OrderModel from "@/lib/model/Order"
import User from "@/lib/model/User"

// TypeScript interface for an Order
export interface Order {
  id: string
  stripeSessionId?: string
  stripePaymentIntentId?: string
  customerEmail: string
  customerName: string
  customerPhone: string
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  billingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  items: {
    productId: string
    productName: string
    quantity: number
    price: number
    total: number
  }[]
  total: number
  currency: string
  status: "pending" | "completed" | "cancelled"
  paymentStatus: string
  metadata?: any
  createdAt: string
  updatedAt: string
}

// ✅ Helper: Format Order for safe client usage
function formatOrder(order: any): Order {
  return {
    id: order._id.toString(),
    stripeSessionId: order.stripeSessionId,
    stripePaymentIntentId: order.stripePaymentIntentId,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    shippingAddress: order.shippingAddress,
    billingAddress: order.billingAddress,
    items: order.items,
    total: order.total,
    currency: order.currency,
    status: order.status,
    paymentStatus: order.paymentStatus,
    metadata: order.metadata ?? null,
    createdAt: order.createdAt?.toISOString(),
    updatedAt: order.updatedAt?.toISOString(),
  }
}

// ✅ GET Orders
export async function getOrders(): Promise<Order[]> {
  try {
    await connect()
    const orders = await OrderModel.find().lean()
    return orders.map(formatOrder)
  } catch (error) {
    console.error("Error getting orders:", error)
    throw new Error("Failed to fetch orders")
  }
}

// ✅ ADD Order
export async function addOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
  try {
    await connect()
    const order = await OrderModel.create(orderData)
    await updateUserFromOrder(order)
    return formatOrder(order.toObject())
  } catch (error) {
    console.error("Error adding order:", error)
    throw new Error("Failed to add order")
  }
}

// ✅ Update/Create User Based on Order
async function updateUserFromOrder(order: any): Promise<void> {
  try {
    const existingUser = await User.findOne({ email: order.customerEmail })

    const updates = {
      name: order.customerName,
      phone: order.customerPhone,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      $inc: { totalOrders: 1, totalSpent: order.total },
    }

    if (existingUser) {
      await User.updateOne({ email: order.customerEmail }, updates)
    } else {
      await User.create({
        email: order.customerEmail,
        ...updates,
      })
    }
  } catch (error) {
    console.error("Error updating user from order:", error)
    throw new Error("Failed to update user from order")
  }
}
