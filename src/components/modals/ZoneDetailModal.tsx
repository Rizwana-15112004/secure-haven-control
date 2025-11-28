import { BuildingZone, SensorData } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { 
  Layers, 
  Users, 
  Thermometer, 
  Wind, 
  Flame,
  Activity,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface ZoneDetailModalProps {
  zone: BuildingZone | null;
  open: boolean;
  onClose: () => void;
}

export function ZoneDetailModal({ zone, open, onClose }: ZoneDetailModalProps) {
  if (!zone) return null;

  const getSensorIcon = (type: SensorData['type']) => {
    switch (type) {
      case 'smoke': return Flame;
      case 'temperature': return Thermometer;
      case 'gas': return Wind;
      case 'vibration': return Activity;
      default: return Activity;
    }
  };

  const getSensorStatus = (sensor: SensorData) => {
    const percent = (sensor.value / sensor.threshold) * 100;
    if (percent >= 100) return { color: 'text-danger', bg: 'bg-danger/20', label: 'CRITICAL' };
    if (percent >= 70) return { color: 'text-warning', bg: 'bg-warning/20', label: 'WARNING' };
    return { color: 'text-safe', bg: 'bg-safe/20', label: 'NORMAL' };
  };

  const zoneStatusColor = {
    critical: 'text-danger bg-danger/20 border-danger',
    danger: 'text-danger bg-danger/10 border-danger/50',
    warning: 'text-warning bg-warning/10 border-warning/50',
    safe: 'text-safe bg-safe/10 border-safe/50',
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full border-2",
              zoneStatusColor[zone.status]
            )}>
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display">{zone.name}</span>
              <p className="text-xs text-muted-foreground font-body">
                Zone ID: {zone.id}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Zone Status Overview */}
          <div className="grid grid-cols-3 gap-3">
            <div className={cn(
              "p-3 rounded-lg border-2 text-center",
              zoneStatusColor[zone.status]
            )}>
              <p className="text-xs uppercase tracking-wider opacity-70">Status</p>
              <p className="text-lg font-display font-bold uppercase">{zone.status}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary text-center">
              <p className="text-xs text-muted-foreground uppercase">Occupants</p>
              <div className="flex items-center justify-center gap-1">
                <Users className="w-4 h-4 text-info" />
                <span className="text-lg font-display font-bold text-info">
                  {zone.occupantCount}
                </span>
              </div>
            </div>
            <div className={cn(
              "p-3 rounded-lg text-center border-2",
              zone.evacPath === 'safe' ? 'border-safe/50 bg-safe/10' :
              zone.evacPath === 'blocked' ? 'border-warning/50 bg-warning/10' :
              'border-danger/50 bg-danger/10'
            )}>
              <p className="text-xs uppercase tracking-wider opacity-70">Evac Path</p>
              <p className={cn(
                "text-sm font-bold uppercase",
                zone.evacPath === 'safe' ? 'text-safe' :
                zone.evacPath === 'blocked' ? 'text-warning' : 'text-danger'
              )}>
                {zone.evacPath}
              </p>
            </div>
          </div>

          {/* Sensors */}
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-info" />
              Sensor Readings
            </h3>
            <div className="space-y-2">
              {zone.sensors.map((sensor) => {
                const Icon = getSensorIcon(sensor.type);
                const status = getSensorStatus(sensor);
                const percent = Math.min((sensor.value / sensor.threshold) * 100, 100);

                return (
                  <div 
                    key={sensor.id}
                    className={cn(
                      "p-3 rounded-lg border-2",
                      status.bg,
                      sensor.status === 'critical' && 'animate-pulse'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={cn("w-4 h-4", status.color)} />
                        <span className="text-sm font-medium capitalize">{sensor.type}</span>
                      </div>
                      <span className={cn("text-xs font-bold", status.color)}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className={cn("text-2xl font-display font-bold", status.color)}>
                          {sensor.value.toFixed(1)}
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">
                          {sensor.unit}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Threshold: {sensor.threshold} {sensor.unit}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all",
                          percent >= 100 ? 'bg-danger' :
                          percent >= 70 ? 'bg-warning' : 'bg-safe'
                        )}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alert Notice */}
          {zone.status !== 'safe' && (
            <div className={cn(
              "p-3 rounded-lg border flex items-start gap-2",
              zone.status === 'critical' ? 'bg-danger/10 border-danger/50' : 'bg-warning/10 border-warning/50'
            )}>
              <AlertTriangle className={cn(
                "w-5 h-5 flex-shrink-0",
                zone.status === 'critical' ? 'text-danger' : 'text-warning'
              )} />
              <div>
                <p className={cn(
                  "text-sm font-medium",
                  zone.status === 'critical' ? 'text-danger' : 'text-warning'
                )}>
                  {zone.status === 'critical' ? 'Critical Alert' : 'Warning Alert'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This zone has elevated sensor readings. Evacuation {zone.evacPath === 'danger' ? 'is dangerous' : zone.evacPath === 'blocked' ? 'path is blocked' : 'recommended'}.
                </p>
              </div>
            </div>
          )}

          {zone.status === 'safe' && (
            <div className="p-3 rounded-lg border bg-safe/10 border-safe/50 flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-safe flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-safe">Zone Clear</p>
                <p className="text-xs text-muted-foreground mt-1">
                  All sensors within normal parameters. Evacuation path is clear.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
