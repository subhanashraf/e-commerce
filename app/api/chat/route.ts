import { type NextRequest, NextResponse } from "next/server"

import { join } from "path"
import { getProducts } from "@/app/actions/produect"


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
6. Use emojis wisely and relevantly (not on metaTags or imageUrl).

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


