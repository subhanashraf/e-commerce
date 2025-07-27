"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus } from "lucide-react"
import { addProduct } from "@/lib/actions"
import { useCart } from "@/components/cart-provider" // Assuming totalItems here somehow represents total products in DB

// Import Alert components for better message display
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const PRODUCT_LIMIT = 20; // Define your product creation limit here

export function AddProductForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  // Assuming 'totalItems' here *actually* represents the count of products in your store/database
  // If not, you need to get the total product count from another source (e.g., prop, another API call, or global state)
  const { totalItems } = useCart() 
 

  const isLimitReached = totalItems >= PRODUCT_LIMIT;

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)

    // Prevent submission if limit is reached
    if (isLimitReached) {
        toast({
            title: "Product Limit Reached",
            description: `You can only create ${PRODUCT_LIMIT} products. Please delete an existing product to add a new one.`,
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }

    try {
      const result = await addProduct(formData)

      if (result.success) {
        toast({
          title: "Product added successfully!",
          description: `The product has been added to your store${result.productId ? ` with ID: ${result.productId}` : ""}.`,
        })

        // Reset form
        const form = document.getElementById("add-product-form") as HTMLFormElement
        form?.reset()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) { // Type 'any' for error for broader compatibility
      const errorMessage = error.message || "There was an error adding the product. Please try again."

      toast({
        title: "Error adding product",
        description: errorMessage,
        variant: "destructive",
      })

      // Show specific Stripe configuration help
      if (errorMessage.includes("Stripe") || errorMessage.includes("STRIPE_SECRET_KEY")) {
        toast({
          title: "Stripe Configuration Required",
          description:
            "Please add your Stripe API keys to .env.local file. Check the console for detailed instructions.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Display the warning message if the limit is reached */}
        {isLimitReached && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Product Creation Limit Reached!</AlertTitle>
            <AlertDescription>
              You currently have {totalItems} products. You can only create up to {PRODUCT_LIMIT} products. Please delete an existing product before adding a new one.
            </AlertDescription>
          </Alert>
        )}

        <form id="add-product-form" action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" required className="transition-all focus:scale-105" disabled={isLimitReached} />
          </div>

          <div>
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input id="shortDescription" name="shortDescription" required className="transition-all focus:scale-105" disabled={isLimitReached} />
          </div>

          <div>
            <Label htmlFor="longDescription">Long Description</Label>
            <Textarea
              id="longDescription"
              name="longDescription"
              rows={4}
              required
              className="transition-all focus:scale-105"
              disabled={isLimitReached}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                required
                className="transition-all focus:scale-105"
                disabled={isLimitReached}
              />
            </div>
            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                name="discount"
                type="number"
                min="0"
                max="100"
                defaultValue="0"
                className="transition-all focus:scale-105"
                disabled={isLimitReached}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="stock">Stock Available</Label>
            <Input id="stock" name="stock" type="number" min="0" required className="transition-all focus:scale-105" disabled={isLimitReached} />
          </div>

          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" name="image" type="url" required className="transition-all focus:scale-105" disabled={isLimitReached} />
          </div>

          <div>
            <Label htmlFor="metaTags">Meta Tags (comma separated)</Label>
            <Input
              id="metaTags"
              name="metaTags"
              placeholder="electronics, premium, wireless"
              className="transition-all focus:scale-105"
              disabled={isLimitReached}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" required className="transition-all focus:scale-105" disabled={isLimitReached} />
            </div>
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" required className="transition-all focus:scale-105" disabled={isLimitReached} />
            </div>
          </div>

          <Button type="submit" disabled={isLoading || isLimitReached} className="w-full hover:scale-105 transition-transform">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Product...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}