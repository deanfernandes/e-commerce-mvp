import { NextFunction, Request, Response } from "express";
import client from "../services/redis-service";
import logger from "../services/logger-service";

export default function cache(key: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryKey = JSON.stringify(req.query);
      const cacheKey = `${key}:${queryKey}`;

      logger.info(`Cache middleware started for key: ${cacheKey}`);
      logger.info(`Redis client ready state: ${client.isReady}`);

      logger.info(`Attempting to get key: ${cacheKey}`);
      const value = await client.get(cacheKey);
      logger.info(`Got value from Redis: ${value ? "found" : "not found"}`);

      if (value) {
        logger.info(`Fetched ${cacheKey} from cache`);
        res.json(JSON.parse(value));
      } else {
        logger.info(
          `Cache miss for ${cacheKey}, proceeding to next middleware`
        );
        next();
      }
    } catch (err) {
      logger.error(`Failed to fetch ${key} from cache: ${err}`);
      next();
    }
  };
}
