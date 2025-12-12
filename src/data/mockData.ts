import { 
  Occupant, 
  Camera, 
  Alert, 
  BuildingZone, 
  ControlSystem, 
  RescueTeam,
  EmergencyStats,
  SensorData,
  EmergencySupply,
  CircuitSystem
} from '@/types';

// Helper function to generate occupants
const generateOccupants = (): Occupant[] => {
  const departments = ['Engineering', 'HR', 'Finance', 'IT', 'Security', 'Admin', 'R&D', 'Marketing', 'Legal', 'Operations'];
  const zones = ['A', 'B', 'C', 'D'];
  const conditions = ['Asthma', 'Heart condition', 'Diabetes', 'Hypertension', 'Mobility impaired', 'Pregnant', 'Epilepsy', 'Allergies'];
  const injuries = ['None', 'Smoke inhalation', 'Minor cuts', 'Burns on arm', 'Leg injury', 'Head injury', 'Bruises', 'Unable to move', 'Breathing difficulty', 'Fracture'];
  
  const names = [
    'Rajesh Kumar', 'Priya Sharma', 'Mohammed Ali', 'Sarah Johnson', 'Amit Patel',
    'Sneha Reddy', 'Vikram Singh', 'Anita Desai', 'Arjun Nair', 'Kavitha Menon',
    'Rahul Gupta', 'Deepa Krishnan', 'Suresh Iyer', 'Meena Joshi', 'Karthik Rajan',
    'Lakshmi Pillai', 'Sanjay Mehta', 'Pooja Agarwal', 'Venkat Rao', 'Divya Kulkarni',
    'Arun Bhat', 'Swathi Hegde', 'Naveen Shetty', 'Ritu Saxena', 'Prasad Murthy',
    'Rekha Naidu', 'Ashok Verma', 'Sunita Pandey', 'Manish Tiwari', 'Anjali Bhatt',
    'Ramesh Choudhary', 'Geeta Thakur', 'Vijay Malhotra', 'Nisha Kapoor', 'Sunil Ahuja',
    'Parveen Kaur', 'Tarun Bajaj', 'Simran Gill', 'Mohit Khanna', 'Preeti Bansal',
    'Gaurav Arora', 'Shweta Jain', 'Nitin Garg', 'Aarti Sinha', 'Rohit Dutta',
    'Vandana Roy', 'Aakash Mittal', 'Bhavna Chauhan', 'Dinesh Yadav', 'Pallavi Mishra',
    'Harish Goyal', 'Jyoti Rawat', 'Pankaj Saini', 'Madhu Bhatnagar', 'Alok Tandon',
    'Shilpa Oberoi', 'Rakesh Grover', 'Neetu Chandra', 'Sameer Vohra', 'Kritika Sethi',
    'Anil Dhawan', 'Sapna Kohli', 'Manoj Chopra', 'Richa Luthra', 'Siddharth Anand',
    'Neha Suri', 'Vivek Bedi', 'Komal Nagpal', 'Yash Malviya', 'Tanvi Sachdev'
  ];

  // Status distribution: 52 safe, 13 stuck, 5 rescued (matching mockStats)
  const statusDistribution: Array<{ status: Occupant['status']; health: Occupant['healthCondition']; count: number }> = [
    { status: 'safe', health: 'healthy', count: 45 },
    { status: 'safe', health: 'minor', count: 7 },
    { status: 'stuck', health: 'moderate', count: 5 },
    { status: 'stuck', health: 'severe', count: 4 },
    { status: 'stuck', health: 'critical', count: 4 },
    { status: 'rescued', health: 'minor', count: 3 },
    { status: 'rescued', health: 'healthy', count: 2 },
  ];

  const occupants: Occupant[] = [];
  let index = 0;

  statusDistribution.forEach(({ status, health, count }) => {
    for (let i = 0; i < count && index < 70; i++) {
      const floor = status === 'stuck' ? (Math.random() > 0.5 ? 3 : 4) : Math.floor(Math.random() * 4) + 1;
      const zone = zones[Math.floor(Math.random() * zones.length)];
      const hasConditions = Math.random() > 0.7;
      const preExisting = hasConditions 
        ? [conditions[Math.floor(Math.random() * conditions.length)]]
        : [];
      if (hasConditions && Math.random() > 0.6) {
        preExisting.push(conditions[Math.floor(Math.random() * conditions.length)]);
      }
      
      const injury = status === 'stuck' || health !== 'healthy' 
        ? injuries[Math.floor(Math.random() * (injuries.length - 1)) + 1]
        : 'None';

      // Calculate triage score based on status and health
      let triageScore: number;
      if (status === 'stuck' && health === 'critical') {
        triageScore = 85 + Math.floor(Math.random() * 15);
      } else if (status === 'stuck' && health === 'severe') {
        triageScore = 70 + Math.floor(Math.random() * 15);
      } else if (status === 'stuck') {
        triageScore = 50 + Math.floor(Math.random() * 20);
      } else if (health === 'minor') {
        triageScore = 25 + Math.floor(Math.random() * 15);
      } else {
        triageScore = 5 + Math.floor(Math.random() * 20);
      }

      occupants.push({
        id: String(index + 1),
        tempUID: `TUID-${String(index + 1).padStart(3, '0')}`,
        name: names[index],
        department: departments[Math.floor(Math.random() * departments.length)],
        floor,
        zone,
        location: { 
          lat: 12.9710 + (Math.random() * 0.002), 
          lng: 77.5940 + (Math.random() * 0.002) 
        },
        status,
        healthCondition: health,
        preExistingConditions: preExisting,
        injuryStatus: injury,
        entryTime: new Date(`2024-01-15T0${7 + Math.floor(Math.random() * 3)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`),
        lastSeen: new Date(),
        triageScore,
        contactNumber: `+91 ${98760 + index} ${43210 + index}`,
        emergencyContact: `+91 ${98760 + index} ${43211 + index}`,
      });
      index++;
    }
  });

  return occupants;
};

// Mock Occupants Data - 70 occupants
export const mockOccupants: Occupant[] = generateOccupants();

// Mock Cameras
export const mockCameras: Camera[] = [
  { id: 'CAM-001', name: 'Lobby Main', floor: 1, zone: 'A', status: 'online', streamUrl: '/camera/1', isLocal: true },
  { id: 'CAM-002', name: 'Floor 2 Corridor', floor: 2, zone: 'A', status: 'online', streamUrl: '/camera/2', isLocal: true },
  { id: 'CAM-003', name: 'Floor 3 East Wing', floor: 3, zone: 'A', status: 'online', streamUrl: '/camera/3', isLocal: true },
  { id: 'CAM-004', name: 'Floor 3 West Wing', floor: 3, zone: 'B', status: 'recording', streamUrl: '/camera/4', isLocal: true },
  { id: 'CAM-005', name: 'Floor 4 Server Room', floor: 4, zone: 'C', status: 'online', streamUrl: '/camera/5', isLocal: true },
  { id: 'CAM-006', name: 'Stairwell A', floor: 0, zone: 'A', status: 'online', streamUrl: '/camera/6', isLocal: true },
  { id: 'CAM-007', name: 'Emergency Exit B', floor: 0, zone: 'B', status: 'offline', streamUrl: '/camera/7', isLocal: true },
  { id: 'CAM-008', name: 'Parking Level', floor: -1, zone: 'A', status: 'online', streamUrl: '/camera/8', isLocal: true },
];

// Mock Alerts
export const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    type: 'fire',
    level: 'critical',
    message: 'FIRE DETECTED - Floor 3, Zone A - Immediate evacuation required',
    floor: 3,
    zone: 'A',
    timestamp: new Date(),
    isActive: true,
    acknowledged: false,
    sensor: 'SMOKE-3A-01',
  },
  {
    id: 'ALT-002',
    type: 'gas',
    level: 'warning',
    message: 'Elevated CO levels detected - Floor 4, Zone C',
    floor: 4,
    zone: 'C',
    timestamp: new Date(Date.now() - 300000),
    isActive: true,
    acknowledged: true,
    sensor: 'GAS-4C-02',
  },
  {
    id: 'ALT-003',
    type: 'structural',
    level: 'danger',
    message: 'Structural integrity warning - Floor 3, Zone B - Vibration sensors triggered',
    floor: 3,
    zone: 'B',
    timestamp: new Date(Date.now() - 600000),
    isActive: true,
    acknowledged: false,
    sensor: 'VIB-3B-01',
  },
];

// Mock Sensors
const createSensors = (floor: number, zone: string): SensorData[] => [
  {
    id: `SMOKE-${floor}${zone}-01`,
    type: 'smoke',
    value: floor === 3 && zone === 'A' ? 85 : Math.random() * 20,
    threshold: 50,
    unit: 'ppm',
    status: floor === 3 && zone === 'A' ? 'critical' : 'safe',
    lastUpdate: new Date(),
  },
  {
    id: `TEMP-${floor}${zone}-01`,
    type: 'temperature',
    value: floor === 3 && zone === 'A' ? 78 : 22 + Math.random() * 5,
    threshold: 60,
    unit: '°C',
    status: floor === 3 && zone === 'A' ? 'danger' : 'safe',
    lastUpdate: new Date(),
  },
  {
    id: `GAS-${floor}${zone}-01`,
    type: 'gas',
    value: floor === 4 && zone === 'C' ? 45 : Math.random() * 15,
    threshold: 35,
    unit: 'ppm',
    status: floor === 4 && zone === 'C' ? 'warning' : 'safe',
    lastUpdate: new Date(),
  },
];

// Mock Building Zones
export const mockZones: BuildingZone[] = [
  { id: 'Z-1A', name: 'Ground Floor - Lobby', floor: 1, status: 'safe', occupantCount: 12, sensors: createSensors(1, 'A'), evacPath: 'safe' },
  { id: 'Z-2A', name: 'Floor 2 - Admin', floor: 2, status: 'safe', occupantCount: 25, sensors: createSensors(2, 'A'), evacPath: 'safe' },
  { id: 'Z-2B', name: 'Floor 2 - HR', floor: 2, status: 'warning', occupantCount: 15, sensors: createSensors(2, 'B'), evacPath: 'safe' },
  { id: 'Z-3A', name: 'Floor 3 - Engineering', floor: 3, status: 'critical', occupantCount: 8, sensors: createSensors(3, 'A'), evacPath: 'danger' },
  { id: 'Z-3B', name: 'Floor 3 - R&D', floor: 3, status: 'danger', occupantCount: 5, sensors: createSensors(3, 'B'), evacPath: 'blocked' },
  { id: 'Z-4A', name: 'Floor 4 - Executive', floor: 4, status: 'warning', occupantCount: 3, sensors: createSensors(4, 'A'), evacPath: 'safe' },
  { id: 'Z-4C', name: 'Floor 4 - Server Room', floor: 4, status: 'warning', occupantCount: 2, sensors: createSensors(4, 'C'), evacPath: 'safe' },
];

// Mock Control Systems
export const mockControls: ControlSystem[] = [
  { id: 'CTRL-ALM-01', name: 'Building Alarm', type: 'alarm', floor: 0, zone: 'ALL', status: 'on', isManualOverride: false },
  { id: 'CTRL-SPR-3A', name: 'Sprinkler 3A', type: 'sprinkler', floor: 3, zone: 'A', status: 'on', isManualOverride: false },
  { id: 'CTRL-SPR-3B', name: 'Sprinkler 3B', type: 'sprinkler', floor: 3, zone: 'B', status: 'auto', isManualOverride: false },
  { id: 'CTRL-DOOR-EM1', name: 'Emergency Exit 1', type: 'door', floor: 1, zone: 'A', status: 'on', isManualOverride: true },
  { id: 'CTRL-DOOR-EM2', name: 'Emergency Exit 2', type: 'door', floor: 2, zone: 'B', status: 'on', isManualOverride: false },
  { id: 'CTRL-VENT-01', name: 'Smoke Extraction', type: 'ventilation', floor: 0, zone: 'ALL', status: 'on', isManualOverride: false },
  { id: 'CTRL-PWR-EM', name: 'Emergency Power', type: 'power', floor: 0, zone: 'ALL', status: 'on', isManualOverride: false },
  { id: 'CTRL-LGT-EVA', name: 'Evacuation Lights', type: 'light', floor: 0, zone: 'ALL', status: 'on', isManualOverride: false },
];

// Mock Rescue Teams
export const mockRescueTeams: RescueTeam[] = [
  { id: 'RT-INT', name: 'Internal Safety Team', type: 'internal', status: 'on_scene', contactNumber: '+91 1800 123 001', notifiedAt: new Date() },
  { id: 'RT-FIRE', name: 'Fire Department', type: 'fire_dept', status: 'dispatched', eta: 8, contactNumber: '101', notifiedAt: new Date() },
  { id: 'RT-MED', name: 'Ambulance Service', type: 'medical', status: 'alerted', eta: 12, contactNumber: '108', notifiedAt: new Date() },
  { id: 'RT-POL', name: 'Local Police', type: 'police', status: 'standby', contactNumber: '100' },
];

// Emergency Statistics
export const mockStats: EmergencyStats = {
  totalOccupants: 70,
  safeOccupants: 52,
  stuckOccupants: 13,
  rescuedOccupants: 5,
  injuredOccupants: 8,
  casualtyCount: 0,
  activeAlerts: 3,
  floorsAffected: 2,
  evacuationProgress: 74,
};

// Emergency Supplies (10-day reserve)
export const mockSupplies: EmergencySupply[] = [
  {
    id: 'SUP-001',
    name: 'Drinking Water',
    type: 'water',
    totalUnits: 500,
    usedUnits: 120,
    unit: 'liters',
    daysRemaining: 8,
    location: 'Floor 1 - Emergency Room',
    lastRestocked: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: 'SUP-002',
    name: 'Emergency Food Packs',
    type: 'food',
    totalUnits: 200,
    usedUnits: 45,
    unit: 'packs',
    daysRemaining: 9,
    location: 'Floor 1 - Emergency Room',
    lastRestocked: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: 'SUP-003',
    name: 'First Aid Kits',
    type: 'medical',
    totalUnits: 50,
    usedUnits: 12,
    unit: 'kits',
    daysRemaining: 7,
    location: 'Multiple Floors',
    lastRestocked: new Date(Date.now() - 86400000 * 5),
  },
  {
    id: 'SUP-004',
    name: 'Emergency Blankets',
    type: 'blankets',
    totalUnits: 100,
    usedUnits: 25,
    unit: 'pieces',
    daysRemaining: 10,
    location: 'Floor 2 - Storage',
    lastRestocked: new Date(Date.now() - 86400000 * 7),
  },
  {
    id: 'SUP-005',
    name: 'Flashlights',
    type: 'flashlights',
    totalUnits: 40,
    usedUnits: 8,
    unit: 'units',
    daysRemaining: 10,
    location: 'Security Office',
    lastRestocked: new Date(Date.now() - 86400000 * 10),
  },
  {
    id: 'SUP-006',
    name: 'Backup Batteries',
    type: 'batteries',
    totalUnits: 200,
    usedUnits: 85,
    unit: 'packs',
    daysRemaining: 4,
    location: 'Floor 4 - Server Room',
    lastRestocked: new Date(Date.now() - 86400000 * 8),
  },
];

// Circuit Systems with Failure Prediction
export const mockCircuits: CircuitSystem[] = [
  {
    id: 'CIR-001',
    name: 'Main Power Distribution',
    zone: 'ALL',
    floor: 0,
    status: 'healthy',
    load: 65,
    maxLoad: 100,
    temperature: 42,
    predictedFailure: false,
    failureRisk: 15,
    lastMaintenance: new Date(Date.now() - 86400000 * 14),
  },
  {
    id: 'CIR-002',
    name: 'Floor 3 Circuit A',
    zone: 'A',
    floor: 3,
    status: 'critical',
    load: 95,
    maxLoad: 100,
    temperature: 78,
    predictedFailure: true,
    failureRisk: 85,
    lastMaintenance: new Date(Date.now() - 86400000 * 45),
    solution: 'Immediate load reduction required. Redirect non-essential systems to backup circuit. Schedule emergency maintenance.',
  },
  {
    id: 'CIR-003',
    name: 'Floor 3 Circuit B',
    zone: 'B',
    floor: 3,
    status: 'warning',
    load: 78,
    maxLoad: 100,
    temperature: 55,
    predictedFailure: true,
    failureRisk: 62,
    lastMaintenance: new Date(Date.now() - 86400000 * 30),
    solution: 'High load detected. Consider redistributing electrical load to prevent overheating. Maintenance recommended within 24 hours.',
  },
  {
    id: 'CIR-004',
    name: 'Emergency Lighting',
    zone: 'ALL',
    floor: 0,
    status: 'healthy',
    load: 45,
    maxLoad: 100,
    temperature: 35,
    predictedFailure: false,
    failureRisk: 8,
    lastMaintenance: new Date(Date.now() - 86400000 * 7),
  },
  {
    id: 'CIR-005',
    name: 'Server Room UPS',
    zone: 'C',
    floor: 4,
    status: 'warning',
    load: 82,
    maxLoad: 100,
    temperature: 52,
    predictedFailure: true,
    failureRisk: 48,
    lastMaintenance: new Date(Date.now() - 86400000 * 21),
    solution: 'Battery capacity degradation detected. Replace UPS batteries within 48 hours to ensure backup power reliability.',
  },
  {
    id: 'CIR-006',
    name: 'HVAC System',
    zone: 'ALL',
    floor: 0,
    status: 'failed',
    load: 0,
    maxLoad: 100,
    temperature: 25,
    predictedFailure: false,
    failureRisk: 100,
    lastMaintenance: new Date(Date.now() - 86400000 * 60),
    solution: 'Circuit breaker tripped due to fire damage. Manual reset required after fire suppression. Check for wire damage before restoring power.',
  },
];
