import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CircuitSystem } from "@/types";
import { 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Wrench,
  ThermometerSun,
  Activity,
  XCircle,
  Lightbulb
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface CircuitPredictionPanelProps {
  circuits: CircuitSystem[];
  onRepairCircuit?: (id: string) => void;
}

export function CircuitPredictionPanel({ circuits, onRepairCircuit }: CircuitPredictionPanelProps) {
  const getStatusIcon = (status: CircuitSystem['status']) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      case 'failed': return XCircle;
    }
  };

  const getStatusColor = (status: CircuitSystem['status']) => {
    switch (status) {
      case 'healthy': return 'text-safe';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-danger';
      case 'failed': return 'text-critical';
    }
  };

  const handleRepair = (circuit: CircuitSystem) => {
    if (onRepairCircuit) {
      onRepairCircuit(circuit.id);
    }
    toast({
      title: "Repair Initiated",
      description: `Maintenance team notified for ${circuit.name}`,
    });
  };

  // Sort by failure risk
  const sortedCircuits = [...circuits].sort((a, b) => b.failureRisk - a.failureRisk);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-warning" />
          Circuit Failure Prediction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedCircuits.map((circuit) => {
          const StatusIcon = getStatusIcon(circuit.status);
          const loadPercent = Math.round((circuit.load / circuit.maxLoad) * 100);

          return (
            <div 
              key={circuit.id}
              className={cn(
                "p-3 rounded-lg border-2 transition-all",
                circuit.status === 'failed' ? 'bg-critical/10 border-critical/50 animate-pulse' :
                circuit.status === 'critical' ? 'bg-danger/10 border-danger/50' :
                circuit.status === 'warning' ? 'bg-warning/10 border-warning/50' :
                'bg-secondary border-border'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StatusIcon className={cn("w-5 h-5", getStatusColor(circuit.status))} />
                  <div>
                    <h4 className="font-medium text-sm">{circuit.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      Floor {circuit.floor} • Zone {circuit.zone}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "text-xs font-bold uppercase px-2 py-0.5 rounded",
                    circuit.status === 'failed' ? 'bg-critical/20 text-critical' :
                    circuit.status === 'critical' ? 'bg-danger/20 text-danger' :
                    circuit.status === 'warning' ? 'bg-warning/20 text-warning' :
                    'bg-safe/20 text-safe'
                  )}>
                    {circuit.status}
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-muted-foreground" />
                  <span>Load: <span className={cn(
                    "font-medium",
                    loadPercent >= 90 ? 'text-danger' : loadPercent >= 70 ? 'text-warning' : 'text-safe'
                  )}>{loadPercent}%</span></span>
                </div>
                <div className="flex items-center gap-1">
                  <ThermometerSun className="w-3 h-3 text-muted-foreground" />
                  <span>Temp: <span className={cn(
                    "font-medium",
                    circuit.temperature >= 70 ? 'text-danger' : circuit.temperature >= 50 ? 'text-warning' : 'text-foreground'
                  )}>{circuit.temperature}°C</span></span>
                </div>
                <div className="flex items-center gap-1">
                  <Wrench className="w-3 h-3 text-muted-foreground" />
                  <span className="truncate">Last: {formatDistanceToNow(circuit.lastMaintenance, { addSuffix: true })}</span>
                </div>
              </div>

              {/* Failure Risk */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Failure Risk</span>
                  <span className={cn(
                    "font-bold",
                    circuit.failureRisk >= 70 ? 'text-danger' : 
                    circuit.failureRisk >= 40 ? 'text-warning' : 'text-safe'
                  )}>
                    {circuit.failureRisk}%
                  </span>
                </div>
                <Progress 
                  value={circuit.failureRisk} 
                  className="h-1.5"
                  variant={circuit.failureRisk >= 70 ? 'danger' : circuit.failureRisk >= 40 ? 'warning' : 'safe'}
                />
              </div>

              {/* Predicted Failure & Solution */}
              {circuit.predictedFailure && (
                <div className="mt-2 p-2 bg-warning/10 rounded border border-warning/30">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-warning">Predicted Failure</p>
                      {circuit.solution && (
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="font-medium text-foreground">Solution:</span> {circuit.solution}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {(circuit.status === 'warning' || circuit.status === 'critical' || circuit.status === 'failed') && (
                <Button
                  size="sm"
                  variant={circuit.status === 'failed' ? 'danger' : 'warning'}
                  className="w-full mt-2"
                  onClick={() => handleRepair(circuit)}
                >
                  <Wrench className="w-3 h-3 mr-1" />
                  {circuit.status === 'failed' ? 'Emergency Repair' : 'Schedule Maintenance'}
                </Button>
              )}
            </div>
          );
        })}

        {/* Summary */}
        <div className="pt-2 border-t border-border">
          <div className="grid grid-cols-4 gap-2 text-xs text-center">
            <div>
              <p className="text-safe font-bold">{circuits.filter(c => c.status === 'healthy').length}</p>
              <p className="text-muted-foreground">Healthy</p>
            </div>
            <div>
              <p className="text-warning font-bold">{circuits.filter(c => c.status === 'warning').length}</p>
              <p className="text-muted-foreground">Warning</p>
            </div>
            <div>
              <p className="text-danger font-bold">{circuits.filter(c => c.status === 'critical').length}</p>
              <p className="text-muted-foreground">Critical</p>
            </div>
            <div>
              <p className="text-critical font-bold">{circuits.filter(c => c.status === 'failed').length}</p>
              <p className="text-muted-foreground">Failed</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
