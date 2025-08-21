const RATE_LIMIT_WINDOW_MINUTES = 15;

import express from "express";
import userRoutes from "./routes/users-routes";
import authRoutes from "./routes/auth-routes";
import productsRoutes from "./routes/products-routes";
import ordersRoutes from "./routes/orders-routes";
import morgan from "morgan";
import authenticateJwt from "./middleware/authenticateJwt";
import cors, { type CorsOptions } from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");

dotenv.config();

const app = express();

var whitelist = [process.env.REVERSE_PROXY_ORIGIN];
var corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      callback(null, true); // Allow Postman, email confirm link
    } else if (origin && whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
};
app.use(cors(corsOptions));

app.use(express.json());

const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} else {
  app.use(morgan("combined"));
}

app.use("/api/users", authenticateJwt, userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", authenticateJwt, productsRoutes);
app.use("/api/orders", authenticateJwt, ordersRoutes);

export default app;
