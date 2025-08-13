import express from "express";
import * as productsController from "../controllers/products-controller";
import authorizeRole from "../middleware/authorizeRole";

const router = express.Router();

/**
 * @swagger
 * /products:
 *   post:
 *     tags:
 *       - products
 *     summary: Create a new product
 *     requestBody:
 *       description: Product data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *                 example: Wireless Mouse
 *               description:
 *                 type: string
 *                 example: Ergonomic wireless mouse with USB receiver
 *               price:
 *                 type: number
 *                 example: 29.99
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *       400:
 *         description: Invalid product input
 *       500:
 *         description: Internal server error
 */
router.post("/", authorizeRole("admin"), productsController.createProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - products
 *     summary: Get all products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter products by title (case insensitive substring match)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *       500:
 *         description: Internal server error
 */
router.get("/", authorizeRole("user", "admin"), productsController.getProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags:
 *       - products
 *     summary: Get a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the product
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id",
  authorizeRole("user", "admin"),
  productsController.getProductById
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags:
 *       - products
 *     summary: Update a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the product to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Updated product data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Mouse
 *               description:
 *                 type: string
 *                 example: Updated description here
 *               price:
 *                 type: number
 *                 example: 35.99
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid product input
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authorizeRole("admin"), productsController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags:
 *       - products
 *     summary: Delete a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the product to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authorizeRole("admin"), productsController.deleteProduct);

export default router;
