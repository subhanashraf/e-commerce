import fs from "fs"
import path from "path"

// Types
export interface Product {
  id: string
  name: string
  shortDescription: string
  longDescription: string
  price: number
  discount: number
  stock: number
  image: string
  metaTags: string[]
  category: string
  brand: string
  stripeProductId?: string
  stripePriceId?: string
  createdAt: string
  updatedAt: string
}

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

export interface Analytics {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  monthlyData: {
    month: string
    revenue: number
    orders: number
  }[]
  topProducts: {
    productId: string
    productName: string
    totalSold: number
    revenue: number
  }[]
  lastUpdated: string
}

export interface AIRequest {
  date: string
  count: number
}

// File paths
const DATA_DIR = path.join(process.cwd(), "public", "data")
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json")
const ORDERS_FILE = path.join(DATA_DIR, "orders.json")
const USERS_FILE = path.join(DATA_DIR, "users.json")
const ANALYTICS_FILE = path.join(DATA_DIR, "analytics.json")
const AI_REQUESTS_FILE = path.join(DATA_DIR, "ai-requests.json")

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Helper functions
function readJSONFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8")
      return JSON.parse(data)
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error)
  }
  return defaultValue
}

function writeJSONFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error)
  }
}

// Product functions
export function getProducts(): Product[] {
  return readJSONFile<Product[]>(PRODUCTS_FILE, [])
}

export function addProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
  const products = getProducts()
  const newProduct: Product = {
    ...productData,
    id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  products.push(newProduct)
  writeJSONFile(PRODUCTS_FILE, products)
  updateAnalytics()
  return newProduct
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts()
  const index = products.findIndex((p) => p.id === id)

  if (index === -1) return null

  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  writeJSONFile(PRODUCTS_FILE, products)
  updateAnalytics()
  return products[index]
}

export function deleteProduct(id: string): boolean {
  const products = getProducts()
  const filteredProducts = products.filter((p) => p.id !== id)

  if (filteredProducts.length === products.length) return false

  writeJSONFile(PRODUCTS_FILE, filteredProducts)
  updateAnalytics()
  return true
}

// Order functions
export function getOrders(): Order[] {
  return readJSONFile<Order[]>(ORDERS_FILE, [])
}

export function addOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Order {
  const orders = getOrders()
  const newOrder: Order = {
    ...orderData,
    id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  orders.push(newOrder)
  writeJSONFile(ORDERS_FILE, orders)

  // Update or create user
  updateUserFromOrder(newOrder)
  updateAnalytics()

  return newOrder
}

// User functions
export function getUsers(): User[] {
  return readJSONFile<User[]>(USERS_FILE, [])
}

export function addUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): User {
  const users = getUsers()
  const newUser: User = {
    ...userData,
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  users.push(newUser)
  writeJSONFile(USERS_FILE, users)
  return newUser
}

function updateUserFromOrder(order: Order): void {
  const users = getUsers()
  const existingUser = users.find((u) => u.email === order.customerEmail)

  if (existingUser) {
    // Update existing user
    existingUser.totalOrders += 1
    existingUser.totalSpent += order.total
    existingUser.updatedAt = new Date().toISOString()

    // Update addresses if provided
    if (order.shippingAddress) {
      existingUser.shippingAddress = order.shippingAddress
    }
    if (order.billingAddress) {
      existingUser.billingAddress = order.billingAddress
    }
  } else {
    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: order.customerEmail,
      name: order.customerName,
      phone: order.customerPhone,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      totalOrders: 1,
      totalSpent: order.total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    users.push(newUser)
  }

  writeJSONFile(USERS_FILE, users)
}

// Analytics functions
export function getAnalytics(): Analytics {
  return readJSONFile<Analytics>(ANALYTICS_FILE, {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    monthlyData: [],
    topProducts: [],
    lastUpdated: new Date().toISOString(),
  })
}

function updateAnalytics(): void {
  const orders = getOrders()
  const users = getUsers()
  const products = getProducts()

  // Calculate totals
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const totalCustomers = users.length

  // Calculate monthly data
  const monthlyMap = new Map<string, { revenue: number; orders: number }>()

  orders.forEach((order) => {
    const month = new Date(order.createdAt).toISOString().slice(0, 7) // YYYY-MM
    const existing = monthlyMap.get(month) || { revenue: 0, orders: 0 }
    monthlyMap.set(month, {
      revenue: existing.revenue + order.total,
      orders: existing.orders + 1,
    })
  })

  const monthlyData = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month,
      ...data,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))

  // Calculate top products
  const productMap = new Map<string, { productName: string; totalSold: number; revenue: number }>()

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const existing = productMap.get(item.productId) || {
        productName: item.productName,
        totalSold: 0,
        revenue: 0,
      }
      productMap.set(item.productId, {
        productName: item.productName,
        totalSold: existing.totalSold + item.quantity,
        revenue: existing.revenue + item.total,
      })
    })
  })

  const topProducts = Array.from(productMap.entries())
    .map(([productId, data]) => ({
      productId,
      ...data,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)

  const analytics: Analytics = {
    totalRevenue,
    totalOrders,
    totalCustomers,
    monthlyData,
    topProducts,
    lastUpdated: new Date().toISOString(),
  }

  writeJSONFile(ANALYTICS_FILE, analytics)
}

// AI Request functions
export function getAIRequests(): AIRequest[] {
  return readJSONFile<AIRequest[]>(AI_REQUESTS_FILE, [])
}

export function canMakeAIRequest(): boolean {
  const today = new Date().toISOString().split("T")[0]
  const requests = getAIRequests()
  const todayRequest = requests.find((r) => r.date === today)
  return !todayRequest || todayRequest.count < 10
}

export function incrementAIRequestCount(): void {
  const today = new Date().toISOString().split("T")[0]
  const requests = getAIRequests()
  const todayIndex = requests.findIndex((r) => r.date === today)

  if (todayIndex >= 0) {
    requests[todayIndex].count += 1
  } else {
    requests.push({ date: today, count: 1 })
  }

  // Keep only last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const filteredRequests = requests.filter((r) => new Date(r.date) >= thirtyDaysAgo)

  writeJSONFile(AI_REQUESTS_FILE, filteredRequests)
}

export function getAIRequestCount(): { used: number; limit: number } {
  const today = new Date().toISOString().split("T")[0]
  const requests = getAIRequests()
  const todayRequest = requests.find((r) => r.date === today)
  return {
    used: todayRequest?.count || 0,
    limit: 10,
  }
}

// Product limits
export function getProductLimits(): { current: number; limit: number; remaining: number } {
  const products = getProducts()
  const current = products.length
  const limit = 20
  return {
    current,
    limit,
    remaining: Math.max(0, limit - current),
  }
}


// Company data (static)
export function getCompany() {
  return {
    company: {
      name: "DarkStore",
      tagline: "Premium E-commerce Experience",
      description:
        "We are a leading e-commerce platform dedicated to providing premium products with exceptional customer service.",
      founded: "2020",
      employees: "50+",
      headquarters: "New York, USA",
      mission:
        "To revolutionize online shopping by providing premium products with exceptional customer service and cutting-edge technology.",
      vision:
        "To become the world's most trusted e-commerce platform, known for quality, innovation, and customer satisfaction.",
      values: ["Quality First", "Customer Satisfaction", "Innovation", "Sustainability", "Transparency"],
      contact: {
        email: "info@darkstore.com",
        phone: "+1 (555) 123-4567",
        address: "123 Business Ave, New York, NY 10001",
      },
      social: {
        facebook: "https://facebook.com/darkstore",
        twitter: "https://twitter.com/darkstore",
        instagram: "https://instagram.com/darkstore",
        linkedin: "https://linkedin.com/company/darkstore",
      },
    },
    faq: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy for all products. Items must be in original condition with tags attached.",
      },
      {
        question: "How long does shipping take?",
        answer: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days.",
      },
      {
        question: "Do you ship internationally?",
        answer: "Yes, we ship to over 50 countries worldwide. International shipping times vary by location.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Once your order ships, you'll receive a tracking number via email. You can track your package on our website.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards, PayPal, Apple Pay, and Google Pay through our secure Stripe integration.",
      },
    ],
  }
}