import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: String,
    availability: { type: Boolean, default: true },
    preparationTime: { type: Number, default: 15 }
  },
  { timestamps: true }
);

export const MenuItem = mongoose.model("MenuItem", menuItemSchema);
