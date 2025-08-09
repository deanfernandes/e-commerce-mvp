import express, { Request, Response } from "express";
import userRoutes from "./routes/users-routes";
import authRoutes from "./routes/auth-routes";
import morgan from "morgan";
import authMiddleware from "./middleware/auth-middleware";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.get("/protected", authMiddleware, (req: Request, res: Response) => {
  res.json({
    message: "You accessed a protected route",
    user: (req as any).user,
  });
});

export default app;
