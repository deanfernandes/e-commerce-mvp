import { Client } from "pg";
import dotenv from "dotenv";
import User from "../models/user";
import logger from "./logger-service";
import type Product from "../models/product";
import Order from "../models/Order";
import OrderProduct from "../models/OrderProduct";
import type { SortBy, Order as OrderType } from "../types/Product";

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
    "UPDATE users SET name = $1, email = $2, password = $3 email_verified = $5 WHERE id = $6",
    [user.name, user.email, user.password, user.email_verified, user.id]
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

async function getProducts(
  title?: string,
  minPrice?: number,
  maxPrice?: number,
  sortBy?: SortBy,
  order?: OrderType
): Promise<Product[]> {
  const conditions: string[] = [];
  const values: any[] = [];

  // Filtering
  if (title) {
    values.push(`%${title}%`);
    conditions.push(`title ILIKE $${values.length}`);
  }

  if (minPrice !== undefined) {
    values.push(minPrice);
    conditions.push(`price >= $${values.length}`);
  }

  if (maxPrice !== undefined) {
    values.push(maxPrice);
    conditions.push(`price <= $${values.length}`);
  }

  let query = "SELECT * FROM products";
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  // Sorting
  if (sortBy) {
    query += ` ORDER BY ${sortBy}`;
  }

  if (order) {
    query += ` ${order.toUpperCase()}`;
  }

  const result = await client.query(query, values);
  return result.rows;
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

async function createOrder(
  userId: number,
  orderProducts: OrderProduct[]
): Promise<number> {
  try {
    await client.query("BEGIN");

    const id: number = (
      await client.query(
        "INSERT INTO orders (user_id) VALUES ($1) RETURNING id",
        [userId]
      )
    ).rows[0].id;

    for (const orderProduct of orderProducts) {
      await client.query(
        "INSERT INTO orders_products (order_id, product_id, quantity) VALUES ($1, $2, $3)",
        [id, orderProduct.productId, orderProduct.quantity]
      );
    }

    await client.query("COMMIT");

    return id;
  } catch (err) {
    await client.query("ROLLBACK");

    throw err;
  }
}

export async function getOrderProducts(orderId: number): Promise<any[]> {
  const result = await client.query(
    `
    SELECT op.quantity, p.id AS product_id, p.title
    FROM orders_products op
    JOIN products p ON op.product_id = p.id
    WHERE op.order_id = $1;
    `,
    [orderId]
  );
  return result.rows;
}

export async function insertFavorite(
  userId: number,
  productId: number
): Promise<void> {
  try {
    await client.query(
      `
    INSERT INTO favorites
    (user_id, product_id)
    VALUES ($1, $2)
    `,
      [userId, productId]
    );

    logger.info(
      `inserted favorite user id: ${userId} product id: ${productId}`
    );
  } catch (err) {
    logger.error(
      `failed to insert favorite user id: ${userId} product id: ${productId}: ${err}`
    );
    throw err;
  }
}

export async function selectFavoritesByUserId(
  userId: number
): Promise<Product[]> {
  try {
    const result = await client.query(
      `
      SELECT p.*
      FROM favorites f
      JOIN products p ON f.product_id = p.id
      WHERE f.user_id = $1
      `,
      [userId]
    );

    logger.info(`Got user ${userId} favorites with product details`);

    return result.rows;
  } catch (err) {
    logger.error(`Failed to get user ${userId} favorites: ${err}`);
    throw err;
  }
}

export async function deleteFavorite(
  userId: number,
  productId: number
): Promise<void> {
  try {
    await client.query(
      "DELETE FROM favorites WHERE user_id = $1 AND product_id = $2",
      [userId, productId]
    );

    logger.info(`deleted user ${userId} favorite ${productId}`);
  } catch (err) {
    logger.error(
      `failed to delete user ${userId} favorite ${productId}: ${err}`
    );
    throw err;
  }
}

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
(async () => {
  try {
    await client.connect();

    logger.info(`Connected database`);
  } catch (err) {
    logger.error(`Failed to connect database: ${err}`);
  }
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
  createOrder,
};
