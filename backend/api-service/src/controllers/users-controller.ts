import type { RequestHandler } from "express";
import type User from "../models/user";
import { hashPassword } from "../services/password-service";
import * as databaseService from "../services/database-service";
import logger from "../services/logger-service";

export const createUser: RequestHandler = async (req, res) => {
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

    const createdUser = await databaseService.createUser(user);

    return res.status(201).json(createdUser);
  } catch (err) {
    logger.error("Failed to create user", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUsers: RequestHandler = async (_req, res) => {
  try {
    const users = await databaseService.getUsers();
    return res.json(users);
  } catch (err) {
    logger.error("Failed to get users", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserById: RequestHandler = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const user = await databaseService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    logger.error("Failed to get user by ID", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser: RequestHandler = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const existingUser = await databaseService.getUserById(userId);

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const newUser = req.body as User;

    if (!newUser.name || !newUser.email || !newUser.password) {
      return res.status(400).json({ error: "Invalid user input" });
    }

    if (
      typeof newUser.name !== "string" ||
      typeof newUser.email !== "string" ||
      typeof newUser.password !== "string"
    ) {
      return res.status(400).json({ error: "Invalid user input types" });
    }

    newUser.id = userId;
    newUser.password = await hashPassword(newUser.password);

    await databaseService.updateUser(newUser);

    return res.status(200).send();
  } catch (err) {
    logger.error("Failed to update user", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const existingUser = await databaseService.getUserById(userId);

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await databaseService.deleteUser(userId);
    return res.status(204).send();
  } catch (err) {
    logger.error("Failed to delete user", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
