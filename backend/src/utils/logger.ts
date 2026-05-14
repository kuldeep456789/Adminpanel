import pool from "../db/index.ts";

export const logActivity = async (data: {
  projectId: string;
  type: "ticket" | "chat" | "call" | "project" | "system";
  title: string;
  description?: string;
  actor?: string;
  metadata?: any;
}) => {
  try {
    await pool.query(
      "INSERT INTO activity_logs (project_id, type, title, description, actor, metadata) VALUES ($1, $2, $3, $4, $5, $6)",
      [data.projectId, data.type, data.title, data.description, data.actor, JSON.stringify(data.metadata || {})]
    );
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};
