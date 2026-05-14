import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils.ts";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-accent text-white hover:bg-accent-soft",
    secondary: "bg-surface text-text border border-border hover:border-border-hover",
    ghost: "bg-transparent text-muted hover:text-text hover:bg-surface",
    danger: "bg-red-custom/10 text-red-custom border border-red-custom/20 hover:bg-red-custom hover:text-white",
    outline: "bg-transparent border border-accent text-accent hover:bg-accent/5"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "p-2"
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };
