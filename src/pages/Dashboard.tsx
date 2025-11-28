import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { BuildingMap } from "@/components/dashboard/BuildingMap";
import { CCTVPanel } from "@/components/dashboard/CCTVPanel";
import { OccupantsList } from "@/components/dashboard/OccupantsList";
import { ControlPanel } from "@/components/dashboard/ControlPanel";
import { RescueTeamsPanel } from "@/components/dashboard/RescueTeamsPanel";
import { EvacuationProgress } from "@/components/dashboard/EvacuationProgress";
import { OccupantDetailModal } from "@/components/modals/OccupantDetailModal";
import { ZoneDetailModal } from "@/components/modals/ZoneDetailModal";
import { 
  mockOccupants, 
  mockCameras, 
  mockAlerts, 
  mockZones, 
  mockControls,
  mockRescueTeams,
  mockStats 
} from "@/data/mockData";
import { Occupant, BuildingZone, Alert, Camera, ControlSystem, RescueTeam } from "@/types";
import { 
  Users, 
  AlertTriangle, 
  UserCheck, 
  UserX,
  Shield,
  Flame
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Data states
  const [occupants, setOccupants] = useState(mockOccupants);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [controls, setControls] = useState(mockControls);
  const [rescueTeams, setRescueTeams] = useState(mockRescueTeams);

  // Modal states
  const [selectedOccupant, setSelectedOccupant] = useState<Occupant | null>(null);
  const [selectedZone, setSelectedZone] = useState<BuildingZone | null>(null);
  const [occupantModalOpen, setOccupantModalOpen] = useState(false);
  const [zoneModalOpen, setZoneModalOpen] = useState(false);

  const activeAlerts = alerts.filter(a => a.isActive);
  const isEmergency = activeAlerts.some(a => a.level === 'critical' || a.level === 'danger');

  // Handlers
  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, acknowledged: true } : a
    ));
    toast({ title: "Alert Acknowledged", description: "The alert has been marked as acknowledged." });
  };

  const handleControlToggle = (id: string, status: 'on' | 'off') => {
    setControls(prev => prev.map(c => 
      c.id === id ? { ...c, status, isManualOverride: true } : c
    ));
  };

  const handleAlertTeam = (teamId: string) => {
    setRescueTeams(prev => prev.map(t => 
      t.id === teamId ? { ...t, status: 'alerted' as const, notifiedAt: new Date() } : t
    ));
    toast({ 
      title: "Emergency Alert Sent", 
      description: "The rescue team has been notified via SMS/GSM.",
    });
  };

  const handleMarkRescued = (id: string) => {
    setOccupants(prev => prev.map(o => 
      o.id === id ? { ...o, status: 'rescued' as const } : o
    ));
    setOccupantModalOpen(false);
    toast({ 
      title: "Occupant Rescued", 
      description: "Status updated successfully.",
    });
  };

  const handleOccupantSelect = (occupant: Occupant) => {
    setSelectedOccupant(occupant);
    setOccupantModalOpen(true);
  };

  const handleZoneSelect = (zone: BuildingZone) => {
    setSelectedZone(zone);
    setZoneModalOpen(true);
  };

  const handleCameraSelect = (camera: Camera) => {
    toast({ 
      title: `Camera: ${camera.name}`, 
      description: `Floor ${camera.floor}, Zone ${camera.zone} - ${camera.status}` 
    });
  };

  // Calculate real stats from occupants
  const stuckCount = occupants.filter(o => o.status === 'stuck').length;
  const rescuedCount = occupants.filter(o => o.status === 'rescued').length;
  const safeCount = occupants.filter(o => o.status === 'safe').length;
  const injuredCount = occupants.filter(o => o.status === 'injured' || o.healthCondition === 'severe' || o.healthCondition === 'critical').length;
  
  const stats = {
    totalOccupants: mockStats.totalOccupants,
    safeOccupants: safeCount + (mockStats.safeOccupants - 1), // Simulated safe occupants outside our tracked list
    stuckOccupants: stuckCount,
    rescuedOccupants: rescuedCount,
    injuredOccupants: injuredCount,
    casualtyCount: 0,
    activeAlerts: activeAlerts.length,
    floorsAffected: mockStats.floorsAffected,
    evacuationProgress: Math.round(((safeCount + rescuedCount + mockStats.safeOccupants - 1) / mockStats.totalOccupants) * 100),
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        alertCount={activeAlerts.length} 
        isEmergency={isEmergency}
        onMenuToggle={() => setMenuOpen(!menuOpen)}
        menuOpen={menuOpen}
      />
      
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
        />
        
        <main className="flex-1 lg:ml-64 p-4 md:p-6">
          {/* Emergency Banner */}
          {isEmergency && (
            <div className="mb-6 p-4 bg-danger/10 border-2 border-danger rounded-lg animate-pulse">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-danger" />
                <div>
                  <h2 className="font-display text-lg font-bold text-danger">
                    EMERGENCY SITUATION ACTIVE
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {activeAlerts.filter(a => a.level === 'critical').length} critical alerts • 
                    {stats.stuckOccupants} people stuck • 
                    Government rescue teams notified
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 mb-6">
                <StatsCard
                  title="Total Occupants"
                  value={stats.totalOccupants}
                  icon={Users}
                  variant="info"
                />
                <StatsCard
                  title="Safe"
                  value={stats.safeOccupants + stats.rescuedOccupants}
                  icon={UserCheck}
                  variant="safe"
                />
                <StatsCard
                  title="Stuck"
                  value={stats.stuckOccupants}
                  icon={UserX}
                  variant="danger"
                />
                <StatsCard
                  title="Active Alerts"
                  value={activeAlerts.length}
                  icon={AlertTriangle}
                  variant={activeAlerts.length > 0 ? 'danger' : 'safe'}
                />
                <StatsCard
                  title="Injured"
                  value={stats.injuredOccupants}
                  icon={Shield}
                  variant="warning"
                />
                <StatsCard
                  title="Floors Affected"
                  value={stats.floorsAffected}
                  icon={Flame}
                  variant={stats.floorsAffected > 0 ? 'warning' : 'safe'}
                />
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                  {/* CCTV */}
                  <CCTVPanel 
                    cameras={mockCameras} 
                    onCameraSelect={handleCameraSelect}
                  />

                  {/* Building Map + Alerts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <BuildingMap 
                      zones={mockZones} 
                      occupants={occupants}
                      onZoneSelect={handleZoneSelect}
                    />
                    <AlertsPanel 
                      alerts={alerts} 
                      onAcknowledge={handleAcknowledgeAlert}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4 md:space-y-6">
                  {/* Evacuation Progress */}
                  <EvacuationProgress stats={stats} />

                  {/* Occupants List */}
                  <div className="h-[400px]">
                    <OccupantsList 
                      occupants={occupants}
                      onOccupantSelect={handleOccupantSelect}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6">
                <ControlPanel 
                  controls={controls}
                  onControlToggle={handleControlToggle}
                />
                <RescueTeamsPanel 
                  teams={rescueTeams}
                  onAlertTeam={handleAlertTeam}
                />
              </div>
            </>
          )}

          {/* Monitoring View */}
          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Sensor Monitoring</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatsCard title="Total Occupants" value={stats.totalOccupants} icon={Users} variant="info" />
                <StatsCard title="Safe" value={stats.safeOccupants + stats.rescuedOccupants} icon={UserCheck} variant="safe" />
                <StatsCard title="Stuck" value={stats.stuckOccupants} icon={UserX} variant="danger" />
                <StatsCard title="Active Alerts" value={activeAlerts.length} icon={AlertTriangle} variant={activeAlerts.length > 0 ? 'danger' : 'safe'} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AlertsPanel alerts={alerts} onAcknowledge={handleAcknowledgeAlert} />
                <EvacuationProgress stats={stats} />
              </div>
            </div>
          )}

          {/* CCTV View */}
          {activeTab === 'cctv' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold">CCTV Surveillance</h2>
              <CCTVPanel cameras={mockCameras} onCameraSelect={handleCameraSelect} />
            </div>
          )}

          {/* Occupants View */}
          {activeTab === 'occupants' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Occupants Management</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatsCard title="Total Occupants" value={stats.totalOccupants} icon={Users} variant="info" />
                <StatsCard title="Safe" value={stats.safeOccupants + stats.rescuedOccupants} icon={UserCheck} variant="safe" />
                <StatsCard title="Stuck" value={stats.stuckOccupants} icon={UserX} variant="danger" />
                <StatsCard title="Injured" value={stats.injuredOccupants} icon={Shield} variant="warning" />
              </div>
              <OccupantsList occupants={occupants} onOccupantSelect={handleOccupantSelect} />
            </div>
          )}

          {/* Building Map View */}
          {activeTab === 'map' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Building Map</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BuildingMap zones={mockZones} occupants={occupants} onZoneSelect={handleZoneSelect} />
                <EvacuationProgress stats={stats} />
              </div>
            </div>
          )}

          {/* Controls View */}
          {activeTab === 'controls' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Building Controls</h2>
              <ControlPanel controls={controls} onControlToggle={handleControlToggle} />
            </div>
          )}

          {/* Alerts View */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Alert Management</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <StatsCard title="Active Alerts" value={activeAlerts.length} icon={AlertTriangle} variant={activeAlerts.length > 0 ? 'danger' : 'safe'} />
                <StatsCard title="Critical" value={activeAlerts.filter(a => a.level === 'critical').length} icon={Flame} variant="danger" />
                <StatsCard title="Acknowledged" value={alerts.filter(a => a.acknowledged).length} icon={Shield} variant="info" />
              </div>
              <AlertsPanel alerts={alerts} onAcknowledge={handleAcknowledgeAlert} />
            </div>
          )}

          {/* Rescue Teams View */}
          {activeTab === 'rescue' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Rescue Teams</h2>
              <RescueTeamsPanel teams={rescueTeams} onAlertTeam={handleAlertTeam} />
            </div>
          )}

          {/* Reports View */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Reports</h2>
              <div className="p-8 bg-card rounded-lg border border-border text-center">
                <p className="text-muted-foreground">Report generation feature coming soon.</p>
              </div>
            </div>
          )}

          {/* Settings View */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Settings</h2>
              <div className="p-8 bg-card rounded-lg border border-border text-center">
                <p className="text-muted-foreground">System settings will be available here.</p>
              </div>
            </div>
          )}

          {/* Help View */}
          {activeTab === 'help' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Help & Documentation</h2>
              <div className="p-8 bg-card rounded-lg border border-border text-center">
                <p className="text-muted-foreground">Help documentation and support resources.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <OccupantDetailModal
        occupant={selectedOccupant}
        open={occupantModalOpen}
        onClose={() => setOccupantModalOpen(false)}
        onMarkRescued={handleMarkRescued}
      />
      <ZoneDetailModal
        zone={selectedZone}
        open={zoneModalOpen}
        onClose={() => setZoneModalOpen(false)}
      />
    </div>
  );
}
