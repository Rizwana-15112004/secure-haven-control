import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { EmergencySupply } from "@/types";
import { 
  Package, 
  Droplet, 
  Utensils, 
  Pill, 
  Flashlight,
  Battery,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SuppliesPanelProps {
  supplies: EmergencySupply[];
}

export function SuppliesPanel({ supplies }: SuppliesPanelProps) {
  const getIcon = (type: EmergencySupply['type']) => {
    switch (type) {
      case 'food': return Utensils;
      case 'water': return Droplet;
      case 'medical': return Pill;
      case 'blankets': return Package;
      case 'flashlights': return Flashlight;
      case 'batteries': return Battery;
      default: return Package;
    }
  };

  const getStatusColor = (daysRemaining: number, usedPercent: number) => {
    if (daysRemaining <= 2 || usedPercent >= 80) return 'danger';
    if (daysRemaining <= 5 || usedPercent >= 60) return 'warning';
    return 'safe';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5 text-info" />
          Emergency Supplies (10-Day Reserve)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {supplies.map((supply) => {
          const Icon = getIcon(supply.type);
          const usedPercent = Math.round((supply.usedUnits / supply.totalUnits) * 100);
          const remainingUnits = supply.totalUnits - supply.usedUnits;
          const status = getStatusColor(supply.daysRemaining, usedPercent);

          return (
            <div 
              key={supply.id}
              className={cn(
                "p-3 rounded-lg border-2 transition-all",
                status === 'danger' ? 'bg-danger/10 border-danger/50' :
                status === 'warning' ? 'bg-warning/10 border-warning/50' :
                'bg-secondary border-border'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-1.5 rounded",
                    status === 'danger' ? 'bg-danger/20' :
                    status === 'warning' ? 'bg-warning/20' : 'bg-info/20'
                  )}>
                    <Icon className={cn(
                      "w-4 h-4",
                      status === 'danger' ? 'text-danger' :
                      status === 'warning' ? 'text-warning' : 'text-info'
                    )} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{supply.name}</h4>
                    <p className="text-xs text-muted-foreground">{supply.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {status === 'danger' ? (
                      <AlertTriangle className="w-3 h-3 text-danger" />
                    ) : status === 'warning' ? (
                      <AlertTriangle className="w-3 h-3 text-warning" />
                    ) : (
                      <CheckCircle className="w-3 h-3 text-safe" />
                    )}
                    <span className={cn(
                      "text-sm font-bold",
                      status === 'danger' ? 'text-danger' :
                      status === 'warning' ? 'text-warning' : 'text-safe'
                    )}>
                      {supply.daysRemaining} days
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    Available: <span className="font-medium text-foreground">{remainingUnits} {supply.unit}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Used: {usedPercent}%
                  </span>
                </div>
                <Progress 
                  value={usedPercent} 
                  className="h-2"
                  variant={status}
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Total: {supply.totalUnits} {supply.unit}</span>
                  <span>Restocked: {formatDistanceToNow(supply.lastRestocked, { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Summary */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Supply Status for Stuck People</span>
            <div className="flex gap-2">
              <span className="text-safe">● Sufficient</span>
              <span className="text-warning">● Low</span>
              <span className="text-danger">● Critical</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
