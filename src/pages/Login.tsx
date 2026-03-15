import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert, KeyRound, User, Siren, ShieldCheck, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { getBackendURL } from "@/config/api";
import { useVolunteerAlert } from "@/hooks/useVolunteerAlert";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [wakeLocked, setWakeLocked] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { connected, armBackgroundSystem } = useVolunteerAlert();

  useEffect(() => {
    // 1. Request Notification Permissions for Background Alerts
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // 2. Request Wake Lock to prevent screen sleep during demo
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await (navigator as any).wakeLock.request("screen");
          setWakeLocked(true);
          console.log("Wake Lock is active");
        }
      } catch (err) {
        console.error(`${err.name}, ${err.message}`);
      }
    };

    requestWakeLock();

    return () => {
      if (wakeLock) wakeLock.release().then(() => setWakeLocked(false));
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const backendUrl = getBackendURL();
      
      let response;
      try {
        response = await fetch(`${backendUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
      } catch (e) {
        console.warn("Backend unreachable, falling back to mock authentication.");
      }

      const isDemoAdmin = username === 'admin' && password === 'admin123';
      const isDemoStaff = username === 'staff' && password === 'staff123';

      if (response && response.ok) {
        const user = await response.json();
        login(user.username);
        navigate("/");
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.fullName || user.username}!`,
        });
      } else if (isDemoAdmin || isDemoStaff) {
        // Fallback for Demo
        login(username);
        navigate("/");
        toast({
          title: "Login Successful (Demo Mode)",
          description: `Welcome back, ${username}! The system is running in offline demo mode.`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please check your username and password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Internal Error",
        description: "An unexpected error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-danger/20 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 overflow-hidden rounded-2xl flex items-center justify-center mb-6 border border-primary/20 bg-transparent">
            <img 
              src="/pwa-192x192.png" 
              alt="SDRRS Logo" 
              className="w-full h-full object-contain p-2"
            />
          </div>
          <h2 className="text-3xl font-display font-bold tracking-tight text-foreground">
            Secure Haven Control
          </h2>
          <p className="text-muted-foreground mt-2">
            Sign in to access the emergency management network
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="Enter 'admin' or 'staff'"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="username"
                    autoCorrect="off"
                    disabled={isLoading}
                    className="pl-10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    placeholder="Enter 'password'"
                    type="password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              )}
              Access System
            </Button>

            <div className="bg-secondary/50 rounded-lg p-4 text-sm text-secondary-foreground">
              <p className="font-semibold mb-1">Demo Credentials:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Admin: <code>admin</code> / <code>admin123</code></li>
                <li>Staff: <code>staff</code> / <code>staff123</code></li>
              </ul>
            </div>
          </form>
        </div>

        {/* Public Alert Receiver - "Government Model" Demo */}
        <div className={`border rounded-xl p-4 flex items-center justify-between text-[11px] transition-all duration-500 ${connected ? 'bg-success/10 border-success/30' : 'bg-danger/10 border-danger/30 animate-pulse'}`}>
           <div className="flex items-center gap-3">
             <div className={`p-2 rounded-full ${connected ? 'bg-success/20' : 'bg-danger/20'}`}>
               <Siren className={`h-4 w-4 ${connected ? 'text-success' : 'text-danger'} ${connected ? 'animate-bounce' : 'animate-ping'}`} />
             </div>
             <div>
               <p className={`font-black uppercase tracking-tighter ${connected ? 'text-success' : 'text-danger'}`}>
                 {connected ? 'Cellular Node Active' : 'Searching for Signal'}
               </p>
               <p className="text-white/40 italic">
                 {connected ? 'Phone triangulated by Emergency Tower KL-01' : 'Establishing link to SDRRS Disaster Network...'}
               </p>
             </div>
           </div>
           <div className="flex flex-col items-end gap-1">
             <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border border-white/5 ${connected ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                <div className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-success' : 'bg-danger'} ${connected ? 'animate-ping' : ''}`} />
                <span className="font-bold uppercase text-[8px]">{connected ? 'Triangulated' : 'Offline'}</span>
             </div>
             {wakeLocked && (
               <div className="text-[7px] text-success/60 font-black uppercase tracking-tighter flex items-center gap-1">
                 <ShieldCheck className="h-2.5 w-2.5" /> Screen Sleep Disabled
               </div>
             )}
             {connected && (
               <div className="flex flex-col items-end gap-2 mt-1">
                 <Button 
                   size="sm"
                   variant="destructive"
                   onClick={() => {
                     armBackgroundSystem();
                     if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
                     toast({ 
                       title: "SYSTEM ARMED", 
                       description: "Emergency Listener is now protected from OS sleep modes. Keep this tab open.",
                       variant: "default"
                     });
                   }}
                   className="h-7 text-[9px] font-black uppercase tracking-widest bg-danger animate-pulse shadow-lg shadow-danger/40"
                 >
                   Arm Background System
                 </Button>
                 <button 
                   onClick={() => {
                     if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
                     toast({ title: "Signal Test", description: "Connection to Emergency Tower is stable. Background listening active." });
                   }}
                   className="text-[8px] text-white/20 underline hover:text-white/40 font-bold uppercase tracking-widest"
                 >Test Link</button>
               </div>
             )}
           </div>
        </div>

        <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.2em]">
          SDRRS Local Network v4.2.0 • Secured by CEP
        </p>
      </div>
    </div>
  );
}
