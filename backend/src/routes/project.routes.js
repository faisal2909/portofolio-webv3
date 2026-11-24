import express from "express";
import verifyToken from "#src/middleware/auth.js";
import { validateProjectInput } from "#src/middleware/validate.js";
import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} from "#src/controllers/project.controller.js";

const router = express.Router();

// publik - tidak perlu login
router.get("/", getAllProjects);
router.get("/:id", getProjectById);

// protected - wajib token admin valid + inpput tervalidasi
router.post("/", verifyToken, validateProjectInput, createProject);
router.put("/:id", verifyToken, validateProjectInput, updateProject);
router.delete("/:id", verifyToken, deleteProject);

export default router;