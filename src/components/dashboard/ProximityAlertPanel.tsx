import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Send, Megaphone, ShieldCheck } from "lucide-react";
import { useVolunteerAlert } from "@/hooks/useVolunteerAlert";
import { toast } from "@/hooks/use-toast";

export function ProximityAlertPanel() {
  const { broadcastProximity, connected } = useVolunteerAlert();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    title: "Structural Instability Detected",
    location: "Block A - North Wing",
    message: "Immediate evacuation ordered for all nearby residents. Emergency responders are en route. Please follow marked evacuation routes.",
    motivation: "Your quick action saves lives. Every second counts in a crisis. Stay calm, stay focused, and help those around you reach safety."
  });

  const handleBroadcast = async () => {
    if (!connected) {
      toast({ 
        title: "Connection Error", 
        description: "Not connected to the alert server. Please check your connection.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await broadcastProximity({
        type: 'RADIUS_EMERGENCY',
        ...details,
        radius: 2000, // 2km
        timestamp: new Date().toISOString()
      });
      
      toast({ 
        title: "Broadcast Successful", 
        description: "Emergency alert sent to all people within 2km radius.",
      });
    } catch (error) {
      toast({ 
        title: "Broadcast Failed", 
        description: "Failed to send the broadcast. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-danger/30 bg-danger/5 shadow-lg shadow-danger/5">
      <CardHeader className="pb-3 border-b border-danger/10">
        <CardTitle className="text-lg flex items-center gap-2 text-danger">
          <Megaphone className="h-5 w-5" />
          Nearby People Broadcast (2km)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="h-3 w-3" /> Incident Title
          </label>
          <Input 
            value={details.title}
            onChange={e => setDetails(prev => ({ ...prev, title: e.target.value }))}
            className="bg-background/50 border-danger/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
            <MapPin className="h-3 w-3" /> Affected Zone
          </label>
          <Input 
            value={details.location}
            onChange={e => setDetails(prev => ({ ...prev, location: e.target.value }))}
            className="bg-background/50 border-danger/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground">Emergency Instructions</label>
          <Textarea 
            value={details.message}
            onChange={e => setDetails(prev => ({ ...prev, message: e.target.value }))}
            className="bg-background/50 border-danger/20 min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground">Motivational Message</label>
          <Textarea 
            value={details.motivation}
            onChange={e => setDetails(prev => ({ ...prev, motivation: e.target.value }))}
            className="bg-background/50 border-danger/20 text-xs italic"
          />
        </div>

        <Button 
          onClick={handleBroadcast} 
          disabled={loading}
          className="w-full bg-danger hover:bg-danger/90 text-white font-bold h-12 shadow-xl shadow-danger/20 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
          ) : (
            <>
              <Send className="h-5 w-5" />
              BROADCAST TO 2KM RADIUS
            </>
          )}
        </Button>
        <p className="text-[10px] text-center text-muted-foreground font-medium italic">
          * This will immediately notify all active SDRRS users within 2km via high-priority push and vibration.
        </p>
      </CardContent>
    </Card>
  );
}
