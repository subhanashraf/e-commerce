"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, X } from "lucide-react"
import { updateProduct } from "@/lib/actions"
import Image from "next/image"

interface Product {
  id: string
  name: string
  shortDescription: string
  longDescription: string
  price: number
  discount: number
  stock: number
  image: string
  metaTags: string[]
  category: string
  brand: string
  stripeProductId?: string
  stripePriceId?: string
}

interface EditProductDialogProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  onProductUpdated: (product: Product) => void
}

export function EditProductDialog({ product, isOpen, onClose, onProductUpdated }: EditProductDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product.name,
    shortDescription: product.shortDescription,
    longDescription: product.longDescription,
    price: product.price.toString(),
    discount: product.discount.toString(),
    stock: product.stock.toString(),
    image: product.image,
    metaTags: product.metaTags.join(", "),
    category: product.category,
    brand: product.brand,
  })
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updatedData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        discount: Number.parseInt(formData.discount) || 0,
        stock: Number.parseInt(formData.stock),
        metaTags: formData.metaTags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }

      const result = await updateProduct(product.id, updatedData)

      if (result.success) {
        const updatedProduct = { ...product, ...updatedData }
        onProductUpdated(updatedProduct)
        toast({
          title: "Product updated successfully!",
          description: "The product has been updated in your store.",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error updating product",
        description: error.message || "There was an error updating the product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-card to-card/95">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Edit Product
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Image Preview */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border">
              <Image src={formData.image || "/placeholder.svg"} alt={formData.name} fill className="object-cover" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                className="transition-all focus:scale-105"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                required
                className="transition-all focus:scale-105"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="longDescription">Long Description</Label>
              <Textarea
                id="longDescription"
                value={formData.longDescription}
                onChange={(e) => handleInputChange("longDescription", e.target.value)}
                rows={4}
                required
                className="transition-all focus:scale-105"
              />
            </div>

            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                required
                className="transition-all focus:scale-105"
              />
            </div>

            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) => handleInputChange("discount", e.target.value)}
                className="transition-all focus:scale-105"
              />
            </div>

            <div>
              <Label htmlFor="stock">Stock Available</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                required
                className="transition-all focus:scale-105"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                required
                className="transition-all focus:scale-105"
              />
            </div>

            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                required
                className="transition-all focus:scale-105"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                required
                className="transition-all focus:scale-105"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="metaTags">Meta Tags (comma separated)</Label>
              <Input
                id="metaTags"
                value={formData.metaTags}
                onChange={(e) => handleInputChange("metaTags", e.target.value)}
                placeholder="electronics, premium, wireless"
                className="transition-all focus:scale-105"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 hover:scale-105 transition-transform bg-gradient-to-r from-primary to-purple-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Product
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="hover:scale-105 transition-transform bg-transparent"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
