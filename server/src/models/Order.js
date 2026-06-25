import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
    items: { type: [orderItemSchema], default: [] },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    },
    orderStatus: {
      type: String,
      enum: ["placed", "accepted", "preparing", "ready", "served", "completed", "cancelled"],
      default: "placed"
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const Order = mongoose.model("Order", orderSchema);
