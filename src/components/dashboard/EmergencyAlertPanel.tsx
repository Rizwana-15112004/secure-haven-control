import { useEmergencyAlerts, EmergencyAlert } from "@/contexts/EmergencyAlertContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, User, MapPin, Heart, FileText, CheckCheck, Trash2, Clock } from "lucide-react";

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function AlertCard({ alert, onAck, onClear }: { alert: EmergencyAlert; onAck: () => void; onClear: () => void }) {
  const isInjured = alert.injured.toLowerCase().includes('yes');
  return (
    <div className={`rounded-xl border p-4 space-y-3 transition-all ${alert.acknowledged ? 'border-border opacity-70 bg-muted/20' : 'border-destructive/60 bg-destructive/5 shadow-md shadow-destructive/10'}`}>
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {!alert.acknowledged && (
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
            </span>
          )}
          <span className="font-bold text-sm text-destructive uppercase tracking-wide">
            {alert.acknowledged ? 'Acknowledged' : '🚨 Staff Emergency'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatTime(alert.timestamp)}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground shrink-0" />
          <span><strong>Name:</strong> {alert.staffName}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
          <span><strong>Floor:</strong> {alert.floor}</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className={`h-4 w-4 shrink-0 ${isInjured ? 'text-destructive' : 'text-green-500'}`} />
          <span><strong>Injured:</strong>{" "}
            <Badge variant={isInjured ? "destructive" : "secondary"} className="text-[10px] py-0 px-1">
              {alert.injured}
            </Badge>
          </span>
        </div>
      </div>
      <div className="flex items-start gap-2 text-sm">
        <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <span><strong>Situation:</strong> {alert.details}</span>
      </div>

      {/* Actions */}
      {!alert.acknowledged && (
        <div className="flex gap-2 pt-1">
          <Button size="sm" className="flex-1 h-8 bg-green-600 hover:bg-green-700 text-white text-xs" onClick={onAck}>
            <CheckCheck className="h-3 w-3 mr-1" /> Acknowledge & Dispatch Help
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={onClear}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
      {alert.acknowledged && (
        <div className="flex justify-end">
          <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground" onClick={onClear}>
            <Trash2 className="h-3 w-3 mr-1" /> Remove
          </Button>
        </div>
      )}
    </div>
  );
}

export function EmergencyAlertPanel() {
  const { alerts, acknowledgeAlert, clearAlert, unreadCount } = useEmergencyAlerts();

  return (
    <Card className={`w-full border ${unreadCount > 0 ? 'border-destructive/40' : 'border-border'}`}>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className={`h-5 w-5 ${unreadCount > 0 ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
          Staff Emergency Alerts
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs px-1.5 py-0 ml-1">
              {unreadCount} new
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-30" />
            No emergency alerts received yet.
          </div>
        ) : (
          <ScrollArea className="max-h-[500px] pr-2">
            <div className="space-y-3">
              {alerts.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAck={() => acknowledgeAlert(alert.id)}
                  onClear={() => clearAlert(alert.id)}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
