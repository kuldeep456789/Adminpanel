import { useState, useEffect, useRef, FormEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Settings, 
  Ticket as TicketIcon, 
  MessageSquare, 
  PhoneCall, 
  Activity, 
  Calendar,
  User,
  Clock,
  ChevronRight,
  MoreVertical,
  Plus,
  Send,
  Lock,
  X,
  Search,
  Download,
  Info,
  GitPullRequest,
  Terminal,
  ShieldCheck,
  BrainCircuit,
  TestTube,
  CheckCircle2,
  Users,
  Database,
  Github,
  ChevronDown,
  Workflow
} from "lucide-react";
import { AppShell } from "../components/layout/AppShell.tsx";
import { Card, Badge, Input, Label, Textarea } from "../components/ui/UIComponents.tsx";
import { Button } from "../components/ui/Button.tsx";
import { useStore } from "../store/useStore.ts";
import { toast } from "react-hot-toast";
import { formatRelativeTime, cn } from "../lib/utils.ts";
import { 
  DEMO_PROJECTS, 
  DEMO_TICKETS, 
  DEMO_CHATS, 
  DEMO_CALLS, 
  DEMO_ACTIVITY 
} from "../store/demoData.ts";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  
  // Data for tabs
  const [tickets, setTickets] = useState([]);
  const [activities, setActivities] = useState([]);
  const [chats, setChats] = useState([]);
  const [calls, setCalls] = useState([]);

  const { token, isDemoMode, logout } = useStore();

  useEffect(() => {
    if (id) {
      fetchProject();
      fetchActivities();
    }
  }, [id, isDemoMode, token]);

  useEffect(() => {
    if (activeTab === "tickets") fetchTickets();
    if (activeTab === "activity") fetchActivities();
    if (activeTab === "chat") fetchChats();
    if (activeTab === "calls") fetchCalls();
  }, [activeTab, isDemoMode, token]);

  const fetchProject = async () => {
    if (isDemoMode) {
      const p = DEMO_PROJECTS.find((x: any) => x._id === id) || DEMO_PROJECTS[0];
      setProject(p);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const all = await res.json();
      const p = all.find((x: any) => String(x._id) === String(id));
      setProject(p);
    } catch (err) {
      toast.error("Failed to fetch project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !project && !isDemoMode) {
      toast.error("Project context lost. Returning to dashboard.");
      navigate("/projects");
    }
  }, [loading, project, isDemoMode]);

  const fetchTickets = async () => {
    if (isDemoMode) {
      setTickets(DEMO_TICKETS as any);
      return;
    }
    try {
      const res = await fetch(`/api/tickets/project/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setTickets(await res.json());
    } catch (err) {}
  };

  const fetchActivities = async () => {
    if (isDemoMode) {
      setActivities(DEMO_ACTIVITY as any);
      return;
    }
    try {
      const res = await fetch(`/api/activity/project/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setActivities(await res.json());
    } catch (err) {}
  };

  const fetchChats = async () => {
    if (isDemoMode) {
      setChats(DEMO_CHATS as any);
      return;
    }
    try {
      const res = await fetch(`/api/chats/project/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setChats(await res.json());
    } catch (err) {}
  };

  const fetchCalls = async () => {
    if (isDemoMode) {
      setCalls(DEMO_CALLS as any);
      return;
    }
    try {
      const res = await fetch(`/api/calls/project/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setCalls(await res.json());
    } catch (err) {}
  };

  if (loading) return <AppShell>Loading...</AppShell>;
  if (!project) return <AppShell>Project not found</AppShell>;

  const tabs = [
    { id: "overview", label: "Overview", icon: Calendar },
    { id: "workflow", label: "Workflow", icon: Workflow },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "tickets", label: "Tickets", icon: TicketIcon, enabled: project.modules.ticket },
    { id: "chat", label: "Chat", icon: MessageSquare, enabled: project.modules.chat },
    { id: "calls", label: "Calls", icon: PhoneCall, enabled: project.modules.call },
  ];

  return (
    <AppShell>
      {/* Cinematic Header Section */}
      <div className="relative mb-6 p-6 rounded-2xl overflow-hidden border border-border/10 bg-transparent backdrop-blur-2xl group transition-all duration-500">
        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-accent/10 transition-colors duration-1000" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-blue-custom/5 rounded-full blur-[80px] pointer-events-none" />

        <Link to="/projects" className="inline-flex items-center gap-2 text-[10px] font-black text-muted hover:text-accent mb-8 uppercase tracking-[0.3em] transition-all group/back">
          <ArrowLeft className="w-3 h-3 transition-transform group-hover/back:-translate-x-1" />
          Back to Portfolio
        </Link>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-xl shadow-accent/5">
                <Workflow className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-4xl font-black tracking-tighter text-text leading-none">{project.name}</h1>
                  <Badge variant={project.status === 'active' ? "active" : "inactive"} className="h-6 px-3 text-[10px] uppercase font-black tracking-widest">{project.status}</Badge>
                </div>
                <p className="text-muted text-sm font-medium opacity-80">
                  Client Identifier: <span className="text-text font-bold">{project.clientName}</span> • Operational Environment
                </p>
              </div>
            </div>
            <p className="text-muted/70 text-sm max-w-2xl leading-relaxed">
              {project.description || "Sophisticated operational support environment optimized for automated triage and high-speed resolution orchestration."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" className="h-10 px-5 text-xs font-black uppercase tracking-widest gap-2 bg-surface/50 border-border/50 hover:bg-surface">
              <Settings className="w-4 h-4" /> Environment Config
            </Button>
            <Button size="sm" className="h-10 px-6 text-xs font-black uppercase tracking-widest gap-2 shadow-xl shadow-accent/20">
              <Activity className="w-4 h-4" /> Operational Sync
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Modern Hand-Crafted Style */}
      <div className="flex gap-1 p-1 bg-surface/5 border border-border/10 rounded-xl mb-6 w-fit backdrop-blur-2xl overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            disabled={tab.enabled === false}
            className={cn(
              "flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 relative",
              tab.enabled === false ? "opacity-30 cursor-not-allowed" : "",
              activeTab === tab.id 
                ? "bg-accent text-white shadow-lg shadow-accent/20 scale-[1.02]" 
                : "text-muted hover:text-text hover:bg-surface/60"
            )}
          >
            <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-white" : "text-muted")} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="activeTab" className="absolute inset-0 bg-accent rounded-xl -z-10" />
            )}
          </button>
        ))}
      </div>

      {/* Viewport Content */}
      <div className="min-h-[500px]">
        {activeTab === "overview" && <OverviewTab project={project} activities={activities} />}
        {activeTab === "workflow" && <WorkflowTab project={project} />}
        {activeTab === "activity" && <ActivityTab activities={activities} />}
        {activeTab === "tickets" && (
          project.modules.ticket ? <TicketTab tickets={tickets} onRefresh={fetchTickets} /> : <LockedTab module="Tickets" />
        )}
        {activeTab === "chat" && (
          project.modules.chat ? <ChatTab chats={chats} /> : <LockedTab module="Chat" />
        )}
        {activeTab === "calls" && (
          project.modules.call ? <CallTab calls={calls} projectId={id} onRefresh={fetchCalls} /> : <LockedTab module="Calls" />
        )}
      </div>
    </AppShell>
  );
}

const LockedTab = ({ module }: { module: string }) => (
  <Card className="p-12 flex flex-col items-center justify-center border-dashed bg-surface/20">
    <div className="w-16 h-16 rounded-2xl bg-border/50 flex items-center justify-center mb-6">
      <Lock className="w-8 h-8 text-muted" />
    </div>
    <h3 className="text-xl font-bold mb-2">{module} Support Locked</h3>
    <p className="text-muted text-center max-w-sm mb-8">
      This support module is not enabled for the current project. Enable it in the project configuration drawer to begin tracking {module.toLowerCase()} data.
    </p>
    <Button variant="secondary" className="gap-2">
      <Settings className="w-4 h-4" /> Enable Module
    </Button>
  </Card>
);

const OverviewTab = ({ project, activities }: any) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2 space-y-8">
      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6 bg-accent/5 border-accent/20">
          <p className="text-[10px] uppercase font-bold text-accent tracking-[0.2em] mb-2">Health Score</p>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold italic">98.2</span>
            <div className="w-10 h-10 rounded-full border-4 border-accent border-t-transparent animate-spin-slow" />
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-[10px] uppercase font-bold text-muted tracking-[0.2em] mb-2">Uptime</p>
          <p className="text-3xl font-bold">99.9%</p>
        </Card>
        <Card className="p-6">
          <p className="text-[10px] uppercase font-bold text-muted tracking-[0.2em] mb-2">Team Size</p>
          <p className="text-3xl font-bold">12</p>
        </Card>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted mb-6 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Recent Operational Pulse
        </h3>
        <div className="space-y-4">
          {activities.slice(0, 5).map((act: any) => (
            <div key={act._id} className="flex gap-4 p-4 rounded-xl bg-card border border-border group hover:border-border-hover transition-all">
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center font-bold text-accent">
                {act.type.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm">{act.title}</h4>
                  <span className="text-[10px] text-muted font-bold">{formatRelativeTime(act.createdAt)}</span>
                </div>
                <p className="text-xs text-muted mb-2">{act.description}</p>
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 text-muted" />
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{act.actor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <Card className="p-6 h-fit sticky top-24">
      <h3 className="text-sm font-bold uppercase tracking-widest text-muted mb-6">Environment Details</h3>
      <div className="space-y-6">
        <div>
          <Label>Client Identifier</Label>
          <p className="text-sm font-bold">{project.clientName}</p>
        </div>
        <div>
          <Label>Project Status</Label>
          <Badge variant={project.status === 'active' ? 'active' : 'inactive'}>{project.status}</Badge>
        </div>
        <div>
          <Label>Module Access</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(project.modules).map(([name, enabled]) => (
              <Badge key={name} variant={enabled ? "active" : "inactive"}>{name}</Badge>
            ))}
          </div>
        </div>
        <div>
          <Label>Established</Label>
          <p className="text-xs font-medium text-muted italic flex items-center gap-2">
            <Calendar className="w-3 h-3" /> {new Date(project.createdAt).toLocaleDateString(undefined, { dateStyle: 'full' })}
          </p>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-border">
        <Button variant="danger" className="w-full">Archive Environment</Button>
      </div>
    </Card>
  </div>
);

const ActivityTab = ({ activities }: any) => (
  <div className="max-w-3xl mx-auto py-4">
    <div className="relative pl-8 border-l border-border space-y-12">
      {activities.length === 0 ? (
        <div className="text-center py-12 text-muted">No activities logged yet.</div>
      ) : activities.map((act: any) => (
        <div key={act._id} className="relative group">
          <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-lg bg-card border border-border flex items-center justify-center z-10 group-hover:border-accent transition-colors">
            <div className={cn(
              "w-2 h-2 rounded-full",
              act.type === 'ticket' ? "bg-blue-custom" : 
              act.type === 'chat' ? "bg-accent" : 
              act.type === 'call' ? "bg-green-custom" : "bg-muted"
            )} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1 italic">
              {new Date(act.createdAt).toLocaleString()}
            </span>
            <Card className="p-4 bg-surface/50 border-dashed hover:border-accent/40 transition-all">
              <h4 className="font-bold text-sm mb-1">{act.title}</h4>
              <p className="text-xs text-muted leading-relaxed mb-3">{act.description}</p>
              <div className="flex items-center gap-3">
                <Badge variant="neutral" className="bg-background">{act.type}</Badge>
                <div className="flex items-center gap-1.5 text-[10px] text-muted font-bold">
                  <User className="w-3 h-3" /> {act.actor}
                </div>
              </div>
            </Card>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TicketTab = ({ tickets, projectId, onRefresh }: any) => {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [ticketFormData, setTicketFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Open",
    assignedTo: ""
  });
  
  const token = useStore(state => state.token);
  const user = useStore(state => state.user);

  const fetchComments = async (ticketId: string) => {
    // Prevent fetching for demo tickets
    if (ticketId.toString().startsWith('t')) {
      // Use potential demo comments or empty
      setComments([]);
      return;
    }
    try {
      const res = await fetch(`/api/tickets/${ticketId}/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setComments(await res.json());
    } catch (err) {}
  };

  const handleSelectTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsDetailOpen(true);
    fetchComments(ticket._id);
  };

  const handleCreateTicket = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/tickets/project/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(ticketFormData)
      });
      if (res.ok) {
        toast.success("Ticket created successfully");
        setIsCreateOpen(false);
        setTicketFormData({ title: "", description: "", priority: "Medium", status: "Open", assignedTo: "" });
        onRefresh();
      }
    } catch (err) {
      toast.error("Failed to create ticket");
    }
  };

  const handleUpdateTicket = async (status?: string, assignedTo?: string) => {
    // Handle demo tickets locally
    if (selectedTicket._id.toString().startsWith('t')) {
      setSelectedTicket({
        ...selectedTicket,
        status: status || selectedTicket.status,
        assignedTo: assignedTo || selectedTicket.assignedTo
      });
      toast.success("Operational state updated (Simulation Mode)");
      setIsDetailOpen(false);
      return;
    }
    try {
      const updateData = {
        ...selectedTicket,
        status: status || selectedTicket.status,
        assignedTo: assignedTo || selectedTicket.assignedTo
      };
      
      const res = await fetch(`/api/tickets/${selectedTicket._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (res.ok) {
        const updatedTicket = await res.json();
        setSelectedTicket(updatedTicket);
        toast.success("Ticket updated");
        onRefresh();
      }
    } catch (err) {
      toast.error("Failed to update ticket");
    }
  };

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      const res = await fetch(`/api/tickets/${selectedTicket._id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });
      if (res.ok) {
        setNewComment("");
        fetchComments(selectedTicket._id);
        toast.success("Comment added");
      }
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted">Ticket Backlog</h3>
        <Button size="sm" className="gap-2" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4" /> New Ticket
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {tickets.length === 0 ? (
          <div className="text-center py-12 text-muted text-sm italic">No tickets found for this environment.</div>
        ) : tickets.map((t: any) => (
          <Card 
            key={t._id} 
            onClick={() => handleSelectTicket(t)}
            className="p-4 flex items-center justify-between group hover:border-accent/40 cursor-pointer transition-all border-l-4 border-l-transparent hover:border-l-accent"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-1 h-10 rounded-full",
                t.status === 'Open' ? "bg-blue-custom" :
                t.status === 'In Progress' ? "bg-amber-custom" :
                t.status === 'Resolved' ? "bg-green-custom" : "bg-muted"
              )} />
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest font-mono">#{t._id.toString().slice(-6)}</span>
                  <h4 className="font-bold text-sm tracking-tight">{t.title}</h4>
                  <Badge variant={t.status.replace(' ', '_').toLowerCase()}>{t.status}</Badge>
                  <Badge variant="neutral" className="text-[8px] bg-surface">{t.priority}</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted font-bold uppercase">
                    <User className="w-3 h-3" /> {t.assignedTo || 'Unassigned'}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted font-bold uppercase">
                    <Clock className="w-3 h-3" /> {formatRelativeTime(t.createdAt)}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon"><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Ticket Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold uppercase tracking-tight">Report New Issue</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-muted hover:text-text"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <Label>Ticket Title</Label>
                <Input 
                  required 
                  value={ticketFormData.title}
                  onChange={e => setTicketFormData({ ...ticketFormData, title: e.target.value })}
                  placeholder="Summarize the core problem..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <select 
                    value={ticketFormData.priority}
                    onChange={e => setTicketFormData({ ...ticketFormData, priority: e.target.value })}
                    className="w-full h-10 bg-surface border border-border rounded-lg px-3 text-xs font-bold focus:ring-1 focus:ring-accent outline-none appearance-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <Label>Initial Status</Label>
                  <select 
                    value={ticketFormData.status}
                    onChange={e => setTicketFormData({ ...ticketFormData, status: e.target.value })}
                    className="w-full h-10 bg-surface border border-border rounded-lg px-3 text-xs font-bold focus:ring-1 focus:ring-accent outline-none appearance-none"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Assignment (Optional)</Label>
                <Input 
                  value={ticketFormData.assignedTo}
                  onChange={e => setTicketFormData({ ...ticketFormData, assignedTo: e.target.value })}
                  placeholder="e.g. Sarah Connor"
                />
              </div>
              <div>
                <Label>Full Technical Description</Label>
                <Textarea 
                  required
                  value={ticketFormData.description}
                  onChange={e => setTicketFormData({ ...ticketFormData, description: e.target.value })}
                  placeholder="Provide logs, reproduction steps, or environment data..."
                  rows={4}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsCreateOpen(false)}>Abort</Button>
                <Button type="submit" className="flex-1">Raise Ticket</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {isDetailOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
          <Card className="w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border bg-surface/30 flex justify-between items-start">
              <div className="flex gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-white",
                  selectedTicket.status === 'Open' ? "bg-blue-custom" :
                  selectedTicket.status === 'In Progress' ? "bg-amber-custom" :
                  selectedTicket.status === 'Resolved' ? "bg-green-custom" : "bg-muted"
                )}>
                  <TicketIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono font-bold text-muted uppercase tracking-widest">Ticket #{selectedTicket._id.toString().slice(-8)}</span>
                    <Badge variant={selectedTicket.status.replace(' ', '_').toLowerCase()}>{selectedTicket.status}</Badge>
                    <Badge variant="neutral" className="bg-surface">{selectedTicket.priority} Priority</Badge>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">{selectedTicket.title}</h2>
                </div>
              </div>
              <button 
                onClick={() => setIsDetailOpen(false)}
                className="p-2 rounded-full hover:bg-surface transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3">
              {/* Content / Comments */}
              <div className="lg:col-span-2 flex flex-col overflow-hidden border-r border-border">
                <div className="p-8 overflow-y-auto flex-1 custom-scrollbar space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted font-mono">Technical Brief</h4>
                    <div className="p-6 rounded-2xl bg-surface/50 border border-border/50 text-sm leading-relaxed text-text whitespace-pre-wrap">
                      {selectedTicket.description}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted font-mono">Communication Log</h4>
                    <div className="space-y-4">
                      {comments.map((comment, idx) => (
                        <div key={idx} className="flex gap-4 p-4 rounded-xl bg-card border border-border/30">
                          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-xs">
                            {comment.author.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold">{comment.author}</span>
                              <span className="text-[9px] text-muted font-mono">{formatRelativeTime(comment.createdAt)}</span>
                            </div>
                            <p className="text-sm text-text leading-relaxed">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                      {comments.length === 0 && (
                        <p className="text-xs text-muted italic p-4 text-center border border-dashed border-border rounded-xl">No comments shared in this log thread.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-surface/30 border-t border-border">
                  <form onSubmit={handleAddComment} className="flex gap-3">
                    <Input 
                      placeholder="Add operational note or instruction..."
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!newComment.trim()}>Post Update</Button>
                  </form>
                </div>
              </div>

              {/* Sidebar / Actions */}
              <div className="p-8 bg-surface/20 space-y-10 overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted font-mono">Control Panel</h4>
                  
                  <div className="space-y-2">
                    <Label>Lifecycle Status</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Open', 'In Progress', 'Resolved', 'Closed'].map(s => (
                        <button 
                          key={s}
                          onClick={() => handleUpdateTicket(s)}
                          className={cn(
                            "px-3 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-tight transition-all",
                            selectedTicket.status === s 
                              ? "bg-accent border-accent text-white" 
                              : "bg-background border-border text-muted hover:border-accent/40"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Assigned Controller</Label>
                    <div className="relative">
                      <Input 
                        value={selectedTicket.assignedTo || ""}
                        onChange={e => setSelectedTicket({...selectedTicket, assignedTo: e.target.value})}
                        className="pr-10"
                        placeholder="Assignee name..."
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-1 top-1 h-8 w-8"
                        onClick={() => handleUpdateTicket(undefined, selectedTicket.assignedTo)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-border">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted font-mono">Deployment Intel</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[9px] text-muted font-bold uppercase tracking-wider block mb-1">Established</span>
                      <span className="text-xs font-mono font-bold">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-muted font-bold uppercase tracking-wider block mb-1">Pulse Count</span>
                      <span className="text-xs font-mono font-bold">{comments.length} Log Entries</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <Button variant="danger" className="w-full gap-2">
                    <Lock className="w-3.5 h-3.5" /> Force Close Session
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

import { io } from "socket.io-client";

const ChatTab = ({ chats: initialChats }: { chats: any[] }) => {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState(initialChats);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmEndModalOpen, setIsConfirmEndModalOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  
  const user = useStore(state => state.user);
  const token = useStore(state => state.token);
  const socketRef = useRef<any>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const selectedChatRef = useRef(selectedChat);
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  const normaliseChat = (c: any) => ({
    ...c,
    _id: c.id ?? c._id,
    userName: c.user_name ?? c.userName ?? c.customerName ?? "UNKNOWN_NODE",
    startedAt: c.started_at ?? c.startedAt ?? c.updatedAt ?? c.createdAt ?? new Date().toISOString(),
    status: c.status,
    unreadCount: c.unreadCount ?? 0
  });

  const normaliseMessage = (m: any) => ({
    ...m,
    chatId: m.chat_id ?? m.chatId,
    sender: m.sender,
    content: m.content,
    isAdmin: m.is_admin ?? m.isAdmin,
    createdAt: m.created_at ?? m.createdAt
  });

  // Connection for project-wide chat updates
  useEffect(() => {
    const socket = io();
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Telemetry Link: ESTABLISHED");
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Telemetry Link: SEVERED");
      setSocketConnected(false);
    });

    socket.on("receive-message", (msg) => {
      const normalizedMsg = normaliseMessage(msg);
      // Update message list if it's the selected chat
      if (selectedChatRef.current && (selectedChatRef.current.id === normalizedMsg.chatId || selectedChatRef.current._id === normalizedMsg.chatId)) {
        setMessages(prev => [...prev, normalizedMsg]);
      } else {
        // Increment unread count for the chat in the list
        setChats(prev => prev.map(c => {
          const cid = c.id ?? c._id;
          return cid === normalizedMsg.chatId ? { 
            ...c, 
            unreadCount: (c.unreadCount || 0) + 1, 
            hasNewMessage: true 
          } : c;
        }));
      }
    });

    socket.on("status-update", ({ chatId, status }: any) => {
      setChats(prev => prev.map(c => {
        const cid = c.id ?? c._id;
        return cid === chatId ? { ...c, status } : c;
      }));
      if (selectedChatRef.current && (selectedChatRef.current.id === chatId || selectedChatRef.current._id === chatId)) {
        setSelectedChat((prev: any) => ({ ...prev, status }));
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Separate effect to join rooms whenever chats are loaded/updated
  useEffect(() => {
    if (socketRef.current && socketConnected && chats.length > 0) {
      chats.forEach((chat: any) => {
        const id = chat.id ?? chat._id;
        socketRef.current.emit("join-chat", id);
      });
    }
  }, [chats, socketConnected]);

  // Auto-scroll to bottom of log
  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat?._id]); 

  // Sync initial chats if they change from parent
  useEffect(() => {
    setChats(initialChats);
  }, [initialChats]);

  const fetchMessages = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chats/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.map(normaliseMessage));
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const handleSendMessage = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !socketRef.current || selectedChat.status === 'Ended') return;

    const chatId = selectedChat.id ?? selectedChat._id;

    const msgData = {
      chatId,
      sender: user?.name || "Admin",
      content: newMessage,
      isAdmin: true,
      createdAt: new Date().toISOString()
    };

    socketRef.current.emit("send-message", msgData);
    setNewMessage("");
  };

  const handleEndChat = async () => {
    if (!selectedChat || selectedChat.status === 'Ended') return;
    
    try {
      const res = await fetch(`/api/chats/${selectedChat._id}/end`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Support session closed");
        // Status update will come back via Socket.IO
      }
    } catch (err) {
      toast.error("Failed to close session");
    }
  };

  const handleSelectChat = async (chat: any) => {
    setSelectedChat(chat);
    setIsDetailsDrawerOpen(false);
    if (!chat.isRead || chat.hasNewMessage) {
      // Guard demo chats
      if ((chat.id ?? chat._id).toString().startsWith('ch')) {
        setChats(prev => prev.map(c => {
          const cid = c.id ?? c._id;
          const chatid = chat.id ?? chat._id;
          return cid === chatid ? { ...c, isRead: true, hasNewMessage: false, unreadCount: 0 } : c;
        }));
        return;
      }
      try {
        await fetch(`/api/chats/${chat.id ?? chat._id}/read`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        });
        setChats(prev => prev.map(c => {
          const cid = c.id ?? c._id;
          const chatid = chat.id ?? chat._id;
          return cid === chatid ? { ...c, isRead: true, hasNewMessage: false, unreadCount: 0 } : c;
        }));
      } catch (err) {
        console.error("Failed to mark chat as read", err);
      }
    }
  };

  const filteredChats = chats.map(normaliseChat).filter((c: any) => 
    (c.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.id?.toString() || c._id?.toString() || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportHistory = () => {
    if (!selectedChat || messages.length === 0) return;
    
    const content = messages.map(m => 
      `[${new Date(m.createdAt).toLocaleString()}] ${m.sender}: ${m.content}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-history-${selectedChat.userName}-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("History exported successfully");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px] animate-in fade-in duration-500 relative">
      {/* Sessions Sidebar */}
      <Card className="lg:col-span-1 flex flex-col overflow-hidden border-border/50 shadow-xl shadow-black/10">
        <div className="p-4 border-b border-border bg-surface/30 relative">
          <Input 
            placeholder="Search active logs..." 
            className="h-9 text-xs bg-background/50 border-border/50 pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-3.5 h-3.5 absolute left-7 top-7 text-muted" />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredChats.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface border border-dashed border-border flex items-center justify-center">
                <Search className="w-4 h-4 text-muted/30" />
              </div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">No matching sessions</p>
            </div>
          ) : (
            filteredChats.map((c: any) => {
              const cid = c.id ?? c._id;
              return (
                <div 
                  key={cid} 
                  onClick={() => handleSelectChat(c)}
                  className={cn(
                    "p-4 border-b border-border cursor-pointer transition-all border-l-4 group relative overflow-hidden",
                    selectedChat?.id === cid || selectedChat?._id === cid
                      ? "bg-accent/[0.03] border-accent" 
                      : "border-transparent hover:bg-surface/50 hover:border-accent/30"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      {( !c.isRead || c.hasNewMessage ) && (
                        <div className="w-2 h-2 rounded-full bg-accent shrink-0 shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.6)] animate-pulse" />
                      )}
                      <span className={cn(
                        "text-xs font-black truncate tracking-tight transition-colors",
                        (!c.isRead || c.hasNewMessage) ? "text-text" : "text-muted",
                        (selectedChat?.id === cid || selectedChat?._id === cid) ? "text-accent" : ""
                      )}>
                        {c.userName || "UNKNOWN_NODE"}
                      </span>
                    </div>
                    <span className="text-[8px] text-muted uppercase font-black whitespace-nowrap bg-background px-1.5 py-0.5 rounded border border-border/50 font-mono">
                      {formatRelativeTime(c.startedAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        c.status === 'Active' ? "bg-green-custom animate-pulse" : 
                        c.status === 'Ended' ? "bg-red-custom" : "bg-muted"
                      )} />
                      <p className={cn(
                        "text-[9px] font-bold uppercase tracking-tighter truncate font-mono",
                        c.status === 'Active' ? "text-green-custom" : 
                        c.status === 'Ended' ? "text-red-custom" : "text-muted"
                      )}>{c.status}</p>
                    </div>
                    
                    {c.unreadCount > 0 && (
                      <span className="bg-accent text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full font-mono">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Main Technical Log View */}
      <Card className="lg:col-span-3 flex flex-col bg-background border-border shadow-sm relative group overflow-hidden">
        {/* Header */}
        <div className="p-3 border-b border-border bg-surface/50 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-2 h-2 rounded-full",
              selectedChat ? (selectedChat.status === 'Active' ? "bg-green-custom animate-pulse" : "bg-muted") : "bg-muted/30"
            )} />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted font-mono flex items-center gap-2">
              <span className="opacity-50">STDOUT:</span> 
              <span className={cn(selectedChat ? "text-accent" : "text-muted/40 animate-pulse")}>
                {selectedChat ? `NODE_${(selectedChat.id ?? selectedChat._id).toString().slice(0, 8).toUpperCase()}` : "AWAITING_INPUT"}
              </span>
            </h3>
          </div>
          {selectedChat && (
            <div className="flex items-center gap-2">
              <button 
                onClick={handleExportHistory}
                className="p-1.5 text-muted hover:text-accent transition-colors"
                title="Export History"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setIsDetailsDrawerOpen(!isDetailsDrawerOpen)}
                className={cn(
                  "p-1.5 transition-colors",
                  isDetailsDrawerOpen ? "text-accent" : "text-muted hover:text-accent"
                )}
                title="Session Details"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
              <div className="w-[1px] h-3 bg-border mx-1" />
              <Badge variant="neutral" className="text-[9px] font-mono tracking-tighter bg-surface">
                {selectedChat.userName || "ANONYMOUS"}
              </Badge>
              {selectedChat.status === 'Active' && (
                <button 
                  onClick={() => setIsConfirmEndModalOpen(true)}
                  className="p-1.5 text-muted hover:text-red-custom transition-colors"
                  title="End Support Session"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar font-sans z-10">
          {!selectedChat ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-muted opacity-40">
              <MessageSquare className="w-12 h-12" />
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 font-mono">Awaiting Session Connection</p>
                <p className="text-[10px] max-w-[220px] leading-relaxed mx-auto italic">
                  Select a support node from the secondary buffer to initiate telemetry stream.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="text-[10px] text-muted/60 mb-6 font-mono border-b border-border pb-2 uppercase tracking-widest flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("w-1 h-1 rounded-full", socketConnected ? "bg-accent animate-pulse" : "bg-red-custom")} /> 
                  {socketConnected ? "Connection established. Handshake stable." : "Telemetry Link Severed. Reconnecting..."}
                </div>
                <span className="opacity-40">Port: 3000</span>
              </div>
              {messages.length === 0 && (
                <div className="text-[10px] text-muted italic font-mono">NO_DATA_RECEIVED</div>
              )}
              {messages.map((m, idx) => (
                <div key={idx} className="flex gap-4 group animate-in slide-in-from-left-2 duration-300">
                  <span className="text-[10px] text-muted/50 shrink-0 select-none font-mono">
                    {new Date(m.createdAt || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="flex-1">
                    <span className={cn(
                      "text-[10px] font-bold uppercase mr-2 tracking-widest font-mono",
                      m.isAdmin ? "text-accent" : "text-green-custom"
                    )}>
                      {m.sender}:
                    </span>
                    <span className="text-sm text-text leading-relaxed">{m.content}</span>
                  </div>
                </div>
              ))}
              <div ref={logEndRef} />
            </>
          )}
        </div>

        {/* Details Drawer */}
        {isDetailsDrawerOpen && selectedChat && (
          <div className="absolute right-0 top-[48px] bottom-0 w-64 bg-surface border-l border-border z-20 animate-in slide-in-from-right-full duration-300 shadow-2xl">
            <div className="p-4 border-b border-border flex justify-between items-center bg-background/50">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Session Intelligence</h4>
              <button onClick={() => setIsDetailsDrawerOpen(false)} className="text-muted hover:text-text">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-8">
              <div className="space-y-2">
                <Label className="text-[8px] tracking-widest opacity-50">Operational Node</Label>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-bold truncate leading-none mb-1">{selectedChat.userName || "ANONYMOUS_NODE"}</p>
                    <p className="text-[9px] text-muted font-mono uppercase">ID: {(selectedChat.id ?? selectedChat._id).toString().slice(-8)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-[10px]">
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted uppercase font-bold tracking-tighter">Status</span>
                  <span className={cn(
                    "font-bold uppercase tracking-tighter",
                    selectedChat.status === 'Active' ? "text-green-custom" : "text-red-custom"
                  )}>{selectedChat.status}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted uppercase font-bold tracking-tighter">Established</span>
                  <span className="text-text font-mono tracking-tighter">{new Date(selectedChat.startedAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted uppercase font-bold tracking-tighter">Packets Received</span>
                  <span className="text-text font-mono tracking-tighter">{messages.length}</span>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2 border-dashed border-border hover:border-accent hover:text-accent text-[10px]"
                  onClick={handleExportHistory}
                >
                  <Download className="w-3.5 h-3.5" /> Full Session Export
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-border bg-surface/40 backdrop-blur-md z-10 relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          <form 
            onSubmit={handleSendMessage}
            className="flex items-center gap-3"
          >
            <div className="flex-1 relative group">
              <Input 
                placeholder={selectedChat ? (selectedChat.status === 'Ended' ? "STDOUT: SESSION_CLOSED" : "Type command...") : "STDOUT: AWAITING_SELECTION"}
                className="h-11 border-border/50 focus:border-accent/50 bg-background/80 text-sm font-mono pl-10 pr-12 transition-all"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={!selectedChat || selectedChat.status === 'Ended'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/30 group-focus-within:text-accent transition-colors">
                {">_"}
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-muted/20 uppercase tracking-widest pointer-events-none group-focus-within:text-accent/20">
                Ready
              </div>
            </div>
            <Button 
              type="submit"
              className="h-10 px-6"
              disabled={!selectedChat || !newMessage.trim() || selectedChat.status === 'Ended'}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <div className="flex justify-between items-center mt-3 px-2">
            <span className={cn(
              "text-[8px] font-bold uppercase tracking-widest font-mono",
              selectedChat?.status === 'Active' ? "text-accent" : "text-muted"
            )}>
              {selectedChat ? (selectedChat.status === 'Ended' ? "SESSION_CLOSED" : "ENCRYPTED_STREAM_ACTIVE") : "STANDBY"}
            </span>
          </div>
        </div>
      </Card>

      {/* Confirmation Modal */}
      {isConfirmEndModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <Card className="w-full max-w-sm p-8 shadow-2xl animate-in zoom-in-95 duration-200 border-red-custom/20">
            <div className="w-16 h-16 bg-red-custom/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-custom">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-center">Terminate Session?</h3>
            <p className="text-xs text-muted text-center mb-8 px-4 leading-relaxed">
              Terminating session <span className="font-mono text-accent">{selectedChat._id.slice(0, 12)}</span> will disconnect the user pulse and lock the current message stream.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                className="flex-1 font-bold uppercase tracking-widest text-[10px]" 
                onClick={() => setIsConfirmEndModalOpen(false)}
              >
                Abort
              </Button>
              <Button 
                variant="danger"
                className="flex-1 font-bold uppercase tracking-widest text-[10px]" 
                onClick={() => {
                  handleEndChat();
                  setIsConfirmEndModalOpen(false);
                }}
              >
                Confirm Stop
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

const CallTab = ({ calls, projectId, onRefresh }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [formData, setFormData] = useState({
    requesterName: "",
    requesterEmail: "",
    scheduledAt: "",
    notes: ""
  });
  const token = useStore(state => state.token);

  const handleScheduleCall = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, projectId })
      });
      if (res.ok) {
        toast.success("Call scheduled successfully");
        setIsModalOpen(false);
        setFormData({ requesterName: "", requesterEmail: "", scheduledAt: "", notes: "" });
        onRefresh();
      }
    } catch (err) {
      toast.error("Failed to schedule call");
    }
  };

  const handleUpdateStatus = async (status: string) => {
    // Handle demo calls locally
    if (selectedCall._id.toString().startsWith('ca')) {
      toast.success("Protocol updated (Simulation Mode)");
      setIsStatusModalOpen(false);
      setShowConfirmation(false);
      return;
    }
    try {
      const res = await fetch(`/api/calls/${selectedCall._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status,
          scheduledAt: selectedCall.scheduledAt,
          notes: selectedCall.notes
        })
      });
      if (res.ok) {
        toast.success("Call status updated");
        setIsStatusModalOpen(false);
        setShowConfirmation(false);
        onRefresh();
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted">Call Operations</h3>
        <Button size="sm" className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Calendar className="w-4 h-4" /> Schedule Outbound
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-1">
        {calls.length === 0 ? (
          <div className="text-center py-12 text-muted text-sm italic">No call records found for this environment.</div>
        ) : calls.map((cl: any) => (
          <div key={cl._id} className="flex items-center justify-between p-4 bg-card border-b border-border last:border-none hover:bg-surface/30 transition-colors">
            <div className="flex items-center gap-6">
              <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center">
                <PhoneCall className={cn("w-4 h-4", cl.status === 'Completed' ? "text-green-custom" : "text-amber-custom")} />
              </div>
              <div>
                <h4 className="text-sm font-bold">{cl.requesterName}</h4>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] text-muted">{cl.requesterEmail || 'No email provided'}</p>
                  {cl.notes && (
                    <span className="text-[9px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest border border-accent/20">
                      Detailed
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-12">
              {cl.notes && (
                <div className="hidden lg:block max-w-[200px] truncate italic text-[11px] text-muted">
                  "{cl.notes}"
                </div>
              )}
              <div className="hidden md:block text-right">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-0.5">Scheduled</p>
                <p className="text-xs font-semibold">{cl.scheduledAt ? new Date(cl.scheduledAt).toLocaleString() : 'N/A'}</p>
              </div>
              <Badge variant={cl.status.toLowerCase()}>{cl.status}</Badge>
              {cl.status !== 'Cancelled' && cl.status !== 'Completed' && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-8 h-8 text-red-custom hover:bg-red-custom/10"
                  title="Cancel Call"
                  onClick={() => {
                    setSelectedCall({ ...cl, status: 'Cancelled' });
                    setIsStatusModalOpen(true);
                    setShowConfirmation(false);
                  }}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-8 h-8"                onClick={() => {
                  setSelectedCall({ ...cl });
                  setIsStatusModalOpen(true);
                  setShowConfirmation(false);
                }}
              >
                <MoreVertical className="w-4 h-4 text-muted" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Call Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-6">Schedule Outbound Call</h3>
            <form onSubmit={handleScheduleCall} className="space-y-4">
              <div>
                <Label>Requester Name</Label>
                <Input 
                  required 
                  value={formData.requesterName}
                  onChange={e => setFormData({ ...formData, requesterName: e.target.value })}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <Label>Requester Email</Label>
                <Input 
                  type="email"
                  value={formData.requesterEmail}
                  onChange={e => setFormData({ ...formData, requesterEmail: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label>Scheduled Time</Label>
                <Input 
                  type="datetime-local"
                  required
                  value={formData.scheduledAt}
                  onChange={e => setFormData({ ...formData, scheduledAt: e.target.value })}
                />
              </div>
              <div>
                <Label>Notes (Optional)</Label>
                <Textarea 
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Meeting agenda, special requirements..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Schedule Call</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Update Status Modal */}
      {isStatusModalOpen && selectedCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            {!showConfirmation ? (
              <>
                <h3 className="text-xl font-bold mb-4">Update Call Request</h3>
                <p className="text-xs text-muted mb-6">Manage status and notes for {selectedCall.requesterName}</p>
                
                <div className="space-y-6">
                  <div>
                    <Label>Current Status</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Pending', 'Scheduled', 'Completed', 'Cancelled'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setSelectedCall({ ...selectedCall, status })}
                          className={cn(
                            "px-3 py-1.5 rounded-lg border text-xs font-bold transition-all",
                            selectedCall.status === status 
                              ? "bg-accent border-accent text-white" 
                              : "bg-surface border-border text-text hover:border-accent/50"
                          )}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Update Notes</Label>
                    <Textarea 
                      className="mt-2"
                      value={selectedCall.notes || ""}
                      onChange={e => setSelectedCall({ ...selectedCall, notes: e.target.value })}
                      placeholder="Update call details or add outcome notes..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button variant="secondary" className="flex-1" onClick={() => setIsStatusModalOpen(false)}>Close</Button>
                    {selectedCall.status !== 'Cancelled' && (
                      <Button 
                        variant="outline" 
                        className="flex-1 border-red-custom text-red-custom hover:bg-red-custom/5" 
                        onClick={() => {
                          setSelectedCall({ ...selectedCall, status: 'Cancelled' });
                          setShowConfirmation(true);
                        }}
                      >
                        Cancel Call
                      </Button>
                    )}
                    <Button className="flex-1" onClick={() => setShowConfirmation(true)}>Save Changes</Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PhoneCall className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">Confirm Status Change</h3>
                <p className="text-sm text-muted mb-8 px-4">
                  Are you sure you want to update the status of this call to <span className="text-accent font-bold">"{selectedCall.status}"</span>?
                </p>
                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1" onClick={() => setShowConfirmation(false)}>Go Back</Button>
                  <Button className="flex-1" onClick={() => handleUpdateStatus(selectedCall.status)}>Confirm Update</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
// --- Workflow Visualization Components ---

const WorkflowTab = ({ project }: any) => {
  return (
    <div className="relative w-full h-[700px] bg-transparent overflow-hidden rounded-3xl border border-border/30 mb-12">
      {/* SVG Connection Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
         <defs>
           <filter id="workflowGlow" x="-20%" y="-20%" width="140%" height="140%">
             <feGaussianBlur stdDeviation="3" result="blur" />
             <feComposite in="SourceGraphic" in2="blur" operator="over" />
           </filter>
           
           <marker
             id="arrowhead"
             markerWidth="10"
             markerHeight="7"
             refX="9"
             refY="3.5"
             orient="auto"
           >
             <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-accent)" className="opacity-40" />
           </marker>

           <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
             <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0" />
             <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.5" />
             <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
           </linearGradient>
         </defs>
         
         <WorkflowBezier start={[240, 200]} end={[350, 300]} />
         <WorkflowBezier start={[240, 450]} end={[350, 300]} />
         <WorkflowBezier start={[580, 300]} end={[700, 300]} />
         <WorkflowBezier start={[950, 300]} end={[1080, 150]} />
         <WorkflowBezier start={[950, 300]} end={[1080, 450]} />
         <WorkflowBezier start={[1300, 150]} end={[1420, 300]} />
         <WorkflowBezier start={[1300, 450]} end={[1420, 300]} />
         <WorkflowBezier start={[1650, 300]} end={[1780, 300]} />
      </svg>

      <div className="relative h-full w-full py-10 z-20 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-24 px-12 min-w-max h-full">
          
          {/* INGRESS */}
          <div className="flex flex-col gap-10">
            <WorkflowNode 
              title="Project Ingress"
              icon={Github}
              desc="Repository telemetry sync."
              content={`Project: ${project.name}\nSource: github.com/pulse\nLast_Sync: NOW`}
              footer="2ms Latency"
              isUser
            />
            <WorkflowNode 
              title="Log Stream"
              icon={Activity}
              desc="Real-time event ingestion."
              content={`Status: ACTIVE\nEvents: 42/min\nSource: UDP_7421`}
              footer="Live Stream"
            />
          </div>

          {/* ANALYSIS */}
          <WorkflowNode 
            title="Logic Engine"
            icon={Search}
            desc="Building context map."
            content={`AST_Parse: SUCCESS\nRisk_Analysis: 0.02\nProject: ${project.name}`}
            footer="Pulse v3.0"
          />

          {/* AGENT */}
          <WorkflowNode 
            title="Pulse Agent"
            icon={BrainCircuit}
            desc="AI Reasoning Pipeline."
            className="w-80"
            agentDetails={{
              model: "Claude-3.5-Pro",
              knowledgeBases: [`Project_${project.name}_Context`, "System_Specs"],
              tools: [Terminal, GitPullRequest, ShieldCheck]
            }}
          />

          {/* EXECUTION */}
          <div className="flex flex-col gap-10">
            <WorkflowNode 
              title="Code Synthesis"
              icon={GitPullRequest}
              desc="Generating resolution code."
              content={`Action: PATCH\nTarget: main\nStatus: PENDING`}
              footer="AI_EXEC"
              size="sm"
            />
            <WorkflowNode 
              title="System Patch"
              icon={Terminal}
              desc="Deploying infra updates."
              content={`Action: UPDATE\nTarget: k8s_cluster\nStatus: RUNNING`}
              footer="OPS_GEN"
              size="sm"
            />
          </div>

          {/* VERIFICATION */}
          <WorkflowNode 
            title="CI Validator"
            icon={TestTube}
            desc="Security & Regression checks."
            content={`Tests: 12/12 PASSED\nSecurity: COMPLIANT\nBuild: OK`}
            footer="VERIFIED"
          />

          {/* RESOLUTION */}
          <WorkflowNode 
            title="Resolution"
            icon={CheckCircle2}
            desc="Final delivery status."
            outputContent={`Project: ${project.name}\n\n• Logic verified\n• Patch generated\n• System stable\n\nResult: SUCCESS`}
            footer="RESOLVED"
          />

        </div>
      </div>
    </div>
  );
};

function WorkflowNode({ title, icon: Icon, desc, content, footer, className, size = 'md', agentDetails, outputContent, isUser }: any) {
  return (
    <div className={cn(
      "bg-transparent border border-border/10 rounded-xl flex flex-col backdrop-blur-2xl transition-all duration-500 hover:border-accent/40 hover:bg-accent/5 group relative overflow-hidden",
      size === 'sm' ? "w-60 p-4" : "w-64 p-5",
      className
    )}>
      {/* Tech Corners */}
      <div className="tech-corner top-0 left-0 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="tech-corner top-0 right-0 border-t border-r opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="tech-corner bottom-0 left-0 border-b border-l opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="tech-corner bottom-0 right-0 border-b border-r opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Cinematic Overlays */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -inset-x-20 top-0 h-40 bg-accent/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent h-40 -top-full group-hover:animate-scan pointer-events-none z-0" />

      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className="w-11 h-11 rounded-2xl border border-border/50 bg-background/50 flex items-center justify-center text-accent shadow-lg shadow-black/10 group-hover:scale-110 transition-transform duration-500">
          {isUser ? <Users className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[11px] font-black text-text uppercase tracking-[0.1em]">{title}</h3>
          <div className="flex items-center gap-1.5 mt-1">
             <div className={cn("w-1.5 h-1.5 rounded-full", isUser ? "bg-accent animate-pulse" : "bg-muted")} />
             <span className="text-[8px] font-bold text-muted uppercase tracking-[0.2em]">{isUser ? "Live_Stream" : "Idle_Standby"}</span>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-muted/80 mb-4 leading-relaxed font-medium relative z-10">{desc}</p>

      {content && (
        <div className="p-4 bg-background/40 rounded-2xl mb-4 border border-border/20 backdrop-blur-sm relative z-10 group-hover:border-accent/20 transition-colors">
           <pre className="text-[9px] font-mono font-bold text-text/90 whitespace-pre-wrap leading-tight">
             {content}
           </pre>
        </div>
      )}

      {agentDetails && (
        <div className="space-y-4 mb-4 relative z-10">
           <div className="p-3 bg-accent/5 border border-accent/10 rounded-2xl flex items-center justify-between">
              <span className="text-[10px] font-black text-accent italic uppercase tracking-widest">{agentDetails.model}</span>
              <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
           </div>
           <div>
              <div className="space-y-2">
                 {agentDetails.knowledgeBases.map((kb: string, i: number) => (
                    <div key={i} className="flex items-center gap-2.5 p-2.5 border border-border/10 rounded-xl bg-background/20 hover:bg-background/40 transition-colors">
                       <Database className="w-3.5 h-3.5 text-accent/60" />
                       <span className="text-[9px] font-bold text-muted">{kb}</span>
                    </div>
                 ))}
              </div>
           </div>
           <div className="flex gap-2.5">
              {agentDetails.tools.map((T: any, i: number) => (
                 <div key={i} className="p-2.5 border border-border/10 rounded-xl bg-background/30 hover:border-accent/40 hover:text-accent transition-all cursor-crosshair">
                    <T className="w-4 h-4" />
                 </div>
              ))}
           </div>
        </div>
      )}

      {outputContent && (
        <div className="p-4 bg-accent/[0.04] border border-accent/20 rounded-2xl text-[10px] leading-relaxed text-text mb-4 relative z-10 shadow-inner">
           {outputContent.split('\n').map((line: string, i: number) => (
             <p key={i} className={cn(line.startsWith('•') ? "ml-2 mt-1.5 text-accent font-black" : "mt-2 first:mt-0 font-bold opacity-80")}>
               {line}
             </p>
           ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-border/20 mt-auto relative z-10">
        <button className="flex items-center gap-2 text-[9px] font-black text-muted hover:text-accent uppercase tracking-[0.2em] transition-all">
           Telemetry <ChevronDown className="w-3 h-3" />
        </button>
        <span className="text-[8px] font-mono text-accent/30 tracking-tighter animate-flicker uppercase">0x{Math.random().toString(16).slice(2, 6)}</span>
        <span className="text-[9px] font-mono font-bold text-accent bg-accent/5 px-2 py-0.5 rounded-full">{footer}</span>
      </div>
    </div>
  );
}

function WorkflowBezier({ start, end }: { start: [number, number], end: [number, number] }) {
  const [sx, sy] = start;
  const [ex, ey] = end;
  const cp1x = sx + (ex - sx) * 0.4;
  const cp1y = sy;
  const cp2x = sx + (ex - sx) * 0.6;
  const cp2y = ey;
  const path = `M ${sx} ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${ex} ${ey}`;

  return (
    <g>
      {/* Background static path */}
      <path d={path} fill="none" stroke="#e5e7eb" strokeWidth="1" className="opacity-10" />
      
      {/* Directional Path with Arrowhead */}
      <path 
        d={path} 
        fill="none" 
        stroke="var(--color-accent)" 
        strokeWidth="1.5" 
        className="opacity-20" 
        markerEnd="url(#arrowhead)" 
      />

      {/* Animated Flow Segment */}
      <motion.path
        d={path}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeDasharray="40 200"
        animate={{ strokeDashoffset: [240, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        filter="url(#workflowGlow)"
        className="opacity-40"
      />

      {/* Traveling Photon */}
      <motion.circle
        r="3.5"
        fill="var(--color-accent)"
        transition={{ 
          duration: 2.5, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{ 
          offsetPath: `path('${path}')`,
        }}
        initial={{ offsetDistance: "0%" }}
        animate={{ 
          offsetDistance: "100%",
          scale: [1, 1.8, 1],
          opacity: [0.3, 1, 0.3]
        }}
        className="z-50"
        filter="url(#workflowGlow)"
      />
    </g>
  );
}
