import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET_KEY!, (err, payload) => {
    if (err) return res.sendStatus(403);
    (req as any).user = (payload as any).user;
    next();
  });
};

export default authenticateJwt;
