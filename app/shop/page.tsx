import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { getProducts } from "@/lib/data-store"

export default async function ShopPage() {
  const rawProducts = await getProducts();
  const products = rawProducts

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Our Products
          </h1>
          <p className="text-xl text-muted-foreground">Explore our complete collection of premium products</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
