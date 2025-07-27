"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/components/cart-provider"
import { Minus, Plus, Trash2, ShoppingBag, CreditCard } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { createStripeCheckoutitem } from "@/lib/actions"

interface ProduectNUmber {
  productId:string,
  quantity:number
}
export function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const { toast } = useToast()

  const handleCheckout = async () => {
    setIsCheckingOut(true)

    if (items.length === 0) {
    toast({
      title: "Cart is Empty",
      description: "Please add items to your cart before checking out.",
      variant: "destructive",
    })
     const checkoutItems  = items.map(item => ({
    productId: item.id,       // Assuming your cart item has an 'id' property
    quantity: item.quantity,  // Assuming your cart item has a 'quantity' property
  }))

      try {
        const result = await createStripeCheckoutitem(checkoutItems)
  
        if (result.success && result.url) {
          window.location.href = result.url
           clearCart()
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
         setIsCheckingOut(false)
      }    
  }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-br from-card to-card/95 rounded-lg p-12 max-w-md mx-auto">
          <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link href="/shop">
            <Button
              size="lg"
              className="hover:scale-105 transition-transform bg-gradient-to-r from-primary to-purple-600"
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-card/95">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-muted-foreground">${item.price.toFixed(2)} each</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="hover:scale-110 transition-transform"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="hover:scale-110 transition-transform"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 hover:scale-110 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="bg-gradient-to-br from-card to-card/95">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-500">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(totalPrice * 1.08).toFixed(2)}</span>
              </div>

              <Button
                className="w-full hover:scale-105 transition-transform bg-gradient-to-r from-primary to-purple-600"
                size="lg"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Checkout
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full bg-transparent hover:scale-105 transition-transform"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
