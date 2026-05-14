import pool from "./src/db/index.ts";
import dotenv from "dotenv";
dotenv.config();

async function diagnose() {
  try {
    console.log("Testing FULL stats query...");
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*)::int FROM projects) as total_projects,
        (SELECT COUNT(*)::int FROM projects WHERE status = 'active') as active_projects,
        (SELECT COUNT(*)::int FROM tickets) as total_tickets,
        (SELECT COUNT(*)::int FROM chat_sessions) as total_chats,
        (SELECT COUNT(*)::int FROM call_requests) as total_calls,
        (SELECT COUNT(*)::int FROM tickets WHERE status = 'Open') as open_tickets
    `);
    console.log("Stats:", stats.rows[0]);

    console.log("Testing monthlyTrend query...");
    const monthlyActivity = await pool.query(`
      SELECT TO_CHAR(created_at, 'Mon') as month, COUNT(*)::int as count 
      FROM activity_logs 
      WHERE created_at > NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)
    `);
    console.log("Monthly Trend:", monthlyActivity.rows);

    process.exit(0);
  } catch (err) {
    console.error("DIAGNOSTIC FAILED:", err);
    process.exit(1);
  }
}

diagnose();
