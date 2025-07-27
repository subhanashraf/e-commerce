import { OrderManagement } from "@/components/order-management"
import { readFile } from "fs/promises"
import { join } from "path"

async function getOrders() {
  const filePath = join(process.cwd(), "data", "products.json")
  const fileContent = await readFile(filePath, "utf8")
  const data = JSON.parse(fileContent)
  return data.orders
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Order Management
        </h1>
        <p className="text-muted-foreground">Manage and track all customer orders</p>
      </div>

      <OrderManagement orders={orders} />
    </div>
  )
}
