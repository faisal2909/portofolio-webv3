import express from "express";
import verifyToken from "#src/middleware/auth.js";
import { createSignedUpload } from "#src/controllers/upload.controller.js";

const router = express.Router();

router.post("/sign", verifyToken, createSignedUpload);

export default router;