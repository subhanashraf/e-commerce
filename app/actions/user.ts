'use server'

import { connect } from "@/lib/dbConnect"
import UserModel from "@/lib/model/User"

// TypeScript interface
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  shippingAddress?: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  billingAddress?: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  totalOrders: number
  totalSpent: number
  createdAt: string
  updatedAt: string
}

// ✅ Helper function: convert MongoDB doc to plain object
function formatUser(user: any): User {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    phone: user.phone,
    shippingAddress: user.shippingAddress,
    billingAddress: user.billingAddress,
    totalOrders: user.totalOrders ?? 0,
    totalSpent: user.totalSpent ?? 0,
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
  }
}

// ✅ Get all users
export async function getUsers(): Promise<User[]> {
  try {
    await connect()
    const users = await UserModel.find().lean()
    return users.map(formatUser)
  } catch (error) {
    console.error("Error getting users:", error)
    throw new Error("Failed to fetch users")
  }
}

// ✅ Add user
export async function addUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
  try {
    await connect()
    const user = await UserModel.create(userData)
    return formatUser(user.toObject())
  } catch (error) {
    console.error("Error adding user:", error)
    throw new Error("Failed to add user")
  }
}
