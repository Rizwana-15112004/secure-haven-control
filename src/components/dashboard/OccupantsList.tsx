import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Occupant } from "@/types";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Search, 
  AlertTriangle, 
  Heart, 
  MapPin, 
  Phone,
  ChevronRight,
  Filter,
  UserCheck,
  UserX
} from "lucide-react";

interface OccupantsListProps {
  occupants: Occupant[];
  onOccupantSelect: (occupant: Occupant) => void;
}

export function OccupantsList({ occupants, onOccupantSelect }: OccupantsListProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'stuck' | 'rescued' | 'critical'>('all');

  const filteredOccupants = occupants
    .filter(o => {
      if (filter === 'stuck') return o.status === 'stuck';
      if (filter === 'rescued') return o.status === 'rescued';
      if (filter === 'critical') return o.triageScore >= 80;
      return true;
    })
    .filter(o => 
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.tempUID.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.triageScore - a.triageScore);

  const getStatusStyle = (status: Occupant['status']) => {
    switch (status) {
      case 'stuck': return 'bg-danger/20 text-danger border-danger/50';
      case 'injured': return 'bg-warning/20 text-warning border-warning/50';
      case 'critical': return 'bg-critical/20 text-critical border-critical/50';
      case 'rescued': return 'bg-safe/20 text-safe border-safe/50';
      default: return 'bg-info/20 text-info border-info/50';
    }
  };

  const getTriageColor = (score: number) => {
    if (score >= 80) return 'text-danger';
    if (score >= 50) return 'text-warning';
    return 'text-safe';
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-info" />
            Occupants
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredOccupants.length} / {occupants.length}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-3">
        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or UID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary border-border"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all', label: 'All', icon: Users },
            { key: 'stuck', label: 'Stuck', icon: UserX },
            { key: 'critical', label: 'Critical', icon: AlertTriangle },
            { key: 'rescued', label: 'Rescued', icon: UserCheck },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setFilter(key as typeof filter)}
              className="text-xs"
            >
              <Icon className="w-3 h-3 mr-1" />
              {label}
            </Button>
          ))}
        </div>

        {/* Occupants List */}
        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
          {filteredOccupants.map((occupant) => (
            <button
              key={occupant.id}
              onClick={() => onOccupantSelect(occupant)}
              className={cn(
                "w-full p-3 rounded-lg border-2 text-left transition-all hover:scale-[1.01]",
                getStatusStyle(occupant.status),
                occupant.triageScore >= 80 && 'pulse-danger'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold truncate">{occupant.name}</span>
                    <span className="text-xs opacity-70">{occupant.tempUID}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      F{occupant.floor} • Zone {occupant.zone}
                    </span>
                    {occupant.preExistingConditions.length > 0 && (
                      <span className="flex items-center gap-1 text-warning">
                        <Heart className="w-3 h-3" />
                        {occupant.preExistingConditions.length}
                      </span>
                    )}
                  </div>
                  {occupant.injuryStatus !== 'None' && (
                    <p className="text-xs mt-1 opacity-70 truncate">
                      ⚠ {occupant.injuryStatus}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={cn(
                    "text-lg font-display font-bold",
                    getTriageColor(occupant.triageScore)
                  )}>
                    {occupant.triageScore}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider opacity-70">
                    Triage
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Priority Legend */}
        <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Priority: Higher score = Rescue first</span>
          <div className="flex gap-2">
            <span className="text-danger">80+ Critical</span>
            <span className="text-warning">50+ High</span>
            <span className="text-safe">&lt;50 Normal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
