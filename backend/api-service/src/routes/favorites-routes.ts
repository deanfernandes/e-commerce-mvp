import express, { Router } from "express";
import {
  deleteUserFavorite,
  getUserFavorites,
  postFavorites,
} from "../controllers/favorites-controller";

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /users/{userId}/favorites:
 *   post:
 *     summary: Add a product to user's favorites
 *     tags:
 *       - favorites
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - product_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID of the user adding the favorite
 *               product_id:
 *                 type: integer
 *                 example: 101
 *                 description: ID of the product to add as favorite
 *     responses:
 *       201:
 *         description: Favorite added successfully
 *       500:
 *         description: Internal server error
 */
router.post("/", postFavorites);

/**
 * @swagger
 * /users/{userId}/favorites:
 *   get:
 *     summary: Get all favorite products of a user
 *     description: Returns a list of all products that a specific user has marked as favorites.
 *     tags:
 *       - favorites
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user whose favorites to retrieve
 *     responses:
 *       200:
 *         description: List of favorite products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: integer
 *                     example: 123
 *                   name:
 *                     type: string
 *                     example: "Product Name"
 *                   price:
 *                     type: number
 *                     example: 49.99
 *       500:
 *         description: Internal server error
 */
router.get("/", getUserFavorites);

/**
 * @swagger
 * /users/{userId}/favorites/{productId}:
 *   delete:
 *     summary: Remove a product from a user's favorites
 *     description: Deletes a specific product from the favorites list of a given user.
 *     tags:
 *       - favorites
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to remove from favorites
 *     responses:
 *       204:
 *         description: Favorite successfully deleted (no content)
 *       500:
 *         description: Internal server error
 */
router.delete("/:productId", deleteUserFavorite);

export default router;
