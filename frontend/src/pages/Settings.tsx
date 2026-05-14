import { useState } from "react";
import { AppShell } from "../components/layout/AppShell.tsx";
import { Card, Button, Input, Label, Textarea } from "../components/ui/UIComponents.tsx";
import { useStore } from "../store/useStore.ts";
import { 
  Settings as SettingsIcon, 
  User, 
  Palette, 
  Shield, 
  Bell, 
  Save, 
  Check,
  Moon,
  Sun,
  Monitor,
  Key,
  Database,
  Globe,
  Trash2,
  Lock
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils.ts";
import { toast } from "react-hot-toast";
import { DEMO_USER } from "../store/demoData.ts";
import { Sparkles } from "lucide-react";

export default function Settings() {
  const { user, theme, setTheme, isDemoMode, setShowAuthModal } = useStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  const currentUser = isDemoMode ? DEMO_USER : user;

  const handleSave = () => {
    if (isDemoMode) {
      toast("Sign in to save real settings!", { icon: "🔒" });
      setShowAuthModal(true);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Settings updated successfully");
    }, 1000);
  };

  const [notificationSettings, setNotificationSettings] = useState({
    push: true,
    email: false,
    urgent: true,
    marketing: false
  });

  const toggleNotification = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: "profile", icon: User, label: "Profile" },
    { id: "appearance", icon: Palette, label: "Appearance" },
    { id: "security", icon: Shield, label: "Security" },
    { id: "notifications", icon: Bell, label: "Notifications" }
  ];

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <header>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter">Account Settings</h1>
          </div>
          <p className="text-muted text-sm ml-13">Manage your profile, preferences, and system security</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tabs Sidebar */}
          <div className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all group",
                  activeTab === tab.id 
                    ? "bg-accent text-white shadow-lg shadow-accent/20" 
                    : "text-muted hover:text-text hover:bg-surface border border-transparent hover:border-border"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-white" : "text-muted group-hover:text-accent")} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 border border-border/50 shadow-2xl shadow-black/20 overflow-hidden relative">
                {/* Profile Settings */}
                {activeTab === "profile" && (
                  <div className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="relative group shadow-2xl">
                        <div className="w-24 h-24 rounded-3xl bg-accent/10 border-2 border-dashed border-accent/30 flex items-center justify-center text-3xl font-black text-accent overflow-hidden">
                          {currentUser?.name?.slice(0, 1) || "A"}
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-surface border border-border text-muted hover:text-accent hover:border-accent/40 shadow-xl transition-all active:scale-90">
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex-1 space-y-4 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted">Full Name</Label>
                            <Input defaultValue={currentUser?.name || "Admin User"} className="bg-background/50 border-border/50 h-11" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted">Email Address</Label>
                            <Input defaultValue={currentUser?.email || "admin@example.com"} className="bg-background/50 border-border/50 h-11" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted">Bio / Personal Note</Label>
                          <Textarea placeholder="Write a short bio..." className="bg-background/50 border-border/50 min-h-[100px]" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border/50 flex justify-end gap-3">
                      <Button variant="secondary" className="px-8 bg-surface border-border/50">Cancel</Button>
                      <Button onClick={handleSave} loading={loading} className="px-8 gap-2">
                        <Save className="w-4 h-4" /> Save Profile
                      </Button>
                    </div>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeTab === "appearance" && (
                  <div className="space-y-10">
                    <div>
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-accent" /> Select Theme
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { id: 'dark', label: 'Dark Mode', icon: Moon },
                          { id: 'light', label: 'Light Mode', icon: Sun },
                          { id: 'system', label: 'System (Auto)', icon: Monitor }
                        ].map(t => (
                          <button
                            key={t.id}
                            onClick={() => t.id !== 'system' && setTheme(t.id as any)}
                            className={cn(
                              "relative group p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4",
                              theme === t.id 
                                ? "bg-accent/5 border-accent shadow-xl shadow-accent/5" 
                                : "bg-surface border-border hover:border-border-hover"
                            )}
                          >
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                              theme === t.id ? "bg-accent text-white" : "bg-background text-muted group-hover:text-text"
                            )}>
                              <t.icon className="w-6 h-6" />
                            </div>
                            <span className={cn("text-sm font-bold", theme === t.id ? "text-text" : "text-muted")}>{t.label}</span>
                            {theme === t.id && (
                              <div className="absolute top-3 right-3 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border/50 flex justify-end">
                      <Button onClick={handleSave} loading={loading} className="px-8 gap-2">
                        <Save className="w-4 h-4" /> Apply Changes
                      </Button>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === "security" && (
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <div className="flex items-start justify-between p-6 rounded-3xl bg-surface border border-border group hover:border-accent/30 transition-all">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                            <Lock className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-text mb-1">Two-Factor Authentication</h4>
                            <p className="text-xs text-muted leading-relaxed">Add an extra layer of security to your account by requiring a code from your device.</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 rounded-xl border border-accent text-accent text-xs font-bold hover:bg-accent hover:text-white transition-all">
                          Enable 2FA
                        </button>
                      </div>

                      <div className="flex items-start justify-between p-6 rounded-3xl bg-surface border border-border group hover:border-accent/30 transition-all">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                            <Key className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-text mb-1">API Access Tokens</h4>
                            <p className="text-xs text-muted leading-relaxed">Generate tokens to access our API securely from external applications or CLI tools.</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 rounded-xl border border-border text-muted text-xs font-bold hover:border-accent hover:text-accent transition-all">
                          Manage Tokens
                        </button>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-border/50">
                      <h4 className="text-sm font-black uppercase tracking-widest text-red-custom mb-6 flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Danger Zone
                      </h4>
                      <div className="p-6 rounded-3xl border border-red-custom/20 bg-red-custom/5 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-text mb-1">Deactivate Account</p>
                          <p className="text-xs text-muted italic">This will permanently delete all your data and access.</p>
                        </div>
                        <button 
                          onClick={() => {
                            if (isDemoMode) {
                              toast("Sign in to manage real accounts!", { icon: "🔒" });
                              setShowAuthModal(true);
                              return;
                            }
                            toast.error("Danger: Real account deletion is disabled in this environment.");
                          }}
                          className="px-6 py-2.5 rounded-xl bg-red-custom text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-red-custom/20 hover:scale-105 transition-all"
                        >
                          {isDemoMode ? "Lock" : "Delete Permanently"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeTab === "notifications" && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      {[
                        { id: 'push', title: "Push Notifications", desc: "Receive alerts directly on your browser or device." },
                        { id: 'email', title: "Email Reports", desc: "Digest of weekly activity and project performance." },
                        { id: 'urgent', title: "Urgent Alerts", desc: "Notification for high priority tickets and server events." },
                        { id: 'marketing', title: "Marketing Updates", desc: "Stay informed about new features and updates." }
                      ].map((item) => {
                        const isEnabled = (notificationSettings as any)[item.id];
                        return (
                          <div 
                            key={item.id} 
                            onClick={() => toggleNotification(item.id as any)}
                            className="flex items-center justify-between p-5 rounded-2xl bg-surface/50 border border-border/50 cursor-pointer hover:border-accent/30 transition-all group"
                          >
                            <div>
                              <h4 className="font-bold text-text text-sm mb-1 group-hover:text-accent transition-colors">{item.title}</h4>
                              <p className="text-[11px] text-muted">{item.desc}</p>
                            </div>
                            <div className={cn(
                              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                              isEnabled ? "bg-accent" : "bg-border"
                            )}>
                              <div className={cn(
                                "h-4 w-4 transform rounded-full bg-white transition-transform",
                                isEnabled ? "translate-x-6" : "translate-x-1"
                              )} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="pt-6 border-t border-border/50 flex justify-end">
                      <Button onClick={handleSave} loading={loading} className="px-8 gap-2">
                        <Save className="w-4 h-4" /> Update Preferences
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Quick Helper Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="p-5 border-border/30 bg-surface/30">
                <Globe className="w-5 h-5 text-accent mb-4" />
                <h4 className="text-xs font-black uppercase tracking-widest text-text mb-2">Regional</h4>
                <p className="text-[10px] text-muted">Set your timezone, language and locale preferences.</p>
              </Card>
              <Card className="p-5 border-border/30 bg-surface/30">
                <Database className="w-5 h-5 text-accent mb-4" />
                <h4 className="text-xs font-black uppercase tracking-widest text-text mb-2">Backup</h4>
                <p className="text-[10px] text-muted">Export your personal data or download system snapshots.</p>
              </Card>
              <Card className="p-5 border-border/30 bg-surface/30">
                <Monitor className="w-5 h-5 text-accent mb-4" />
                <h4 className="text-xs font-black uppercase tracking-widest text-text mb-2">Sessions</h4>
                <p className="text-[10px] text-muted">View and manage all your active login sessions.</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
