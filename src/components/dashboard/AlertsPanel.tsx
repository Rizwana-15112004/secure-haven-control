import { Alert } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Flame, Wind, Building2, Check, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
}

export function AlertsPanel({ alerts, onAcknowledge }: AlertsPanelProps) {
  const getIcon = (type: Alert['type']) => {
    switch (type) {
      case 'fire': return Flame;
      case 'gas': return Wind;
      case 'structural': return Building2;
      default: return AlertTriangle;
    }
  };

  const getLevelStyles = (level: Alert['level']) => {
    switch (level) {
      case 'critical': return 'border-danger bg-danger/10 text-danger';
      case 'danger': return 'border-danger/70 bg-danger/5 text-danger';
      case 'warning': return 'border-warning bg-warning/10 text-warning';
      default: return 'border-safe bg-safe/5 text-safe';
    }
  };

  const activeAlerts = alerts.filter(a => a.isActive);

  return (
    <Card variant={activeAlerts.length > 0 ? 'danger' : 'default'} className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className={cn(
              "w-5 h-5",
              activeAlerts.length > 0 && "text-danger animate-pulse"
            )} />
            Active Alerts
          </CardTitle>
          <span className={cn(
            "px-3 py-1 rounded-full text-sm font-bold",
            activeAlerts.length > 0 
              ? "bg-danger/20 text-danger animate-pulse" 
              : "bg-safe/20 text-safe"
          )}>
            {activeAlerts.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
        {activeAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Check className="w-12 h-12 mx-auto mb-2 text-safe" />
            <p className="font-medium">All Clear</p>
            <p className="text-sm">No active alerts</p>
          </div>
        ) : (
          activeAlerts.map((alert) => {
            const Icon = getIcon(alert.type);
            return (
              <div
                key={alert.id}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all",
                  getLevelStyles(alert.level),
                  alert.level === 'critical' && 'pulse-danger'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-full",
                    alert.level === 'critical' ? 'bg-danger/20' : 'bg-warning/20'
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {alert.type}
                      </span>
                      <span className="text-xs opacity-70">
                        Floor {alert.floor} • Zone {alert.zone}
                      </span>
                    </div>
                    <p className="text-sm font-medium leading-tight mb-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs opacity-70">
                        {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                      </span>
                      {!alert.acknowledged && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onAcknowledge(alert.id)}
                          className="h-7 text-xs"
                        >
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
