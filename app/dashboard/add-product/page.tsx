import { AddProductForm } from "@/components/add-product-form"
import { ProductChatbot } from "@/components/product-chatbot"
import { ProductList } from "@/components/product-list"

export default function AddProductPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Product Management
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Add new products or edit existing ones in your store
        </p>
      </div>

      {/* Add Product Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <AddProductForm />
        <ProductChatbot />
      </div>

      {/* Product List Section */}
      <div className="mt-8 sm:mt-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Manage Existing Products
        </h2>
        <ProductList />
      </div>
    </div>
  )
}
