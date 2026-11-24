import express from "express";
import verifyToken from "#src/middleware/auth.js";
import loginLimiter from "#src/middleware/rateLimiter.js";
import { login, me } from "#src/controllers/auth.controller.js";

const router = express.Router();

// POST /api/auth/login - publik
router.post("/login", loginLimiter, login);

// GET /api/auth/me - butuh token, dipakai untu cek sesi admin
router.get("/me", verifyToken, me);

export default router;