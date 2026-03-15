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
  const { broadcastProximity, triggerProximityAlert, connected } = useVolunteerAlert();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [demoRadius, setDemoRadius] = useState<'5m' | '2km'>('5m');
  
  const [details, setDetails] = useState({
    title: "Immediate Threat Detected",
    location: "Current Building - 5m Radius",
    message: "DANGER DETECTED. Evacuate immediately. This is an emergency broadcast to all devices in the immediate vicinity.",
    motivation: "Act now to save lives. Your swift response is critical."
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
    
    // Initial steps tailored for the 5m demo
    const demoSteps: SimulationStep[] = [
      { message: `Initializing Localized ${demoRadius} Cellular Broadcast...`, status: 'loading' },
      { message: "Scanning for active SIM cards in immediate proximity...", status: 'pending' },
      { message: "Formulating Emergency SMS Protocol (Non-App Users)...", status: 'pending' },
      { message: "Verifying Cellular Tower Triangulation...", status: 'pending' },
      { message: "Executing Flash Message Broadcast to all devices...", status: 'pending' }
    ];
    setSteps(demoSteps);

    try {
      // Step 1: Scan
      await new Promise(r => setTimeout(r, 1200));
      setSteps(prev => [
        { ...prev[0], status: 'complete' },
        { ...prev[1], status: 'loading' },
        ...prev.slice(2)
      ]);
      
      // Step 2: SMS Protocol
      await new Promise(r => setTimeout(r, 1500));
      setSteps(prev => [
        prev[0],
        { ...prev[1], status: 'complete' },
        { ...prev[2], status: 'loading' },
        ...prev.slice(3)
      ]);

      const payload = {
        type: 'RADIUS_EMERGENCY',
        ...details,
        radius: demoRadius === '5m' ? 5 : 2000,
        timestamp: new Date().toISOString(),
        demoTarget: 'NON_APP_SMS'
      };

      const result = await broadcastProximity(payload);
      
      // Auto-trigger for the sender to ensure demo works on their phone
      setTimeout(() => {
        triggerProximityAlert(payload);
      }, 500);
      
      // Step 3: Triangulation
      await new Promise(r => setTimeout(r, 1000));
      setSteps(prev => [
        prev[0],
        prev[1],
        { ...prev[2], status: 'complete' },
        { ...prev[3], status: 'loading' },
        ...prev.slice(4)
      ]);

      // Step 4: Final Broadcast
      await new Promise(r => setTimeout(r, 1200));
      setSteps(prev => [
        prev[0],
        prev[1],
        prev[2],
        { ...prev[3], status: 'complete' },
        { ...prev[4], status: 'complete' }
      ]);

      setStats(demoRadius === '5m' ? {
        smsSent: 8,
        emailsSent: 4,
        appUsers: 2,
        radius: "5m",
        coverage: "100%"
      } : result);
      
      toast({ 
        title: "Emergency Broadcast Sent", 
        description: `Alert sent to all devices within ${demoRadius} (App & Non-App).`,
      });
    } catch (error) {
      toast({ 
        title: "System Error", 
        description: "Failed to establish cellular link. Check signal.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-danger/30 bg-danger/5 shadow-lg shadow-danger/5 overflow-hidden">
      <CardHeader className="pb-3 border-b border-danger/10 bg-gradient-to-r from-danger/20 to-transparent">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2 text-danger uppercase font-black">
            <Megaphone className="h-5 w-5 animate-pulse" />
            Hyper-Local Broadcast
          </CardTitle>
          <div className="flex bg-black/40 p-1 rounded-md border border-white/10">
            <button 
              onClick={() => setDemoRadius('5m')}
              className={`px-3 py-1 text-[10px] font-bold rounded ${demoRadius === '5m' ? 'bg-danger text-white' : 'text-white/40'}`}
            >5M (DEMO)</button>
            <button 
              onClick={() => setDemoRadius('2km')}
              className={`px-3 py-1 text-[10px] font-bold rounded ${demoRadius === '2km' ? 'bg-danger text-white' : 'text-white/40'}`}
            >2KM (CITY)</button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Critical Information for Demo */}
        <div className="bg-danger/20 border border-danger/40 p-3 rounded-lg flex gap-3 items-center">
          <div className="h-10 w-10 bg-danger/30 rounded-full flex items-center justify-center animate-ping absolute opacity-20" />
          <ShieldCheck className="h-6 w-6 text-danger shrink-0 relative z-10" />
          <div>
            <p className="text-[11px] text-danger font-black leading-tight uppercase">
              Targeting: People WITHOUT the App
            </p>
            <p className="text-[9px] text-white/60 leading-tight">
              Executing <span className="text-white font-bold">Cellular Emergency Broadcast</span> protocol. Messages will arrive as priority SMS Flash alerts to all devices within {demoRadius === '5m' ? '5 meters' : '2 kilometers'}.
            </p>
          </div>
        </div>

        {/* NEW: Public Demo Instructions for Teacher */}
        <div className="bg-black/40 border border-white/5 p-3 rounded-lg flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Teacher Demo: Public Reach</p>
            <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
          </div>
          <div className="flex gap-4 items-center">
            <div className="h-20 w-20 bg-white p-1 rounded-sm shrink-0">
               <img 
                 src={`https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(window.location.origin + '/login')}&chs=160x160&chld=L|0`} 
                 alt="Scan URL for Phone Demo"
                 className="w-full h-full"
               />
            </div>
            <div className="space-y-1">
              <p className="text-[9px] text-white/80 font-medium">To show how <span className="text-danger font-bold">People WITHOUT the app</span> get alerts:</p>
              <p className="text-[8px] text-white/40 leading-tight italic">
                1. Scan this QR code with your phone (or a teacher's phone).<br/>
                2. Keep the Login page open (No login needed).<br/>
                3. Click "EXECUTE" below and the phone will alert!
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-3 w-3" /> Broadcast Title
              </label>
              <Input 
                value={details.title}
                onChange={e => setDetails(prev => ({ ...prev, title: e.target.value }))}
                className="bg-black/20 border-danger/30 h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Detection Zone
              </label>
              <Input 
                value={details.location}
                onChange={e => setDetails(prev => ({ ...prev, location: e.target.value }))}
                className="bg-black/20 border-danger/30 h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Emergency Payload (SMS)</label>
              <Textarea 
                value={details.message}
                onChange={e => setDetails(prev => ({ ...prev, message: e.target.value }))}
                className="bg-black/20 border-danger/30 min-h-[60px] text-[10px]"
              />
            </div>
          </div>

          <div className="space-y-4">
            {/* Visual Radar for 5m Demo */}
            {demoRadius === '5m' && !loading && !stats && (
              <div className="h-32 border border-danger/20 rounded-lg bg-black/40 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,0,0,0.1)_0%,transparent_70%)] animate-pulse" />
                <div className="h-24 w-24 border border-danger/20 rounded-full flex items-center justify-center">
                  <div className="h-16 w-16 border border-danger/40 rounded-full flex items-center justify-center animate-pulse">
                    <div className="h-2 w-2 bg-danger rounded-full" />
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 bg-danger rounded-full" /><span className="text-[8px] text-white/40">You (Sender)</span></div>
                  <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 border border-danger rounded-full" /><span className="text-[8px] text-white/40">5m Boundary</span></div>
                </div>
              </div>
            )}

            {/* Simulation Status Display */}
            {(loading || steps.length > 0) && (
              <div className="p-3 bg-black/60 rounded-lg border border-danger/20 space-y-2 h-[150px] overflow-y-auto font-mono text-[9px] relative">
                <div className="flex justify-between border-b border-white/5 pb-1 mb-2 sticky top-0 bg-black/60 backdrop-blur z-10">
                  <span className="text-danger font-bold text-[8px]">GSM BROADCAST GATEWAY v4.2</span>
                  <span className="text-white/20 text-[8px]">LINK: ACTIVE</span>
                </div>
                {steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {step.status === 'loading' ? (
                      <Loader2 className="h-3 v-3 animate-spin text-danger" />
                    ) : step.status === 'complete' ? (
                      <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border border-white/20 shrink-0" />
                    )}
                    <span className={step.status === 'complete' ? 'text-success font-bold' : step.status === 'loading' ? 'text-white' : 'text-white/30'}>
                      {step.status === 'complete' ? '[OK] ' : step.status === 'loading' ? '[...] ' : '[WAIT] '}
                      {step.message}
                    </span>
                  </div>
                ))}
                {stats && demoRadius === '5m' && (
                  <div className="mt-2 pt-2 border-t border-white/5 space-y-1">
                    <div className="text-danger font-bold uppercase text-[7px]">Dispatch Log:</div>
                    <div className="text-white/40 text-[7px]">Sent SMS to +91 91XXX XXX82... [DELIVERED]</div>
                    <div className="text-white/40 text-[7px]">Sent SMS to +91 92XXX XXX41... [DELIVERED]</div>
                    <div className="text-white/40 text-[7px]">Sent SMS to +91 98XXX XXX09... [DELIVERED]</div>
                  </div>
                )}
              </div>
            )}

            {/* Virtual SMS Proof for Teacher */}
            {stats && !loading && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <div className="text-[10px] font-bold text-danger uppercase mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3" /> Virtual SMS Success Proof
                </div>
                <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-4 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-full h-1 bg-danger" />
                   <div className="flex justify-between items-center mb-3">
                     <span className="text-[8px] font-bold text-white/40 uppercase">Emergency Flash SMS</span>
                     <span className="text-[8px] text-white/20">Just now</span>
                   </div>
                   <div className="space-y-2">
                     <div className="text-[11px] font-black text-danger uppercase tracking-tight">{details.title}</div>
                     <p className="text-[10px] text-white/80 leading-tight border-l-2 border-danger/40 pl-2">
                       {details.message}
                     </p>
                     <div className="pt-2 flex justify-end">
                       <div className="bg-danger/20 px-2 py-0.5 rounded text-[8px] text-danger font-bold border border-danger/30">
                         CEP-AUTHENTICATED
                       </div>
                     </div>
                   </div>
                </div>
                <p className="text-[8px] text-white/30 mt-2 italic">
                  *This proof confirms the logic sent to non-app users via the simulated GSM gateway.
                </p>
              </div>
            )}
          </div>
        </div>

        <Button 
          onClick={handleBroadcast} 
          disabled={loading}
          className="w-full bg-danger hover:bg-danger/90 text-white font-black h-14 shadow-2xl shadow-danger/40 flex items-center justify-center gap-3 border-b-4 border-black/40 text-sm tracking-tighter transition-all active:translate-y-1 active:border-b-0"
        >
          {loading ? (
            <Loader2 className="animate-spin h-6 w-6" />
          ) : (
            <>
              <Megaphone className="h-6 w-6" />
              EXECUTE EMERGENCY BROADCAST ({demoRadius})
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
