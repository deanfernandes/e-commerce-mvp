import express from "express";
import * as ordersController from "../controllers/orders-controller";

const router = express.Router();
router.post("/", ordersController.createOrder);

export default router;
