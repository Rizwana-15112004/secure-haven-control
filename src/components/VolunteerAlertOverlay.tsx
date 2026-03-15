import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Phone, Navigation, AlertTriangle, Users } from "lucide-react";
import { VolunteerAlertPayload } from "@/hooks/useVolunteerAlert";

interface Props {
  alert: VolunteerAlertPayload;
  onDismiss: () => void;
}

export function VolunteerAlertOverlay({ alert, onDismiss }: Props) {
  // Vibrate the phone on receiving alert
  useEffect(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate([400, 200, 400, 200, 800]);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      {/* Alert Card */}
      <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(239,68,68,0.6)] border-2 border-red-500 animate-in zoom-in-95 duration-300">

        {/* Pulsing top header */}
        <div className="bg-gradient-to-r from-red-700 via-red-500 to-orange-500 p-5 text-white text-center animate-pulse">
          <div className="text-4xl mb-1">🚨</div>
          <h1 className="font-black text-2xl tracking-tight leading-tight uppercase">
            Emergency Alert!
          </h1>
          <p className="text-white/90 text-sm font-medium mt-1">
            Lives are at risk — Your help is needed NOW
          </p>
        </div>

        {/* Body */}
        <div className="bg-zinc-900 text-white p-5 space-y-4">

          {/* Main message */}
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2 animate-pulse" />
            <p className="font-bold text-lg leading-snug">{alert.title}</p>
            <p className="text-white/70 text-sm mt-1">{alert.message}</p>
          </div>
          {/* Nearby Warning */}
          <div className="flex flex-col items-center gap-1.5 py-1">
            <div className="flex items-center gap-2 bg-red-600 px-4 py-1.5 rounded-full border border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
              <MapPin className="h-4 w-4 text-white animate-bounce" />
              <span className="text-xs font-black text-white uppercase tracking-widest">
                Rescue Zone: Within {alert.radius >= 1000 ? `${(alert.radius/1000).toFixed(1)}km` : `${alert.radius}m`}
              </span>
            </div>
            <p className="text-red-400 text-[10px] uppercase font-bold tracking-widest animate-pulse">
              You are in the immediate vicinity
            </p>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5">
              <MapPin className="h-5 w-5 text-red-400 shrink-0" />
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wide">Location</p>
                <p className="text-sm font-semibold">{alert.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5">
              <Navigation className="h-5 w-5 text-blue-400 shrink-0" />
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wide">GPS Coordinates</p>
                <p className="text-sm font-semibold">{alert.coords}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5">
              <Phone className="h-5 w-5 text-green-400 shrink-0" />
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wide">Contact</p>
                <p className="text-sm font-semibold">{alert.contact}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5">
              <Users className="h-5 w-5 text-orange-400 shrink-0" />
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wide">Devices Alerted</p>
                <p className="text-sm font-semibold">{alert.deviceCount} phones received this alert</p>
              </div>
            </div>
          </div>

          {/* Motivational call to action */}
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-2xl p-4 text-center">
            <Heart className="h-6 w-6 text-red-400 mx-auto mb-2" />
            <p className="font-bold text-base text-orange-300">💪 You can save a life today!</p>
            <p className="text-white/70 text-xs mt-1 leading-relaxed">
              Please proceed to the location immediately.<br/>
              Every second counts. Be the hero someone needs right now. 🦸
            </p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-xl text-sm"
              onClick={() => {
                window.open("https://maps.app.goo.gl/xWBZXZ3k55wwgUeZ9", "_blank");
              }}
            >
              <Navigation className="h-4 w-4 mr-1.5" />
              Get Directions
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl text-sm"
              onClick={() => {
                window.location.href = `tel:${alert.contact.replace(/\s/g, "")}`;
              }}
            >
              <Phone className="h-4 w-4 mr-1.5" />
              Call Now
            </Button>
          </div>

          <Button
            variant="outline"
            className="w-full border-white/20 text-white/60 hover:bg-white/10 rounded-xl h-10 text-sm"
            onClick={onDismiss}
          >
            I'm not available to help right now
          </Button>
        </div>
      </div>
    </div>
  );
}
