import { Router } from "express";
import * as authController from "../controller/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken); // 👉 API cấp lại token

// Protected route
router.get("/me", authenticateToken, authController.getMe);

export default router;