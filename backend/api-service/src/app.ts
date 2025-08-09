import express from "express";
import userRoutes from "./routes/users-routes";
import authRoutes from "./routes/auth-routes";
import morgan from "morgan";
import authMiddleware from "./middleware/auth-middleware";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/auth", authRoutes);

export default app;
