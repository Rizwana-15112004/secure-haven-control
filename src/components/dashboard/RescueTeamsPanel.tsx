import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RescueTeam } from "@/types";
import { cn } from "@/lib/utils";
import { 
  Siren, 
  Phone, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Truck,
  Shield,
  Ambulance,
  Send
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RescueTeamsPanelProps {
  teams: RescueTeam[];
  onAlertTeam: (teamId: string) => void;
}

export function RescueTeamsPanel({ teams, onAlertTeam }: RescueTeamsPanelProps) {
  const getIcon = (type: RescueTeam['type']) => {
    switch (type) {
      case 'fire_dept': return Truck;
      case 'medical': return Ambulance;
      case 'police': return Shield;
      default: return Siren;
    }
  };

  const getStatusStyle = (status: RescueTeam['status']) => {
    switch (status) {
      case 'on_scene': return 'bg-safe/20 text-safe border-safe/50';
      case 'dispatched': return 'bg-info/20 text-info border-info/50';
      case 'alerted': return 'bg-warning/20 text-warning border-warning/50';
      default: return 'bg-secondary text-muted-foreground border-border';
    }
  };

  const getStatusText = (status: RescueTeam['status']) => {
    switch (status) {
      case 'on_scene': return 'On Scene';
      case 'dispatched': return 'En Route';
      case 'alerted': return 'Alerted';
      default: return 'Standby';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Siren className="w-5 h-5 text-danger" />
            Rescue Teams
          </CardTitle>
          <Button variant="emergency" size="sm" className="text-xs">
            <Send className="w-3 h-3 mr-1" />
            Alert All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {teams.map((team) => {
          const Icon = getIcon(team.type);
          return (
            <div
              key={team.id}
              className={cn(
                "p-3 rounded-lg border-2 transition-all",
                getStatusStyle(team.status)
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg bg-background/50",
                    team.status === 'on_scene' && "animate-pulse"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{team.name}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <Phone className="w-3 h-3" />
                      <span>{team.contactNumber}</span>
                    </div>
                    {team.notifiedAt && (
                      <p className="text-xs opacity-70 mt-1">
                        Notified {formatDistanceToNow(team.notifiedAt, { addSuffix: true })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-bold uppercase",
                    team.status === 'on_scene' ? "bg-safe/30" :
                    team.status === 'dispatched' ? "bg-info/30" :
                    team.status === 'alerted' ? "bg-warning/30" : "bg-muted"
                  )}>
                    {getStatusText(team.status)}
                  </span>
                  {team.eta && (
                    <p className="text-xs mt-2 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      ETA: {team.eta} min
                    </p>
                  )}
                </div>
              </div>
              
              {team.status === 'standby' && (
                <Button
                  variant="warning"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => onAlertTeam(team.id)}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Send Emergency Alert
                </Button>
              )}
            </div>
          );
        })}

        {/* Auto-Alert Notice */}
        <div className="p-3 rounded-lg bg-info/10 border border-info/30 text-xs">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-info">Auto-Alert Active</p>
              <p className="text-muted-foreground mt-1">
                Government rescue teams are automatically notified via GSM when disasters are detected.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
