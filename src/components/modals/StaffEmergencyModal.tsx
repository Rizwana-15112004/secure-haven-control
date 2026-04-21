import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, User, MapPin, Heart, FileText, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { EmergencyAlert } from "@/contexts/EmergencyAlertContext";

interface Props {
  isOpen: boolean;
  alert: EmergencyAlert | null;
  onAcknowledge: (id: string) => void;
}

export function StaffEmergencyModal({ isOpen, alert, onAcknowledge }: Props) {
  const [audio] = useState(new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'));

  useEffect(() => {
    if (isOpen) {
      audio.play().catch(e => console.log("Audio play blocked"));
      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [isOpen, audio]);

  if (!alert) return null;
  const isInjured = alert.injured.toLowerCase().includes('yes');

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-destructive/50 shadow-2xl shadow-destructive/20 animate-in zoom-in-95 backdrop-blur-xl bg-background/95">
        <div className="bg-destructive p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <AlertCircle className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full animate-pulse">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="bg-white/10 text-white border-white/30 text-[10px] uppercase font-bold tracking-widest px-2">
                  Staff SOS Received
                </Badge>
                <div className="flex h-2 w-2 rounded-full bg-white animate-ping" />
              </div>
              <h2 className="text-2xl font-display font-black tracking-tight leading-none uppercase">
                Emergency Assistance Needed
              </h2>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-border/50">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Staff Name</p>
                <p className="font-semibold">{alert.staffName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-border/50">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Floor / Location</p>
                <p className="font-semibold">{alert.floor}</p>
              </div>
            </div>
          </div>

          <div className={`p-4 border-l-4 rounded-r-xl ${isInjured ? 'bg-destructive/10 border-destructive' : 'bg-warning/10 border-warning'}`}>
            <h4 className={`font-bold flex items-center gap-2 mb-1 text-sm uppercase ${isInjured ? 'text-destructive' : 'text-warning'}`}>
              <Heart className="w-4 h-4" />
              Injuries Reported: {alert.injured}
            </h4>
            <p className="text-sm font-medium mt-2 flex gap-2">
              <FileText className="w-4 h-4 shrink-0 text-muted-foreground mt-0.5" />
              <span>{alert.details}</span>
            </p>
          </div>

          <div className="pt-2">
            <Button 
              onClick={() => onAcknowledge(alert.id)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black h-14 text-lg shadow-xl shadow-green-600/20 flex items-center justify-center gap-3"
            >
              <CheckCheck className="w-6 h-6" />
              SEND HELP & ACKNOWLEDGE
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
