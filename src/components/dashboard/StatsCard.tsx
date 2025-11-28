import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: 'default' | 'danger' | 'warning' | 'safe' | 'info';
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  variant = 'default',
  subtitle,
  className 
}: StatsCardProps) {
  const variantStyles = {
    default: 'border-border',
    danger: 'border-danger/50 bg-danger/5',
    warning: 'border-warning/50 bg-warning/5',
    safe: 'border-safe/50 bg-safe/5',
    info: 'border-info/50 bg-info/5',
  };

  const iconStyles = {
    default: 'text-muted-foreground',
    danger: 'text-danger',
    warning: 'text-warning',
    safe: 'text-safe',
    info: 'text-info',
  };

  const valueStyles = {
    default: 'text-foreground',
    danger: 'text-danger',
    warning: 'text-warning',
    safe: 'text-safe',
    info: 'text-info',
  };

  return (
    <Card className={cn(
      "p-4 md:p-6 border-2 transition-all duration-300 hover:scale-[1.02]",
      variantStyles[variant],
      variant === 'danger' && 'pulse-danger',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <p className={cn(
            "text-2xl md:text-4xl font-display font-bold tracking-tight animate-count-up",
            valueStyles[variant]
          )}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn(
          "p-2 md:p-3 rounded-lg bg-secondary/50",
          variant === 'danger' && 'animate-pulse'
        )}>
          <Icon className={cn("w-5 h-5 md:w-6 md:h-6", iconStyles[variant])} />
        </div>
      </div>
    </Card>
  );
}
