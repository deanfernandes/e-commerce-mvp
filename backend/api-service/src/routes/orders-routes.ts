import express from "express";
import * as ordersController from "../controllers/orders-controller";
import authorizeRole from "../middleware/authorizeRole";

const router = express.Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     tags:
 *       - orders
 *     summary: Create a new order
 *     requestBody:
 *       description: Order data including user ID and product list
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - orderProducts
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               orderProducts:
 *                 type: array
 *                 description: List of ordered products
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       example: 101
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1234
 *       400:
 *         description: Invalid order input
 *       500:
 *         description: Internal server error
 */
router.post("/", authorizeRole("user", "admin"), ordersController.createOrder);

export default router;
