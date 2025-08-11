import express from "express";
import { confirm, login, register } from "../controllers/auth-controller";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/confirm", confirm);

export default router;
