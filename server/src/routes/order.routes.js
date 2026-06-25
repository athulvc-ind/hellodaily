import express from "express";

import { authenticate, authorize } from "../middleware/auth.js";
import { createId, db, findById, upsert } from "../data/store.js";

export const orderRouter = express.Router();

orderRouter.get("/", authenticate, (req, res) => {
  const orders =
    req.user.role === "customer"
      ? db.orders.filter((order) => order.userId === req.user._id)
      : db.orders;
  res.json({ orders });
});

orderRouter.get("/:id", authenticate, (req, res) => {
  const order = findById("orders", req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found." });
  if (req.user.role === "customer" && order.userId !== req.user._id) {
    return res.status(403).json({ message: "Cannot view another customer's order." });
  }
  res.json({ order });
});

orderRouter.post("/", authenticate, (req, res) => {
  const { tableId, items } = req.body;
  if (!tableId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "tableId and at least one item are required." });
  }

  const normalizedItems = items.map((item) => {
    const menuItem = findById("menuItems", item.menuItemId);
    if (!menuItem) {
      const error = new Error(`Menu item not found: ${item.menuItemId}`);
      error.status = 400;
      throw error;
    }
    return {
      menuItemId: menuItem._id,
      name: menuItem.name,
      quantity: Number(item.quantity || 1),
      price: menuItem.price
    };
  });

  const totalAmount = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = {
    _id: createId("order"),
    userId: req.user._id,
    tableId,
    items: normalizedItems,
    totalAmount,
    paymentStatus: "pending",
    orderStatus: "placed",
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(order);
  const table = findById("tables", tableId);
  if (table) table.status = "occupied";
  res.status(201).json({ order });
});

orderRouter.put("/:id/status", authenticate, authorize("staff", "kitchen", "admin"), (req, res) => {
  const { orderStatus } = req.body;
  const allowed = ["placed", "accepted", "preparing", "ready", "served", "completed", "cancelled"];
  const order = findById("orders", req.params.id);

  if (!order) return res.status(404).json({ message: "Order not found." });
  if (!allowed.includes(orderStatus)) {
    return res.status(400).json({ message: `orderStatus must be one of: ${allowed.join(", ")}` });
  }

  res.json({ order: upsert("orders", { ...order, orderStatus }) });
});

orderRouter.put("/:id", authenticate, (req, res) => {
  const order = findById("orders", req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found." });
  if (order.userId !== req.user._id && !["staff", "admin"].includes(req.user.role)) {
    return res.status(403).json({ message: "Cannot modify this order." });
  }
  if (!["placed", "accepted"].includes(order.orderStatus)) {
    return res.status(409).json({ message: "Order can no longer be modified." });
  }
  res.json({ order: upsert("orders", { ...order, ...req.body }) });
});
