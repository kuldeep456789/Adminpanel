import { Request, Response } from "express";
import pool from "../db/index.ts";
import { logActivity } from "../utils/logger.ts";

export const getChatsByProject = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      "SELECT id as _id, project_id as projectId, user_name as userName, user_email as userEmail, status, is_read as \"isRead\", started_at as startedAt, ended_at as endedAt FROM chat_sessions WHERE project_id = $1 ORDER BY started_at DESC",
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      "UPDATE chat_sessions SET is_read = TRUE WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByChatId = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, sender, content, is_admin as \"isAdmin\", created_at as \"createdAt\" FROM chat_messages WHERE chat_id = $1 ORDER BY created_at ASC",
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const sendMessage = async (req: any, res: Response) => {
  try {
    const { content } = req.body;
    const { id: chatId } = req.params;
    const sender = req.user.name || "Admin";

    const { rows } = await pool.query(
      "INSERT INTO chat_messages (chat_id, sender, content, is_admin) VALUES ($1, $2, $3, $4) RETURNING id, sender, content, is_admin as \"isAdmin\", created_at as \"createdAt\"",
      [chatId, sender, content, true]
    );
    
    if (req.io) {
      req.io.to(`chat-${chatId}`).emit("receive-message", rows[0]);
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const endChat = async (req: any, res: Response) => {
  try {
    const { rows } = await pool.query(
      "UPDATE chat_sessions SET status = 'Ended', ended_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    const chat = rows[0];
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    await logActivity({
      projectId: chat.project_id.toString(),
      type: "chat",
      title: "Chat Support Ended",
      description: `Support session with ${chat.user_name} closed`,
      actor: req.user.name || "Admin"
    });

    // Broadcast status change
    if (req.io) {
      req.io.to(`chat-${chat.id}`).emit("status-update", { 
        chatId: chat.id, 
        status: 'Ended' 
      });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
