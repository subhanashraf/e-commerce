import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingBag, Home } from "lucide-react"
import Link from "next/link"

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
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
              <CardTitle className="text-3xl text-green-600">Payment Successful!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground">
                Thank you for your purchase! Your order has been confirmed and will be processed shortly.
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
                  You will receive an email confirmation shortly with your order details and tracking information.
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
  )
}
