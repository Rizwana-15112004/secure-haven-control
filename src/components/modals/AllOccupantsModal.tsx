import { Occupant } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { 
  Users, 
  Search, 
  MapPin, 
  Phone, 
  Heart,
  Copy,
  ExternalLink,
  Filter
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AllOccupantsModalProps {
  occupants: Occupant[];
  open: boolean;
  onClose: () => void;
  onSelectOccupant: (occupant: Occupant) => void;
}

export function AllOccupantsModal({ 
  occupants, 
  open, 
  onClose,
  onSelectOccupant 
}: AllOccupantsModalProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'stuck' | 'safe' | 'rescued' | 'injured'>('all');

  const filteredOccupants = occupants
    .filter(o => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (search && !o.name.toLowerCase().includes(search.toLowerCase()) && 
          !o.tempUID.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => b.triageScore - a.triageScore);

  const getStatusStyle = (status: Occupant['status']) => {
    switch (status) {
      case 'stuck': return 'bg-danger/20 text-danger';
      case 'injured': return 'bg-warning/20 text-warning';
      case 'critical': return 'bg-critical/20 text-critical';
      case 'rescued': return 'bg-safe/20 text-safe';
      default: return 'bg-info/20 text-info';
    }
  };

  const copyCoordinates = (lat: number, lng: number) => {
    navigator.clipboard.writeText(`${lat}, ${lng}`);
    toast({ title: "Coordinates Copied", description: `${lat}, ${lng}` });
  };

  const openInMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Users className="w-5 h-5 text-info" />
            <span className="font-display">All Occupants ({occupants.length})</span>
          </DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or UID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary border-border"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'stuck', 'safe', 'rescued', 'injured'] as const).map(status => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Occupants Table */}
        <div className="overflow-auto max-h-[60vh] rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary sticky top-0">
              <tr>
                <th className="text-left p-3 font-medium">UID</th>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Dept</th>
                <th className="text-left p-3 font-medium">Location</th>
                <th className="text-left p-3 font-medium">Coordinates (Lat, Lng)</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Triage</th>
                <th className="text-left p-3 font-medium">Health</th>
                <th className="text-left p-3 font-medium">Contact</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOccupants.map((occupant) => (
                <tr 
                  key={occupant.id} 
                  className={cn(
                    "border-t border-border hover:bg-secondary/50 cursor-pointer transition-colors",
                    occupant.triageScore >= 80 && "bg-danger/5"
                  )}
                  onClick={() => onSelectOccupant(occupant)}
                >
                  <td className="p-3 font-mono text-xs">{occupant.tempUID}</td>
                  <td className="p-3 font-medium">{occupant.name}</td>
                  <td className="p-3 text-muted-foreground">{occupant.department}</td>
                  <td className="p-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-info" />
                      F{occupant.floor} • Zone {occupant.zone}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs bg-secondary px-2 py-1 rounded">
                        {occupant.location.lat.toFixed(6)}, {occupant.location.lng.toFixed(6)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyCoordinates(occupant.location.lat, occupant.location.lng);
                        }}
                        className="p-1 hover:bg-secondary rounded"
                        title="Copy coordinates"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openInMaps(occupant.location.lat, occupant.location.lng);
                        }}
                        className="p-1 hover:bg-secondary rounded"
                        title="Open in Maps"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-bold uppercase",
                      getStatusStyle(occupant.status)
                    )}>
                      {occupant.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={cn(
                      "text-lg font-display font-bold",
                      occupant.triageScore >= 80 ? "text-danger" :
                      occupant.triageScore >= 50 ? "text-warning" : "text-safe"
                    )}>
                      {occupant.triageScore}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      {occupant.preExistingConditions.length > 0 && (
                        <Heart className="w-3 h-3 text-warning" />
                      )}
                      <span className={cn(
                        "capitalize text-xs",
                        occupant.healthCondition === 'critical' ? "text-danger" :
                        occupant.healthCondition === 'severe' ? "text-warning" : "text-muted-foreground"
                      )}>
                        {occupant.healthCondition}
                      </span>
                    </div>
                    {occupant.injuryStatus !== 'None' && (
                      <p className="text-xs text-danger mt-1">{occupant.injuryStatus}</p>
                    )}
                  </td>
                  <td className="p-3">
                    <a 
                      href={`tel:${occupant.contactNumber}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-info hover:underline"
                    >
                      <Phone className="w-3 h-3" />
                      <span className="text-xs">{occupant.contactNumber}</span>
                    </a>
                  </td>
                  <td className="p-3">
                    <Button
                      size="sm"
                      variant="info"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOccupant(occupant);
                      }}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
          <span>Showing {filteredOccupants.length} of {occupants.length} occupants</span>
          <div className="flex gap-4">
            <span className="text-danger">Stuck: {occupants.filter(o => o.status === 'stuck').length}</span>
            <span className="text-safe">Safe: {occupants.filter(o => o.status === 'safe').length}</span>
            <span className="text-info">Rescued: {occupants.filter(o => o.status === 'rescued').length}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
