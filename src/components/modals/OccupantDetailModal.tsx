import { Occupant } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  User, 
  MapPin, 
  Phone, 
  Heart, 
  Clock, 
  AlertTriangle,
  Navigation,
  UserCheck
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface OccupantDetailModalProps {
  occupant: Occupant | null;
  open: boolean;
  onClose: () => void;
  onMarkRescued: (id: string) => void;
}

export function OccupantDetailModal({ 
  occupant, 
  open, 
  onClose,
  onMarkRescued 
}: OccupantDetailModalProps) {
  if (!occupant) return null;

  const getStatusColor = (status: Occupant['status']) => {
    switch (status) {
      case 'stuck': return 'text-danger bg-danger/20';
      case 'injured': return 'text-warning bg-warning/20';
      case 'critical': return 'text-critical bg-critical/20';
      case 'rescued': return 'text-safe bg-safe/20';
      default: return 'text-info bg-info/20';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full",
              getStatusColor(occupant.status)
            )}>
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display">{occupant.name}</span>
              <p className="text-xs text-muted-foreground font-body">
                {occupant.tempUID}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status & Triage */}
          <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Status</p>
              <span className={cn(
                "px-2 py-1 rounded text-sm font-bold uppercase",
                getStatusColor(occupant.status)
              )}>
                {occupant.status}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase">Triage Score</p>
              <span className={cn(
                "text-3xl font-display font-bold",
                occupant.triageScore >= 80 ? "text-danger" :
                occupant.triageScore >= 50 ? "text-warning" : "text-safe"
              )}>
                {occupant.triageScore}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-info" />
              <span className="text-sm font-medium">Location</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Floor / Zone</p>
                <p className="font-medium">Floor {occupant.floor}, Zone {occupant.zone}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Coordinates</p>
                <p className="font-mono text-xs">
                  {occupant.location.lat.toFixed(6)}, {occupant.location.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </div>

          {/* Health Information */}
          <div className="p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-danger" />
              <span className="text-sm font-medium">Health Information</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Condition</span>
                <span className={cn(
                  "font-medium capitalize",
                  occupant.healthCondition === 'critical' ? "text-danger" :
                  occupant.healthCondition === 'severe' ? "text-warning" : "text-foreground"
                )}>
                  {occupant.healthCondition}
                </span>
              </div>
              {occupant.preExistingConditions.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-1">Pre-existing Conditions</p>
                  <div className="flex flex-wrap gap-1">
                    {occupant.preExistingConditions.map((condition, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 bg-warning/20 text-warning text-xs rounded"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {occupant.injuryStatus !== 'None' && (
                <div className="flex items-start gap-2 p-2 bg-danger/10 rounded">
                  <AlertTriangle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Current Injury</p>
                    <p className="text-danger font-medium">{occupant.injuryStatus}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4 text-info" />
              <span className="text-sm font-medium">Contact</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Personal</p>
                <p className="font-mono">{occupant.contactNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Emergency</p>
                <p className="font-mono">{occupant.emergencyContact}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Entry: {formatDistanceToNow(occupant.entryTime, { addSuffix: true })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Navigation className="w-3 h-3" />
              <span>Last seen: {formatDistanceToNow(occupant.lastSeen, { addSuffix: true })}</span>
            </div>
          </div>

          {/* Actions */}
          {occupant.status !== 'rescued' && (
            <div className="flex gap-2 pt-2">
              <Button 
                variant="safe" 
                className="flex-1"
                onClick={() => onMarkRescued(occupant.id)}
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Mark as Rescued
              </Button>
              <Button variant="info" className="flex-1">
                <Navigation className="w-4 h-4 mr-2" />
                Navigate
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
