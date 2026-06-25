import express from "express";

import { authenticate, authorize } from "../middleware/auth.js";
import { db } from "../data/store.js";

export const reportRouter = express.Router();

const periods = {
  daily: 1,
  weekly: 7,
  monthly: 30,
  yearly: 365
};

function buildReport(days) {
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const orders = db.orders.filter((order) => new Date(order.createdAt).getTime() >= since);
  const paidOrders = orders.filter((order) => order.paymentStatus === "paid");
  const revenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const itemMap = new Map();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const current = itemMap.get(item.name) || 0;
      itemMap.set(item.name, current + item.quantity);
    });
  });

  const topSellingItems = [...itemMap.entries()]
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return {
    orderCount: orders.length,
    paidOrderCount: paidOrders.length,
    revenue,
    averageOrderValue: paidOrders.length ? Math.round(revenue / paidOrders.length) : 0,
    topSellingItems,
    tableUtilization: {
      occupied: db.tables.filter((table) => table.status === "occupied").length,
      booked: db.tables.filter((table) => table.status === "booked").length,
      available: db.tables.filter((table) => table.status === "available").length
    }
  };
}

Object.entries(periods).forEach(([period, days]) => {
  reportRouter.get(`/${period}`, authenticate, authorize("admin", "staff"), (_req, res) => {
    res.json({ period, ...buildReport(days) });
  });
});
