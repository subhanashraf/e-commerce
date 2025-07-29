import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    email: String,
    name: String,
    phone: String,
    shippingAddress: Object,
    billingAddress: Object,
    totalOrders: Number,
    totalSpent: Number,
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model("User", UserSchema)
