"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface Address {
  city: string
  country: string
  line1: string
  line2?: string
  postal_code: string
  state?: string
}

interface OrderItem {
  productName: string
  quantity: number
  price: number
  total: number
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  billingAddress: Address
  shippingAddress: Address
  items: OrderItem[]
  status: string
  paymentStatus: string
  stripePaymentIntentId: string
  stripeSessionId: string
  total: number
  currency: string
  createdAt: string
  updatedAt: string
  metadata: {
    customerEmail: string
    customerName: string
    customerPhone: string
  }
}

export function OrderManagement({ orders: initialOrders }: { orders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders || [])
  const { toast } = useToast()

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
    toast({
      title: "Order status updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-500"
      case "completed": return "bg-green-500"
      case "shipped": return "bg-blue-500"
      case "cancelled": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const formatAddress = (address: Address) => {
    return `${address.line1}${address.line2 ? `, ${address.line2}` : ''}, ${address.city}, ${address.postal_code}, ${address.country}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

   

  if (!orders || orders.length === 0) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            All Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No orders found.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          All Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
           <div className="min-w-[500px] max-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Order ID</TableHead>
                  <TableHead className="min-w-[150px]">Customer</TableHead>
                  <TableHead className="min-w-[180px]">Email</TableHead>
                  <TableHead className="min-w-[120px]">Phone</TableHead>
                  <TableHead className="min-w-[200px]">Shipping Address</TableHead>
                  <TableHead className="min-w-[200px]">Billing Address</TableHead>
                  <TableHead className="min-w-[150px]">Items</TableHead>
                  <TableHead className="min-w-[100px]">Total</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[100px]">Change Status</TableHead>
                  <TableHead className="min-w-[100px]">Payment</TableHead>
                  <TableHead className="min-w-[150px]">Stripe ID</TableHead>
                  <TableHead className="min-w-[150px]">Session ID</TableHead>
                  <TableHead className="min-w-[150px]">Created</TableHead>
                  <TableHead className="min-w-[150px]">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium truncate">{order.id}</TableCell>
                    <TableCell className="truncate">{order.customerName}</TableCell>
                    <TableCell className="truncate">{order.customerEmail}</TableCell>
                    <TableCell className="truncate">{order.customerPhone}</TableCell>
                    <TableCell className="truncate" title={formatAddress(order.shippingAddress)}>
                      {formatAddress(order.shippingAddress)}
                    </TableCell>
                    <TableCell className="truncate" title={formatAddress(order.billingAddress)}>
                      {formatAddress(order.billingAddress)}
                    </TableCell>
                    <TableCell>
                      {order.items.map(item => (
                        <div key={`${order.id}-${item.productName}`}>
                          {item.productName} × {item.quantity}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      {order.total.toFixed(2)} {order.currency.toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                    <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                    
                    <TableCell>
                      <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="truncate" title={order.stripePaymentIntentId}>
                      {order.stripePaymentIntentId}
                    </TableCell>
                    <TableCell className="truncate" title={order.stripeSessionId}>
                      {order.stripeSessionId}
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>{formatDate(order.updatedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}