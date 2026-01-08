import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmergencyStats } from "@/types";
import { cn } from "@/lib/utils";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Heart, 
  Skull,
  ArrowRight,
  TrendingUp
} from "lucide-react";

interface EvacuationProgressProps {
  stats: EmergencyStats;
}

export function EvacuationProgress({ stats }: EvacuationProgressProps) {
  const evacuationPercent = Math.round((stats.safeOccupants + stats.rescuedOccupants) / stats.totalOccupants * 100);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-info" />
          Evacuation Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall Progress</span>
            <span className={cn(
              "text-2xl font-display font-bold",
              evacuationPercent >= 80 ? "text-safe" :
              evacuationPercent >= 50 ? "text-warning" : "text-danger"
            )}>
              {evacuationPercent}%
            </span>
          </div>
          <Progress 
            value={evacuationPercent} 
            className="h-3"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatBox
            icon={Users}
            label="Total Inside"
            value={stats.totalOccupants}
            variant="info"
          />
          <StatBox
            icon={UserCheck}
            label="Safe/Evacuated"
            value={stats.safeOccupants + stats.rescuedOccupants}
            variant="safe"
          />
          <StatBox
            icon={UserX}
            label="Still Stuck"
            value={stats.stuckOccupants}
            variant="danger"
          />
          <StatBox
            icon={Heart}
            label="Injured"
            value={stats.injuredOccupants}
            variant="warning"
          />
        </div>

        {/* Flow Visualization */}
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
          <div className="text-center">
            <p className="text-lg font-bold text-info">{stats.totalOccupants}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
          <div className="text-center">
            <p className="text-lg font-bold text-warning">{stats.stuckOccupants}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
          <div className="text-center">
            <p className="text-lg font-bold text-safe">{stats.safeOccupants + stats.rescuedOccupants}</p>
            <p className="text-xs text-muted-foreground">Safe</p>
          </div>
        </div>

        {/* Casualty Notice */}
        {stats.casualtyCount > 0 ? (
          <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Skull className="w-4 h-4 text-danger" />
              <span className="text-sm font-medium text-danger">
                Casualties: {stats.casualtyCount}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-safe/10 border border-safe/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-safe" />
              <span className="text-sm font-medium text-safe">
                No casualties reported
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatBoxProps {
  icon: React.ElementType;
  label: string;
  value: number;
  variant: 'info' | 'safe' | 'warning' | 'danger';
}

function StatBox({ icon: Icon, label, value, variant }: StatBoxProps) {
  const styles = {
    info: 'border-info/30 bg-info/5',
    safe: 'border-safe/30 bg-safe/5',
    warning: 'border-warning/30 bg-warning/5',
    danger: 'border-danger/30 bg-danger/5',
  };

  const textStyles = {
    info: 'text-info',
    safe: 'text-safe',
    warning: 'text-warning',
    danger: 'text-danger',
  };

  return (
    <div className={cn(
      "p-3 rounded-lg border-2",
      styles[variant],
      variant === 'danger' && value > 0 && 'animate-pulse'
    )}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={cn("w-4 h-4", textStyles[variant])} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={cn("text-xl font-display font-bold", textStyles[variant])}>
        {value}
      </p>
    </div>
  );
}
