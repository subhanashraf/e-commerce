"use server"

import { revalidatePath } from "next/cache"
import {
  getProducts,
  addProduct as addProductToStore,
  updateProduct as updateProductInStore,
  deleteProduct as deleteProductFromStore,
} from "./data-store"

export async function addProduct(formData: FormData) {
  try {
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

    console.log("productData", productData)

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
        throw new Error(`Stripe integration failed: ${stripeError.message}`)
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

    revalidatePath("/shop")
    revalidatePath("/dashboard")

    return { success: true, productId: newProduct.id }
  } catch (error) {
    console.error("❌ Error adding product:", error)
    return { success: false, error: error.message || "Failed to add product" }
  }
}

export async function updateProduct(productId: string, updatedData: any) {
  try {
    const existingProduct = updateProductInStore(productId, updatedData)

    if (!existingProduct) {
      throw new Error("Product not found")
    }

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
    revalidatePath(`/product/${productId}`)

    return { success: true, productId }
  } catch (error) {
    console.error("❌ Error updating product:", error)
    return { success: false, error: error.message || "Failed to update product" }
  }
}

export async function deleteProduct(productId: string) {
  try {
    const products = getProducts()
    const product = products.find((p) => p.id === productId)

    if (!product) {
      throw new Error("Product not found")
    }

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
      throw new Error("Failed to delete product")
    }

    revalidatePath("/shop")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("❌ Error deleting product:", error)
    return { success: false, error: error.message || "Failed to delete product" }
  }
}

export async function addProductFromAI(extractedData: any) {
  try {
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
        throw new Error(`Stripe integration failed: ${stripeError.message}`)
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

    revalidatePath("/shop")
    revalidatePath("/dashboard")

    return { success: true, productId: newProduct.id }
  } catch (error) {
    console.error("❌ Error adding product from AI:", error)
    return { success: false, error: error.message || "Failed to add product" }
  }
}

export async function createStripeCheckout(productId: string, quantity = 1) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe not configured - please add STRIPE_SECRET_KEY to environment variables")
    }

    // Get product data
    const products = getProducts()
    const product = products.find((p) => p.id === productId)

    if (!product) {
      throw new Error("Product not found")
    }

    if (!product.stripePriceId) {
      throw new Error("Product not properly configured with Stripe")
    }

    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: product.stripePriceId,
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/product/${productId}`,
      metadata: {
        productId: productId,
        productName: product.name,
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
interface ProduectNUmber {
  productId:string,
  quantity:number
}
export async function createStripeCheckoutitem(productId:ProduectNUmber[]) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe not configured - please add STRIPE_SECRET_KEY to environment variables")
    }
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

     const lineItems = [];
    const metadata: { [key: string]: string } = {}; // To store metadata for the session

    // Iterate over the items received from the client
    for (const clientItem of productId) {
      const products = getProducts(); // Assuming getProducts() is defined and accessible
      const product = products.find((p) => p.id === clientItem.productId);

      if (!product) {
        throw new Error(`Product with ID ${clientItem.productId} not found.`);
      }

      if (!product.stripeProductId) {
        throw new Error(`Product ${product.name} (ID: ${product.id}) not properly configured with Stripe (missing stripePriceId).`);
      }

      if (clientItem.quantity <= 0 || clientItem.quantity > product.stock) {
          throw new Error(`Invalid quantity for product ${product.name}. Requested: ${clientItem.quantity}, Available: ${product.stock}`);
      }

      lineItems.push({
        price: product.stripePriceId, // Use the Stripe Price ID
        quantity: clientItem.quantity, // Use the quantity from the client request
      });

      // Add product details to session metadata (optional, for your records)
      metadata[`product_${clientItem.productId}_name`] = product.name;
      metadata[`product_${clientItem.productId}_quantity`] = clientItem.quantity.toString();
    }

    if (lineItems.length === 0) {
      throw new Error("No valid items to checkout.");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/product/${productId}`,
      metadata: metadata,
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
