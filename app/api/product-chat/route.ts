import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { getProducts } from "@/app/actions/produect"




export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json()

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    const products = await getProducts()

    // If OpenAI is available, use it for product extraction
    if ( process.env.OPENAI_API_KEY) {
      try {
         const systemPrompt = `You are an AI product assistant that helps create e-commerce product listings. 
Given a product description  your are handle user like use question other filed relative than your are some respon, 
{
  "productName": "Refined product name",
  "suggestedPrice": 19.99,
  "shortDescription": "Brief product summary",
  "longDescription": "Detailed product description",
  "category": "Relevant category",
  "brand": "Plausible brand name",
  "metaTags": ["comma", "separated", "keywords"],
  "imageUrl": "https://images.unsplash.com/photo-PHOTO_ID?w=400&h=400&fit=crop" this is important
}

Rules:
1. Image URL must be from Unsplash and must work
2. Price should be realistic for the product type
3. Descriptions should be compelling and accurate



Product to describe: "${question.trim()}"`

       const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.OPENAI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'x-goog-api-key': process.env.GEMINI_API_KEY, // Not needed if key is in URL
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              maxOutputTokens: 500,
              temperature: 0.1,
              topP: 0.9,
              // If using gemini-1.5-flash and want explicit JSON mode (highly recommended for this task):
              // responseMimeType: "application/json",
            },
          }),
        });

        const geminiData = await geminiResponse.json();

        // Check if the API call itself was successful
        if (!geminiResponse.ok) {
          console.error("Gemini API error response:", geminiData);
          throw new Error(`Gemini API returned an error: ${geminiData.error?.message || JSON.stringify(geminiData)}`);
        }

       
        const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    
        
        try {
          const extractedData = JSON.parse(aiResponse)
          return NextResponse.json({
            success: true,
            extractedData,
            source: "openai",
          })
        } catch (parseError) {
          // If JSON parsing fails, return the text response
          return NextResponse.json({
            success: false,
            message: aiResponse,
            source: "openai",
          })
        }
      } catch (openaiError) {
        console.error("OpenAI API error:", openaiError)
        // Fall back to local logic
        
      }
    }

  
  } catch (error) {
    console.error("Product chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
