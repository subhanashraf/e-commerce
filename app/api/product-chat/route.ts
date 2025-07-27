import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"



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
    const { question } = await req.json()

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    const products = await getProducts()

    // If OpenAI is available, use it for product extraction
    if ( process.env.OPENAI_API_KEY) {
      try {
           const systemPrompt = `You are an AI assistant helping a user create a product listing for an e-commerce store.
The user will provide a basic product name or idea. Your role is to **guide** them by suggesting appropriate details for various fields.

For each field, provide a clear suggestion. Always suggest an image URL and verfiy this url is working .

Here are the fields you should provide suggestions for:
- **Product Name:** (Refine if necessary, or confirm the one provided)
- **Suggested Price:** (A reasonable numerical value)
- **Short Description:** (A concise summary)
- **Long Description:** (A detailed explanation of features and benefits)
- **Category:** (e.g., Electronics, Clothing, Footwear, Accessories)
- **Brand:** (A plausible brand name)
- **Meta Tags:** (Comma-separated keywords)
- **Image URL:** (A relevant URL from unsplash.com. and verfiy this url is working an correct , because mostly url not work again confirm )

Example interaction:
User Input: "Help me with a T-shirt"
Your Response:
Product Name: Classic Cotton T-Shirt
Suggested Price: 29.99
Short Description: Comfortable and durable cotton t-shirt for everyday wear.
Long Description: Made from 100% premium cotton, this classic t-shirt offers exceptional comfort and breathability. Its timeless design makes it perfect for layering or wearing on its own. Available in multiple colors.
Category: Clothing
Brand: ComfortWear
Meta Tags: t-shirt, cotton, classic, casual, apparel
Image URL: https://images.unsplash.com/photo-1576566526180-21a42a220-4100?w=800&h=600&fit=crop

Now, please provide suggestions for the following:
User Input: "${question}"`;

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

        // Extract the text content from Gemini's response structure
        // Gemini's text is usually in candidate[0].content.parts[0].text
        console.log(geminiData?.candidates?.[0]?.content,"geminiData.candidates.co");
        console.log(geminiData?.candidates?.[0]?.content?.parts,"geminiData.candidates.content.parts");
        console.log(geminiData?.candidates?.[0]?.content?.parts[0].text,"geminiData.candidates.content.parts.text");
        
        const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log(aiResponse,"aiResponse");
        
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
