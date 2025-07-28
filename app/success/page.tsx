import { Navbar } from "@/components/navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";
import Link from "next/link";
import Stripe from "stripe";
import { getOrders, addUser, addOrder } from "@/lib/data-store";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-04-10",
  });

  let session = null;

  if (searchParams.session_id) {
    session = await stripe.checkout.sessions.retrieve(searchParams.session_id, {
      expand: ["line_items", "customer"],
    });

    const existingOrder = getOrders().find(
      (order) => order.stripeSessionId === session.id
    );

    if (!existingOrder) {
      const user = {
        id: session.customer_details?.email || `guest_${Date.now()}`, // fallback ID
        name: session.customer_details?.name || "Guest",
        email: session.customer_details?.email || "",
        phone: session.customer_details?.phone || "",
        shippingAddress: {
          line1: session.customer_details?.address?.line1 || "",
          line2: session.customer_details?.address?.line2 || "",
          city: session.customer_details?.address?.city || "",
          state: session.customer_details?.address?.state || "",
          postal_code: session.customer_details?.address?.postal_code || "",
          country: session.customer_details?.address?.country || "",
        },
        billingAddress: {
          line1: session.customer_details?.address?.line1 || "",
          line2: session.customer_details?.address?.line2 || "",
          city: session.customer_details?.address?.city || "",
          state: session.customer_details?.address?.state || "",
          postal_code: session.customer_details?.address?.postal_code || "",
          country: session.customer_details?.address?.country || "",
        },
        totalOrders: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const order = {
        id: `order_${Date.now()}`,
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
        customerEmail: session.customer_details?.email || "",
        customerName: session.customer_details?.name || "",
        customerPhone: session.customer_details?.phone || "",
        shippingAddress: {
          line1: session.customer_details?.address?.line1 || "",
          line2: session.customer_details?.address?.line2 || "",
          city: session.customer_details?.address?.city || "",
          state: session.customer_details?.address?.state || "",
          postal_code: session.customer_details?.address?.postal_code || "",
          country: session.customer_details?.address?.country || "",
        },
        billingAddress: {
          line1: session.customer_details?.address?.line1 || "",
          line2: session.customer_details?.address?.line2 || "",
          city: session.customer_details?.address?.city || "",
          state: session.customer_details?.address?.state || "",
          postal_code: session.customer_details?.address?.postal_code || "",
          country: session.customer_details?.address?.country || "",
        },
        items:
          session.line_items?.data.map((item: any) => ({
            productId: item.price.product.id,
            productName: item.description,
            quantity: item.quantity,
            price: item.price.unit_amount / 100,
            total: (item.amount_total || 0) / 100,
          })) || [],
        total: session.amount_total! / 100,
        currency: session.currency!,
        status: "completed",
        paymentStatus: session.payment_status || "paid",
        metadata: session.metadata || {},
        createdAt: new Date(session.created * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addUser(user);
      addOrder(order);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-3xl text-green-600">
                Payment Successful!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground">
                Thank you for your purchase! Your order has been confirmed and
                will be processed shortly.
              </p>

              {searchParams.session_id && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Session ID:</strong> {searchParams.session_id}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <p className="text-muted-foreground">
                  You will receive an email confirmation shortly with your order
                  details and tracking information.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/shop">
                    <Button className="w-full sm:w-auto hover:scale-105 transition-transform">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Button>
                  </Link>

                  <Link href="/">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto hover:scale-105 transition-transform bg-transparent"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
