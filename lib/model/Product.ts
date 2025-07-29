import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    shortDescription: String,
    longDescription: String,
    price: Number,
    discount: Number,
    stock: Number,
    image: String,
    metaTags: [String],
    category: String,
    brand: String,
    stripeProductId: String,
    stripePriceId: String,
  },
  { timestamps: true }
)

export default mongoose.models.Product || mongoose.model("Product", ProductSchema)
