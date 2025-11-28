import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Shield, 
  Bell, 
  Settings, 
  User, 
  Clock,
  Wifi,
  WifiOff,
  Battery,
  AlertTriangle,
  Menu,
  X
} from "lucide-react";

interface HeaderProps {
  alertCount: number;
  isEmergency: boolean;
  onMenuToggle?: () => void;
  menuOpen?: boolean;
}

export function Header({ alertCount, isEmergency, onMenuToggle, menuOpen }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 border-b transition-all duration-300",
      isEmergency 
        ? "bg-danger/10 border-danger/50 backdrop-blur-md" 
        : "bg-background/95 border-border backdrop-blur-md"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuToggle}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className={cn(
              "p-2 rounded-lg",
              isEmergency ? "bg-danger/20 animate-pulse" : "bg-secondary"
            )}>
              <Shield className={cn(
                "w-6 h-6",
                isEmergency ? "text-danger" : "text-info"
              )} />
            </div>
            <div>
              <h1 className="font-display text-lg md:text-xl font-bold tracking-wider">
                SDRRS
              </h1>
              <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest">
                Smart Disaster Response System
              </p>
            </div>
          </div>

          {/* Emergency Banner */}
          {isEmergency && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-danger/20 rounded-lg border border-danger/50 animate-pulse">
              <AlertTriangle className="w-5 h-5 text-danger" />
              <span className="font-display text-sm text-danger font-bold uppercase tracking-wider">
                Emergency Active
              </span>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* System Status */}
            <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-safe" />
                ) : (
                  <WifiOff className="w-4 h-4 text-warning" />
                )}
                <span className={isOnline ? "text-safe" : "text-warning"}>
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Battery className="w-4 h-4 text-safe" />
                <span>UPS OK</span>
              </div>
            </div>

            {/* Time */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-sm">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>

            {/* Alerts */}
            <Button
              variant={alertCount > 0 ? "danger" : "secondary"}
              size="icon"
              className="relative"
            >
              <Bell className="w-5 h-5" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {alertCount}
                </span>
              )}
            </Button>

            {/* User */}
            <Button variant="secondary" size="icon" className="hidden sm:flex">
              <User className="w-5 h-5" />
            </Button>

            {/* Settings */}
            <Button variant="secondary" size="icon" className="hidden sm:flex">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Emergency Strip */}
      {isEmergency && (
        <div className="h-1 bg-gradient-to-r from-danger via-warning to-danger animate-pulse" />
      )}
    </header>
  );
}
