import type { RequestHandler } from "express";
import type User from "../models/user";
import { hashPassword } from "../services/password-service";
import * as databaseService from "../services/database-service";

export const createUser: RequestHandler = async (req, res) => {
  const user = req.body as User;
  user.password = await hashPassword(user.password);
  res.status(201).json(await databaseService.createUser(user));
};

export const getUsers: RequestHandler = async (req, res) => {
  res.json(await databaseService.getUsers());
};

export const getUserById: RequestHandler = async (req, res) => {
  res.json(await databaseService.getUserById(Number(req.params.id)));
};

export const updateUser: RequestHandler = async (req, res) => {
  const user = req.body as User;
  user.id = Number(req.params.id);
  user.password = await hashPassword(user.password);
  await databaseService.updateUser(user);
  res.status(200).send();
};

export const deleteUser: RequestHandler = async (req, res) => {
  await databaseService.deleteUser(Number(req.params.id));
  res.status(204).send();
};
