import { Request, Response } from "express";
import {
  deleteFavorite,
  insertFavorite,
  selectFavoritesByUserId,
} from "../services/database-service";
import logger from "../services/logger-service";
import { REDIS_KEYS } from "../constants/redisKeys";
import client from "../services/redis-service";

export const postFavorites = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body as {
      productId: number;
    };
    const userId = Number(req.params.userId);

    await insertFavorite(userId, productId);

    return res.status(201).send();
  } catch (err) {
    logger.error("Failed to add favorite: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserFavorites = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    const favoriteProducts = await selectFavoritesByUserId(userId);

    let cacheKey: string = REDIS_KEYS.FAVORITES;
    cacheKey += `:params=${JSON.stringify(req.params)}`;
    client.setEx(cacheKey, 300, JSON.stringify(favoriteProducts));
    logger.info(`Cached favorites: ${cacheKey}`);

    return res.json(favoriteProducts);
  } catch (err) {
    logger.error("Failed to get user favorites: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUserFavorite = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.params;

    await deleteFavorite(Number(userId), Number(productId));

    return res.status(204).send();
  } catch (err) {
    logger.error("Failed to delete user favorite: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
