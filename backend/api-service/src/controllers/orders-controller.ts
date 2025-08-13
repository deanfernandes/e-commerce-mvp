import type { Request, Response } from "express";
import * as databaseService from "../services/database-service";
import logger from "../services/logger-service";
import { producer } from "../services/kafka-producer-service";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, orderProducts } = req.body;

    if (userId <= 0 || typeof userId !== "number") {
      return res.status(400).json({ error: "Invalid order input" });
    }

    const id = await databaseService.createOrder(userId, orderProducts);

    const { email } = await databaseService.getUserById(userId);
    const dbOrderProducts = await databaseService.getOrderProducts(id);

    await producer.send({
      topic: "order-created",
      messages: [
        {
          value: JSON.stringify({
            email,
            orderId: id,
            orderProducts: dbOrderProducts,
          }),
        },
      ],
    });

    return res.status(201).json(id);
  } catch (err) {
    logger.error("Failed to create order", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
