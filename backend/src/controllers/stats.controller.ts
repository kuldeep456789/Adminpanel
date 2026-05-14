import { Request, Response } from "express";
import pool from "../db/index.ts";

export const getGlobalStats = async (req: Request, res: Response) => {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*)::int FROM projects) as total_projects,
        (SELECT COUNT(*)::int FROM projects WHERE status = 'active') as active_projects,
        (SELECT COUNT(*)::int FROM tickets) as total_tickets,
        (SELECT COUNT(*)::int FROM chat_sessions) as total_chats,
        (SELECT COUNT(*)::int FROM call_requests) as total_calls,
        (SELECT COUNT(*)::int FROM tickets WHERE status = 'Open') as open_tickets
    `);

    // Monthly activity mock or query
    const monthlyActivity = await pool.query(`
      SELECT TO_CHAR(created_at, 'Mon') as month, COUNT(*)::int as count 
      FROM activity_logs 
      WHERE created_at > NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)
    `);

    // Recent global activity
    const recentActivity = await pool.query(`
      SELECT id as _id, project_id as projectId, type, title, description, actor, metadata, created_at as createdAt 
      FROM activity_logs 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    // Project-wise activity for charts
    const projectActivity = await pool.query(`
      SELECT p.name, 
             (SELECT COUNT(*)::int FROM tickets t WHERE t.project_id = p.id) as tickets,
             (SELECT COUNT(*)::int FROM chat_sessions c WHERE c.project_id = p.id) as chats
      FROM projects p
      WHERE p.status = 'active'
      LIMIT 5
    `);

    // Ticket status breakdown
    const statusBreakdown = await pool.query(`
      SELECT status as name, COUNT(*)::int as value
      FROM tickets
      GROUP BY status
    `);

    res.json({
      summary: stats.rows[0],
      monthlyTrend: monthlyActivity.rows,
      recentActivity: recentActivity.rows,
      projectActivity: projectActivity.rows,
      statusBreakdown: statusBreakdown.rows
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
