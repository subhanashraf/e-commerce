"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ShoppingCart, CreditCard, Loader2 } from "lucide-react"
import { useState } from "react"
import { createStripeCheckout } from "@/lib/actions"

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

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)

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

  const handleBuyNow = async () => {
    setIsBuyingNow(true)

    try {
      const result = await createStripeCheckout(product.id, 1)

      if (result.success && result.url) {
        window.location.href = result.url
      } else {
        toast({
          title: "Checkout Error",
          description: result.error || "Failed to create checkout session",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
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
              onClick={handleBuyNow}
              disabled={product.stock === 0 || isBuyingNow}
              variant="secondary"
              className="w-full hover:scale-105 transition-transform"
              size="lg"
            >
              {isBuyingNow ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Buy Now
                </>
              )}
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
        </div>
      </div>
    </div>
  )
}
