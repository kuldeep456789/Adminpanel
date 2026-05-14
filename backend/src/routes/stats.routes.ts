import { Router } from "express";
import { getGlobalStats } from "../controllers/stats.controller.ts";
import { protect } from "../middleware/auth.middleware.ts";

const router = Router();

router.get("/", protect, getGlobalStats);

export default router;
