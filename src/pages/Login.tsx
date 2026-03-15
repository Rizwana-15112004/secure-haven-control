import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert, KeyRound, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const ip = localStorage.getItem('serverIP') || window.location.hostname;
      const protocol = window.location.protocol;
      
      let response;
      try {
        response = await fetch(`${protocol}//${ip}:8080/api/auth/login`, {
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
      </div>
    </div>
  );
}
