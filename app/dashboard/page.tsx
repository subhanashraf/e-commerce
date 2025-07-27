import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentSales } from "@/components/recent-sales"
import { CartSummary } from "@/components/cart-summary"
import { readFile } from "fs/promises"
import { join } from "path"
import { Package, BarChart3, ShoppingCart, DollarSign } from "lucide-react"

async function getDashboardData() {
  const productsPath = join(process.cwd(), "data", "products.json")
  const ordersPath = join(process.cwd(), "data", "orders.json")
  const usersPath = join(process.cwd(), "data", "users.json")

  const [productsContent, ordersContent, usersContent] = await Promise.all([
    readFile(productsPath, "utf8"),
    readFile(ordersPath, "utf8"),
    readFile(usersPath, "utf8"),
  ])

  const products = JSON.parse(productsContent).products
  const orders = JSON.parse(ordersContent).orders
  const users = JSON.parse(usersContent).users

  const totalProducts = products.length
  const totalValue = products.reduce((sum: number, product: any) => sum + product.price * product.stock, 0)
  const totalSold = orders.reduce(
    (sum: number, order: any) =>
      sum + order.products.reduce((orderSum: number, product: any) => orderSum + product.quantity, 0),
    0,
  )
  const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0)

  return {
    totalProducts,
    totalValue,
    totalSold,
    totalRevenue,
    orders,
    users,
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardData()

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">Welcome to your store management dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active products in store</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total inventory worth</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSold}</div>
            <p className="text-xs text-muted-foreground">Total units sold</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Revenue generated</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Charts */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-6">
            <Overview />
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-6">
            <div className="overflow-x-auto">
              <RecentSales orders={stats.orders} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cart Summary */}
      <CartSummary />
    </div>
  )
}
