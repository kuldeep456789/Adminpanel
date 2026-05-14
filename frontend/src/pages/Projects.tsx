import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  ExternalLink, 
  Edit2, 
  Trash2,
  MessageSquare,
  PhoneCall,
  Ticket as TicketIcon,
  Filter,
  Lock,
  Sparkles
} from "lucide-react";
import { AppShell } from "../components/layout/AppShell.tsx";
import { Card, Input, Label, Badge, Textarea } from "../components/ui/UIComponents.tsx";
import { Button } from "../components/ui/Button.tsx";
import { Drawer } from "../components/ui/Drawer.tsx";
import { useStore } from "../store/useStore.ts";
import { DEMO_PROJECTS } from "../store/demoData.ts";
import { toast } from "react-hot-toast";

interface Project {
  _id: string;
  name: string;
  clientName: string;
  description: string;
  status: 'active' | 'inactive';
  modules: {
    chat: boolean;
    call: boolean;
    ticket: boolean;
  };
  createdAt: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    clientName: "",
    description: "",
    status: "active",
    modules: {
      chat: true,
      call: true,
      ticket: true
    }
  });

  const { token, logout, isDemoMode, setShowAuthModal } = useStore();

  useEffect(() => {
    if (isDemoMode) {
      setProjects(DEMO_PROJECTS);
      setLoading(false);
      return;
    }
    fetchProjects();
  }, [isDemoMode, token]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.status === 401) { logout(); return; }
      if (res.ok) setProjects(data);
    } catch (err) {
      toast.error("Failed to load projects");
      setProjects(DEMO_PROJECTS);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemoMode) {
      toast("Sign in to create and manage real projects!", { icon: "🔒" });
      setShowAuthModal(true);
      setIsDrawerOpen(false);
      return;
    }
    const url = editingProject ? `/api/projects/${editingProject._id}` : "/api/projects";
    const method = editingProject ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast.success(editingProject ? "Project updated" : "Project created");
        setIsDrawerOpen(false);
        fetchProjects();
        resetForm();
      }
    } catch (err) {
      toast.error("Process failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Project deleted");
        fetchProjects();
      }
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      clientName: "",
      description: "",
      status: "active",
      modules: { chat: true, call: true, ticket: true }
    });
    setEditingProject(null);
  };

  const handleToggleStatus = async (projectId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`/api/projects/${projectId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success(`Project ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`);
        fetchProjects();
      }
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Operations Portfolio</h1>
          <p className="text-muted text-sm">Orchestrate terminal environments and support modules</p>
        </div>
        <div className="flex items-center gap-3">
          {isDemoMode && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-[10px] font-bold text-accent uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Demo Data
            </span>
          )}
          <Button
            onClick={() => {
              if (isDemoMode) {
                toast("Sign in to create real projects!", { icon: "🔒" });
                setShowAuthModal(true);
                return;
              }
              resetForm();
              setIsDrawerOpen(true);
            }}
            className="gap-2"
          >
            {isDemoMode ? <Lock className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isDemoMode ? "Sign In to Create" : "New Project"}
          </Button>
        </div>
      </div>

      <Card className="mb-8 bg-surface/30 backdrop-blur-sm border-dashed border-border/50">
        <div className="p-5 flex gap-5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input 
              placeholder="Search by operation or client..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 border-none bg-surface/50 rounded-2xl" 
            />
          </div>
          <Button variant="secondary" className="gap-2.5 h-12 px-6 rounded-2xl">
            <Filter className="w-4 h-4" /> Filter Ops
          </Button>
        </div>
      </Card>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border/50 text-left">
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-muted">Operation</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-muted">Client Entity</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-muted">Modules</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-muted">Status</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-muted text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3].map((i) => (
                <tr key={i} className="border-b border-border animate-pulse">
                  <td colSpan={5} className="px-4 py-6"><div className="h-4 bg-surface rounded w-full" /></td>
                </tr>
              ))
            ) : filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted text-sm">No projects found. Create your first one.</td>
              </tr>
            ) : (
              filteredProjects.map((p) => (
                <tr key={p._id} className="border-b border-border/50 hover:bg-surface/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm tracking-tight">{p.name}</span>
                      <span className="text-[10px] text-muted font-medium">{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-xs text-muted">{p.clientName}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {p.modules.ticket && <TicketIcon className="w-3.5 h-3.5 text-accent" />}
                      {p.modules.chat && <MessageSquare className="w-3.5 h-3.5 text-blue-custom" />}
                      {p.modules.call && <PhoneCall className="w-3.5 h-3.5 text-green-custom" />}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs font-semibold uppercase tracking-wider">
                    <button 
                      onClick={() => handleToggleStatus(p._id, p.status)}
                      className="cursor-pointer hover:opacity-80 transition-opacity outline-none"
                    >
                      <Badge variant={p.status === 'active' ? "active" : "inactive"}>{p.status}</Badge>
                    </button>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/projects/${p._id}`}>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="h-8 text-[10px] font-black uppercase tracking-widest gap-1.5"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-surface/80"
                        onClick={() => {
                          setEditingProject(p);
                          setFormData({
                            name: p.name,
                            clientName: p.clientName,
                            description: p.description,
                            status: p.status,
                            modules: p.modules
                          });
                          setIsDrawerOpen(true);
                        }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-custom/40 hover:text-red-custom hover:bg-red-custom/10"
                        onClick={() => handleDelete(p._id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        title={editingProject ? "Edit Project" : "New Project"}
        description={editingProject ? "Detailed configuration for existing terminal" : "Initialize a new project environment"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Project Name</Label>
            <Input 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Nexus Core Deployment" 
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Client Name</Label>
            <Input 
              value={formData.clientName} 
              onChange={e => setFormData({ ...formData, clientName: e.target.value })}
              placeholder="e.g. Acme Corporation" 
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Operational objectives..." 
            />
          </div>

          <div className="space-y-2">
            <Label>System Status</Label>
            <select 
              value={formData.status} 
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              className="w-full h-11 bg-surface border border-border rounded-lg px-4 text-sm font-medium focus:ring-2 focus:ring-accent outline-none appearance-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <Label>Support Modules</Label>
            <div className="space-y-3">
              {[
                { id: 'ticket', label: 'Ticketing System', icon: TicketIcon },
                { id: 'chat', label: 'Real-time Chat', icon: MessageSquare },
                { id: 'call', label: 'Call Management', icon: PhoneCall },
              ].map(m => (
                <label key={m.id} className="flex items-center justify-between p-3 bg-surface rounded-lg cursor-pointer hover:border-accent/40 border border-transparent transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-background flex items-center justify-center">
                      <m.icon className="w-4 h-4 text-muted" />
                    </div>
                    <span className="text-sm font-medium">{m.label}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={(formData.modules as any)[m.id]} 
                    onChange={e => setFormData({
                      ...formData,
                      modules: { ...formData.modules, [m.id]: e.target.checked }
                    })}
                    className="w-5 h-5 accent-accent cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="pt-8 flex gap-3">
            <Button variant="secondary" type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Save Configuration</Button>
          </div>
        </form>
      </Drawer>
    </AppShell>
  );
}
