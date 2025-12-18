import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { BuildingMap } from "@/components/dashboard/BuildingMap";
import { CCTVAccessControl } from "@/components/dashboard/CCTVAccessControl";
import { OccupantsList } from "@/components/dashboard/OccupantsList";
import { ControlPanel } from "@/components/dashboard/ControlPanel";
import { RescueTeamsPanel } from "@/components/dashboard/RescueTeamsPanel";
import { EvacuationProgress } from "@/components/dashboard/EvacuationProgress";
import { SuppliesPanel } from "@/components/dashboard/SuppliesPanel";
import { CircuitPredictionPanel } from "@/components/dashboard/CircuitPredictionPanel";
import { ReportsPanel } from "@/components/dashboard/ReportsPanel";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";
import { HelpPanel } from "@/components/dashboard/HelpPanel";
import { OccupantDetailModal } from "@/components/modals/OccupantDetailModal";
import { ZoneDetailModal } from "@/components/modals/ZoneDetailModal";
import { AllOccupantsModal } from "@/components/modals/AllOccupantsModal";
import { AddOccupantModal } from "@/components/modals/AddOccupantModal";
import { Button } from "@/components/ui/button";
import { 
  mockOccupants, 
  mockCameras, 
  mockAlerts, 
  mockZones, 
  mockControls,
  mockRescueTeams,
  mockStats,
  mockSupplies,
  mockCircuits
} from "@/data/mockData";
import { Occupant, BuildingZone, Camera } from "@/types";
import { 
  Users, 
  AlertTriangle, 
  UserCheck, 
  UserX,
  Shield,
  Flame,
  Eye,
  UserPlus
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
  const [circuits, setCircuits] = useState(mockCircuits);

  // Modal states
  const [selectedOccupant, setSelectedOccupant] = useState<Occupant | null>(null);
  const [selectedZone, setSelectedZone] = useState<BuildingZone | null>(null);
  const [occupantModalOpen, setOccupantModalOpen] = useState(false);
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [allOccupantsModalOpen, setAllOccupantsModalOpen] = useState(false);
  const [addOccupantModalOpen, setAddOccupantModalOpen] = useState(false);

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
    toast({ title: "Control Updated", description: `${id} has been turned ${status}.` });
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

  const handleRepairCircuit = (id: string) => {
    setCircuits(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'warning' as const, failureRisk: Math.max(c.failureRisk - 30, 10) } : c
    ));
  };

  const handleAddOccupant = (newOccupant: Occupant) => {
    setOccupants(prev => [...prev, newOccupant]);
  };

  // Header button handlers
  const handleAlertsClick = () => setActiveTab('alerts');
  const handleSettingsClick = () => setActiveTab('settings');
  const handleUserClick = () => {
    toast({ title: "User Profile", description: "Safety Team Admin - Active Session" });
  };

  // Calculate real stats from occupants
  const stuckCount = occupants.filter(o => o.status === 'stuck').length;
  const rescuedCount = occupants.filter(o => o.status === 'rescued').length;
  const safeCount = occupants.filter(o => o.status === 'safe').length;
  const injuredCount = occupants.filter(o => o.status === 'injured' || o.healthCondition === 'severe' || o.healthCondition === 'critical').length;
  
  const stats = {
    totalOccupants: mockStats.totalOccupants,
    safeOccupants: safeCount + (mockStats.safeOccupants - 1),
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
        onAlertsClick={handleAlertsClick}
        onSettingsClick={handleSettingsClick}
        onUserClick={handleUserClick}
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
                  {/* CCTV with Access Control */}
                  <CCTVAccessControl 
                    cameras={mockCameras} 
                    onCameraSelect={handleCameraSelect}
                    isEmergency={isEmergency}
                    userRole="head"
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

                  {/* Occupants List with View All Button */}
                  <div className="h-[400px] relative">
                    <OccupantsList 
                      occupants={occupants}
                      onOccupantSelect={handleOccupantSelect}
                    />
                    <Button 
                      variant="info" 
                      size="sm" 
                      className="absolute top-3 right-3"
                      onClick={() => setAllOccupantsModalOpen(true)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View All
                    </Button>
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

              {/* Supplies & Circuits Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6">
                <SuppliesPanel supplies={mockSupplies} />
                <CircuitPredictionPanel 
                  circuits={circuits}
                  onRepairCircuit={handleRepairCircuit}
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
                <CircuitPredictionPanel circuits={circuits} onRepairCircuit={handleRepairCircuit} />
              </div>
            </div>
          )}

          {/* CCTV View */}
          {activeTab === 'cctv' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold">CCTV Surveillance</h2>
              <CCTVAccessControl 
                cameras={mockCameras} 
                onCameraSelect={handleCameraSelect}
                isEmergency={isEmergency}
                userRole="head"
              />
            </div>
          )}

          {/* Occupants View */}
          {activeTab === 'occupants' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="font-display text-2xl font-bold">Occupants Management</h2>
                <div className="flex gap-2">
                  <Button variant="default" onClick={() => setAddOccupantModalOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Occupant
                  </Button>
                  <Button variant="info" onClick={() => setAllOccupantsModalOpen(true)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View All with Coordinates
                  </Button>
                </div>
              </div>
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
              <p className="text-muted-foreground">Manually control all building systems with the buttons below.</p>
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

          {/* Supplies View */}
          {activeTab === 'supplies' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Emergency Supplies</h2>
              <p className="text-muted-foreground">Track food, water, and essential supplies for stuck occupants (10-day reserve).</p>
              <SuppliesPanel supplies={mockSupplies} />
            </div>
          )}

          {/* Circuits View */}
          {activeTab === 'circuits' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Circuit Failure Prediction</h2>
              <p className="text-muted-foreground">Monitor electrical systems and get AI-powered failure predictions with solutions.</p>
              <CircuitPredictionPanel circuits={circuits} onRepairCircuit={handleRepairCircuit} />
            </div>
          )}

          {/* Reports View */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Reports & Documentation</h2>
              <p className="text-muted-foreground">Generate, download, and schedule emergency reports for compliance and analysis.</p>
              <ReportsPanel stats={stats} alertCount={activeAlerts.length} />
            </div>
          )}

          {/* Settings View */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold">System Settings</h2>
              <p className="text-muted-foreground">Configure notifications, sensors, GSM module, CCTV, and system preferences.</p>
              <SettingsPanel />
            </div>
          )}

          {/* Help View */}
          {activeTab === 'help' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Help & Documentation</h2>
              <p className="text-muted-foreground">Learn about the SDRRS modules, emergency procedures, and get support.</p>
              <HelpPanel />
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
      <AllOccupantsModal
        occupants={occupants}
        open={allOccupantsModalOpen}
        onClose={() => setAllOccupantsModalOpen(false)}
        onSelectOccupant={(occupant) => {
          setAllOccupantsModalOpen(false);
          handleOccupantSelect(occupant);
        }}
      />
      <AddOccupantModal
        isOpen={addOccupantModalOpen}
        onClose={() => setAddOccupantModalOpen(false)}
        onAddOccupant={handleAddOccupant}
        existingCount={occupants.length}
      />
    </div>
  );
}
