import jwt from "jsonwebtoken";

import { db, publicUser } from "../data/store.js";

const jwtSecret = () => process.env.JWT_SECRET || "dev-only-project-zed-x-secret";

export function signToken(user) {
  return jwt.sign({ sub: user._id, role: user.role }, jwtSecret(), { expiresIn: "7d" });
}

export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication token required." });
  }

  try {
    const payload = jwt.verify(token, jwtSecret());
    const user = db.users.find((candidate) => candidate._id === payload.sub);
    if (!user) return res.status(401).json({ message: "User no longer exists." });
    req.user = publicUser(user);
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired authentication token." });
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: "You do not have access to this resource." });
    }
    return next();
  };
}
