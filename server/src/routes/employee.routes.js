import express from "express";

import { authenticate, authorize } from "../middleware/auth.js";
import { createId, db, findById, removeById, upsert } from "../data/store.js";

export const employeeRouter = express.Router();

employeeRouter.get("/", authenticate, authorize("admin", "staff"), (_req, res) => {
  res.json({ employees: db.employees });
});

employeeRouter.post("/", authenticate, authorize("admin"), (req, res) => {
  const employee = { _id: createId("emp"), status: "active", ...req.body };
  db.employees.push(employee);
  res.status(201).json({ employee });
});

employeeRouter.put("/:id", authenticate, authorize("admin"), (req, res) => {
  const employee = findById("employees", req.params.id);
  if (!employee) return res.status(404).json({ message: "Employee not found." });
  res.json({ employee: upsert("employees", { ...employee, ...req.body }) });
});

employeeRouter.delete("/:id", authenticate, authorize("admin"), (req, res) => {
  if (!removeById("employees", req.params.id)) {
    return res.status(404).json({ message: "Employee not found." });
  }
  res.status(204).send();
});
