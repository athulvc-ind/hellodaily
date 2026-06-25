import express from "express";
import QRCode from "qrcode";

import { authenticate, authorize } from "../middleware/auth.js";
import { createId, db, findById, removeById, upsert } from "../data/store.js";

export const tableRouter = express.Router();

tableRouter.get("/", (_req, res) => {
  res.json({ tables: db.tables, bookings: db.bookings });
});

tableRouter.post("/", authenticate, authorize("admin", "staff"), async (req, res) => {
  const { restaurantId, tableNumber, capacity, zone, status = "available" } = req.body;
  if (!restaurantId || !tableNumber) {
    return res.status(400).json({ message: "restaurantId and tableNumber are required." });
  }

  const _id = createId("table");
  const qrCode = await QRCode.toDataURL(`hellodaily://table/${_id}`);
  const table = { _id, restaurantId, tableNumber, capacity, zone, qrCode, status };
  db.tables.push(table);
  res.status(201).json({ table });
});

tableRouter.post("/book", authenticate, (req, res) => {
  const { tableId, bookingDate, startTime, endTime, guests } = req.body;
  const table = findById("tables", tableId);

  if (!table) return res.status(404).json({ message: "Table not found." });
  if (!["available", "reserved"].includes(table.status)) {
    return res.status(409).json({ message: "Table is not available for booking." });
  }

  const booking = {
    _id: createId("booking"),
    userId: req.user._id,
    tableId,
    bookingDate,
    startTime,
    endTime,
    guests,
    status: "confirmed"
  };
  db.bookings.push(booking);
  table.status = "booked";

  res.status(201).json({ booking, table });
});

tableRouter.put("/:id", authenticate, authorize("admin", "staff"), (req, res) => {
  const table = findById("tables", req.params.id);
  if (!table) return res.status(404).json({ message: "Table not found." });
  res.json({ table: upsert("tables", { ...table, ...req.body }) });
});

tableRouter.delete("/:id", authenticate, authorize("admin"), (req, res) => {
  if (!removeById("tables", req.params.id)) {
    return res.status(404).json({ message: "Table not found." });
  }
  res.status(204).send();
});

tableRouter.delete("/book/:bookingId", authenticate, (req, res) => {
  const booking = findById("bookings", req.params.bookingId);
  if (!booking) return res.status(404).json({ message: "Booking not found." });
  if (booking.userId !== req.user._id && req.user.role !== "admin") {
    return res.status(403).json({ message: "Cannot cancel another user's booking." });
  }

  booking.status = "cancelled";
  const table = findById("tables", booking.tableId);
  if (table) table.status = "available";
  res.json({ booking, table });
});
