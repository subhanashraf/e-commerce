"use client"

import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/components/cart-provider"
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, User, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { createStripeCheckout } from "@/lib/actions"

export function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const { toast } = useToast()

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some items to your cart before checkout.",
        variant: "destructive",
      })
      return
    }
    setShowCustomerForm(true)
  }

  const handleCustomerInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerInfo.name || !customerInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email address.",
        variant: "destructive",
      })
      return
    }

    setIsCheckingOut(true)

    try {
      console.log("🛒 Starting checkout process...")

      // Create Stripe checkout session
      const result = await createStripeCheckout(items, customerInfo)

      if (result.success && result.url) {
        console.log("✅ Redirecting to Stripe checkout...")
        // Redirect to Stripe checkout
        window.location.href = result.url
      } else {
        throw new Error(result.error || "Failed to create checkout session")
      }
    } catch (error) {
      console.error("❌ Checkout error:", error)
      toast({
        title: "Checkout Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
      setIsCheckingOut(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
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

        {/* Order Summary & Customer Info */}
        <div className="space-y-6">
          {/* Customer Information Form */}
          {showCustomerForm && (
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
                      Back to Cart
                    </Button>
                    <Button
                      type="submit"
                      disabled={isCheckingOut}
                      className="flex-1 bg-gradient-to-r from-primary to-purple-600"
                    >
                      {isCheckingOut ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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

          {/* Order Summary */}
          <Card className="bg-gradient-to-br from-card to-card/95">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-500">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(totalPrice * 1.08).toFixed(2)}</span>
              </div>

              {!showCustomerForm ? (
                <>
                  <Button
                    className="w-full hover:scale-105 transition-transform bg-gradient-to-r from-primary to-purple-600"
                    size="lg"
                    onClick={handleProceedToCheckout}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Checkout
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent hover:scale-105 transition-transform"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </>
              ) : (
                <div className="text-sm text-muted-foreground text-center p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium mb-2">Secure Checkout with Stripe</p>
                  <p>• Shipping address will be collected during payment</p>
                  <p>• All major credit cards accepted</p>
                  <p>• Your payment information is secure</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
