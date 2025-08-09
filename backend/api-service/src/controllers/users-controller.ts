import type { RequestHandler } from "express";
import type User from "../models/user";

const users: User[] = [];

export const createUser: RequestHandler = async (req, res) => {
  const user = req.body as User;
  user.id = users.length + 1;
  users.push(user);
  res.status(201).json(user);
};

export const getUsers: RequestHandler = async (req, res) => {
  res.json(users);
};

export const getUserById: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};

export const updateUser: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const updatedUser = { ...users[index], ...req.body };
  users[index] = updatedUser;
  res.json(updatedUser);
};

export const deleteUser: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  users.splice(index, 1);
  res.status(204).send();
};
