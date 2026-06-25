import express from "express";

import { authenticate } from "../middleware/auth.js";
import { createId, db, findById } from "../data/store.js";

export const paymentRouter = express.Router();

paymentRouter.get("/history", authenticate, (req, res) => {
  const ownOrderIds = db.orders
    .filter((order) => req.user.role !== "customer" || order.userId === req.user._id)
    .map((order) => order._id);
  const payments = db.payments.filter((payment) => ownOrderIds.includes(payment.orderId));
  res.json({ payments });
});

paymentRouter.post("/:orderId/pay", authenticate, (req, res) => {
  const order = findById("orders", req.params.orderId);
  if (!order) return res.status(404).json({ message: "Order not found." });
  if (req.user.role === "customer" && order.userId !== req.user._id) {
    return res.status(403).json({ message: "Cannot pay for another customer's order." });
  }

  order.paymentStatus = "paid";
  const payment = {
    _id: createId("payment"),
    orderId: order._id,
    amount: order.totalAmount,
    method: req.body.method || "upi",
    status: "paid",
    paidAt: new Date().toISOString()
  };
  db.payments.push(payment);
  res.status(201).json({ payment, order });
});
