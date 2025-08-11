import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../services/password-service";
import {
  createUser,
  getUserByEmail,
  updateUser,
} from "../services/database-service";
import logger from "../services/logger-service";
import type User from "../models/user";
import type { Request, Response } from "express";
import type { StringValue } from "ms";

type JwtPayload = {
  email: string;
};

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

    const payload: JwtPayload = {
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
      expiresIn: process.env.JWT_EXPIRES! as StringValue,
    });

    res.json({ token });
  } catch (err: any) {
    logger.error("Failed to login", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const confirm = async (req: Request, res: Response) => {
  const token: string = req.query.token as string;

  if (!token) {
    return res.status(400).json({ message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as JwtPayload;

    const email = decoded.email;

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    if (user.email_verified) {
      return res.status(400).json({ message: "Email already confirmed" });
    }

    user.email_verified = true;
    await updateUser(user);

    res.json({ message: "Email successfully confirmed" });
  } catch (err) {
    logger.error(`Failed to confirm email: ${err}`);
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(400).json({ message: "Token expired" });
    }

    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: "Invalid token" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};
