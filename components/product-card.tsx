"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Loader2 } from "lucide-react"
import { useState } from "react"

interface Product {
  id: string
  name: string
  price: number
  discount?: number
  image: string
  shortDescription: string
  stock: number
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price

  const handleAddToCart = async () => {
    setIsLoading(true)

    // Simulate loading
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

    setIsLoading(false)
  }

  return (
    <Card className="group bg-black text-white border-gray-800 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 hover:scale-105">
      <CardContent className="p-0">
        <Link href={`/product/${product.id}`}>
          <div className="relative overflow-hidden rounded-t-lg">
            {/* <img src={product.image} alt={product.name || "/placeholder.svg"} width={400}
              height={300}
               className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" /> */}
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={400}
              height={300}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {product.discount && (
              <Badge className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 animate-pulse">
                -{product.discount}%
              </Badge>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>

        <div className="p-4">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors group-hover:text-primary">
              {product.name}
            </h3>
          </Link>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.shortDescription}</p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">${discountedPrice.toFixed(2)}</span>
              {product.discount && (
                <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
              )}
            </div>
            <Badge variant={product.stock > 0 ? "default" : "destructive"} className="animate-pulse">
              {product.stock > 0 ? `${product.stock} ${t("product.inStock")}` : t("product.outOfStock")}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isLoading}
          className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              {t("product.addToCart")}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
