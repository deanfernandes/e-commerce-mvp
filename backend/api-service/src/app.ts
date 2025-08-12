import express from "express";
import userRoutes from "./routes/users-routes";
import authRoutes from "./routes/auth-routes";
import productsRoutes from "./routes/products-routes";
import ordersRoutes from "./routes/orders-routes";
import morgan from "morgan";
import authMiddleware from "./middleware/auth-middleware";
import cors, { type CorsOptions } from "cors";

const app = express();

const allowNoOrigin = process.env.NODE_ENV === "development";
var whitelist = [process.env.REVERSE_PROXY_ORIGIN];
var corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin && allowNoOrigin) {
      callback(null, true); // Allow Postman
    } else if (origin && whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
};
app.use(cors(corsOptions));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use(express.json());

app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", authMiddleware, productsRoutes);
app.use("/api/orders", authMiddleware, ordersRoutes);

export default app;
