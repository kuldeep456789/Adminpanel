import { Request, Response } from "express";
import pool from "../db/index.ts";
import { logActivity } from "../utils/logger.ts";

export const getCallsByProject = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      "SELECT id as _id, project_id as projectId, requester_name as requesterName, requester_email as requesterEmail, scheduled_at as scheduledAt, status, notes, created_at as createdAt FROM call_requests WHERE project_id = $1 ORDER BY created_at DESC",
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createCall = async (req: any, res: Response) => {
  const { projectId, requesterName, requesterEmail, scheduledAt, notes } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO call_requests (project_id, requester_name, requester_email, scheduled_at, status, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [projectId, requesterName, requesterEmail, scheduledAt, 'Pending', notes]
    );
    const call = rows[0];

    await logActivity({
      projectId: projectId,
      type: "call",
      title: "Call Scheduled",
      description: `New call request for ${requesterName} scheduled at ${scheduledAt}. Notes: ${notes || 'None'}`,
      actor: req.user.name || "Admin"
    });

    res.status(201).json(call);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCall = async (req: any, res: Response) => {
  const { status, scheduledAt, notes } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE call_requests SET status = $1, scheduled_at = $2, notes = $3 WHERE id = $4 RETURNING *",
      [status, scheduledAt, notes, req.params.id]
    );
    const call = rows[0];
    if (!call) return res.status(404).json({ message: "Call request not found" });

    await logActivity({
      projectId: call.project_id.toString(),
      type: "call",
      title: "Call Updated",
      description: `Call with ${call.requester_name} status: ${call.status}. Notes: ${call.notes || 'None'}`,
      actor: req.user.name || "Admin"
    });

    res.json(call);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
