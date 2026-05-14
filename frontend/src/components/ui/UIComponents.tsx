import { HTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, LabelHTMLAttributes } from "react";
import { cn } from "../../lib/utils.ts";

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("bg-surface/5 border border-border/20 rounded-xl overflow-hidden backdrop-blur-2xl transition-all duration-300", className)} {...props} />
);

export const Badge = ({ className, variant = 'neutral', ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: string }) => {
  const variants: Record<string, string> = {
    active: "bg-green-custom/10 text-green-custom border-green-custom/20",
    inactive: "bg-muted/10 text-muted border-border",
    open: "bg-blue-custom/10 text-blue-custom border-blue-custom/20",
    in_progress: "bg-amber-custom/10 text-amber-custom border-amber-custom/20",
    resolved: "bg-green-custom/10 text-green-custom border-green-custom/20",
    closed: "bg-muted/20 text-muted border-border",
    pending: "bg-amber-custom/10 text-amber-custom border-amber-custom/20",
    scheduled: "bg-blue-custom/10 text-blue-custom border-blue-custom/20",
    completed: "bg-green-custom/10 text-green-custom border-green-custom/20",
    cancelled: "bg-red-custom/10 text-red-custom border-red-custom/20",
    neutral: "bg-muted/10 text-muted border-border"
  };

  return (
    <span 
      className={cn(
        "px-2.5 py-1 text-[10px] uppercase tracking-widest font-mono font-bold border rounded-lg",
        variants[variant.toLowerCase()] || variants.neutral,
        className
      )} 
      {...props} 
    />
  );
};

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    className={cn(
      "w-full bg-surface/10 border border-border/20 rounded-lg px-3 py-2 text-xs text-text placeholder:text-muted/40 focus:outline-none focus:border-accent/40 transition-all font-mono",
      className
    )} 
    {...props} 
  />
);

export const Textarea = ({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea 
    className={cn(
      "w-full bg-surface border border-border rounded px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all min-h-[100px]",
      className
    )} 
    {...props} 
  />
);

export const Label = ({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn("text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block font-mono", className)} {...props} />
);

export const Button = ({ className, variant = 'primary', loading = false, children, ...props }: HTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost', loading?: boolean, type?: "button" | "submit" | "reset" }) => {
  const variants = {
    primary: "bg-accent text-white hover:bg-accent/90 shadow-sm transition-colors",
    secondary: "bg-surface border border-border text-text hover:bg-border-hover transition-colors",
    outline: "bg-transparent border border-accent text-accent hover:bg-accent/5 transition-colors",
    ghost: "bg-transparent text-muted hover:text-text hover:bg-surface transition-colors"
  };

  return (
    <button
      className={cn(
        "px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2.5 active:scale-[0.96] transition-all",
        variants[variant],
        loading && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={loading}
      {...(props as any)}
    >
      {loading ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
      {children}
    </button>
  );
};

export const StatCard = ({ label, value, trend, icon: Icon, className }: { label: string, value: string | number, trend?: { value: string, positive: boolean }, icon?: any, className?: string }) => (
  <Card className={cn("p-4 flex flex-col justify-between h-28", className)}>
    <div className="flex justify-between items-start">
      <span className="text-[10px] font-black text-muted uppercase tracking-[0.12em]">{label}</span>
      <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
        {Icon && <Icon className="w-3.5 h-3.5 text-accent" />}
      </div>
    </div>
    <div className="mt-2">
      <h3 className="text-2xl font-black tracking-tighter text-text">{value}</h3>
      {trend && (
        <div className="flex items-center gap-2 mt-1">
          <span className={cn("text-[9px] font-bold px-1.2 py-0.3 rounded-md", trend.positive ? "bg-green-custom/10 text-green-custom" : "bg-red-custom/10 text-red-custom")}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
          <span className="text-[8px] font-bold text-muted uppercase tracking-tight opacity-50">vs cycle</span>
        </div>
      )}
    </div>
  </Card>
);
