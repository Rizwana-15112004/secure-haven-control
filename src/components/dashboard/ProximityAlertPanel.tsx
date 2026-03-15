import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Send, Megaphone, ShieldCheck, Mail, MessageSquare, CheckCircle2, Loader2, Info } from "lucide-react";
import { useVolunteerAlert } from "@/hooks/useVolunteerAlert";
import { toast } from "@/hooks/use-toast";

interface SimulationStep {
  message: string;
  status: 'pending' | 'loading' | 'complete';
}

export function ProximityAlertPanel() {
  const { broadcastProximity, connected } = useVolunteerAlert();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  
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
    setStats(null);
    
    // Initial steps
    const demoSteps: SimulationStep[] = [
      { message: "Scanning 2km radius for active cellular devices...", status: 'loading' },
      { message: "Initiating SMS Gateway handshake...", status: 'pending' },
      { message: "Dispatching emergency emails to registered volunteers...", status: 'pending' },
      { message: "Broadcasting high-priority push to app users...", status: 'pending' }
    ];
    setSteps(demoSteps);

    try {
      // Simulate real-time progress for the teacher
      await new Promise(r => setTimeout(r, 800));
      setSteps(prev => [
        { ...prev[0], status: 'complete' },
        { ...prev[1], status: 'loading' },
        ...prev.slice(2)
      ]);
      
      await new Promise(r => setTimeout(r, 1000));
      setSteps(prev => [
        prev[0],
        { ...prev[1], status: 'complete' },
        { ...prev[2], status: 'loading' },
        ...prev.slice(3)
      ]);

      const result = await broadcastProximity({
        type: 'RADIUS_EMERGENCY',
        ...details,
        radius: 2000,
        timestamp: new Date().toISOString()
      });
      
      await new Promise(r => setTimeout(r, 800));
      setSteps(prev => [
        prev[0],
        prev[1],
        { ...prev[2], status: 'complete' },
        { ...prev[3], status: 'complete' }
      ]);

      setStats(result);
      
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
    <Card className="border-danger/30 bg-danger/5 shadow-lg shadow-danger/5 overflow-hidden">
      <CardHeader className="pb-3 border-b border-danger/10 bg-danger/10">
        <CardTitle className="text-lg flex items-center gap-2 text-danger uppercase font-black">
          <Megaphone className="h-5 w-5 animate-pulse" />
          Nearby People Broadcast (2km)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Help Tip for Non-App Users */}
        <div className="bg-info/10 border border-info/20 p-3 rounded-lg flex gap-3 items-start">
          <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
          <p className="text-[10px] text-info font-medium leading-tight">
            <strong>DEMO TIP:</strong> This feature utilizes local cellular towers and volunteer databases to reach people <strong>without the app</strong> via emergency SMS and Email.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
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
                className="bg-background/50 border-danger/20 min-h-[80px] text-xs"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Motivational Message</label>
              <Textarea 
                value={details.motivation}
                onChange={e => setDetails(prev => ({ ...prev, motivation: e.target.value }))}
                className="bg-background/50 border-danger/20 text-[10px] italic min-h-[80px]"
              />
            </div>

            {/* Simulation Status Display */}
            {(loading || steps.length > 0) && (
              <div className="p-3 bg-black/40 rounded-lg border border-white/5 space-y-2 h-[120px] overflow-y-auto font-mono text-[9px]">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {step.status === 'loading' ? (
                      <Loader2 className="h-3 w-3 animate-spin text-info" />
                    ) : step.status === 'complete' ? (
                      <CheckCircle2 className="h-3 w-3 text-success" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border border-white/20" />
                    )}
                    <span className={step.status === 'complete' ? 'text-success' : 'text-white/60'}>
                      {step.message}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Success Stats Panel */}
            {stats && !loading && (
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-success/20 border border-success/30 p-2 rounded text-center">
                  <div className="flex justify-center mb-1"><MessageSquare className="h-3 w-3 text-success" /></div>
                  <div className="text-[10px] font-black">{stats.smsSent}</div>
                  <div className="text-[8px] text-success/70 font-bold uppercase">SMS Sent</div>
                </div>
                <div className="bg-info/20 border border-info/30 p-2 rounded text-center">
                  <div className="flex justify-center mb-1"><Mail className="h-3 w-3 text-info" /></div>
                  <div className="text-[10px] font-black">{stats.emailsSent}</div>
                  <div className="text-[8px] text-info/70 font-bold uppercase">Emails</div>
                </div>
                <div className="bg-warning/20 border border-warning/30 p-2 rounded text-center">
                  <div className="flex justify-center mb-1"><Send className="h-3 w-3 text-warning" /></div>
                  <div className="text-[10px] font-black">{stats.appUsers}</div>
                  <div className="text-[8px] text-warning/70 font-bold uppercase">App Users</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Button 
          onClick={handleBroadcast} 
          disabled={loading}
          className="w-full bg-danger hover:bg-danger/90 text-white font-black h-14 shadow-xl shadow-danger/20 flex items-center justify-center gap-3 border-t-4 border-black/20"
        >
          {loading ? (
            <Loader2 className="animate-spin h-6 w-6" />
          ) : (
            <>
              <Send className="h-6 w-6" />
              EXECUTE PROXIMITY MOBILIZATION
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
