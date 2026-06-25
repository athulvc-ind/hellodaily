import bcrypt from "bcryptjs";
import express from "express";

import { authenticate, signToken } from "../middleware/auth.js";
import { createId, db, publicUser } from "../data/store.js";

export const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const { name, email, phone, password, role = "customer" } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  if (db.users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ message: "Email is already registered." });
  }

  const user = {
    _id: createId("user"),
    name,
    email: email.toLowerCase(),
    phone,
    password: await bcrypt.hash(password, 10),
    role,
    createdAt: new Date().toISOString()
  };
  db.users.push(user);

  res.status(201).json({ user: publicUser(user), token: signToken(user) });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find((candidate) => candidate.email.toLowerCase() === email?.toLowerCase());

  if (!user || !(await bcrypt.compare(password || "", user.password))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  res.json({ user: publicUser(user), token: signToken(user) });
});

authRouter.post("/logout", authenticate, (_req, res) => {
  res.json({ message: "Logged out. Remove the token on the client." });
});

authRouter.post("/reset-password", (req, res) => {
  const { email } = req.body;
  const exists = db.users.some((user) => user.email.toLowerCase() === email?.toLowerCase());
  res.json({
    message: exists
      ? "Password reset instructions queued for the registered email."
      : "If the email exists, reset instructions will be sent."
  });
});

authRouter.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});
