
import { OrderManagement } from "@/components/order-management";
import { getOrders } from "@/app/actions/order";

export default async function OrdersPage() {
  const rawOrders = await getOrders();
   const orders = JSON.parse( JSON.stringify(rawOrders) ) 
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Order Management
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Manage and track all customer orders
        </p>
      </div>

      <div className="container mx-auto p-4">
        {orders && orders.length > 0 ? (
          <OrderManagement orders={orders} />
        ) : (
          <p className="text-center text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  );
}
