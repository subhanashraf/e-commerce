import { OrderManagement } from "@/components/order-management"
import { getOrders } from "@/lib/data-store"

export default async function OrdersPage() {
  const orders = getOrders()

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Order Management
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage and track all customer orders</p>
      </div>

      <OrderManagement orders={orders} />
    </div>
  )
}
