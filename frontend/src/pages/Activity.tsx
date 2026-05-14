import { useState, useEffect } from "react";
import { AppShell } from "../components/layout/AppShell.tsx";
import { Card } from "../components/ui/UIComponents.tsx";
import { useStore } from "../store/useStore.ts";
import { DEMO_ACTIVITY } from "../store/demoData.ts";
import { 
  Activity as ActivityIcon, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  User as UserIcon,
  Tag,
  RefreshCw,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import { cn } from "../lib/utils.ts";

export default function Activity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { token, isDemoMode } = useStore();

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/activity", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (err) {
      console.error("Failed to fetch activity", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDemoMode) {
      setActivities(DEMO_ACTIVITY);
      setLoading(false);
      return;
    }
    fetchActivity();
  }, [isDemoMode, token]);

  // Normalise field names — demo uses user/project, real API uses actor/project_name
  const normalise = (act: any) => ({
    ...act,
    id: act._id ?? act.id,
    actor: act.actor ?? act.user,
    project_name: act.project_name ?? act.project,
    created_at: act.created_at ?? act.createdAt,
  });

  const filteredActivities = activities.map(normalise).filter(act => {
    const matchesFilter = filter === "all" || act.type === filter;
    const matchesSearch = 
      act.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      act.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.actor?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'ticket': return '🎫';
      case 'chat': return '💬';
      case 'call': return '📞';
      case 'project': return '📁';
      default: return '⚡';
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center text-accent">
                <ActivityIcon className="w-4 h-4" />
              </div>
              <h1 className="text-2xl font-black tracking-tight uppercase italic">Operational <span className="text-accent">Logs.</span></h1>
            </div>
            <p className="text-xs text-muted font-mono tracking-tighter ml-11">DATA_STREAM: SYSTEM_LOGS_v3.2</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchActivity}
              className="p-2 rounded border border-border hover:bg-surface text-muted transition-all"
              title="Refresh logs"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            </button>
            <div className="h-6 w-px bg-border" />
            <div className="flex p-1 bg-surface border border-border rounded">
              {['all', 'ticket', 'chat', 'call', 'project'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest transition-all",
                    filter === f ? "bg-accent text-white" : "text-muted hover:text-text"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input 
                type="text" 
                placeholder="Search across all operations..."
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent transition-all text-sm font-mono"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Card className="p-0 border-border/50">
              <div className="divide-y divide-border/30">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={`skeleton-${i}`} className="p-4 flex items-start gap-4 animate-pulse">
                        <div className="w-10 h-10 bg-border/20 rounded" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-border/20 rounded w-1/4" />
                          <div className="h-2 bg-border/20 rounded w-full" />
                        </div>
                      </div>
                    ))
                  ) : filteredActivities.length > 0 ? (
                    filteredActivities.map((act) => (
                      <div 
                        key={act.id}
                        className="p-4 flex items-start gap-4 hover:bg-surface transition-colors group cursor-default"
                      >
                        <div className="w-10 h-10 rounded bg-background border border-border flex items-center justify-center text-lg group-hover:border-accent transition-colors">
                          {getIcon(act.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4 mb-1">
                            <h3 className="text-xs font-bold text-text truncate group-hover:text-accent transition-colors">
                              {act.title}
                            </h3>
                            <div className="flex items-center gap-1 text-[9px] text-muted font-mono whitespace-nowrap">
                              <Clock className="w-3 h-3" />
                              {act.created_at ? format(new Date(act.created_at), 'MMM d, h:mm a') : 'Recent'}
                            </div>
                          </div>
                          <p className="text-[11px] text-muted mb-3 leading-relaxed font-mono">
                            {act.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1.5 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                              <div className="w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center">
                                <UserIcon className="w-2 h-2 text-accent" />
                              </div>
                              <span className="text-[9px] font-bold text-text font-mono uppercase tracking-tighter">{act.actor}</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-border" />
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-border bg-background">
                              <Tag className="w-2.5 h-2.5 text-muted" />
                              <span className="text-[8px] font-bold uppercase tracking-widest text-muted font-mono">{act.type}</span>
                            </div>
                            {act.project_name && (
                              <>
                                <div className="w-1 h-1 rounded-full bg-border" />
                                <span className="text-[10px] font-bold text-accent hover:underline cursor-pointer font-mono tracking-tighter">
                                  {act.project_name}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-2 text-muted hover:text-accent transition-all self-center">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-16 text-center">
                      <ActivityIcon className="w-8 h-8 text-muted/20 mx-auto mb-4" />
                      <h3 className="text-sm font-bold mb-1 font-mono uppercase">Node Buffer Empty</h3>
                      <p className="text-muted text-[10px] uppercase tracking-tighter">No relevant data points detected in current frequency.</p>
                    </div>
                  )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-5 border-border/50">
              <h3 className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4 font-mono">Log Diagnostics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[9px] font-bold mb-1.5 font-mono">
                    <span className="text-muted tracking-tighter uppercase">Buffer Integrity</span>
                    <span className="text-accent">98.4%</span>
                  </div>
                  <div className="h-1 w-full bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-[98%]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded bg-background border border-border">
                    <p className="text-[8px] font-bold text-muted uppercase mb-1 font-mono tracking-tighter">Packets</p>
                    <p className="text-lg font-black font-mono tracking-tighter">{activities.length}</p>
                  </div>
                  <div className="p-2.5 rounded bg-background border border-border">
                    <p className="text-[8px] font-bold text-muted uppercase mb-1 font-mono tracking-tighter">Collisions</p>
                    <p className="text-lg font-black font-mono tracking-tighter text-amber-custom">0</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-background border-dashed border-border/50">
              <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-4 flex items-center gap-2 font-mono">
                <Calendar className="w-3 h-3 text-accent" /> Temporal Filter
              </h3>
              <div className="space-y-2">
                {['Today', 'Yesterday', 'Last 7 Days', 'Archive'].map(d => (
                  <button 
                    key={d}
                    className="w-full flex items-center justify-between px-3 py-2 rounded border border-transparent hover:border-border hover:bg-surface text-[10px] font-bold transition-all group font-mono uppercase tracking-tighter"
                  >
                    <span className="text-muted group-hover:text-text transition-colors">{d}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
