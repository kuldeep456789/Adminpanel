import bcrypt from "bcryptjs";
import pool from "./src/db/index.ts";
import dotenv from "dotenv";

dotenv.config();

async function seed() {
  let client;
  try {
    console.log("Seeding PostgreSQL database...");
    client = await pool.connect();

    // Create base tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'active',
        modules_chat BOOLEAN DEFAULT TRUE,
        modules_call BOOLEAN DEFAULT TRUE,
        modules_ticket BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'Open',
        priority VARCHAR(50) DEFAULT 'Medium',
        assigned_to TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ticket_comments (
        id SERIAL PRIMARY KEY,
        ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
        author VARCHAR(255),
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS chat_sessions (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        user_name VARCHAR(255) NOT NULL,
        user_email VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Active',
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS call_requests (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        requester_name VARCHAR(255) NOT NULL,
        requester_email VARCHAR(255),
        scheduled_at TIMESTAMP,
        status VARCHAR(50) DEFAULT 'Pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        actor VARCHAR(255),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Clear existing data
    await client.query("TRUNCATE users, projects, tickets, ticket_comments, chat_sessions, call_requests, activity_logs CASCADE");

    // Create Admin User
    const passwordHash = await bcrypt.hash("Password123!", 10);
    const { rows: userRows } = await client.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id",
      ["Admin User", "admin@example.com", passwordHash, "admin"]
    );
    const adminId = userRows[0].id;
    console.log("Admin user created: admin@example.com / Password123!");

    // Create Projects
    const projects = [
      {
        name: "Titan Core Infrastructure",
        client_name: "Titan Global",
        description: "Critical support environment for cloud infrastructure migration and deployment.",
        modules_chat: true,
        modules_call: true,
        modules_ticket: true
      },
      {
        name: "Stellar App Support",
        client_name: "Stellar.io",
        description: "Customer support portal focusing on ticketing and scheduled calls.",
        modules_chat: false,
        modules_call: true,
        modules_ticket: true
      },
      {
        name: "Acme Corp SaaS",
        client_name: "Acme Corp",
        description: "Enterprise level support for Acme SaaS platform",
        modules_chat: true,
        modules_call: false,
        modules_ticket: true
      }
    ];

    for (const p of projects) {
      const { rows: projRows } = await client.query(
        "INSERT INTO projects (name, client_name, description, modules_chat, modules_call, modules_ticket) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        [p.name, p.client_name, p.description, p.modules_chat, p.modules_call, p.modules_ticket]
      );
      const projectId = projRows[0].id;

      // Add dummy activity
      await client.query(
        "INSERT INTO activity_logs (project_id, type, title, description, actor) VALUES ($1, $2, $3, $4, $5)",
        [projectId, "project", "Project Seeded", "Sample data populated for " + p.name, "System"]
      );

      // Add a dummy ticket
      const { rows: ticketRows } = await client.query(
        "INSERT INTO tickets (project_id, title, description, status, priority) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [projectId, "Welcome Ticket", "This is a sample ticket for " + p.name, "Open", "Low"]
      );
      const ticketId = ticketRows[0].id;

      // Add a comment
      await client.query(
        "INSERT INTO ticket_comments (ticket_id, author, content) VALUES ($1, $2, $3)",
        [ticketId, "System Administrator", "This is an automated welcoming comment."]
      );
    }

    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    if (client) client.release();
  }
}

seed();
