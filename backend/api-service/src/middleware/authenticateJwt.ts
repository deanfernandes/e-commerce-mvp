import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import logger from "../services/logger-service";
import client from "../services/redis-service";

dotenv.config();

const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  logger.info("Authenticate user...");
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  logger.info(token);

  jwt.verify(token, process.env.JWT_SECRET_KEY!, async (err, payload) => {
    if (err) {
      logger.error(`Failed to verify token: ${err.message}`);
      return res.sendStatus(403);
    }

    const isBlacklisted = await client.get(`blacklist:${token}`);
    if (isBlacklisted) {
      logger.warn("Token is blacklisted");
      return res.status(403).json({ message: "Token is invalid (logged out)" });
    }

    (req as any).user = (payload as any).user;
    logger.info(`Identified user: ${(req as any).user}`);
    next();
  });
};

export default authenticateJwt;
