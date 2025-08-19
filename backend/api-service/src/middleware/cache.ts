import { NextFunction, Request, Response } from "express";
import client from "../services/redis-service";
import logger from "../services/logger-service";

export default function cache(key: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(`Cache middleware started for key: ${key}`);
      logger.info(`Redis client ready state: ${client.isReady}`);

      logger.info(`Attempting to get key: ${key}`);
      const value = await client.get(key);
      logger.info(`Got value from Redis: ${value ? "found" : "not found"}`);

      if (value) {
        logger.info(`Fetched ${key} from cache`);
        res.json(JSON.parse(value));
      } else {
        logger.info(`Cache miss for ${key}, proceeding to next middleware`);
        next();
      }
    } catch (err) {
      logger.error(`Failed to fetch ${key} from cache: ${err}`);
      next();
    }
  };
}
