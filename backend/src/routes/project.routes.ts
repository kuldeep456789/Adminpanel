import express from "express";
import { getProjects, createProject, updateProject, deleteProject, toggleModule, toggleStatus } from "../controllers/project.controller.ts";
import { protect, adminOnly } from "../middleware/auth.middleware.ts";

const router = express.Router();

router.get("/", protect, getProjects);
router.post("/", protect, createProject);
router.put("/:id", protect, adminOnly, updateProject);
router.delete("/:id", protect, deleteProject);
router.patch("/:id/modules", protect, adminOnly, toggleModule);
router.patch("/:id/status", protect, adminOnly, toggleStatus);

export default router;
