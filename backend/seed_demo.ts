import pool from "./src/db/index.ts";
import dotenv from "dotenv";
dotenv.config();

async function seedDemo() {
  try {
    console.log("Seeding Demo Data...");
    
    // Clear existing demo data (but keep users/projects if needed)
    // Actually, let's just add to it.
    
    // 1. Get a project ID
    const { rows: projects } = await pool.query("SELECT id FROM projects LIMIT 1");
    if (projects.length === 0) {
      console.log("No projects found. Please create a project first.");
      process.exit(0);
    }
    const projectId = projects[0].id;

    // 2. Add some activity logs
    console.log("Adding activities...");
    await pool.query(`
      INSERT INTO activity_logs (project_id, type, title, description, actor, created_at)
      VALUES 
      ($1, 'project', 'Infrastructure Optimized', 'Global CDN propagation completed successfully', 'System', NOW() - INTERVAL '2 hours'),
      ($1, 'ticket', 'High Priority Ticket', 'Database latency detected in US-East region', 'Monitor', NOW() - INTERVAL '5 hours'),
      ($1, 'chat', 'New Chat Session', 'User requesting assistance with billing', 'Support Bot', NOW() - INTERVAL '1 day'),
      ($1, 'project', 'Security Patch Applied', 'Vulnerability CVE-2026-1234 patched', 'Admin', NOW() - INTERVAL '2 days')
    `, [projectId]);

    // 3. Add some tickets
    console.log("Adding tickets...");
    await pool.query(`
      INSERT INTO tickets (project_id, title, description, status, priority, created_at)
      VALUES 
      ($1, 'SSL Certificate Expiry', 'The main domain cert expires in 3 days', 'Open', 'High', NOW() - INTERVAL '1 day'),
      ($1, 'UI Bug in Dashboard', 'The chart is overlapping on mobile devices', 'Closed', 'Low', NOW() - INTERVAL '3 days'),
      ($1, 'Slow API Response', 'Average latency is above 500ms', 'Open', 'Medium', NOW() - INTERVAL '4 hours')
    `, [projectId]);

    console.log("Demo data seeded successfully.");
    process.exit(0);
  } catch (err) {
    console.error("SEEDING FAILED:", err);
    process.exit(1);
  }
}

seedDemo();
