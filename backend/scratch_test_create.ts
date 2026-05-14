import pool from "./src/db/index.ts";
import dotenv from "dotenv";
dotenv.config();

async function testCreate() {
  try {
    const name = "Test Project";
    const clientName = "Test Client";
    const description = "Test Description";
    const status = "active";
    const modules = { chat: true, call: true, ticket: true };

    const { rows } = await pool.query(
      "INSERT INTO projects (name, client_name, description, status, modules_chat, modules_call, modules_ticket) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, clientName, description, status, modules.chat, modules.call, modules.ticket]
    );
    console.log("Created Project:", rows[0]);

    const project = rows[0];
    await pool.query(
      "INSERT INTO activity_logs (project_id, type, title, description, actor, metadata) VALUES ($1, $2, $3, $4, $5, $6)",
      [project.id, "project", "Project Created", "Test", "Test Actor", JSON.stringify({})]
    );
    console.log("Logged Activity");

    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
}

testCreate();
