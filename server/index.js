import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

import { connectDatabase } from "./src/config/database.js";
import { authRouter } from "./src/routes/auth.routes.js";
import { employeeRouter } from "./src/routes/employee.routes.js";
import { menuRouter } from "./src/routes/menu.routes.js";
import { orderRouter } from "./src/routes/order.routes.js";
import { paymentRouter } from "./src/routes/payment.routes.js";
import { reportRouter } from "./src/routes/report.routes.js";
import { restaurantRouter } from "./src/routes/restaurant.routes.js";
import { tableRouter } from "./src/routes/table.routes.js";
import { userRouter } from "./src/routes/user.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5050;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:4173",
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Project ZED X API",
    storage: process.env.MONGODB_URI ? "mongodb-ready" : "in-memory-demo"
  });
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/tables", tableRouter);
app.use("/api/menu", menuRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/reports", reportRouter);
app.use("/api/employees", employeeRouter);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
});

app.use((error, _req, res, _next) => {
  const status = error.status || 500;
  res.status(status).json({
    message: error.message || "Unexpected server error",
    details: process.env.NODE_ENV === "production" ? undefined : error.stack
  });
});

connectDatabase().finally(() => {
  app.listen(port, () => {
    console.log(`Project ZED X API listening on http://localhost:${port}`);
  });
});
