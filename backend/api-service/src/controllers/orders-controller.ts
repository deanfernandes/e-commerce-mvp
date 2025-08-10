import { Request, Response } from "express";
import * as databaseService from "../services/database-service";
import logger from "../services/logger-service";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, orderProducts } = req.body;

    if (userId <= 0 || typeof userId !== "number") {
      return res.status(400).json({ error: "Invalid order input" });
    }

    const createdOrder = await databaseService.createOrder(
      userId,
      orderProducts
    );

    return res.status(201).json(createdOrder);
  } catch (err) {
    logger.error("Failed to create order", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
