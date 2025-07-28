import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Order {
  id: string
  userName: string
  email: string
  products: any[]
  status: string
  total: number
  date: string
}

interface RecentSalesProps {
  orders: Order[]
}

export function RecentSales({ orders }: RecentSalesProps) {
 
  
  return (
    <div className="space-y-8">
    {orders.slice(0, 5).map((order) => {
  const userName = order.customerName || "Unknown"
  const products = order.items || []
  const total = order.total || 0

  return (
    <div key={order.id} className="flex items-center hover:bg-muted/50 p-2 rounded-lg transition-colors">
      <Avatar className="h-9 w-9">
        <AvatarFallback>
          {userName
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{userName}</p>
        <p className="text-sm text-muted-foreground">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="ml-auto font-medium">+${total.toFixed(2)}</div>
    </div>
  )
})}

    </div>
  )
}
