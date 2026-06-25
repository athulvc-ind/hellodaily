import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["staff", "kitchen", "manager"], required: true },
    phone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    status: { type: String, enum: ["active", "inactive", "on-shift"], default: "active" }
  },
  { timestamps: true }
);

export const Employee = mongoose.model("Employee", employeeSchema);
