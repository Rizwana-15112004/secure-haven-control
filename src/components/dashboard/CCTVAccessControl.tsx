import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera } from "@/types";
import { 
  Video, 
  Lock, 
  Unlock,
  Shield,
  AlertTriangle,
  Eye
} from "lucide-react";
import { CCTVPanel } from "./CCTVPanel";

interface CCTVAccessControlProps {
  cameras: Camera[];
  onCameraSelect: (camera: Camera) => void;
  isEmergency: boolean;
  userRole: 'head' | 'team_member';
}

export function CCTVAccessControl({ 
  cameras, 
  onCameraSelect, 
  isEmergency,
  userRole 
}: CCTVAccessControlProps) {
  const [accessGranted, setAccessGranted] = useState(false);
  
  // Head of company always has access
  // Team members only get access during emergency
  const hasAccess = userRole === 'head' || isEmergency;
  
  // Auto-grant access during emergency for team members
  if (isEmergency && userRole === 'team_member' && !accessGranted) {
    setAccessGranted(true);
  }

  if (!hasAccess) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-muted-foreground" />
            CCTV Live Feed
            <Lock className="w-4 h-4 text-warning ml-2" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-warning" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Restricted Access
              </h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                CCTV surveillance is restricted to the Head of Company during normal operations.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Access will be automatically granted to all team members during emergency situations.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-3 py-2 rounded-lg">
              <Eye className="w-4 h-4" />
              <span>Your role: Disaster Team Member</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      {/* Emergency Access Banner */}
      {isEmergency && userRole === 'team_member' && (
        <div className="mb-2 p-2 bg-danger/10 border border-danger/30 rounded-lg flex items-center gap-2 text-sm">
          <AlertTriangle className="w-4 h-4 text-danger" />
          <span className="text-danger font-medium">Emergency Access Granted</span>
          <Unlock className="w-4 h-4 text-safe ml-auto" />
        </div>
      )}
      
      {/* Head Access Indicator */}
      {userRole === 'head' && !isEmergency && (
        <div className="mb-2 p-2 bg-info/10 border border-info/30 rounded-lg flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-info" />
          <span className="text-info font-medium">Head of Company Access</span>
          <Unlock className="w-4 h-4 text-safe ml-auto" />
        </div>
      )}
      
      <CCTVPanel 
        cameras={cameras} 
        onCameraSelect={onCameraSelect}
      />
    </div>
  );
}
