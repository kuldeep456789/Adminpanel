import { Request, Response } from "express";
import pool from "../db/index.ts";
import { logActivity } from "../utils/logger.ts";

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT * FROM projects ORDER BY created_at DESC");
    // Normalize response to match client expectations (modules as object)
    const normalized = rows.map(p => ({
      _id: p.id,
      name: p.name,
      clientName: p.client_name,
      description: p.description,
      status: p.status,
      modules: {
        chat: p.modules_chat,
        call: p.modules_call,
        ticket: p.modules_ticket
      },
      createdAt: p.created_at,
      updatedAt: p.updated_at
    }));
    res.json(normalized);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createProject = async (req: any, res: Response) => {
  const { name, clientName, description, status, modules } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO projects (name, client_name, description, status, modules_chat, modules_call, modules_ticket) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, clientName, description, status || 'active', modules?.chat ?? true, modules?.call ?? true, modules?.ticket ?? true]
    );
    const project = rows[0];
    
    await logActivity({
      projectId: project.id,
      type: "project",
      title: "Project Created",
      description: `New project '${project.name}' created`,
      actor: req.user.name || "Admin"
    });

    res.status(201).json({
      _id: project.id,
      name: project.name,
      clientName: project.client_name,
      description: project.description,
      status: project.status,
      modules: {
        chat: project.modules_chat,
        call: project.modules_call,
        ticket: project.modules_ticket
      },
      createdAt: project.created_at,
      updatedAt: project.updated_at
    });
  } catch (error) {
    console.error("createProject error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProject = async (req: any, res: Response) => {
  const { name, clientName, description, status, modules } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE projects SET name = $1, client_name = $2, description = $3, status = $4, modules_chat = $5, modules_call = $6, modules_ticket = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *",
      [name, clientName, description, status, modules?.chat ?? true, modules?.call ?? true, modules?.ticket ?? true, req.params.id]
    );
    const project = rows[0];
    if (!project) return res.status(404).json({ message: "Project not found" });

    await logActivity({
      projectId: project.id,
      type: "project",
      title: "Project Updated",
      description: `Project '${project.name}' details updated`,
      actor: req.user.name || "Admin"
    });

    res.json({
      _id: project.id,
      name: project.name,
      clientName: project.client_name,
      description: project.description,
      status: project.status,
      modules: {
        chat: project.modules_chat,
        call: project.modules_call,
        ticket: project.modules_ticket
      },
      createdAt: project.created_at,
      updatedAt: project.updated_at
    });
  } catch (error) {
    console.error("updateProject error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM projects WHERE id = $1", [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const toggleModule = async (req: any, res: Response) => {
  const { module, enabled } = req.body;
  const column = `modules_${module}`;
  try {
    const { rows } = await pool.query(
      `UPDATE projects SET ${column} = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [enabled, req.params.id]
    );
    const project = rows[0];
    if (!project) return res.status(404).json({ message: "Project not found" });

    await logActivity({
      projectId: project.id,
      type: "project",
      title: `${module.charAt(0).toUpperCase() + module.slice(1)} Support ${enabled ? 'Enabled' : 'Disabled'}`,
      description: `Module ${module} was ${enabled ? 'turned on' : 'turned off'}`,
      actor: req.user.name || "Admin"
    });

    res.json(project);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const toggleStatus = async (req: any, res: Response) => {
  const { status } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE projects SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );
    const project = rows[0];
    if (!project) return res.status(404).json({ message: "Project not found" });

    await logActivity({
      projectId: project.id,
      type: "project",
      title: "Project Status Changed",
      description: `Status changed to ${status}`,
      actor: req.user.name || "Admin"
    });

    res.json(project);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
