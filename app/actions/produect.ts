'use server'
import { connect } from "@/lib/dbConnect"
import Product from "@/lib/model/Product"

// TypeScript interface
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

// ✅ Helper: Convert MongoDB Product to plain JS object
function serializeProduct(product: any): Product {
  return {
    id: product._id.toString(),
    name: product.name,
    shortDescription: product.shortDescription,
    longDescription: product.longDescription,
    price: product.price,
    discount: product.discount,
    stock: product.stock,
    image: product.image,
    metaTags: product.metaTags,
    category: product.category,
    brand: product.brand,
    stripeProductId: product.stripeProductId || undefined,
    stripePriceId: product.stripePriceId || undefined,
    createdAt: product.createdAt?.toISOString() || "",
    updatedAt: product.updatedAt?.toISOString() || "",
  }
}

// ✅ Get all products
export async function getProducts(): Promise<Product[]> {
  try {
    await connect()
    const products = await Product.find().lean()
    return products.map(serializeProduct)
  } catch (error) {
    console.error("Error getting products:", error)
    throw new Error("Failed to fetch products")
  }
}

// ✅ Add new product
export async function addProduct(data: Product): Promise<Product> {
  try {
    await connect()
    const product = await Product.create(data)
    return serializeProduct(product)
  } catch (error) {
    console.error("Error adding product:", error)
    throw new Error("Failed to add product")
  }
}

// ✅ Update a product
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  try {
    await connect()
    const updated = await Product.findByIdAndUpdate(id, updates, { new: true }).lean()
    if (!updated) throw new Error("Product not found")
    return serializeProduct(updated)
  } catch (error) {
    console.error("Error updating product:", error)
    throw new Error("Failed to update product")
  }
}

// ✅ Delete a product
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await connect()
    const result = await Product.findByIdAndDelete(id)
    return !!result
  } catch (error) {
    console.error("Error deleting product:", error)
    throw new Error("Failed to delete product")
  }
}
