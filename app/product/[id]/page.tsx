import { Navbar } from "@/components/navbar"
import { ProductDetail } from "@/components/product-detail"
import { ProductCard } from "@/components/product-card"
import { getProduct, getProducts } from "@/lib/data-store"
import { notFound } from "next/navigation"

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id)

  if (!product) {
    notFound()
  }

  const allProducts = getProducts()
  const relatedProducts = allProducts
    .filter((p: any) => p.id !== product.id && p.category === product.category)
    .slice(0, 4)

  return (
    <div className="min-h-screen">
      <Navbar />
      <ProductDetail product={product} />

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-br from-muted/20 to-muted/10">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct: any) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
