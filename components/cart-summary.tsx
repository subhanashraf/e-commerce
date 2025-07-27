"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/components/cart-provider"
import { ShoppingCart } from "lucide-react"

export function CartSummary() {
  const { items, totalItems, totalPrice } = useCart()

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Cart Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-sm text-muted-foreground">Items in Cart</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold">${totalPrice.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Total Value</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-sm text-muted-foreground">Unique Products</p>
          </div>
        </div>

        {items.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="font-medium">Recent Items:</h4>
            {items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex justify-between text-sm p-2 bg-muted/30 rounded">
                <span>{item.name}</span>
                <span>
                  {item.quantity}x ${item.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
