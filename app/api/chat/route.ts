import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

// Initialize OpenAI (if API key is available)
// let openai: any = null
// if (process.env.OPENAI_API_KEY) {
//   try {
//     const { OpenAI } = require("openai")
//     openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
//   } catch (error) {
//     console.warn("OpenAI not available:", error.message)
//   }
// }

async function getProducts() {
  try {
    const filePath = join(process.cwd(), "data", "products.json")
    const fileContent = await readFile(filePath, "utf8")
    const data = JSON.parse(fileContent)
    return data.products
  } catch (error) {
    return []
  }
}

export async function POST(req: NextRequest) {
  try {
    const { question , type } = await req.json()

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    const products = await getProducts()

    // If OpenAI is available, use it
    if (process.env.OPENAI_API_KEY) {
      try {
        const productListText = products
          .map(
            (p: any, i: number) =>
              `Product ${i + 1}:
Title: ${p.name}
Description: ${p.shortDescription}
Price: $${p.price}
Category: ${p.category}
Brand: ${p.brand}
Stock: ${p.stock}
Discount: ${p.discount || 0}%
Tags: ${p.metaTags?.join(", ") || "N/A"}`,
          )
          .join("\n\n")

        const systemPrompt = `You are a helpful AI shopping assistant for DarkStore, a premium e-commerce website.

Your role is to:
1. Help customers find products based on their needs
2. Provide detailed product information and recommendations
3. Answer questions about pricing, availability, and features
4. Assist with store policies (shipping, returns, payments)
5. Be friendly, helpful, and conversational

IMPORTANT MATCHING RULES:
- Match products by name, category, brand, description, or tags
- Consider synonyms (e.g., "headphones" = "earbuds", "shoes" = "footwear")
- Look for partial matches and related terms
- If someone asks about "wireless audio", match both headphones and earbuds
- If someone asks about "clothing", match shirts, pants, dresses, etc.
- If someone asks about price ranges, show products within that range

Current Products Available:
${productListText}



Store Information:
- Free shipping on orders over $50
- 30-day return policy on all items
- We accept all major credit cards, PayPal, Apple Pay, Google Pay
- 24/7 customer support available
- Secure checkout with Stripe
Website Maker Information:
- This website, DarkStore, was developed by [Subhan ashraf]. 



If asked about the website maker, provide the information from the "Website Maker Information" section.


Always be specific about which products you're recommending and why they match the customer's needs.`

  // 2. Use minimal prompt
const prompt = `Products: ${products.join(",")}\nQ: ${question}\nA:`;

// 3. Call lightweight model
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.OPENAI_API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `Products:\n${systemPrompt}\n\nQuestion: ${question}` }]
      }],
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.7,
        topP: 0.9
      }
    })
  }
);

const result = await response.json();

// Proper response extraction
console.log(result,"result");

const aiAnswer = result.candidates?.[0]?.content?.parts?.[0]?.text || 
  "Sorry, I couldn't generate a response.";

// Check for incomplete responses
if (result.candidates?.[0]?.finishReason === "MAX_TOKENS") {
  console.warn("Response truncated due to token limit");
}
        
        

        return NextResponse.json({
          answer: aiAnswer,
          source: "openai",
          products: products.length,
        })
      } catch (openaiError) {
        console.error("OpenAI API error:", openaiError)
        // Fall back to local logic
      }
    }

    // Enhanced fallback to local AI logic
    // const localResponse = generateEnhancedLocalResponse(question, products)
    // return NextResponse.json({
    //   answer: localResponse,
    //   source: "local",
    //   products: products.length,
    // })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateEnhancedLocalResponse(question: string, products: any[]): string {
  const input = question.toLowerCase()

  // Enhanced keyword matching
  const findMatchingProducts = (keywords: string[]) => {
    return products.filter((product) => {
      const searchText = `${product.name} ${product.shortDescription} ${product.category} ${product.brand} ${product.metaTags?.join(" ") || ""
        }`.toLowerCase()

      return keywords.some((keyword) => searchText.includes(keyword))
    })
  }

  // Audio/Electronics keywords
  if (
    input.includes("headphones") ||
    input.includes("earbuds") ||
    input.includes("audio") ||
    input.includes("music") ||
    input.includes("wireless") ||
    input.includes("sound")
  ) {
    const audioProducts = findMatchingProducts(["headphones", "earbuds", "audio", "wireless"])
    if (audioProducts.length > 0) {
      const product = audioProducts[0]
      const discount = product.discount
        ? ` (${product.discount}% off - now $${(product.price * (1 - product.discount / 100)).toFixed(2)})`
        : ""
      return `Perfect! I recommend our ${product.name}! ${product.shortDescription} It's priced at $${product.price}${discount} and we have ${product.stock} in stock. This ${product.brand} product is perfect for music lovers and daily use. Would you like to know more about its features?`
    }
  }

  // Clothing keywords
  if (
    input.includes("shirt") ||
    input.includes("clothing") ||
    input.includes("wear") ||
    input.includes("cotton") ||
    input.includes("fashion")
  ) {
    const clothingProducts = findMatchingProducts(["shirt", "clothing", "cotton", "wear"])
    if (clothingProducts.length > 0) {
      const product = clothingProducts[0]
      const discount = product.discount ? ` (${product.discount}% off!)` : ""
      return `Great choice! Check out our ${product.name}! ${product.shortDescription} Available for $${product.price}${discount} with ${product.stock} pieces in stock. This ${product.brand} item is perfect for casual wear and daily comfort. Interested in learning more?`
    }
  }

  // Footwear keywords
  if (
    input.includes("shoes") ||
    input.includes("running") ||
    input.includes("sneakers") ||
    input.includes("footwear") ||
    input.includes("exercise")
  ) {
    const shoeProducts = findMatchingProducts(["shoes", "running", "sneakers", "footwear"])
    if (shoeProducts.length > 0) {
      const product = shoeProducts[0]
      return `Excellent! Our ${product.name} would be perfect for you! ${product.shortDescription} They're priced at $${product.price} and we have ${product.stock} pairs available. These ${product.brand} shoes are ideal for running, exercise, and daily activities. Want to know more about the features?`
    }
  }

  // Electronics/Tech keywords
  if (
    input.includes("watch") ||
    input.includes("fitness") ||
    input.includes("smart") ||
    input.includes("tech") ||
    input.includes("electronic")
  ) {
    const techProducts = findMatchingProducts(["watch", "fitness", "smart", "electronic", "tech"])
    if (techProducts.length > 0) {
      const product = techProducts[0]
      const discount = product.discount ? ` (${product.discount}% discount available!)` : ""
      return `Amazing! I suggest our ${product.name}! ${product.shortDescription} It's available for $${product.price}${discount} and we have ${product.stock} units in stock. This ${product.brand} device is perfect for fitness enthusiasts and tech lovers. Would you like detailed specifications?`
    }
  }

  // Accessories keywords
  if (
    input.includes("bag") ||
    input.includes("office") ||
    input.includes("work") ||
    input.includes("laptop") ||
    input.includes("leather")
  ) {
    const bagProducts = findMatchingProducts(["bag", "office", "leather", "work", "laptop"])
    if (bagProducts.length > 0) {
      const product = bagProducts[0]
      return `Perfect for professionals! Our ${product.name} is exactly what you need! ${product.shortDescription} Priced at $${product.price} with ${product.stock} available. This ${product.brand} bag is ideal for work, travel, and daily professional use. Interested in the details?`
    }
  }

  // Price-related queries
  if (input.includes("price") || input.includes("cost") || input.includes("cheap") || input.includes("expensive")) {
    const prices = products.map((p) => p.price).sort((a, b) => a - b)
    const cheapest = products.find((p) => p.price === prices[0])
    const mostExpensive = products.find((p) => p.price === prices[prices.length - 1])

    return `Our products range from $${prices[0]} to $${prices[prices.length - 1]}. Here are some options:

💰 Most Affordable: ${cheapest?.name} - $${cheapest?.price}
💎 Premium Option: ${mostExpensive?.name} - $${mostExpensive?.price}

Popular mid-range items:
${products
        .slice(1, 4)
        .map((p) => `• ${p.name} - $${p.price}${p.discount ? ` (${p.discount}% off!)` : ""}`)
        .join("\n")}

What's your budget range? I can help you find the perfect product!`
  }

  // Store policy responses
  if (input.includes("shipping") || input.includes("delivery")) {
    return "🚚 **Shipping Information:**\n\n• FREE shipping on orders over $50!\n• Standard delivery: 3-5 business days\n• Express shipping: 1-2 business days (additional cost)\n• All orders include tracking information\n• We ship nationwide with reliable carriers\n\nNeed help with anything else?"
  }

  if (input.includes("return") || input.includes("refund")) {
    return "↩️ **Return Policy:**\n\n• 30-day return policy on all products\n• Items must be in original condition with tags\n• Free returns - we provide return labels\n• Refunds processed within 5-7 business days\n• Easy return process through our support team\n\nHave a specific return question?"
  }

  if (input.includes("payment") || input.includes("pay")) {
    return "💳 **Payment Options:**\n\n• All major credit cards (Visa, MasterCard, Amex)\n• PayPal for secure online payments\n• Apple Pay for iOS users\n• Google Pay for Android users\n• All payments secured by Stripe encryption\n\nYour payment information is always protected!"
  }

  // Greeting responses
  if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
    return `Hello! 👋 Welcome to DarkStore! I'm here to help you find the perfect products from our collection of ${products.length} premium items.\n\nWe have:\n• Electronics & Tech gadgets\n• Fashion & Clothing\n• Footwear & Accessories\n• Fitness & Lifestyle products\n\nWhat are you looking for today? I can help you find products, check prices, or answer any questions!`
  }

  // Default enhanced response
  return `I'd love to help you find what you're looking for! 🛍️\n\nWe have ${products.length} amazing products across these categories:\n\n📱 **Electronics**: Headphones, smartwatches, and tech gadgets\n👕 **Clothing**: Premium shirts, comfortable wear\n👟 **Footwear**: Running shoes, casual sneakers\n💼 **Accessories**: Professional bags, lifestyle items\n\nYou can ask me about:\n• Specific products or categories\n• Price ranges and deals\n• Product recommendations\n• Shipping and return policies\n\nWhat specific product or category interests you most?`
}
