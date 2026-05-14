import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ChevronRight } from "lucide-react";
import { Card, Input, Label, Badge } from "../components/ui/UIComponents.tsx";
import { Button } from "../components/ui/Button.tsx";
import { useStore } from "../store/useStore.ts";
import { toast } from "react-hot-toast";
import InteractiveGrid from "../components/ui/InteractiveGrid.tsx";

export default function Login() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user, data.token);
        toast.success("Welcome back, Admin");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <InteractiveGrid />
      
      {/* Abstract background subtle glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-soft/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-[380px] z-10">
        <div className="flex items-center gap-2 mb-12 justify-center">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center font-bold text-white italic text-xl shadow-lg shadow-accent/20">D</div>
          <span className="font-bold tracking-tight text-text text-2xl">DYNAMIC.</span>
        </div>

        <Card className="p-8 border-border shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold mb-2">Access Admin Panel</h1>
            <p className="text-sm text-muted">Enter credentials to manage operations</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10" 
                  placeholder="name@company.com" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Password</Label>
                <button type="button" className="text-[11px] font-medium text-accent hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 flex justify-between px-6">
              {loading ? "Authenticating..." : "Sign In"}
              {!loading && <ChevronRight className="w-4 h-4" />}
            </Button>
          </form>
        </Card>

        <div className="mt-8 text-center">
          <Badge variant="neutral" className="border-border/10 bg-surface/50 py-1.5 px-4 backdrop-blur-sm">
            Operational Protocol v2.4.1
          </Badge>
        </div>
      </div>
    </div>
  );
}
