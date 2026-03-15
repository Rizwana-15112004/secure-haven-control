import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, MapPin, Shield, Siren, UserCheck, Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface RadiusAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertData: {
    title: string;
    location: string;
    message: string;
    motivation: string;
    timestamp: string;
  } | null;
}

export function RadiusAlertModal({ isOpen, onClose, alertData }: RadiusAlertModalProps) {
  const [audio] = useState(new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3')); // Emergency siren sound

  useEffect(() => {
    if (isOpen) {
      audio.play().catch(e => console.log("Audio play blocked"));
      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [isOpen]);

  if (!alertData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-danger/50 shadow-2xl shadow-danger/20 animate-in zoom-in-95 backdrop-blur-xl bg-background/95">
        {/* Urgent Header */}
        <div className="bg-danger p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <Siren className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full animate-pulse">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="bg-white/10 text-white border-white/30 text-[10px] uppercase font-bold tracking-widest px-2">
                  Emergency Broadcast
                </Badge>
                <div className="flex h-2 w-2 rounded-full bg-white animate-ping" />
              </div>
              <h2 className="text-2xl font-display font-black tracking-tight leading-none uppercase">
                {alertData.title}
              </h2>
            </div>
          </div>
        </div>

        {/* content */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
            <div className="bg-info/10 p-2 rounded-lg">
              <MapPin className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Affected Zone (within 2km)</p>
              <p className="font-semibold text-lg">{alertData.location}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative p-6 bg-danger/5 border-l-4 border-danger rounded-r-xl">
              <h4 className="font-bold text-danger text-sm uppercase flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4" /> Immediate Instructions
              </h4>
              <p className="text-sm leading-relaxed font-medium">
                {alertData.message}
              </p>
            </div>

            <div className="p-6 bg-info/5 border-l-4 border-info rounded-r-xl relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                <Heart className="w-24 h-24" />
              </div>
              <h4 className="font-bold text-info text-sm uppercase flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4" /> Message to Volunteers
              </h4>
              <p className="text-sm italic leading-relaxed text-muted-foreground">
                "{alertData.motivation}"
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button 
              onClick={onClose}
              className="w-full bg-danger hover:bg-danger/90 text-white font-black h-14 text-lg shadow-xl shadow-danger/20 flex items-center justify-center gap-3"
            >
              <UserCheck className="w-6 h-6" />
              I AM COMMITTED TO HELPING
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full h-12 text-muted-foreground font-bold hover:bg-muted"
            >
              DISMISS ALERT
            </Button>
          </div>
        </div>

        {/* Footer timestamp */}
        <div className="px-6 py-4 border-t bg-muted/30 flex justify-between items-center">
          <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
             Broadcast Active • {new Date(alertData.timestamp).toLocaleTimeString()}
          </div>
          <div className="flex items-center gap-1">
             <div className="h-1 w-1 rounded-full bg-danger animate-pulse" />
             <div className="h-1 w-1 rounded-full bg-danger animate-pulse delay-75" />
             <div className="h-1 w-1 rounded-full bg-danger animate-pulse delay-150" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
