import { Search, Bell, Moon, Sun, Command, Menu, CheckCircle2, Activity, Ticket as TicketIcon, Clock, X, RotateCw } from "lucide-react";
import { useStore } from "../../store/useStore.ts";
import { Input } from "../ui/UIComponents.tsx";
import { cn, formatRelativeTime } from "../../lib/utils.ts";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export const Topbar = () => {
  const { theme, setTheme, sidebarCollapsed, setSidebarCollapsed, token } = useStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (!token) return;
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/activity", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const latest = data.slice(0, 5); // Just show latest 5
        setNotifications(latest);
        // If we found more items than before, or if it's the first fetch
        // setUnreadCount(latest.length > 0 ? 1 : 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600); // Small delay for visual feedback
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Polling every 60s
    return () => clearInterval(interval);
  }, [token]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-14 sticky top-0 bg-transparent backdrop-blur-xl border-b border-border/20 z-40 px-4 flex items-center justify-between transition-all">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 -ml-2 rounded-lg text-muted hover:text-text hover:bg-surface transition-all active:scale-95"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
          <Input 
            placeholder="Search projects or commands..." 
            className="pl-10 h-10 bg-surface/50 border-border/50 focus:border-accent/40 focus:bg-surface transition-all text-sm rounded-xl"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-background border border-border px-1.5 py-0.5 rounded text-[10px] font-black text-muted select-none">
            <Command className="w-2.5 h-2.5" /> K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 pl-4">
        <div className="flex items-center gap-1 bg-surface/50 border border-border/50 p-1 rounded-xl">
          <button 
            onClick={() => setTheme('light')}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              theme === 'light' ? "bg-background text-accent shadow-sm" : "text-muted hover:text-text"
            )}
          >
            <Sun className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setTheme('dark')}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              theme === 'dark' ? "bg-background text-accent shadow-sm" : "text-muted hover:text-text"
            )}
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setUnreadCount(0);
            }}
            className={cn(
              "p-2.5 rounded-xl transition-all relative group",
              showNotifications ? "bg-accent/10 border-accent/40 text-accent" : "bg-surface/50 border border-border/50 text-muted hover:text-text"
            )}
          >
            <Bell className={cn("w-4 h-4", unreadCount > 0 && "animate-ring")} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-custom rounded-full ring-2 ring-background animate-pulse" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-80 bg-background border border-border/50 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden backdrop-blur-xl z-50"
              >
                <div className="p-4 border-b border-border/50 flex justify-between items-center bg-surface/20">
                  <h3 className="text-xs font-black uppercase tracking-widest text-text">Live Pulse</h3>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchNotifications();
                    }}
                    className={cn(
                      "p-1.5 rounded-lg hover:bg-surface transition-all text-muted hover:text-accent",
                      isRefreshing && "animate-spin text-accent"
                    )}
                    title="Refresh Data"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-border/30">
                      {notifications.map((n, i) => (
                        <Link 
                          key={i} 
                          to={`/projects/${n.project_id}`}
                          onClick={() => setShowNotifications(false)}
                          className="flex gap-4 p-4 hover:bg-surface/50 transition-colors group"
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-border/50 bg-surface",
                            n.type === 'project' ? "text-accent" : "text-blue-custom"
                          )}>
                            {n.type === 'project' ? <CheckCircle2 className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-text truncate group-hover:text-accent transition-colors">{n.title}</p>
                            <p className="text-[10px] text-muted line-clamp-2 mt-0.5">{n.description}</p>
                            <div className="flex items-center gap-1.5 mt-2">
                              <Clock className="w-2.5 h-2.5 text-muted/60" />
                              <span className="text-[9px] font-bold text-muted/60 uppercase tracking-tight">{formatRelativeTime(n.created_at)}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center">
                      <p className="text-xs font-bold text-muted">All systems stable.</p>
                      <p className="text-[10px] text-muted/50 mt-1">No new operational alerts.</p>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-surface/30 border-t border-border/50">
                  <Link 
                    to="/activity" 
                    onClick={() => setShowNotifications(false)}
                    className="block w-full py-2 text-center text-[10px] font-black uppercase tracking-widest text-muted hover:text-accent transition-all"
                  >
                    View Operational Logs
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
