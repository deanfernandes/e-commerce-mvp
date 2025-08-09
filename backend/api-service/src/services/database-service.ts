import { Client } from "pg";
import dotenv from "dotenv";
import User from "../models/user";
import logger from "./logger-service";

async function createUser(user: User): Promise<User> {
  return (
    await client.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [user.name, user.email, user.password]
    )
  ).rows[0];
}

async function getUsers(): Promise<User[]> {
  return (await client.query("SELECT * FROM users")).rows;
}

async function getUserById(id: number): Promise<User> {
  return (await client.query("SELECT * FROM users WHERE id = $1", [id]))
    .rows[0];
}

async function updateUser(user: User): Promise<void> {
  await client.query(
    "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4",
    [user.name, user.email, user.password, user.id]
  );
}

async function deleteUser(id: number): Promise<void> {
  await client.query("DELETE FROM users WHERE id = $1", [id]);
}

dotenv.config();

const client = new Client({
  connectionString: process.env.CONNECTION_STRING,
});
(async () => {
  await client.connect();

  logger.info(`connected database`);
})();

export { createUser, getUsers, getUserById, updateUser, deleteUser };
