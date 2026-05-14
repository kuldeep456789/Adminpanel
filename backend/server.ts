import express from "express";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pool from "./src/db/index.ts";

// Routes
import authRoutes from "./src/routes/auth.routes.ts";
import projectRoutes from "./src/routes/project.routes.ts";
import ticketRoutes from "./src/routes/ticket.routes.ts";
import chatRoutes from "./src/routes/chat.routes.ts";
import callRoutes from "./src/routes/call.routes.ts";
import activityRoutes from "./src/routes/activity.routes.ts";
import statsRoutes from "./src/routes/stats.routes.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new SocketServer(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  const PORT = 3000;

  // Database Connection and Table Initialization
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL (Neon)");
    
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
        is_read BOOLEAN DEFAULT FALSE,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        chat_id INTEGER REFERENCES chat_sessions(id) ON DELETE CASCADE,
        sender VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    client.release();
  } catch (err) {
    console.error("PostgreSQL connection or initialization failed:", err);
  }

  app.use(cors());
  app.use(express.json());

  // Attach io to request
  app.use((req: any, res, next) => {
    req.io = io;
    next();
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/tickets", ticketRoutes);
  app.use("/api/chats", chatRoutes);
  app.use("/api/calls", callRoutes);
  app.use("/api/activity", activityRoutes);
  app.use("/api/stats", statsRoutes);

  // Socket.IO Logic
  io.on("connection", (socket) => {
    socket.on("join-chat", (chatId) => {
      socket.join(`chat-${chatId}`);
    });

    socket.on("send-message", async (data) => {
      try {
        const { chatId, sender, content, isAdmin } = data;
        
        // Skip DB persistence for demo IDs (e.g. c1, t2)
        const isDemoId = typeof chatId === 'string' && (chatId.startsWith('c') || chatId.startsWith('t'));
        
        if (!isDemoId) {
          await pool.query(
            "INSERT INTO chat_messages (chat_id, sender, content, is_admin) VALUES ($1, $2, $3, $4)",
            [chatId, sender, content, isAdmin || false]
          );
        }
        
        io.to(`chat-${chatId}`).emit("receive-message", data);
      } catch (err) {
        console.error("Socket message error:", err);
      }
    });
  });

  // Global Error Handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Global Error:", err);
    res.status(500).json({ 
      message: "Internal Server Error", 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  });

  // Serve production build from frontend if needed
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "..", "frontend", "dist");
    app.use(express.static(distPath));
    app.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`API Server running at http://localhost:${PORT}`);
  });
}

startServer();
