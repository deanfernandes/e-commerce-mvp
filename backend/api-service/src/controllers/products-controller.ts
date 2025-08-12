import { Request, Response } from "express";
import Product from "../models/product";
import * as databaseService from "../services/database-service";
import logger from "../services/logger-service";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body as Product;

    if (!product.title || !product.description || !product.price) {
      return res.status(400).json({ error: "Invalid product input" });
    }

    if (
      typeof product.title !== "string" ||
      typeof product.description !== "string" ||
      typeof product.price !== "number"
    ) {
      return res.status(400).json({ error: "Invalid product input types" });
    }

    const createdProduct = await databaseService.createProduct(product);

    return res.status(201).json(createdProduct);
  } catch (err) {
    logger.error("Failed to create product", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

function parseNumberParam(param: unknown): number | undefined {
  const num = Number(param);
  return !isNaN(num) ? num : undefined;
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const minPrice = parseNumberParam(req.query.minPrice);
    const maxPrice = parseNumberParam(req.query.maxPrice);
    const products = await databaseService.getProducts(
      typeof req.query.title === "string" ? req.query.title : undefined,
      minPrice,
      maxPrice
    );
    return res.json(products);
  } catch (err) {
    logger.error("Failed to get products", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);

    const product = await databaseService.getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json(product);
  } catch (err) {
    logger.error("Failed to get product by ID", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);

    const existingProduct = await databaseService.getProductById(productId);

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const newProduct = req.body as Product;

    if (!newProduct.title || !newProduct.description || !newProduct.price) {
      return res.status(400).json({ error: "Invalid product input" });
    }

    if (
      typeof newProduct.title !== "string" ||
      typeof newProduct.description !== "string" ||
      typeof newProduct.price !== "number"
    ) {
      return res.status(400).json({ error: "Invalid product input types" });
    }

    newProduct.id = productId;

    await databaseService.updateProduct(newProduct);

    return res.status(200).send();
  } catch (err) {
    logger.error("Failed to update product", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);

    const existingProduct = await databaseService.getProductById(productId);

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    await databaseService.deleteProduct(productId);
    return res.status(204).send();
  } catch (err) {
    logger.error("Failed to delete product", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
