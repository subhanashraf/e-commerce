import { Navbar } from "@/components/navbar"
import { ProductDetail } from "@/components/product-detail"
import { ProductCard } from "@/components/product-card"
import { readFile } from "fs/promises"
import { join } from "path"
import { notFound } from "next/navigation"

async function getProduct(id: string) {
  const filePath = join(process.cwd(), "data", "products.json")
  const fileContent = await readFile(filePath, "utf8")
  const data = JSON.parse(fileContent)
  return data.products.find((p: any) => p.id === id)
}

async function getRelatedProducts(currentProductId: string, category: string) {
  const filePath = join(process.cwd(), "data", "products.json")
  const fileContent = await readFile(filePath, "utf8")
  const data = JSON.parse(fileContent)

  return data.products.filter((p: any) => p.id !== currentProductId && p.category === category).slice(0, 4)
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category)

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
