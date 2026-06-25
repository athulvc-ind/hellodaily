import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
    bookingDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    guests: { type: Number, default: 2 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "confirmed"
    }
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
