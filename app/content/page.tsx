import { Navbar } from "@/components/navbar"
import { ContactForm } from "@/components/contact-form"
import { Card, CardContent } from "@/components/ui/card"

export default function ContentPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-8">Content & Resources</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Content Section */}
            <div className="space-y-8">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Shopping Guide</h2>
                  <p className="text-muted-foreground mb-4">
                    Discover how to make the most of your shopping experience with our comprehensive guide. Learn about
                    our product categories, quality standards, and how to find exactly what you're looking for.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Understanding product ratings and reviews</li>
                    <li>How to use filters and search effectively</li>
                    <li>Size guides and fitting recommendations</li>
                    <li>Care instructions for different materials</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Sustainability Commitment</h2>
                  <p className="text-muted-foreground mb-4">
                    Learn about our environmental initiatives and how we're working to reduce our carbon footprint while
                    delivering exceptional products.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Eco-friendly packaging materials</li>
                    <li>Carbon-neutral shipping options</li>
                    <li>Sustainable product sourcing</li>
                    <li>Recycling and return programs</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Customer Support</h2>
                  <p className="text-muted-foreground mb-4">
                    Our dedicated support team is here to help you with any questions or concerns. We're committed to
                    providing exceptional service at every step of your journey.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>24/7 customer support chat</li>
                    <li>Easy returns and exchanges</li>
                    <li>Order tracking and updates</li>
                    <li>Product warranty information</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form Section */}
            <div>
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                  <p className="text-muted-foreground mb-6">
                    Have questions or feedback? We'd love to hear from you. Send us a message and we'll get back to you
                    as soon as possible.
                  </p>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
