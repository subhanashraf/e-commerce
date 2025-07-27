import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/components/cart-provider"
import { Toaster } from "@/components/ui/toaster"
import { LoadingProvider } from "@/components/loading-provider"
import { LanguageProvider } from "@/components/language-provider"
import { AIChatbot } from "@/components/ai-chatbot"
import { TopBanner } from "@/components/top-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DarkStore - Premium E-commerce",
  description: "Premium dark-themed e-commerce experience with the latest products",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <LoadingProvider>
            <LanguageProvider>
              <CartProvider>
                <TopBanner/>
                <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                  {children}
                  <Toaster />
                  <AIChatbot />
                </div>
              </CartProvider>
            </LanguageProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
