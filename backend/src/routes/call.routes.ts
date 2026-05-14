import express from "express";
import { getCallsByProject, updateCall, createCall } from "../controllers/call.controller.ts";
import { protect } from "../middleware/auth.middleware.ts";

const router = express.Router();

router.post("/", protect, createCall);
router.get("/project/:id", protect, getCallsByProject);
router.put("/:id", protect, updateCall);

export default router;
