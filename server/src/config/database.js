import mongoose from "mongoose";

export async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    console.log("MONGODB_URI not set. Using in-memory demo store.");
    return null;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");
    return mongoose.connection;
  } catch (error) {
    console.warn("MongoDB connection failed. Continuing with demo store.");
    console.warn(error.message);
    return null;
  }
}
