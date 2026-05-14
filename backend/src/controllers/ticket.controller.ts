import { Request, Response } from "express";
import pool from "../db/index.ts";
import { logActivity } from "../utils/logger.ts";

export const getTicketsByProject = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      "SELECT id as _id, project_id as projectId, title, description, status, priority, assigned_to as assignedTo, created_at as createdAt FROM tickets WHERE project_id = $1 ORDER BY created_at DESC", 
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createTicket = async (req: any, res: Response) => {
  const { title, description, status, priority, assignedTo } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO tickets (project_id, title, description, status, priority, assigned_to) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id as _id, *",
      [req.params.id, title, description, status || 'Open', priority || 'Medium', assignedTo]
    );
    const ticket = rows[0];

    await logActivity({
      projectId: req.params.id,
      type: "ticket",
      title: "Ticket Raised",
      description: `New ticket: ${ticket.title}`,
      actor: req.user.name || "Admin"
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTicket = async (req: any, res: Response) => {
  const { title, description, status, priority, assignedTo } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE tickets SET title = $1, description = $2, status = $3, priority = $4, assigned_to = $5 WHERE id = $6 RETURNING id as _id, *",
      [title, description, status, priority, assignedTo, req.params.id]
    );
    const ticket = rows[0];
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    await logActivity({
      projectId: ticket.project_id.toString(),
      type: "ticket",
      title: "Ticket Updated",
      description: `Ticket #${ticket._id.toString().slice(-6)} updated to status: ${ticket.status}`,
      actor: req.user.name || "Admin"
    });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addComment = async (req: any, res: Response) => {
  const { content } = req.body;
  try {
    const { rows: ticketRows } = await pool.query("SELECT * FROM tickets WHERE id = $1", [req.params.id]);
    const ticket = ticketRows[0];
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    await pool.query(
      "INSERT INTO ticket_comments (ticket_id, author, content) VALUES ($1, $2, $3)",
      [req.params.id, req.user.name || "Admin", content]
    );

    await logActivity({
      projectId: ticket.project_id.toString(),
      type: "ticket",
      title: "Comment Added",
      description: `New comment on ticket #${ticket.id.toString().slice(-6)}`,
      actor: req.user.name || "Admin"
    });

    res.json({ message: "Comment added" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, author, content, created_at as createdAt FROM ticket_comments WHERE ticket_id = $1 ORDER BY created_at ASC",
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
