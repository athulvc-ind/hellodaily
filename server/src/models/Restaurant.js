import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    restaurantName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" }
  },
  { timestamps: true }
);

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
