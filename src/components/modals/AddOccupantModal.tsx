import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Occupant, OccupantStatus, HealthCondition } from "@/types";
import { UserPlus, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AddOccupantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOccupant: (occupant: Occupant) => void;
  existingCount: number;
}

const departments = ['Engineering', 'HR', 'Finance', 'IT', 'Security', 'Admin', 'R&D', 'Marketing', 'Legal', 'Operations'];
const zones = ['A', 'B', 'C', 'D'];
const conditions = ['Asthma', 'Heart condition', 'Diabetes', 'Hypertension', 'Mobility impaired', 'Pregnant', 'Epilepsy', 'Allergies'];

export function AddOccupantModal({ isOpen, onClose, onAddOccupant, existingCount }: AddOccupantModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    floor: '1',
    zone: 'A',
    latitude: '12.9716',
    longitude: '77.5946',
    status: 'safe' as OccupantStatus,
    healthCondition: 'healthy' as HealthCondition,
    preExistingConditions: [] as string[],
    injuryStatus: 'None',
    contactNumber: '',
    emergencyContact: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.department || !formData.contactNumber) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in name, department, and contact number.",
        variant: "destructive",
      });
      return;
    }

    const newId = String(existingCount + 1);
    const newOccupant: Occupant = {
      id: newId,
      tempUID: `TUID-${newId.padStart(3, '0')}`,
      name: formData.name.trim(),
      department: formData.department,
      floor: parseInt(formData.floor),
      zone: formData.zone,
      location: {
        lat: parseFloat(formData.latitude),
        lng: parseFloat(formData.longitude),
      },
      status: formData.status,
      healthCondition: formData.healthCondition,
      preExistingConditions: formData.preExistingConditions,
      injuryStatus: formData.injuryStatus,
      entryTime: new Date(),
      lastSeen: new Date(),
      triageScore: calculateTriageScore(formData.status, formData.healthCondition),
      contactNumber: formData.contactNumber,
      emergencyContact: formData.emergencyContact,
    };

    onAddOccupant(newOccupant);
    toast({
      title: "Occupant Added",
      description: `${formData.name} has been added successfully.`,
    });
    
    // Reset form
    setFormData({
      name: '',
      department: '',
      floor: '1',
      zone: 'A',
      latitude: '12.9716',
      longitude: '77.5946',
      status: 'safe',
      healthCondition: 'healthy',
      preExistingConditions: [],
      injuryStatus: 'None',
      contactNumber: '',
      emergencyContact: '',
    });
    onClose();
  };

  const calculateTriageScore = (status: OccupantStatus, health: HealthCondition): number => {
    if (status === 'stuck' && health === 'critical') return 85 + Math.floor(Math.random() * 15);
    if (status === 'stuck' && health === 'severe') return 70 + Math.floor(Math.random() * 15);
    if (status === 'stuck') return 50 + Math.floor(Math.random() * 20);
    if (health === 'minor') return 25 + Math.floor(Math.random() * 15);
    return 5 + Math.floor(Math.random() * 20);
  };

  const toggleCondition = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      preExistingConditions: prev.preExistingConditions.includes(condition)
        ? prev.preExistingConditions.filter(c => c !== condition)
        : [...prev.preExistingConditions, condition]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <UserPlus className="w-5 h-5 text-primary" />
            Add New Occupant
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select value={formData.department} onValueChange={(v) => setFormData(prev => ({ ...prev, department: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Select value={formData.floor} onValueChange={(v) => setFormData(prev => ({ ...prev, floor: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map(f => (
                    <SelectItem key={f} value={String(f)}>Floor {f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zone">Zone</Label>
              <Select value={formData.zone} onValueChange={(v) => setFormData(prev => ({ ...prev, zone: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {zones.map(z => (
                    <SelectItem key={z} value={z}>Zone {z}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="latitude" className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Latitude
              </Label>
              <Input
                id="latitude"
                type="number"
                step="0.0001"
                value={formData.latitude}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="0.0001"
                value={formData.longitude}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
              />
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData(prev => ({ ...prev, status: v as OccupantStatus }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safe">Safe</SelectItem>
                  <SelectItem value="stuck">Stuck</SelectItem>
                  <SelectItem value="rescued">Rescued</SelectItem>
                  <SelectItem value="injured">Injured</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Health Condition</Label>
              <Select value={formData.healthCondition} onValueChange={(v) => setFormData(prev => ({ ...prev, healthCondition: v as HealthCondition }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="minor">Minor Issues</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pre-existing Conditions */}
          <div className="space-y-2">
            <Label>Pre-existing Conditions</Label>
            <div className="flex flex-wrap gap-2">
              {conditions.map(condition => (
                <Button
                  key={condition}
                  type="button"
                  variant={formData.preExistingConditions.includes(condition) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleCondition(condition)}
                >
                  {condition}
                </Button>
              ))}
            </div>
          </div>

          {/* Injury */}
          <div className="space-y-2">
            <Label htmlFor="injury">Injury Status</Label>
            <Input
              id="injury"
              value={formData.injuryStatus}
              onChange={(e) => setFormData(prev => ({ ...prev, injuryStatus: e.target.value }))}
              placeholder="Describe any injuries"
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number *</Label>
              <Input
                id="contact"
                value={formData.contactNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency">Emergency Contact</Label>
              <Input
                id="emergency"
                value={formData.emergencyContact}
                onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Occupant
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
