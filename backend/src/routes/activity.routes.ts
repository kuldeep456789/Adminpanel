import express from "express";
import { getActivityByProject, getGlobalActivity } from "../controllers/activity.controller.ts";
import { protect } from "../middleware/auth.middleware.ts";

const router = express.Router();

router.get("/", protect, getGlobalActivity);
router.get("/project/:id", protect, getActivityByProject);

export default router;
