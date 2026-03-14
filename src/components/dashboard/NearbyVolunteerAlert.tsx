import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Users,
  MapPin,
  Megaphone,
  AlertTriangle,
  Wifi,
  WifiOff,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useVolunteerAlert } from "@/hooks/useVolunteerAlert";

const BUILDING_ADDRESS = "MES Rd, Aramanakkunnu, Edathala, Aluva, Kerala 683112";
const CONTACT_NUMBER = "+91 98765 43210";
const BUILDING_COORDS = "10.1768° N, 76.3485° E";
const BUILDING_LAT = 10.1768;
const BUILDING_LON = 76.3485;

export function NearbyVolunteerAlert() {
  const { connected, deviceCount, sendAlert } = useVolunteerAlert();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSend = () => {
    if (!connected) {
      toast({
        title: "⚠️ Alert Server Not Running",
        description: "Start alert-server.cjs first: node alert-server.cjs",
        variant: "destructive",
      });
      return;
    }

    sendAlert({
      title: "People TRAPPED — Volunteer Help Needed Immediately!",
      address: BUILDING_ADDRESS,
      coords: BUILDING_COORDS,
      contact: CONTACT_NUMBER,
      message: "A disaster has occurred in the building next to you. People are trapped and need your help. Please proceed to the location RIGHT NOW. Every second counts!",
      adminLat: BUILDING_LAT,
      adminLon: BUILDING_LON,
    });

    setConfirmOpen(false);

    toast({
      title: `🚨 SOS Broadcast Sent!`,
      description: "Phones within 5m radius will receive the emergency popup.",
      variant: "destructive",
    });
  };

  return (
    <>
      {/* Status indicator */}
      <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full w-fit border ${
        connected 
          ? 'bg-green-500/10 border-green-500/30 text-green-600' 
          : 'bg-muted border-border text-muted-foreground'
      }`}>
        {connected 
          ? <><Wifi className="h-3 w-3" /> Alert network live — {deviceCount} device{deviceCount !== 1 ? 's' : ''} connected</>
          : <><WifiOff className="h-3 w-3" /> Alert server offline (run node alert-server.cjs)</>
        }
      </div>

      {/* Main trigger button */}
      <Button
        onClick={() => setConfirmOpen(true)}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-auto py-4 flex-col gap-1.5 shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-95"
      >
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 animate-pulse" />
          <span className="text-base">🚨 Send Alert to Nearby Volunteers</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-normal opacity-80">Broadcasts to ALL connected devices instantly</span>
          {connected && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-white/20 text-white border-0">
              {deviceCount} online
            </Badge>
          )}
        </div>
      </Button>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-500">
              <Megaphone className="h-5 w-5" />
              Send Volunteer Alert
            </DialogTitle>
            <DialogDescription>
              This will instantly push an emergency popup to <strong>all {deviceCount} connected device{deviceCount !== 1 ? 's' : ''}</strong> on the network.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-1">
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl text-sm space-y-1">
              <p className="font-semibold text-orange-500">📣 Alert Preview:</p>
              <p className="text-muted-foreground text-xs">
                "🚨 People TRAPPED — Volunteer Help Needed Immediately!"
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-orange-400 shrink-0" />
              <span className="text-muted-foreground text-xs">{BUILDING_ADDRESS}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-orange-400 shrink-0" />
              <span className="text-muted-foreground text-xs">
                <strong>{deviceCount} phone{deviceCount !== 1 ? 's' : ''}</strong> will receive this alert RIGHT NOW
              </span>
            </div>
            {!connected && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-destructive">Alert server is offline. Start it first:<br/>
                  <code className="font-mono bg-black/20 px-1 rounded">node alert-server.cjs</code>
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button
              className={`flex-1 font-bold ${connected ? 'bg-orange-600 hover:bg-orange-700' : 'bg-muted text-muted-foreground'} text-white`}
              onClick={handleSend}
            >
              <Megaphone className="h-4 w-4 mr-2" />
              {connected ? `Alert ${deviceCount} Device${deviceCount !== 1 ? 's' : ''}` : 'Server Offline'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
