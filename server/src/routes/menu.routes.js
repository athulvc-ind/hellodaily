import express from "express";

import { authenticate, authorize } from "../middleware/auth.js";
import { createId, db, findById, removeById, upsert } from "../data/store.js";

export const menuRouter = express.Router();

menuRouter.get("/", (req, res) => {
  const { category, available } = req.query;
  let menuItems = db.menuItems;
  if (category) menuItems = menuItems.filter((item) => item.category === category);
  if (available === "true") menuItems = menuItems.filter((item) => item.availability);
  res.json({ menuItems });
});

menuRouter.post("/", authenticate, authorize("admin"), (req, res) => {
  const { restaurantId, name, category, price } = req.body;
  if (!restaurantId || !name || !category || price === undefined) {
    return res.status(400).json({ message: "restaurantId, name, category, and price are required." });
  }

  const menuItem = {
    _id: createId("menu"),
    availability: true,
    ...req.body
  };
  db.menuItems.push(menuItem);
  res.status(201).json({ menuItem });
});

menuRouter.put("/:id", authenticate, authorize("admin"), (req, res) => {
  const menuItem = findById("menuItems", req.params.id);
  if (!menuItem) return res.status(404).json({ message: "Menu item not found." });
  res.json({ menuItem: upsert("menuItems", { ...menuItem, ...req.body }) });
});

menuRouter.delete("/:id", authenticate, authorize("admin"), (req, res) => {
  if (!removeById("menuItems", req.params.id)) {
    return res.status(404).json({ message: "Menu item not found." });
  }
  res.status(204).send();
});
