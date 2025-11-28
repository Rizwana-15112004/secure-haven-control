import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BuildingZone, Occupant } from "@/types";
import { cn } from "@/lib/utils";
import { Users, AlertTriangle, MapPin, Layers } from "lucide-react";

interface BuildingMapProps {
  zones: BuildingZone[];
  occupants: Occupant[];
  onZoneSelect: (zone: BuildingZone) => void;
}

export function BuildingMap({ zones, occupants, onZoneSelect }: BuildingMapProps) {
  const [selectedFloor, setSelectedFloor] = useState(3);
  const floors = [4, 3, 2, 1, -1];

  const getZoneStyle = (status: BuildingZone['status']) => {
    switch (status) {
      case 'critical': return 'bg-danger/30 border-danger pulse-danger';
      case 'danger': return 'bg-danger/20 border-danger/70';
      case 'warning': return 'bg-warning/20 border-warning';
      default: return 'bg-safe/10 border-safe/50 hover:bg-safe/20';
    }
  };

  const getEvacPathStyle = (path: BuildingZone['evacPath']) => {
    switch (path) {
      case 'danger': return 'text-danger';
      case 'blocked': return 'text-warning';
      default: return 'text-safe';
    }
  };

  const floorZones = zones.filter(z => z.floor === selectedFloor);
  const floorOccupants = occupants.filter(o => o.floor === selectedFloor);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-info" />
            Building Map
          </CardTitle>
          <div className="flex items-center gap-1 text-xs">
            <span className="w-3 h-3 rounded-full bg-safe"></span>
            <span className="text-muted-foreground mr-2">Safe</span>
            <span className="w-3 h-3 rounded-full bg-warning"></span>
            <span className="text-muted-foreground mr-2">Warning</span>
            <span className="w-3 h-3 rounded-full bg-danger animate-pulse"></span>
            <span className="text-muted-foreground">Critical</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Floor Selector */}
        <div className="flex gap-2 mb-4">
          {floors.map((floor) => {
            const floorHasAlert = zones.some(z => z.floor === floor && (z.status === 'critical' || z.status === 'danger'));
            return (
              <Button
                key={floor}
                variant={selectedFloor === floor ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedFloor(floor)}
                className={cn(
                  "flex-1 relative",
                  floorHasAlert && selectedFloor !== floor && "border-danger"
                )}
              >
                {floor === -1 ? 'B1' : `F${floor}`}
                {floorHasAlert && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full animate-pulse" />
                )}
              </Button>
            );
          })}
        </div>

        {/* Floor Map Grid */}
        <div className="relative bg-secondary/30 rounded-lg p-4 min-h-[300px] border border-border">
          {/* Grid Layout */}
          <div className="grid grid-cols-2 gap-3 h-full">
            {floorZones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => onZoneSelect(zone)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all text-left",
                  getZoneStyle(zone.status)
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Zone {zone.name.split(' - ')[1] || zone.name}
                  </span>
                  {zone.status !== 'safe' && (
                    <AlertTriangle className={cn(
                      "w-4 h-4",
                      zone.status === 'critical' ? 'text-danger animate-pulse' : 'text-warning'
                    )} />
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-lg font-bold">{zone.occupantCount}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <MapPin className={cn("w-3 h-3", getEvacPathStyle(zone.evacPath))} />
                  <span className={cn("capitalize", getEvacPathStyle(zone.evacPath))}>
                    {zone.evacPath === 'safe' ? 'Clear Path' : zone.evacPath === 'blocked' ? 'Blocked' : 'Danger Zone'}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Occupant Dots Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {floorOccupants.map((occupant, idx) => (
              <div
                key={occupant.id}
                className={cn(
                  "absolute w-3 h-3 rounded-full transition-all",
                  occupant.status === 'stuck' ? 'bg-danger animate-pulse' :
                  occupant.status === 'injured' ? 'bg-warning' :
                  occupant.status === 'rescued' ? 'bg-safe' : 'bg-info'
                )}
                style={{
                  left: `${20 + (idx * 15) % 60}%`,
                  top: `${30 + (idx * 20) % 40}%`,
                }}
                title={occupant.name}
              />
            ))}
          </div>
        </div>

        {/* Floor Summary */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-secondary/50 rounded">
            <p className="text-lg font-bold text-info">{floorOccupants.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="p-2 bg-secondary/50 rounded">
            <p className="text-lg font-bold text-danger">
              {floorOccupants.filter(o => o.status === 'stuck').length}
            </p>
            <p className="text-xs text-muted-foreground">Stuck</p>
          </div>
          <div className="p-2 bg-secondary/50 rounded">
            <p className="text-lg font-bold text-safe">
              {floorOccupants.filter(o => o.status === 'safe' || o.status === 'rescued').length}
            </p>
            <p className="text-xs text-muted-foreground">Safe</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
