import express from "express";
import { getChatsByProject, getMessagesByChatId, markAsRead, endChat, sendMessage } from "../controllers/chat.controller.ts";
import { protect } from "../middleware/auth.middleware.ts";

const router = express.Router();

router.get("/project/:id", protect, getChatsByProject);
router.get("/:id/messages", protect, getMessagesByChatId);
router.post("/:id/messages", protect, sendMessage);
router.post("/:id/read", protect, markAsRead);
router.post("/:id/end", protect, endChat);

export default router;
