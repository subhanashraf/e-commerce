"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Package } from "lucide-react"
import { EditProductDialog } from "@/components/edit-product-dialog"
import { useToast } from "@/hooks/use-toast"
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

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Error loading products:", error)
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsEditDialogOpen(true)
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== productId))
        toast({
          title: "Product deleted",
          description: "Product has been successfully deleted",
        })
      } else {
        throw new Error("Failed to delete product")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
    setIsEditDialogOpen(false)
    setSelectedProduct(null)
    toast({
      title: "Product updated",
      description: "Product has been successfully updated",
    })
  }

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-card to-card/95">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </CardContent>
      </Card>
    )
  }

  if (products.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-card to-card/95">
        <CardContent className="p-8 text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">Add your first product using the form above.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card to-card/95 border border-primary/20"
          >
            <CardHeader className="pb-3">
              <div className="relative h-48 w-full rounded-lg overflow-hidden mb-3">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                />
                {product.discount > 0 && (
                  <Badge className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 animate-pulse">
                    -{product.discount}%
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg line-clamp-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                {product.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                  {product.discount > 0 && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                    </span>
                  )}
                </div>
                <Badge variant={product.stock > 0 ? "default" : "destructive"}>{product.stock} in stock</Badge>
              </div>

              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs">
                  {product.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {product.brand}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 hover:scale-105 transition-transform bg-gradient-to-r from-primary to-purple-600"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteProduct(product.id)}
                  className="hover:scale-105 transition-transform"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProduct && (
        <EditProductDialog
          product={selectedProduct}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
            setSelectedProduct(null)
          }}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </>
  )
}
