import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { HeroCarousel } from "@/components/hero-carousel"
import { CompanySection } from "@/components/company-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { getProducts } from "@/lib/data-store"

export default async function HomePage() {
   const rawProducts = await getProducts();
  const allProducts = Array.isArray(rawProducts) ? rawProducts : [];

  // Now, featuredProducts is safely sliced from a guaranteed array
  const featuredProducts = allProducts.slice(0, 6);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Featured Products Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Featured Products
            </h2>
            <p className="text-xl text-muted-foreground">Discover our handpicked selection of premium products</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-card hover:bg-card/80 transition-colors">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">Free shipping on all orders over $50</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card hover:bg-card/80 transition-colors">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-muted-foreground">Your payment information is safe and secure</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card hover:bg-card/80 transition-colors">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">↩️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-muted-foreground">30-day return policy for your peace of mind</p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Section */}
      <CompanySection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
