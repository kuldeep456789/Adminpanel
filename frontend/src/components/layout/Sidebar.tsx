import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Files, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Activity,
  Menu,
  LogIn,
  HeartPulse,
  ShieldAlert,
  Workflow
} from "lucide-react";
import { useStore } from "../../store/useStore.ts";
import { DEMO_USER } from "../../store/demoData.ts";
import { cn } from "../../lib/utils.ts";
import { motion, AnimatePresence } from "motion/react";

const NavItem = ({ to, icon: Icon, children, active, collapsed }: { to: string, icon: any, children: ReactNode, active?: boolean, collapsed: boolean }) => (
  <Link 
    to={to} 
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group relative",
      active 
        ? "bg-accent/10 text-accent border-l-2 border-accent rounded-l-none" 
        : "text-muted hover:text-text hover:bg-surface"
    )}
  >
    <div className="flex items-center justify-center min-w-[20px]">
      <Icon className={cn("w-4 h-4 transition-transform duration-300", active ? "text-accent" : "group-hover:text-text")} />
    </div>
    
    <AnimatePresence initial={false}>
      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ 
            duration: 0.3, 
            delay: 0.2 // Small delay for content appearing when expanding
          }}
          className="whitespace-nowrap overflow-hidden"
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>

    {collapsed && (
      <div className="absolute left-14 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border px-2 py-1 rounded text-[10px] font-bold pointer-events-none z-50 whitespace-nowrap shadow-xl">
        {children}
      </div>
    )}
  </Link>
);

export const Sidebar = () => {
  const { pathname } = useLocation();
  const { user, logout, sidebarCollapsed, setSidebarCollapsed, isDemoMode, setShowAuthModal } = useStore();

  const currentUser = isDemoMode ? DEMO_USER : user;

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 bg-surface/5 backdrop-blur-xl border-r border-border/30 flex flex-col z-50 transition-all duration-500 ease-in-out",
        sidebarCollapsed ? "w-[72px]" : "w-[220px]"
      )}
    >
      <div className="p-4 flex flex-col h-full">
        <div className={cn(
          "flex items-center gap-2 mb-10 transition-all duration-500",
          sidebarCollapsed ? "justify-center" : "px-2"
        )}>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center font-black text-white italic shadow-lg shadow-accent/30 cursor-pointer"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            D
          </motion.div>
          {!sidebarCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-black tracking-tighter text-lg text-text uppercase italic"
            >
              Dynamic.
            </motion.span>
          )}
        </div>

        <nav className="space-y-8 flex-1">
          <div>
            {!sidebarCollapsed && (
              <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4 ml-3 opacity-60">
                Main
              </p>
            )}
            <div className="space-y-1">
              <NavItem to="/dashboard" icon={LayoutDashboard} active={pathname === "/dashboard"} collapsed={sidebarCollapsed}>Dashboard</NavItem>
              <NavItem to="/projects" icon={Files} active={pathname.startsWith("/projects")} collapsed={sidebarCollapsed}>Operations</NavItem>
              <NavItem to="/pulse" icon={Workflow} active={pathname === "/pulse"} collapsed={sidebarCollapsed}>Orchestration</NavItem>
              <NavItem to="/activity" icon={Activity} active={pathname === "/activity"} collapsed={sidebarCollapsed}>Log</NavItem>
            </div>
          </div>



          <div>
            {!sidebarCollapsed && (
              <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4 ml-3 opacity-60">
                Other
              </p>
            )}
            <div className="space-y-1">
              <NavItem to="/settings" icon={Settings} active={pathname === "/settings"} collapsed={sidebarCollapsed}>Settings</NavItem>
            </div>
          </div>
        </nav>

        <div className="mt-auto">
          {!sidebarCollapsed && (
            <div className="mb-4">
              <button 
                onClick={() => setSidebarCollapsed(true)}
                className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold text-muted uppercase tracking-widest hover:text-accent transition-colors group"
              >
                <span>Collapse</span>
                <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          )}
          
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-xl bg-card border border-border group overflow-hidden",
            sidebarCollapsed ? "justify-center" : ""
          )}>
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent font-bold text-xs uppercase shrink-0">
              {currentUser?.name?.slice(0, 2) || "AD"}
            </div>
            {!sidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 min-w-0"
              >
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold truncate">{currentUser?.name || "Admin User"}</p>
                  <span className={cn(
                    "text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter",
                    currentUser?.role === 'admin' ? "bg-accent/20 text-accent" : "bg-muted/20 text-muted"
                  )}>
                    {currentUser?.role || "User"}
                  </span>
                </div>
                <p className="text-[10px] text-muted truncate">{currentUser?.email || "admin@example.com"}</p>
              </motion.div>
            )}
            {!sidebarCollapsed && (
              <button 
                onClick={() => isDemoMode ? setShowAuthModal(true) : logout()} 
                className={cn(
                  "p-1.5 hover:bg-surface rounded-lg text-muted transition-all",
                  isDemoMode ? "hover:text-accent" : "hover:text-red-custom"
                )}
              >
                {isDemoMode ? <LogIn className="w-3.5 h-3.5" /> : <LogOut className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
