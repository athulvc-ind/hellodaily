import express from "express";

import { authenticate, authorize } from "../middleware/auth.js";
import { db, publicUser } from "../data/store.js";

export const userRouter = express.Router();

userRouter.get("/", authenticate, authorize("admin"), (_req, res) => {
  res.json({ users: db.users.map(publicUser) });
});

userRouter.get("/history", authenticate, (req, res) => {
  const orders = db.orders.filter((order) => order.userId === req.user._id);
  const bookings = db.bookings.filter((booking) => booking.userId === req.user._id);
  res.json({ orders, bookings });
});
