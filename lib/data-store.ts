
const productsData = {
  products: [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      shortDescription: "High-quality wireless headphones with noise cancellation",
      longDescription:
        "Experience premium sound quality with our state-of-the-art wireless headphones. Featuring active noise cancellation, 30-hour battery life, and premium comfort padding. Perfect for music lovers, professionals, and anyone who demands the best audio experience.",
      price: 299.99,
      discount: 10,
      stock: 50,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      metaTags: ["electronics", "audio", "wireless", "premium"],
      category: "Electronics",
      brand: "AudioTech",
      stripeProductId: null,
    },
    {
      id: "2",
      name: "Organic Cotton T-Shirt",
      shortDescription: "Comfortable organic cotton t-shirt in multiple colors",
      longDescription:
        "Made from 100% organic cotton, this premium t-shirt offers unmatched comfort and durability. Available in various colors and sizes, it's perfect for casual wear or as a wardrobe staple. Ethically sourced and environmentally friendly.",
      price: 29.99,
      discount: 0,
      stock: 100,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      metaTags: ["clothing", "organic", "cotton", "casual"],
      category: "Clothing",
      brand: "EcoWear",
      stripeProductId: null,
    },
    {
      id: "3",
      name: "Smart Fitness Watch",
      shortDescription: "Advanced fitness tracking with heart rate monitoring",
      longDescription:
        "Track your fitness goals with precision using our advanced smart watch. Features include heart rate monitoring, GPS tracking, sleep analysis, and smartphone notifications. Water-resistant design perfect for all activities.",
      price: 199.99,
      discount: 15,
      stock: 25,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      metaTags: ["fitness", "smartwatch", "health", "technology"],
      category: "Electronics",
      brand: "FitTech",
      stripeProductId: null,
    },
    {
      id: "4",
      name: "Leather Office Bag",
      shortDescription: "Professional leather bag for work and travel",
      longDescription:
        "Crafted from genuine leather, this professional bag is perfect for the modern professional. Features multiple compartments, laptop sleeve, and durable construction. Ideal for work, travel, and daily use.",
      price: 149.99,
      discount: 5,
      stock: 30,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      metaTags: ["accessories", "leather", "professional", "bag"],
      category: "Accessories",
      brand: "LeatherCraft",
      stripeProductId: null,
    },
    {
      id: "5",
      name: "Wireless Earbuds",
      shortDescription: "Compact wireless earbuds with premium sound",
      longDescription:
        "Experience freedom with our wireless earbuds. Featuring noise-cancelling technology, 24-hour battery life, and compact design. Perfect for workouts, commuting, and everyday listening.",
      price: 79.99,
      discount: 20,
      stock: 75,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
      metaTags: ["electronics", "audio", "wireless", "compact"],
      category: "Electronics",
      brand: "AudioTech",
      stripeProductId: null,
    },
    {
      id: "6",
      name: "Red Running Shoes",
      shortDescription: "Lightweight running shoes for daily workouts",
      longDescription:
        "Lightweight, breathable shoes designed for jogging and daily wear. Features advanced cushioning, moisture-wicking materials, and durable construction. Perfect for runners of all levels.",
      price: 59.99,
      discount: 0,
      stock: 40,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      metaTags: ["footwear", "running", "sports", "lightweight"],
      category: "Footwear",
      brand: "SportFlex",
      stripeProductId: null,
    },
  ],
}

const ordersData = {
  orders: [
    {
      id: "order_001",
      userName: "John Doe",
      email: "john@example.com",
      products: [
        {
          id: "1",
          name: "Premium Wireless Headphones",
          quantity: 1,
          price: 269.99,
        },
      ],
      status: "shipped",
      total: 269.99,
      date: "2024-01-15T10:30:00Z",
      shippingAddress: "123 Main St, New York, NY 10001",
    },
    {
      id: "order_002",
      userName: "Jane Smith",
      email: "jane@example.com",
      products: [
        {
          id: "3",
          name: "Smart Fitness Watch",
          quantity: 1,
          price: 169.99,
        },
      ],
      status: "pending",
      total: 169.99,
      date: "2024-01-16T14:20:00Z",
      shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
    },
    {
      id: "order_003",
      userName: "Mike Johnson",
      email: "mike@example.com",
      products: [
        {
          id: "5",
          name: "Wireless Earbuds",
          quantity: 2,
          price: 63.99,
        },
      ],
      status: "delivered",
      total: 127.98,
      date: "2024-01-14T09:15:00Z",
      shippingAddress: "789 Pine St, Chicago, IL 60601",
    },
  ],
}

const usersData = {
  users: [
    {
      id: "user_001",
      name: "John Doe",
      email: "john@example.com",
      address: "123 Main St, New York, NY 10001",
      phone: "+1 (555) 123-4567",
      totalSpent: 269.99,
      orders: ["order_001"],
      joinDate: "2023-12-01T00:00:00Z",
    },
    {
      id: "user_002",
      name: "Jane Smith",
      email: "jane@example.com",
      address: "456 Oak Ave, Los Angeles, CA 90210",
      phone: "+1 (555) 987-6543",
      totalSpent: 169.99,
      orders: ["order_002"],
      joinDate: "2023-11-15T00:00:00Z",
    },
    {
      id: "user_003",
      name: "Mike Johnson",
      email: "mike@example.com",
      address: "789 Pine St, Chicago, IL 60601",
      phone: "+1 (555) 456-7890",
      totalSpent: 127.98,
      orders: ["order_003"],
      joinDate: "2023-10-20T00:00:00Z",
    },
  ],
}

const analyticsData = {
  salesData: [
    {
      month: "Jan",
      sales: 4500,
      orders: 45,
      customers: 38,
    },
    {
      month: "Feb",
      sales: 5200,
      orders: 52,
      customers: 44,
    },
    {
      month: "Mar",
      sales: 4800,
      orders: 48,
      customers: 41,
    },
    {
      month: "Apr",
      sales: 6100,
      orders: 61,
      customers: 55,
    },
    {
      month: "May",
      sales: 5800,
      orders: 58,
      customers: 52,
    },
    {
      month: "Jun",
      sales: 6500,
      orders: 65,
      customers: 59,
    },
  ],
  topProducts: [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      sales: 25,
      revenue: 6749.75,
    },
    {
      id: "5",
      name: "Wireless Earbuds",
      sales: 40,
      revenue: 2559.6,
    },
    {
      id: "3",
      name: "Smart Fitness Watch",
      sales: 18,
      revenue: 3059.82,
    },
  ],
}

const companyData = {
  company: {
    name: "DarkStore",
    tagline: "Premium E-commerce Experience",
    description:
      "We are a leading e-commerce platform dedicated to providing premium products with exceptional customer service. Our mission is to make online shopping seamless, secure, and enjoyable.",
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

// Data access functions
export function getProducts() {
  return productsData.products
}

export function getProduct(id: string) {
  return productsData.products.find((p) => p.id === id)
}

export function addProduct(product: any) {
  const newProduct = {
    ...product,
    id: (productsData.products.length + 1).toString(),
  }
  productsData.products.push(newProduct)
  return newProduct
}

export function updateProduct(id: string, updates: any) {
  const index = productsData.products.findIndex((p) => p.id === id)
  if (index !== -1) {
    productsData.products[index] = { ...productsData.products[index], ...updates }
    return productsData.products[index]
  }
  return null
}

export function deleteProduct(id: string) {
  const index = productsData.products.findIndex((p) => p.id === id)
  if (index !== -1) {
    productsData.products.splice(index, 1)
    return true
  }
  return false
}

export function getOrders() {
  return ordersData.orders
}

export function getUsers() {
  return usersData.users
}

export function getAnalytics() {
  return analyticsData
}

export function getCompany() {
  return companyData
}
