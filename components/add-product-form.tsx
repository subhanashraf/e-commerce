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

export function AddProductForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)

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
    } catch (error) {
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
        <form id="add-product-form" action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" required className="transition-all focus:scale-105" />
          </div>

          <div>
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input id="shortDescription" name="shortDescription" required className="transition-all focus:scale-105" />
          </div>

          <div>
            <Label htmlFor="longDescription">Long Description</Label>
            <Textarea
              id="longDescription"
              name="longDescription"
              rows={4}
              required
              className="transition-all focus:scale-105"
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
              />
            </div>
          </div>

          <div>
            <Label htmlFor="stock">Stock Available</Label>
            <Input id="stock" name="stock" type="number" min="0" required className="transition-all focus:scale-105" />
          </div>

          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" name="image" type="url" required className="transition-all focus:scale-105" />
          </div>

          <div>
            <Label htmlFor="metaTags">Meta Tags (comma separated)</Label>
            <Input
              id="metaTags"
              name="metaTags"
              placeholder="electronics, premium, wireless"
              className="transition-all focus:scale-105"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" required className="transition-all focus:scale-105" />
            </div>
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" required className="transition-all focus:scale-105" />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full hover:scale-105 transition-transform">
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
