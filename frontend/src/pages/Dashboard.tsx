import { useState, useEffect } from "react";
import { 
  Users, 
  MessageSquare, 
  PhoneCall, 
  Ticket as TicketIcon,
  Activity,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, StatCard, Badge } from "../components/ui/UIComponents.tsx";
import { Button } from "../components/ui/Button.tsx";
import { AppShell } from "../components/layout/AppShell.tsx";
import { useStore } from "../store/useStore.ts";
import { DEMO_STATS } from "../store/demoData.ts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded-lg shadow-xl shadow-black/20">
        <p className="text-xs font-bold mb-2 uppercase tracking-wider text-muted">{label}</p>
        {payload.map((item: any, i: number) => (
          <div key={i} className="flex items-center gap-2 mb-1 last:mb-0">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs font-medium text-text">{item.name}:</span>
            <span className="text-xs font-bold ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user, token, sidebarCollapsed, logout, isDemoMode } = useStore();
  const [stats, setStats] = useState<any>(isDemoMode ? DEMO_STATS : null);
  const [loading, setLoading] = useState(!isDemoMode);

  // Key to force re-render charts when sidebar collapses/expands
  const chartKey = sidebarCollapsed ? "collapsed" : "expanded";

  const colors: Record<string, string> = {
    "Open": "#3B82F6",
    "In Progress": "#F59E0B",
    "Resolved": "#22C55E",
    "Closed": "#6B7385"
  };

  useEffect(() => {
    // In demo mode — use static demo data, no API call
    if (isDemoMode) {
      setStats(DEMO_STATS);
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.status === 401) { logout(); return; }
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
        setStats(DEMO_STATS);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [isDemoMode, token]);

  if (loading) return (
    <AppShell>
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-8 w-64 bg-surface rounded-lg" />
        <div className="grid grid-cols-5 gap-5">{[...Array(5)].map((_, i) => <div key={i} className="h-32 bg-surface rounded-lg" />)}</div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 h-80 bg-surface rounded-lg" />
          <div className="h-80 bg-surface rounded-lg" />
        </div>
      </div>
    </AppShell>
  );

  return (
    <AppShell>
      <div className="flex flex-col gap-6 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-text uppercase italic">Dynamic <span className="text-accent">Host.</span></h1>
            <p className="text-muted text-[10px] font-bold uppercase tracking-widest">Live orchestration & operational logs</p>
          </div>
          <div className="flex items-center gap-3">
            {isDemoMode && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-[10px] font-bold text-accent uppercase tracking-widest">
                <Sparkles className="w-3 h-3" /> Demo Data
              </span>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border">
              <div className="w-2 h-2 rounded-full bg-green-custom animate-pulse" />
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest font-mono">Platform Status: Optimal</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <StatCard 
            label="Operational Terminals" 
            value={stats?.summary?.total_projects || 0} 
            trend={{ value: "Synchronized", positive: true }} 
            icon={Users} 
          />
          <StatCard 
            label="Active Environments" 
            value={stats?.summary?.active_projects || 0} 
            trend={{ value: "Online", positive: true }} 
            icon={Activity} 
          />
          <StatCard 
            label="Triage Queue" 
            value={stats?.summary?.total_tickets || 0} 
            trend={{ value: `${stats?.summary?.open_tickets || 0} Open`, positive: true }} 
            icon={TicketIcon} 
          />
          <StatCard 
            label="Chat Requests" 
            value={stats?.summary?.total_chats || 0} 
            trend={{ value: "Real-time", positive: true }} 
            icon={MessageSquare} 
          />
          <StatCard 
            label="Call Requests" 
            value={stats?.summary?.total_calls || 0} 
            trend={{ value: "Pending", positive: true }} 
            icon={PhoneCall} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted font-mono mb-1">Workload Distribution</h3>
                <p className="text-sm font-bold tracking-tight">Active support density by project cluster</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="text-[9px] uppercase font-bold text-muted font-mono tracking-tighter">Chats</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-custom" />
                  <span className="text-[9px] uppercase font-bold text-muted font-mono tracking-tighter">Tickets</span>
                </div>
              </div>
            </div>
            
            <div className="h-[300px] w-full relative min-h-0 min-w-0">
              <ResponsiveContainer key={chartKey} width="100%" height="100%">
                <BarChart data={stats?.projectActivity || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#6B7385", fontSize: 9, fontWeight: 600, fontFamily: "JetBrains Mono" }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#6B7385", fontSize: 9, fontFamily: "JetBrains Mono" }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Bar dataKey="tickets" fill="#3B82F6" radius={[2, 2, 0, 0]} barSize={24} />
                  <Bar dataKey="chats" fill="#6366F1" radius={[2, 2, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted font-mono mb-8">State Breakdown</h3>
            <div className="h-[200px] w-full relative min-h-0 min-w-0">
              <ResponsiveContainer key={chartKey} width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.statusBreakdown?.length > 0 ? stats.statusBreakdown : [{ name: "No Data", value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stats?.statusBreakdown?.length > 0 ? (
                      stats.statusBreakdown.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={colors[entry.name] || "#6B7385"} stroke="none" />
                      ))
                    ) : (
                      <Cell fill="rgba(255,255,255,0.05)" stroke="none" />
                    )}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold font-mono tracking-tighter">{stats?.summary?.total_tickets || 0}</span>
                <span className="text-[8px] font-bold text-muted uppercase tracking-widest font-mono">Telemetry</span>
              </div>
            </div>
            
            <div className="mt-8 space-y-2">
              {(stats?.statusBreakdown || []).map((status: any) => (
                <div key={status.name} className="flex items-center justify-between p-2 rounded bg-surface/50 border border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[status.name] || "#6B7385" }} />
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest font-mono">{status.name}</span>
                  </div>
                  <span className="text-[10px] font-bold font-mono">{((status.value / (stats?.summary?.total_tickets || 1)) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted font-mono">Operations Feed</h3>
              <Button variant="ghost" className="text-[9px] gap-1">
                Expand <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
            <div className="space-y-6">
              {(stats?.recentActivity || []).map((activity: any) => (
                <div key={activity._id || activity.id} className="flex gap-4 group">
                  <div className="relative">
                    <div className="w-8 h-8 rounded bg-surface border border-border flex items-center justify-center z-10 relative">
                      <Activity className="w-4 h-4 text-accent" />
                    </div>
                  </div>
                  <div className="flex-1 pb-6 border-b border-border group-last:border-none">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-bold">{activity.title}</h4>
                      <span className="text-[9px] text-muted font-mono">{new Date(activity.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[11px] text-muted leading-relaxed font-mono">
                      {activity.description} / ID: <span className="text-text font-bold uppercase">{activity.actor.slice(0, 4)}</span>
                    </p>
                  </div>
                </div>
              ))}
              {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
                <p className="text-[10px] text-muted text-center py-4 font-mono">NULL_ACTIVITY_BUFFER</p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted font-mono">Volume Frequency</h3>
            </div>
            <div className="h-[300px] w-full relative min-h-0 min-w-0">
              <ResponsiveContainer key={chartKey} width="100%" height="100%">
                <LineChart data={stats?.monthlyTrend?.map((m: any) => ({ ...m, volume: parseInt(m.count) })) || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#6B7385", fontSize: 9, fontWeight: 600, fontFamily: 'JetBrains Mono' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#6B7385", fontSize: 9, fontFamily: 'JetBrains Mono' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    dot={{ fill: "#3B82F6", strokeWidth: 1, r: 3, stroke: "var(--color-card)" }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
              <div>
                <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-1 font-mono">Peak_Vol</p>
                <p className="text-lg font-black font-mono tracking-tighter">{Math.max(0, ...(stats?.monthlyTrend?.map((m: any) => parseInt(m.count)) || [0]))}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-1 font-mono">Avg_Latency</p>
                <p className="text-lg font-black font-mono tracking-tighter">1.2h</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-1 font-mono">Sync_Rate</p>
                <p className="text-lg font-black font-mono tracking-tighter text-green-custom">94%</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

const FilesIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1s.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z" />
    <path d="M3 7.6v12.8c0 .4.2.8.5 1.1s.7.5 1.1.5h9.8" />
    <path d="M15 2v5h5" />
  </svg>
);
