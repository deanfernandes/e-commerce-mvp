import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../services/password-service";
import { createUser, getUserByEmail } from "../services/database-service";
import logger from "../services/logger-service";
import type User from "../models/user";
import type { Request, Response } from "express";
import type { StringValue } from "ms";

export const register = async (req: Request, res: Response) => {
  try {
    const user = req.body as User;

    if (!user.name || !user.email || !user.password) {
      return res.status(400).json({ error: "Invalid user input" });
    }

    if (
      typeof user.name !== "string" ||
      typeof user.email !== "string" ||
      typeof user.password !== "string"
    ) {
      return res.status(400).json({ error: "Invalid user input types" });
    }

    user.password = await hashPassword(user.password);

    const createdUser = await createUser(user);

    return res.status(201).json(createdUser);
  } catch (err) {
    logger.error("Failed register user", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await verifyPassword(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY!, {
      expiresIn: process.env.JWT_EXPIRES! as StringValue,
    });

    res.json({ token });
  } catch (err: any) {
    logger.error("Failed to login", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
