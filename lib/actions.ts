"use server"

import { revalidatePath } from "next/cache"
import {
  getProducts,
  addProduct as addProductToStore,
  updateProduct as updateProductInStore,
  deleteProduct as deleteProductFromStore,
  canMakeAIRequest,
  incrementAIRequestCount,
  getProductLimits,
} from "./data-store"
import Stripe from "stripe"


export async function addProduct(formData: FormData) {
  try {
    console.log("🚀 Starting addProduct action...")

    // Check product limit first
    const limits = getProductLimits()
    console.log("📊 Product limits:", limits)

    if (limits.remaining <= 0) {
      console.log("❌ Product limit reached")
      return {
        success: false,
        error: `Maximum ${limits.limit} products allowed. Please delete some products before adding new ones.`,
      }
    }

    const productData = {
      name: formData.get("name") as string,
      shortDescription: formData.get("shortDescription") as string,
      longDescription: formData.get("longDescription") as string,
      price: Number.parseFloat(formData.get("price") as string),
      discount: Number.parseInt(formData.get("discount") as string) || 0,
      stock: Number.parseInt(formData.get("stock") as string),
      image: formData.get("image") as string,
      metaTags: (formData.get("metaTags") as string)
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      category: formData.get("category") as string,
      brand: formData.get("brand") as string,
    }

    console.log("📝 Product data:", productData)

    // Validate required fields
    if (!productData.name || !productData.price || !productData.category || !productData.brand) {
      console.log("❌ Missing required fields")
      return {
        success: false,
        error: "Please fill in all required fields (name, price, category, brand)",
      }
    }

    // Create product in Stripe first
    let stripeProductId = null
    let stripePriceId = null

    if (process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

        const stripeProduct = await stripe.products.create({
          name: productData.name,
          description: productData.shortDescription,
          images: [productData.image],
          metadata: {
            category: productData.category,
            brand: productData.brand,
          },
        })

        const stripePrice = await stripe.prices.create({
          unit_amount: Math.round(productData.price * 100), // Convert to cents
          currency: "usd",
          product: stripeProduct.id,
        })

        stripeProductId = stripeProduct.id
        stripePriceId = stripePrice.id
        console.log("✅ Created Stripe product:", stripeProductId)
        console.log("✅ Created Stripe price:", stripePriceId)
      } catch (stripeError) {
        console.error("❌ Stripe error:", stripeError)
        // Continue without Stripe for demo purposes
        stripeProductId = `mock_${Date.now()}`
        stripePriceId = `price_mock_${Date.now()}`
      }
    } else {
      console.warn("⚠️ STRIPE_SECRET_KEY not found, using mock IDs")
      stripeProductId = `mock_${Date.now()}`
      stripePriceId = `price_mock_${Date.now()}`
    }

    const newProduct = addProductToStore({
      ...productData,
      stripeProductId,
      stripePriceId,
    })

    console.log("✅ Product added successfully:", newProduct.id)

    // Revalidate all relevant paths
    revalidatePath("/shop")
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/add-product")
    revalidatePath("/")

    return { success: true, productId: newProduct.id, product: newProduct }
  } catch (error) {
    console.error("❌ Error adding product:", error)
    return { success: false, error: error.message || "Failed to add product" }
  }
}

export async function updateProduct(productId: string, updatedData: any) {
  try {
    console.log("🔄 Updating product:", productId)

    const existingProduct = updateProductInStore(productId, updatedData)

    if (!existingProduct) {
      console.log("❌ Product not found:", productId)
      throw new Error("Product not found")
    }

    console.log("✅ Product updated successfully:", productId)

    // Update Stripe product if available
    if (process.env.STRIPE_SECRET_KEY && existingProduct.stripeProductId) {
      try {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

        // Update Stripe product
        await stripe.products.update(existingProduct.stripeProductId, {
          name: updatedData.name,
          description: updatedData.shortDescription,
          images: [updatedData.image],
          metadata: {
            category: updatedData.category,
            brand: updatedData.brand,
          },
        })

        // Create new price if price changed
        if (existingProduct.price !== updatedData.price) {
          const newPrice = await stripe.prices.create({
            unit_amount: Math.round(updatedData.price * 100),
            currency: "usd",
            product: existingProduct.stripeProductId,
          })

          // Archive old price
          if (existingProduct.stripePriceId) {
            await stripe.prices.update(existingProduct.stripePriceId, {
              active: false,
            })
          }

          updateProductInStore(productId, { stripePriceId: newPrice.id })
        }

        console.log("✅ Updated Stripe product:", existingProduct.stripeProductId)
      } catch (stripeError) {
        console.error("❌ Stripe update error:", stripeError)
        // Continue with local update even if Stripe fails
      }
    }

    revalidatePath("/shop")
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/add-product")
    revalidatePath(`/product/${productId}`)

    return { success: true, productId, product: existingProduct }
  } catch (error) {
    console.error("❌ Error updating product:", error)
    return { success: false, error: error.message || "Failed to update product" }
  }
}

export async function deleteProduct(productId: string) {
  try {
    console.log("🗑️ Deleting product:", productId)

    const products = await getProducts()
    console.log(products,"prskndjksdn");
    
    const product = products.find((p) => p.id === productId)


    if (!product) {
      console.log("❌ Product not found for deletion:", productId)
      throw new Error("Product not found")
    }

    console.log("📦 Found product to delete:", product.name)

    // Archive Stripe product if available
    if (process.env.STRIPE_SECRET_KEY && product.stripeProductId) {
      try {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

        await stripe.products.update(product.stripeProductId, {
          active: false,
        })

        console.log("✅ Archived Stripe product:", product.stripeProductId)
      } catch (stripeError) {
        console.error("❌ Stripe archive error:", stripeError)
        // Continue with local deletion even if Stripe fails
      }
    }

    // Remove from local data
    const deleted = deleteProductFromStore(productId)

    if (!deleted) {
      console.log("❌ Failed to delete from local store")
      throw new Error("Failed to delete product from store")
    }

    console.log("✅ Product deleted successfully:", productId)

    revalidatePath("/shop")
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/add-product")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("❌ Error deleting product:", error)
    return { success: false, error: error.message || "Failed to delete product" }
  }
}

export async function addProductFromAI(extractedData: any) {
  try {
    console.log("🤖 Adding product from AI:", extractedData)

    // Check AI request limit
    if (!canMakeAIRequest()) {
      console.log("❌ AI request limit reached")
      return {
        success: false,
        error: "Daily AI request limit reached (10/day). Please try again tomorrow.",
      }
    }

    // Check product limit
    const limits = getProductLimits()
    if (limits.remaining <= 0) {
      console.log("❌ Product limit reached")
      return {
        success: false,
        error: `Maximum ${limits.limit} products allowed. Please delete some products before adding new ones.`,
      }
    }

    // Increment AI request count
    incrementAIRequestCount()

    const productData = {
      name: extractedData.name,
      shortDescription: extractedData.shortDescription || `High-quality ${extractedData.name}`,
      longDescription:
        extractedData.longDescription || `Premium ${extractedData.name} with excellent features and quality.`,
      price: extractedData.price,
      discount: extractedData.discount || 0,
      stock: extractedData.stock || 10,
      image: extractedData.image || `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop`,
      metaTags: extractedData.metaTags ? extractedData.metaTags.split(",").map((tag: string) => tag.trim()) : [],
      category: extractedData.category || "General",
      brand: extractedData.brand || "Generic",
    }

    // Create product in Stripe
    let stripeProductId = null
    let stripePriceId = null

    if (process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

        const stripeProduct = await stripe.products.create({
          name: productData.name,
          description: productData.shortDescription,
          images: [productData.image],
          metadata: {
            category: productData.category,
            brand: productData.brand,
          },
        })

        const stripePrice = await stripe.prices.create({
          unit_amount: Math.round(productData.price * 100),
          currency: "usd",
          product: stripeProduct.id,
        })

        stripeProductId = stripeProduct.id
        stripePriceId = stripePrice.id
        console.log("✅ Created Stripe product from AI:", stripeProductId)
      } catch (stripeError) {
        console.error("❌ Stripe error:", stripeError)
        stripeProductId = `mock_ai_${Date.now()}`
        stripePriceId = `price_mock_ai_${Date.now()}`
      }
    } else {
      stripeProductId = `mock_ai_${Date.now()}`
      stripePriceId = `price_mock_ai_${Date.now()}`
    }

    const newProduct = addProductToStore({
      ...productData,
      stripeProductId,
      stripePriceId,
    })

    console.log("✅ AI product added successfully:", newProduct.id)

    revalidatePath("/shop")
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/add-product")
    revalidatePath("/")

    return { success: true, productId: newProduct.id, product: newProduct }
  } catch (error) {
    console.error("❌ Error adding product from AI:", error)
    return { success: false, error: error.message || "Failed to add product" }
  }
}

export async function createStripeCheckout(items: any[], customerInfo: any) {
  try {


    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe not configured - please add STRIPE_SECRET_KEY to environment variables")
    }

    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

    // Create line items for Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image],
          metadata: {
            productId: item.id,
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/cart`,
      customer_email: customerInfo.email,
     
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone || "",
      },
    })

    console.log("✅ Created Stripe checkout session:", session.id)

    return {
      success: true,
      url: session.url,
      sessionId: session.id,
    }
  } catch (error) {
    console.error("❌ Error creating Stripe checkout:", error)
    return {
      success: false,
      error: error.message || "Failed to create checkout session. Please try again.",
    }
  }
}
interface LineItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CustomerInfo {
  name: string
  email: string
  phone?: string
}

interface CheckoutResult {
  success: boolean
  url?: string
  sessionId?: string
  error?: string
}

export async function createStripeCheckoutone(
  items: LineItem[],
  customerInfo: CustomerInfo
): Promise<CheckoutResult> {
  // Validate environment variables
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("Stripe secret key not configured")
    return {
      success: false,
      error: "Payment system is currently unavailable. Please try again later."
    }
  }

  // Validate input data
  if (!items || items.length === 0) {
    return {
      success: false,
      error: "No items provided for checkout"
    }
  }

  if (!customerInfo?.email) {
    return {
      success: false,
      error: "Customer email is required"
    }
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16"
  })

  try {
    // Prepare line items
    const lineItems = items.map(item => {
      if (!item.price || item.price <= 0) {
        throw new Error(`Invalid price for item: ${item.name}`)
      }
      if (!item.quantity || item.quantity <= 0) {
        throw new Error(`Invalid quantity for item: ${item.name}`)
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.image],
            metadata: {
              productId: item.id
            }
          },
          unit_amount: Math.round(item.price * 100) // Convert to cents
        },
        quantity: item.quantity
      }
    })

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/cart`,
      customer_email: customerInfo.email,
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true
      },
      metadata: {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone || "",
        productIds: items.map(item => item.id).join(",")
      },
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB"] // Customize as needed
      }
    })

    if (!session.url) {
      throw new Error("Failed to create checkout session URL")
    }

    return {
      success: true,
      url: session.url,
      sessionId: session.id
    }

  } catch (error) {
    console.error("Stripe checkout error:", error)
    
    let errorMessage = "Failed to process payment"
    if (error instanceof Stripe.errors.StripeError) {
      errorMessage = error.message
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      error: errorMessage
    }
  }
}

