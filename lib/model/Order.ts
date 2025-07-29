import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema(
  {
    stripeSessionId: String,
    stripePaymentIntentId: String,
    customerEmail: String,
    customerName: String,
    customerPhone: String,
    shippingAddress: Object,
    billingAddress: Object,
    items: [
      {
        productId: String,
        productName: String,
        quantity: Number,
        price: Number,
        total: Number,
      },
    ],
    total: Number,
    currency: String,
    status: { type: String, enum: ["pending", "completed", "cancelled"] },
    paymentStatus: String,
    metadata: Object,
  },
  { timestamps: true }
)

export default mongoose.models.Order || mongoose.model("Order", OrderSchema)
