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
      {orders.slice(0, 5).map((order) => (
        <div key={order.id} className="flex items-center hover:bg-muted/50 p-2 rounded-lg transition-colors">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {order.userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{order.userName}</p>
            <p className="text-sm text-muted-foreground">
              {order.products.length} product{order.products.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="ml-auto font-medium">+${order.total.toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}
