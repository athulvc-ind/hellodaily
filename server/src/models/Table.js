import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    tableNumber: { type: String, required: true },
    qrCode: { type: String, required: true },
    capacity: { type: Number, default: 2 },
    zone: String,
    status: {
      type: String,
      enum: ["available", "reserved", "booked", "occupied", "maintenance"],
      default: "available"
    }
  },
  { timestamps: true }
);

export const Table = mongoose.model("Table", tableSchema);
