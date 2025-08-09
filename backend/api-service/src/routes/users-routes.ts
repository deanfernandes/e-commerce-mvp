import express from "express";
import * as usersController from "../controllers/users-controller";

const router = express.Router();
router.post("/", usersController.createUser);
router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUserById);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

export default router;
