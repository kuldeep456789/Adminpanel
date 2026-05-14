import express from "express";
import { getTicketsByProject, createTicket, updateTicket, addComment, getComments } from "../controllers/ticket.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/project/:id", protect, getTicketsByProject);
router.post("/project/:id", protect, createTicket);
router.put("/:id", protect, updateTicket);
router.get("/:id/comments", protect, getComments);
router.post("/:id/comments", protect, addComment);

export default router;
