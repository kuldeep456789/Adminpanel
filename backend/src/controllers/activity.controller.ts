import { Request, Response } from "express";
import pool from "../db/index.ts";

export const getActivityByProject = async (req: Request, res: Response) => {
  try {
    const { type, limit } = req.query;
    let queryText = "SELECT id as _id, project_id as projectId, type, title, description, actor, metadata, created_at as createdAt FROM activity_logs WHERE project_id = $1";
    const queryParams: any[] = [req.params.id];

    if (type && type !== "all") {
      queryText += " AND type = $2";
      queryParams.push(type);
    }

    queryText += " ORDER BY created_at DESC LIMIT $" + (queryParams.length + 1);
    queryParams.push(Number(limit) || 50);

    const { rows } = await pool.query(queryText, queryParams);
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getGlobalActivity = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    const { rows } = await pool.query(
      "SELECT id as _id, project_id as projectId, type, title, description, actor, metadata, created_at as createdAt FROM activity_logs ORDER BY created_at DESC LIMIT $1",
      [Number(limit) || 10]
    );
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
