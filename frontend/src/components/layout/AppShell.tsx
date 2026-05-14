import { ReactNode } from "react";
import { Sidebar } from "./Sidebar.tsx";
import { Topbar } from "./Topbar.tsx";
import { motion } from "motion/react";
import { useStore } from "../../store/useStore.ts";
import { cn } from "../../lib/utils.ts";
import InteractiveGrid from "../ui/InteractiveGrid.tsx";

export const AppShell = ({ children }: { children: ReactNode }) => {
  const { sidebarCollapsed, isDemoMode } = useStore();

  return (
    <div className={cn("min-h-screen bg-transparent text-text flex relative", isDemoMode && "pt-10")}>
      <InteractiveGrid />
      
      <Sidebar />
      <div className={cn(
        "flex-1 transition-all duration-500 ease-in-out relative z-10",
        sidebarCollapsed ? "pl-[72px]" : "pl-[220px]"
      )}>
        <Topbar />
        <main className="p-6 w-full">
          <motion.div
            key={sidebarCollapsed ? 'collapsed' : 'expanded'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
