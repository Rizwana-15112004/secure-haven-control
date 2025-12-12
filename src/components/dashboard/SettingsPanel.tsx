import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Settings, 
  Bell, 
  Shield, 
  Wifi, 
  Database, 
  Users,
  Phone,
  Mail,
  Volume2,
  Monitor,
  Moon,
  Sun,
  Save,
  RefreshCw,
  Server,
  Radio,
  Smartphone
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function SettingsPanel() {
  const [settings, setSettings] = useState({
    // Notification Settings
    enableSMS: true,
    enableEmail: true,
    enableVoiceAlerts: true,
    alertVolume: 80,
    
    // GSM Module Settings
    gsmEnabled: true,
    primarySIM: '+91 9876543210',
    backupSIM: '+91 9876543211',
    
    // Government Contacts
    fireStation: '101',
    ambulance: '108',
    police: '100',
    disasterManagement: '1078',
    
    // System Settings
    autoBackup: true,
    offlineMode: true,
    darkMode: true,
    highContrast: false,
    
    // Sensor Settings
    smokeThreshold: 50,
    tempThreshold: 60,
    gasThreshold: 35,
    
    // CCTV Settings
    localRecording: true,
    retentionDays: 30,
    motionDetection: true,
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "All settings have been updated successfully.",
    });
  };

  const handleTestGSM = () => {
    toast({
      title: "GSM Test",
      description: "Test SMS sent to configured numbers.",
    });
  };

  const handleTestAlarm = () => {
    toast({
      title: "Alarm Test",
      description: "Building alarm test initiated for 5 seconds.",
    });
  };

  const handleSyncSensors = () => {
    toast({
      title: "Sensor Sync",
      description: "All sensors synchronized successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions Bar */}
      <div className="flex flex-wrap gap-3">
        <Button variant="default" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
        <Button variant="secondary" onClick={handleSyncSensors}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Sync Sensors
        </Button>
        <Button variant="secondary" onClick={handleTestGSM}>
          <Radio className="w-4 h-4 mr-2" />
          Test GSM Module
        </Button>
        <Button variant="secondary" onClick={handleTestAlarm}>
          <Volume2 className="w-4 h-4 mr-2" />
          Test Alarm
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-info" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sms" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                SMS Alerts
              </Label>
              <Switch 
                id="sms" 
                checked={settings.enableSMS}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, enableSMS: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Notifications
              </Label>
              <Switch 
                id="email" 
                checked={settings.enableEmail}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, enableEmail: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="voice" className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Voice Alerts
              </Label>
              <Switch 
                id="voice" 
                checked={settings.enableVoiceAlerts}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, enableVoiceAlerts: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* GSM Module Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-info" />
              GSM Module (Offline Alerts)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="gsm">GSM Module Enabled</Label>
              <Switch 
                id="gsm" 
                checked={settings.gsmEnabled}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, gsmEnabled: checked }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Primary SIM Number</Label>
              <Input 
                value={settings.primarySIM}
                onChange={(e) => setSettings(s => ({ ...s, primarySIM: e.target.value }))}
                className="bg-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label>Backup SIM Number</Label>
              <Input 
                value={settings.backupSIM}
                onChange={(e) => setSettings(s => ({ ...s, backupSIM: e.target.value }))}
                className="bg-secondary"
              />
            </div>
            <div className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded">
              GSM module works without internet for emergency SMS transmission.
            </div>
          </CardContent>
        </Card>

        {/* Government Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-info" />
              Government Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fire Station</Label>
                <Input 
                  value={settings.fireStation}
                  onChange={(e) => setSettings(s => ({ ...s, fireStation: e.target.value }))}
                  className="bg-secondary"
                />
              </div>
              <div className="space-y-2">
                <Label>Ambulance</Label>
                <Input 
                  value={settings.ambulance}
                  onChange={(e) => setSettings(s => ({ ...s, ambulance: e.target.value }))}
                  className="bg-secondary"
                />
              </div>
              <div className="space-y-2">
                <Label>Police</Label>
                <Input 
                  value={settings.police}
                  onChange={(e) => setSettings(s => ({ ...s, police: e.target.value }))}
                  className="bg-secondary"
                />
              </div>
              <div className="space-y-2">
                <Label>Disaster Management</Label>
                <Input 
                  value={settings.disasterManagement}
                  onChange={(e) => setSettings(s => ({ ...s, disasterManagement: e.target.value }))}
                  className="bg-secondary"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sensor Thresholds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-info" />
              Sensor Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Smoke Detection (ppm)</Label>
              <Input 
                type="number"
                value={settings.smokeThreshold}
                onChange={(e) => setSettings(s => ({ ...s, smokeThreshold: Number(e.target.value) }))}
                className="bg-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label>Temperature Alert (°C)</Label>
              <Input 
                type="number"
                value={settings.tempThreshold}
                onChange={(e) => setSettings(s => ({ ...s, tempThreshold: Number(e.target.value) }))}
                className="bg-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label>Gas Detection (ppm)</Label>
              <Input 
                type="number"
                value={settings.gasThreshold}
                onChange={(e) => setSettings(s => ({ ...s, gasThreshold: Number(e.target.value) }))}
                className="bg-secondary"
              />
            </div>
          </CardContent>
        </Card>

        {/* CCTV Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-info" />
              CCTV & Recording
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="localRec">Local SSD Recording</Label>
              <Switch 
                id="localRec" 
                checked={settings.localRecording}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, localRecording: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="motion">Motion Detection</Label>
              <Switch 
                id="motion" 
                checked={settings.motionDetection}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, motionDetection: checked }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Retention Period (Days)</Label>
              <Input 
                type="number"
                value={settings.retentionDays}
                onChange={(e) => setSettings(s => ({ ...s, retentionDays: Number(e.target.value) }))}
                className="bg-secondary"
              />
            </div>
            <div className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded">
              Footage stored on local SSD for offline access during emergencies.
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-info" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="backup" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Auto Backup
              </Label>
              <Switch 
                id="backup" 
                checked={settings.autoBackup}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, autoBackup: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="offline" className="flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                Offline Mode Support
              </Label>
              <Switch 
                id="offline" 
                checked={settings.offlineMode}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, offlineMode: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark" className="flex items-center gap-2">
                <Moon className="w-4 h-4" />
                Dark Mode
              </Label>
              <Switch 
                id="dark" 
                checked={settings.darkMode}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, darkMode: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="contrast" className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                High Contrast Mode
              </Label>
              <Switch 
                id="contrast" 
                checked={settings.highContrast}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, highContrast: checked }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
