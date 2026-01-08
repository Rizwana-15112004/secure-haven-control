import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BuildingZone, SensorData } from "@/types";
import { cn } from "@/lib/utils";
import { 
  Activity, 
  Thermometer, 
  Wind, 
  Flame, 
  Waves,
  AlertTriangle
} from "lucide-react";

interface SensorMonitorProps {
  zones: BuildingZone[];
}

export function SensorMonitor({ zones }: SensorMonitorProps) {
  const allSensors = zones.flatMap(z => 
    z.sensors.map(s => ({ ...s, zoneName: z.name, floor: z.floor }))
  );

  const criticalSensors = allSensors.filter(s => s.status === 'critical' || s.status === 'danger');
  const warningSensors = allSensors.filter(s => s.status === 'warning');

  const getSensorIcon = (type: SensorData['type']) => {
    switch (type) {
      case 'smoke': return Flame;
      case 'temperature': return Thermometer;
      case 'gas': return Wind;
      case 'vibration': return Activity;
      case 'water': return Waves;
      default: return Activity;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-info" />
            Sensor Monitor
          </CardTitle>
          <div className="flex gap-2 text-xs">
            {criticalSensors.length > 0 && (
              <span className="px-2 py-1 bg-danger/20 text-danger rounded-full animate-pulse">
                {criticalSensors.length} Critical
              </span>
            )}
            {warningSensors.length > 0 && (
              <span className="px-2 py-1 bg-warning/20 text-warning rounded-full">
                {warningSensors.length} Warning
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {/* Critical Sensors First */}
          {[...criticalSensors, ...warningSensors].map((sensor) => {
            const Icon = getSensorIcon(sensor.type);
            const percent = Math.min((sensor.value / sensor.threshold) * 100, 150);
            const isCritical = sensor.status === 'critical' || sensor.status === 'danger';

            return (
              <div
                key={sensor.id}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all",
                  isCritical 
                    ? "border-danger/50 bg-danger/10 pulse-danger" 
                    : "border-warning/50 bg-warning/10"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={cn(
                      "w-4 h-4",
                      isCritical ? "text-danger" : "text-warning"
                    )} />
                    <span className="text-sm font-medium capitalize">{sensor.type}</span>
                    <span className="text-xs text-muted-foreground">
                      F{sensor.floor}
                    </span>
                  </div>
                  <AlertTriangle className={cn(
                    "w-4 h-4",
                    isCritical ? "text-danger animate-pulse" : "text-warning"
                  )} />
                </div>
                <div className="flex items-end justify-between">
                  <div className={cn(
                    "text-xl font-display font-bold",
                    isCritical ? "text-danger" : "text-warning"
                  )}>
                    {sensor.value.toFixed(1)}
                    <span className="text-xs ml-1 text-muted-foreground">{sensor.unit}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    / {sensor.threshold} {sensor.unit}
                  </span>
                </div>
                {/* Mini progress bar */}
                <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all",
                      isCritical ? "bg-danger" : "bg-warning"
                    )}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}

          {criticalSensors.length === 0 && warningSensors.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-8 h-8 mx-auto mb-2 text-safe" />
              <p className="text-sm">All sensors normal</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
