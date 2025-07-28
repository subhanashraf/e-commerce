
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentSales } from "@/components/recent-sales"
import { CartSummary } from "@/components/cart-summary"
import { getProducts, getOrders,  } from "@/lib/data-store"
import { Package, BarChart3, ShoppingCart, DollarSign, Users } from "lucide-react"
import { format } from "date-fns";


export default async function DashboardPage() {
 // AWAIT all asynchronous data fetching functions
  // And ensure they return arrays or expected objects, providing fallbacks
  const products=  getProducts();
  const orders =  getOrders();
  const analytics = {
    totalRevenue: orders.reduce((acc, order) => acc + (order.total || 0), 0),
    totalCustomers: new Set(orders.map((o) => o.customerEmail)).size,
  }

  const totalProducts = products.length
  const totalOrders = orders.length
  const totalRevenue = analytics.totalRevenue
  const totalCustomers = analytics.totalCustomers

  const inventoryValue = products.reduce((sum: number, product: any) => {
    const price = typeof product.price === "number" ? product.price : 0
    const stock = typeof product.stock === "number" ? product.stock : 0
    return sum + price * stock
  }, 0)

  const stats = {
    totalProducts,
    inventoryValue,
    totalOrders,
    totalRevenue,
    totalCustomers,
    orders,
  }
 
  function salesDatafunction() {
  const monthlyTotals: { [key: string]: number } = {};

  for (const order of orders) {
    const month = format(new Date(order.createdAt), "MMM"); // e.g., "Jan", "Feb"
    if (!monthlyTotals[month]) {
      monthlyTotals[month] = 0;
    }
    monthlyTotals[month] += order.total || 0;
  }

  // Convert to the format your chart expects
  const salesData = Object.keys(monthlyTotals).map((month) => ({
    name: month,
    total: monthlyTotals[month],
  }));

  return salesData;
}
const salesData = salesDatafunction()

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Real-time analytics from your store</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
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
            <div className="text-2xl font-bold">${stats.inventoryValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total inventory worth</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Completed orders</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Revenue from Stripe</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Unique customers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Charts */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <p className="text-sm text-muted-foreground">Monthly sales from actual orders</p>
          </CardHeader>
          <CardContent className="p-2 sm:p-6">
            <Overview chartdata={salesData} />
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <p className="text-sm text-muted-foreground">Latest orders from Stripe</p>
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
