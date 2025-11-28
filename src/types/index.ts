export type AlertLevel = 'safe' | 'warning' | 'danger' | 'critical';
export type DisasterType = 'fire' | 'gas' | 'structural' | 'earthquake' | 'flood' | 'none';
export type OccupantStatus = 'safe' | 'stuck' | 'rescued' | 'injured' | 'critical';
export type HealthCondition = 'healthy' | 'minor' | 'moderate' | 'severe' | 'critical';

export interface Occupant {
  id: string;
  tempUID: string;
  name: string;
  department: string;
  floor: number;
  zone: string;
  location: {
    lat: number;
    lng: number;
  };
  status: OccupantStatus;
  healthCondition: HealthCondition;
  preExistingConditions: string[];
  injuryStatus: string;
  entryTime: Date;
  lastSeen: Date;
  triageScore: number;
  contactNumber: string;
  emergencyContact: string;
  photo?: string;
}

export interface Camera {
  id: string;
  name: string;
  floor: number;
  zone: string;
  status: 'online' | 'offline' | 'recording';
  streamUrl: string;
  isLocal: boolean;
}

export interface Alert {
  id: string;
  type: DisasterType;
  level: AlertLevel;
  message: string;
  floor: number;
  zone: string;
  timestamp: Date;
  isActive: boolean;
  acknowledged: boolean;
  sensor: string;
}

export interface BuildingZone {
  id: string;
  name: string;
  floor: number;
  status: AlertLevel;
  occupantCount: number;
  sensors: SensorData[];
  evacPath: 'safe' | 'blocked' | 'danger';
}

export interface SensorData {
  id: string;
  type: 'smoke' | 'gas' | 'temperature' | 'vibration' | 'water';
  value: number;
  threshold: number;
  unit: string;
  status: AlertLevel;
  lastUpdate: Date;
}

export interface ControlSystem {
  id: string;
  name: string;
  type: 'alarm' | 'sprinkler' | 'door' | 'ventilation' | 'power' | 'light';
  floor: number;
  zone: string;
  status: 'on' | 'off' | 'auto' | 'fault';
  isManualOverride: boolean;
}

export interface RescueTeam {
  id: string;
  name: string;
  type: 'internal' | 'fire_dept' | 'medical' | 'police';
  status: 'standby' | 'alerted' | 'dispatched' | 'on_scene';
  eta?: number;
  contactNumber: string;
  notifiedAt?: Date;
}

export interface EmergencyStats {
  totalOccupants: number;
  safeOccupants: number;
  stuckOccupants: number;
  rescuedOccupants: number;
  injuredOccupants: number;
  casualtyCount: number;
  activeAlerts: number;
  floorsAffected: number;
  evacuationProgress: number;
}
