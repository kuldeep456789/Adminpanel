import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, ArrowRight, Sparkles, Zap, Shield, ChevronRight } from "lucide-react";
import { useStore } from "../../store/useStore.ts";
import { cn } from "../../lib/utils.ts";
import { toast } from "react-hot-toast";

type Tab = "login" | "register";

export function DemoAuthModal() {
  const { showAuthModal, setShowAuthModal, exitDemoMode } = useStore();
  const [tab, setTab] = useState<Tab>("login");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Countdown bar (only shown on first auto-open)
  useEffect(() => {
    if (!showAuthModal) return;
    setCountdown(100);
  }, [showAuthModal]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        exitDemoMode(data.user, data.token);
        toast.success(`Welcome back, ${data.user.name}! Your workspace is ready.`);
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch {
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        exitDemoMode(data.user, data.token);
        toast.success(`Workspace created! Welcome, ${data.user.name}!`);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch {
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => setShowAuthModal(false)}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="w-full max-w-md pointer-events-auto">
          {/* Glowing accent behind card */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-accent/20 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative bg-card border border-border/60 rounded-3xl shadow-[0_32px_80px_-16px_rgba(0,0,0,0.8)] overflow-hidden">

            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-accent via-purple-500 to-accent bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite]" />

            {/* Header */}
            <div className="px-8 pt-8 pb-6">
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center text-muted hover:text-text hover:border-border-hover transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Logo mark */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-accent/30">D</div>
                <span className="font-bold tracking-tight text-text text-xl">DYNAMIC.</span>
              </div>

              <h2 className="text-2xl font-black tracking-tight text-text mb-2">
                {tab === "login" ? "Continue your workspace" : "Create your workspace"}
              </h2>
              <p className="text-sm text-muted">
                {tab === "login"
                  ? "Sign in to replace demo data with your real projects and activity."
                  : "Create a free account to save your work and manage real projects."}
              </p>

            </div>

            {/* Tab switcher */}
            <div className="px-8 mb-6">
              <div className="flex gap-1 p-1 rounded-2xl bg-surface border border-border">
                {(["login", "register"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cn(
                      "relative flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                      tab === t ? "text-white" : "text-muted hover:text-text"
                    )}
                  >
                    {tab === t && (
                      <motion.div
                        layoutId="tab-indicator"
                        className="absolute inset-0 bg-accent rounded-xl shadow-lg shadow-accent/30"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{t === "login" ? "Sign In" : "Register"}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Forms */}
            <div className="px-8 pb-8">
              <AnimatePresence mode="wait">
                {tab === "login" ? (
                  <motion.form
                    key="login-form"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleLogin}
                    className="space-y-4"
                  >
                    <AuthInput
                      type="email"
                      placeholder="name@company.com"
                      value={loginEmail}
                      onChange={(v) => setLoginEmail(v)}
                      icon={<Mail className="w-4 h-4" />}
                      required
                    />
                    <AuthInput
                      type="password"
                      placeholder="Your password"
                      value={loginPassword}
                      onChange={(v) => setLoginPassword(v)}
                      icon={<Lock className="w-4 h-4" />}
                      required
                    />
                    <AuthSubmitButton loading={loading} label="Sign In & Load Workspace" />
                  </motion.form>
                ) : (
                  <motion.form
                    key="register-form"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleRegister}
                    className="space-y-4"
                  >
                    <AuthInput
                      type="text"
                      placeholder="Your full name"
                      value={regName}
                      onChange={(v) => setRegName(v)}
                      icon={<User className="w-4 h-4" />}
                      required
                    />
                    <AuthInput
                      type="email"
                      placeholder="name@company.com"
                      value={regEmail}
                      onChange={(v) => setRegEmail(v)}
                      icon={<Mail className="w-4 h-4" />}
                      required
                    />
                    <AuthInput
                      type="password"
                      placeholder="Min. 6 characters"
                      value={regPassword}
                      onChange={(v) => setRegPassword(v)}
                      icon={<Lock className="w-4 h-4" />}
                      required
                    />
                    <AuthSubmitButton loading={loading} label="Create Workspace" />
                  </motion.form>
                )}
              </AnimatePresence>

              {/* OAuth placeholders */}
              <div className="relative flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">or continue with</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "GitHub", icon: "⌥" },
                  { label: "Google", icon: "G" }
                ].map((o) => (
                  <button
                    key={o.label}
                    type="button"
                    onClick={() => toast("OAuth coming soon!", { icon: "🔒" })}
                    className="flex items-center justify-center gap-2 h-10 rounded-xl border border-border bg-surface text-xs font-bold text-muted hover:text-text hover:border-border-hover transition-all"
                  >
                    <span className="text-sm">{o.icon}</span> {o.label}
                  </button>
                ))}
              </div>

              {/* Security note */}
              <div className="flex items-center gap-2 mt-5 p-3 rounded-xl bg-green-custom/5 border border-green-custom/15">
                <Shield className="w-3.5 h-3.5 text-green-custom flex-shrink-0" />
                <p className="text-[10px] text-muted leading-relaxed">Your demo session and real data are fully isolated. No demo activity is saved.</p>
              </div>

              {/* Continue demo link */}
              <div className="text-center mt-5">
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-xs text-muted hover:text-text transition-colors inline-flex items-center gap-1.5 group"
                >
                  <Zap className="w-3 h-3" />
                  Continue exploring in Demo Mode
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ---- Sub-components ----

function AuthInput({
  type, placeholder, value, onChange, icon, required
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">{icon}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full h-12 bg-surface border border-border rounded-2xl pl-11 pr-4 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
      />
    </div>
  );
}

function AuthSubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full h-12 rounded-2xl bg-accent text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/25 transition-all",
        loading ? "opacity-60 cursor-not-allowed" : "hover:bg-accent/90"
      )}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {label} <ArrowRight className="w-4 h-4" />
        </>
      )}
    </motion.button>
  );
}
