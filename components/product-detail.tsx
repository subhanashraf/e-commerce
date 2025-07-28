"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ShoppingCart, CreditCard, Loader2, User, Mail, Phone } from "lucide-react"
import { useState } from "react"
import { createStripeCheckoutone } from "@/lib/actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Product {
  id: string
  name: string
  shortDescription: string
  longDescription: string
  price: number
  discount?: number
  stock: number
  image: string
  metaTags: string[]
  category: string
  brand: string
  stripeProductId: string
}

export function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: ""
  })

  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    addToCart({
      id: product.id,
      name: product.name,
      price: discountedPrice,
      image: product.image,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
    setIsAddingToCart(false)
  }

  const handleBuyNowClick = () => {
    setShowCustomerForm(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCustomerInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsBuyingNow(true)

    if (!customerInfo.name || !customerInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email address.",
        variant: "destructive",
      })
      setIsBuyingNow(false)
      return
    }

    try {
      const result = await createStripeCheckoutone(
        [{
          id: product.id,
          name: product.name,
          price: discountedPrice,
          image: product.image,
          quantity: 1
        }],
        customerInfo
      )

      if (result.success && result.url) {
        window.location.href = result.url
      } else {
        throw new Error(result.error || "Failed to create checkout session")
      }
    } catch (error) {
      toast({
        title: "Checkout Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsBuyingNow(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/shop">
        <Button variant="ghost" className="mb-6 hover:scale-105 transition-transform">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted group">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
            {product.discount && (
              <Badge className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 animate-pulse">
                -{product.discount}%
              </Badge>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {!showCustomerForm ? (
            <>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  <Badge variant="outline">{product.brand}</Badge>
                </div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">{product.shortDescription}</p>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-primary">${discountedPrice.toFixed(2)}</span>
                {product.discount && (
                  <span className="text-xl text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={product.stock > 0 ? "default" : "destructive"} className="animate-pulse">
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </Badge>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isAddingToCart}
                  className="w-full hover:scale-105 transition-transform"
                  size="lg"
                >
                  {isAddingToCart ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding to Cart...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleBuyNowClick}
                  disabled={product.stock === 0}
                  variant="secondary"
                  className="w-full hover:scale-105 transition-transform"
                  size="lg"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Buy Now
                </Button>
              </div>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Product Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.longDescription}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.metaTags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-gradient-to-br from-card to-card/95">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCustomerInfoSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number (Optional)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCustomerForm(false)}
                      className="flex-1"
                    >
                      Back to Product
                    </Button>
                    <Button
                      type="submit"
                      disabled={isBuyingNow}
                      className="flex-1 bg-gradient-to-r from-primary to-purple-600"
                    >
                      {isBuyingNow ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Continue to Payment
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}