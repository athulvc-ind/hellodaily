import express from "express";

import { authenticate, authorize } from "../middleware/auth.js";
import { createId, db, findById, removeById, upsert } from "../data/store.js";

export const restaurantRouter = express.Router();

restaurantRouter.get("/", (_req, res) => {
  res.json({ restaurants: db.restaurants });
});

restaurantRouter.post("/", authenticate, authorize("admin"), (req, res) => {
  const restaurant = {
    _id: createId("rest"),
    status: "active",
    ownerId: req.user._id,
    ...req.body
  };
  db.restaurants.push(restaurant);
  res.status(201).json({ restaurant });
});

restaurantRouter.put("/:id", authenticate, authorize("admin"), (req, res) => {
  const restaurant = findById("restaurants", req.params.id);
  if (!restaurant) return res.status(404).json({ message: "Restaurant not found." });
  res.json({ restaurant: upsert("restaurants", { ...restaurant, ...req.body }) });
});

restaurantRouter.delete("/:id", authenticate, authorize("admin"), (req, res) => {
  if (!removeById("restaurants", req.params.id)) {
    return res.status(404).json({ message: "Restaurant not found." });
  }
  res.status(204).send();
});
