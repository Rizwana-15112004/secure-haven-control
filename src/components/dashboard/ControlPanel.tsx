import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ControlSystem } from "@/types";
import { cn } from "@/lib/utils";
import { 
  Settings, 
  Bell, 
  Droplets, 
  DoorOpen, 
  Fan, 
  Zap, 
  Lightbulb,
  AlertTriangle,
  Power,
  RefreshCw
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ControlPanelProps {
  controls: ControlSystem[];
  onControlToggle: (id: string, status: 'on' | 'off') => void;
}

export function ControlPanel({ controls, onControlToggle }: ControlPanelProps) {
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const getIcon = (type: ControlSystem['type']) => {
    switch (type) {
      case 'alarm': return Bell;
      case 'sprinkler': return Droplets;
      case 'door': return DoorOpen;
      case 'ventilation': return Fan;
      case 'power': return Zap;
      case 'light': return Lightbulb;
      default: return Settings;
    }
  };

  const getStatusColor = (status: ControlSystem['status']) => {
    switch (status) {
      case 'on': return 'text-safe';
      case 'off': return 'text-muted-foreground';
      case 'auto': return 'text-info';
      case 'fault': return 'text-danger';
      default: return 'text-muted-foreground';
    }
  };

  const handleToggle = (control: ControlSystem) => {
    if (control.type === 'alarm' || control.type === 'power') {
      setConfirmAction(control.id);
    } else {
      executeToggle(control);
    }
  };

  const executeToggle = (control: ControlSystem) => {
    const newStatus = control.status === 'on' ? 'off' : 'on';
    onControlToggle(control.id, newStatus);
    toast({
      title: `${control.name} ${newStatus === 'on' ? 'Activated' : 'Deactivated'}`,
      description: `System control updated successfully`,
    });
    setConfirmAction(null);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-info" />
            Building Controls
          </CardTitle>
          <Button variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Emergency Actions */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button variant="danger" className="h-auto py-3 flex-col gap-1">
            <Bell className="w-5 h-5" />
            <span className="text-xs">Full Alarm</span>
          </Button>
          <Button variant="safe" className="h-auto py-3 flex-col gap-1">
            <Droplets className="w-5 h-5" />
            <span className="text-xs">All Sprinklers</span>
          </Button>
        </div>

        {/* Control List */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {controls.map((control) => {
            const Icon = getIcon(control.type);
            const isConfirming = confirmAction === control.id;

            return (
              <div
                key={control.id}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all",
                  control.status === 'fault' 
                    ? "border-danger/50 bg-danger/5" 
                    : "border-border bg-secondary/30",
                  control.isManualOverride && "ring-2 ring-warning/30"
                )}
              >
                {isConfirming ? (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-warning flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Confirm {control.status === 'on' ? 'deactivate' : 'activate'}?
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => executeToggle(control)}
                      >
                        Yes
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setConfirmAction(null)}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        control.status === 'on' ? "bg-safe/20" : "bg-secondary"
                      )}>
                        <Icon className={cn("w-4 h-4", getStatusColor(control.status))} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{control.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>F{control.floor}</span>
                          <span>•</span>
                          <span>Zone {control.zone}</span>
                          {control.isManualOverride && (
                            <>
                              <span>•</span>
                              <span className="text-warning">Manual</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-xs font-medium uppercase",
                        getStatusColor(control.status)
                      )}>
                        {control.status}
                      </span>
                      {control.status !== 'fault' && (
                        <Switch
                          checked={control.status === 'on'}
                          onCheckedChange={() => handleToggle(control)}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Status Summary */}
        <div className="pt-3 border-t border-border grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <p className="text-lg font-bold text-safe">
              {controls.filter(c => c.status === 'on').length}
            </p>
            <p className="text-muted-foreground">Active</p>
          </div>
          <div>
            <p className="text-lg font-bold text-info">
              {controls.filter(c => c.status === 'auto').length}
            </p>
            <p className="text-muted-foreground">Auto</p>
          </div>
          <div>
            <p className="text-lg font-bold text-danger">
              {controls.filter(c => c.status === 'fault').length}
            </p>
            <p className="text-muted-foreground">Fault</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
