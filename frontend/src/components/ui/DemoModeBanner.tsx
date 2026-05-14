import { motion, AnimatePresence } from "motion/react";
import { Zap, X, LogIn } from "lucide-react";
import { useStore } from "../../store/useStore.ts";

export function DemoModeBanner() {
  const { isDemoMode, setShowAuthModal } = useStore();

  return (
    <AnimatePresence>
      {isDemoMode && (
        <motion.div
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="fixed top-0 left-0 right-0 z-[90] h-10 flex items-center justify-center gap-3 text-xs font-bold"
          style={{
            background: "linear-gradient(90deg, rgba(59,130,246,0.15) 0%, rgba(168,85,247,0.15) 50%, rgba(59,130,246,0.15) 100%)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(59,130,246,0.2)"
          }}
        >
          {/* Animated left glow dot */}
          <span className="flex items-center gap-1.5 text-accent">
            <Zap className="w-3 h-3 fill-accent" />
            <span className="uppercase tracking-widest text-[10px]">Demo Mode</span>
          </span>

          <span className="text-muted font-normal hidden sm:inline">
            — You're exploring a live demo. No data is saved.
          </span>

          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-white text-[10px] font-black uppercase tracking-widest hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 ml-2"
          >
            <LogIn className="w-3 h-3" /> Sign In
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
