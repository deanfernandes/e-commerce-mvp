import { Client } from "pg";
import dotenv from "dotenv";
import User from "../models/user";
import logger from "./logger-service";
import type Product from "../models/product";

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

async function getUserByEmail(email: string): Promise<User | undefined> {
  return (await client.query("SELECT * FROM users WHERE email = $1", [email]))
    .rows[0];
}

async function createProduct(product: Product): Promise<Product> {
  return (
    await client.query(
      "INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING *",
      [product.title, product.description, product.price]
    )
  ).rows[0];
}

async function getProducts(): Promise<Product[]> {
  return (await client.query("SELECT * FROM products")).rows;
}

async function getProductById(id: number): Promise<Product> {
  return (await client.query("SELECT * FROM products WHERE id = $1", [id]))
    .rows[0];
}

async function updateProduct(product: Product): Promise<void> {
  await client.query(
    "UPDATE products SET title = $1, description = $2, price = $3 WHERE id = $4",
    [product.title, product.description, product.price, product.id]
  );
}

async function deleteProduct(id: number): Promise<void> {
  await client.query("DELETE FROM products WHERE id = $1", [id]);
}

const seedProducts = async () => {
  try {
    const result = await client.query("SELECT COUNT(*) FROM products");
    const count = parseInt(result.rows[0].count, 10);

    if (count > 0) {
      return;
    }

    const products: Partial<Product>[] = [
      { title: "T-shirt", description: "Cotton shirt", price: 19.99 },
      { title: "Sneakers", description: "Running shoes", price: 89.95 },
      {
        title: "Backpack",
        description: "Durable travel backpack",
        price: 49.5,
      },
      { title: "Hat", description: "Baseball cap", price: 14.0 },
    ];

    for (const product of products) {
      await client.query(
        "INSERT INTO products (title, description, price) VALUES ($1, $2, $3)",
        [product.title, product.description, product.price]
      );
    }

    logger.info("Products table seeded");
  } catch (err) {
    logger.error("Failed to seed products table", err);
  }
};

dotenv.config();

const client = new Client({
  connectionString: process.env.CONNECTION_STRING,
});
(async () => {
  await client.connect();

  //TODO: rm
  seedProducts();

  logger.info(`Connected database`);
})();

export {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
