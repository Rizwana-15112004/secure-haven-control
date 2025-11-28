import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera } from "@/types";
import { cn } from "@/lib/utils";
import { 
  Video, 
  VideoOff, 
  Maximize2, 
  Grid3X3, 
  MonitorPlay,
  Circle,
  Wifi,
  WifiOff
} from "lucide-react";

interface CCTVPanelProps {
  cameras: Camera[];
  onCameraSelect: (camera: Camera) => void;
}

export function CCTVPanel({ cameras, onCameraSelect }: CCTVPanelProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

  const handleCameraClick = (camera: Camera) => {
    setSelectedCamera(camera);
    onCameraSelect(camera);
    if (viewMode === 'grid') {
      setViewMode('single');
    }
  };

  const onlineCameras = cameras.filter(c => c.status !== 'offline');

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-info" />
            CCTV Live Feed
            <span className="ml-2 flex items-center gap-1 text-xs font-normal">
              <Circle className="w-2 h-2 fill-danger text-danger animate-pulse" />
              LIVE
            </span>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'secondary'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'single' ? 'default' : 'secondary'}
              size="icon"
              onClick={() => setViewMode('single')}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {cameras.slice(0, 8).map((camera) => (
              <CameraFeed
                key={camera.id}
                camera={camera}
                onClick={() => handleCameraClick(camera)}
                compact
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {selectedCamera && (
              <CameraFeed
                camera={selectedCamera}
                onClick={() => {}}
                expanded
              />
            )}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {cameras.map((camera) => (
                <button
                  key={camera.id}
                  onClick={() => setSelectedCamera(camera)}
                  className={cn(
                    "flex-shrink-0 p-2 rounded border transition-all text-xs",
                    selectedCamera?.id === camera.id
                      ? "border-info bg-info/10 text-info"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {camera.status === 'offline' ? (
                      <WifiOff className="w-3 h-3 text-muted-foreground" />
                    ) : (
                      <Wifi className="w-3 h-3 text-safe" />
                    )}
                    <span>{camera.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Camera Stats */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-safe">
              <Wifi className="w-4 h-4" />
              {onlineCameras.length} Online
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <WifiOff className="w-4 h-4" />
              {cameras.length - onlineCameras.length} Offline
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Local Storage: Active
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

interface CameraFeedProps {
  camera: Camera;
  onClick: () => void;
  compact?: boolean;
  expanded?: boolean;
}

function CameraFeed({ camera, onClick, compact, expanded }: CameraFeedProps) {
  const isOffline = camera.status === 'offline';
  const isRecording = camera.status === 'recording';

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-lg overflow-hidden border-2 transition-all group",
        isOffline ? "border-muted-foreground/30" : "border-border hover:border-info",
        expanded ? "aspect-video w-full" : compact ? "aspect-video" : "aspect-video"
      )}
    >
      {/* Simulated Video Feed */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center",
        isOffline ? "bg-secondary" : "bg-gradient-to-br from-secondary to-background"
      )}>
        {isOffline ? (
          <VideoOff className="w-8 h-8 text-muted-foreground" />
        ) : (
          <>
            {/* Scanline Effect */}
            <div className="absolute inset-0 scanline opacity-30" />
            <MonitorPlay className="w-8 h-8 text-info/50" />
            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-danger/80 px-2 py-0.5 rounded text-xs text-primary-foreground">
                <Circle className="w-2 h-2 fill-current animate-pulse" />
                REC
              </div>
            )}
          </>
        )}
      </div>

      {/* Camera Info Overlay */}
      <div className={cn(
        "absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-background/90 to-transparent",
        "opacity-100 group-hover:opacity-100 transition-opacity"
      )}>
        <p className={cn(
          "text-xs font-medium truncate",
          compact && "text-[10px]"
        )}>
          {camera.name}
        </p>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>F{camera.floor}</span>
          <span>•</span>
          <span>Zone {camera.zone}</span>
          {camera.isLocal && (
            <>
              <span>•</span>
              <span className="text-info">Local</span>
            </>
          )}
        </div>
      </div>

      {/* Expand Icon */}
      {compact && !isOffline && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-4 h-4 text-foreground" />
        </div>
      )}
    </button>
  );
}
