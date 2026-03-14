import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  Video,
  FileText,
  Shield,
  AlertTriangle,
  Users,
  Download,
  PlayCircle
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { setupSDRRSDoc, addFooter, drawTable } from "@/lib/pdfHelper";
import { VideoModal } from "@/components/modals/VideoModal";

export function HelpPanel() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const faqs = [
    {
      question: 'How do I view all occupants with their exact locations?',
      answer: 'Go to the "Occupants" tab in the sidebar and click "View All Occupants with Coordinates". You can see each person\'s GPS coordinates (Lat/Long), copy them, or open directly in Google Maps.',
    },
    {
      question: 'How does the triage score work?',
      answer: 'The triage score (0-100) prioritizes rescue order. Higher scores indicate more urgent cases. Factors include: stuck status, health condition, pre-existing conditions, injuries, and time since last contact. Score 80+ = Critical, 50-79 = High Priority, <50 = Normal.',
    },
    {
      question: 'What happens when I trigger an emergency alert?',
      answer: 'The system automatically: 1) Activates building sirens and red lights, 2) Sends SMS alerts via GSM to government rescue teams (Fire, Ambulance, Police), 3) Notifies internal safety team, 4) Updates all occupant tracking, 5) Enables voice guidance for evacuation.',
    },
    {
      question: 'Can the system work without internet?',
      answer: 'Yes! The offline hardware layer continues operating during internet/power outages. GSM module sends SMS alerts, local SSD stores CCTV footage, BLE beacons track locations, and UPS powers critical systems.',
    },
    {
      question: 'How do I manually control building systems?',
      answer: 'Go to "Controls" tab. You can toggle: Building Alarm, Sprinklers (per zone), Emergency Doors, Smoke Extraction Ventilation, Emergency Power, and Evacuation Lights. Each control shows current status and allows manual override.',
    },
    {
      question: 'How long do emergency supplies last?',
      answer: 'The system maintains 10-day reserves of food, water, medical supplies, blankets, flashlights, and batteries. The "Supplies" tab shows real-time quantities, usage rates, and days remaining.',
    },
    {
      question: 'What is the Circuit Failure Prediction feature?',
      answer: 'AI-powered monitoring of electrical circuits that predicts failures before they happen. It shows load %, temperature, failure risk, and provides recommended solutions for each circuit.',
    },
  ];

  const handleDownloadManual = () => {
    toast.success("Downloading User Manual PDF...", {
      description: "SDRRS_User_Manual_v2.1.pdf"
    });
    const doc = setupSDRRSDoc("SDRRS User Manual (v2.1)");
    
    let y = 90;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("1. System Architecture & Overview", 20, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    y += 10;
    const desc1 = doc.splitTextToSize(
      "The Smart Disaster Response & Rescue System (SDRRS) is an enterprise-grade, comprehensive monitoring and management platform. It combines real-time occupant tracking via BLE/RFID, environmental sensing (gas, fire, vibration), and automated emergency response protocols deployed at the edge.", 
      170
    );
    doc.text(desc1, 20, y);
    
    y += 35;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("1.1 Core Components Matrix", 20, y);
    y += 10;
    
    y = drawTable(doc, y, {
      head: [['Component Layer', 'Technology Standard', 'Primary Function', 'Failover State']],
      body: [
        ['Sensing', 'MQTT / Zigbee', 'Environmental monitoring', 'Fallback to localized alerts'],
        ['Tracking', 'BLE 5.0 / RFID', 'Occupant localization', 'Last known location cached'],
        ['Actuation', 'Modbus TCP', 'Door locks, vents, alarms', 'Manual mechanical override'],
        ['Processing', 'Edge AI Cluster', 'Predictive failure analysis', 'Cloud sync disabled, local active']
      ],
      theme: 'grid'
    });

    doc.addPage();
    y = 40;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("2. Key Operational Guidelines & Triage", 20, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    y += 10;
    const desc2 = doc.splitTextToSize(
      "The SDRRS utilizes an automated triage scoring mechanism to assist command center operators in prioritizing rescue operations during critical events. The score is calculated deterministically based on real-time biometric and situational inputs.",
      170
    );
    doc.text(desc2, 20, y);

    y += 25;
    y = drawTable(doc, y, {
      head: [['Triage Score Range', 'Classification', 'Recommended Operator Action', 'Automated Response']],
      body: [
        ['80 - 100', 'CRITICAL', 'Dispatch Emergency Rescue Team immediately.', 'Direct path ventilation enabled.'],
        ['50 - 79', 'HIGH PRIORITY', 'Monitor closely. Prepare secondary rescue.', 'Audible alert directed to zone.'],
        ['20 - 49', 'ELEVATED', 'Verify evacuation compliance via CCTV.', 'Standard evacuation routing.'],
        ['0 - 19', 'NORMAL', 'No immediate action required.', 'None.']
      ],
      theme: 'grid'
    });

    addFooter(doc);
    doc.save("SDRRS_User_Manual_v2.1.pdf");
  };

  const handleWatchVideo = (videoName: string) => {
    toast.info(`Opening ${videoName}...`, {
      description: "Video player loading"
    });
    setIsVideoModalOpen(true);
  };

  const handleDownloadGuide = () => {
    toast.success("Downloading Emergency Drills Guide...", {
      description: "Emergency_Drills_Guide_2024.pdf"
    });
    const doc = setupSDRRSDoc("Emergency Drills Guide (2024)");
    
    let y = 90;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Standard Operating Procedures", 20, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    y += 15;
    const sopIntro = doc.splitTextToSize("This document outlines the mandatory emergency drill procedures for all personnel operating within the SDRRS coverage zone. Compliance and timely execution metrics are logged automatically by the system.", 170);
    doc.text(sopIntro, 20, y);

    y += 20;
    doc.setFont("helvetica", "bold");
    doc.text("PROCEDURE 1: FIRE & EVACUATION (Scheduled Monthly)", 20, y);
    doc.setFont("helvetica", "normal");
    y += 8;
    
    y = drawTable(doc, y, {
      head: [['Step', 'Action', 'Responsible Role', 'Time KPI']],
      body: [
        ['1', 'Trigger "Building Alarm" in Training Mode', 'Safety Officer', '< 1 min'],
        ['2', 'Verify Automated Doors Unlock', 'Control Center Operator', 'Instant'],
        ['3', 'Follow Designated Evacuation Routes', 'All Personnel', '< 3 mins'],
        ['4', 'Verify Zone Clear on Dashboard Map', 'Floor Wardens', '< 4 mins'],
        ['5', 'Headcount Verification at Assembly Point', 'HR Representative', '< 5 mins']
      ],
      theme: 'grid'
    });

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("PROCEDURE 2: CHEMICAL LEAK (Scheduled Bi-annually)", 20, y);
    doc.setFont("helvetica", "normal");
    y += 8;

    y = drawTable(doc, y, {
      head: [['Step', 'Action', 'Responsible Role', 'Time KPI']],
      body: [
        ['1', 'Simulate Gas Sensor Trigger in "Zone R&D"', 'Safety Officer', '< 1 min'],
        ['2', 'Verify Smoke Extraction Ventilation Active', 'Facilities Manager', 'Instant'],
        ['3', 'Isolate Air Handlers to Prevent Spread', 'HVAC Engineer', '< 1 min'],
        ['4', 'Evacuate Affected Floor to Safe Distance', 'Floor Wardens', '< 2 mins'],
        ['5', 'Dispatch Internal HazMat Response Team', 'Security Director', '< 5 mins']
      ],
      theme: 'grid'
    });

    addFooter(doc);
    doc.save("SDRRS_Emergency_Drills_Guide_2024.pdf");
  };

  const handleOpenConfiguration = () => {
    toast.success("Downloading Advanced Configuration Guide...", {
      description: "SDRRS_Advanced_Configuration_Admin.pdf"
    });
    const doc = setupSDRRSDoc("SDRRS Administrator Config");
    
    let y = 90;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("1. System Architecture Overview", 20, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    y += 10;
    const desc1 = doc.splitTextToSize(
      "The SDRRS utilizes a highly available microservices architecture bridging the React front-end (Vite) with a distributed hardware layer using MQTT/WebSockets. The local network cluster processes edge AI for Circuit Failure Prediction autonomously without cloud dependencies.", 
      170
    );
    doc.text(desc1, 20, y);
    
    y += 30;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("2. Sensor Calibration Matrix", 20, y);
    y += 10;
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    y = drawTable(doc, y, {
      head: [['Sensor Type', 'Calibration Frequency', 'Method', 'Tolerance']],
      body: [
        ['Temperature/Humidity', 'Quarterly', 'Software Offset via Service Port 8081', '+/- 0.5°C'],
        ['Chemical/Gas Membrane', 'Annually', 'Physical Membrane Replacement', 'Zero-point air'],
        ['Structural Vibration', 'Never', 'Factory Calibrated', 'Do not alter analog'],
        ['Smoke / Particulate', 'Bi-annually', 'Compressed air clearing / Test button', 'N/A']
      ],
      theme: 'grid'
    });
    
    doc.addPage();
    y = 40;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("3. Role-Based Access Control (RBAC)", 20, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    y += 10;
    const rbacDesc = doc.splitTextToSize(
      "Identity management is handled strictly at the edge to ensure availability during network severances. The system enforces strict separation of duties.",
      170
    );
    doc.text(rbacDesc, 20, y);

    y += 20;
    y = drawTable(doc, y, {
      head: [['Role', 'Dashboard Access', 'Hardware Controls', 'Reports Access']],
      body: [
        ['ADMIN', 'Full Access', 'Full Override Capabilities', 'Read / Download'],
        ['STAFF', 'Monitoring & Evacuation Views Only', 'Locked Out', 'Hidden']
      ],
      theme: 'grid'
    });

    addFooter(doc);
    doc.save("SDRRS_Advanced_Configuration_Admin.pdf");
  };

  return (
    <div className="space-y-6">
      {/* Quick Help */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-info" />
            Quick Help
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="secondary" className="h-auto py-4 flex-col gap-2">
              <Phone className="w-6 h-6 text-info" />
              <span>24/7 Support Line</span>
              <span className="text-xs text-muted-foreground">1800-SAFETY-01</span>
            </Button>
            <Button variant="secondary" className="h-auto py-4 flex-col gap-2">
              <Mail className="w-6 h-6 text-info" />
              <span>Email Support</span>
              <span className="text-xs text-muted-foreground">support@sdrrs.com</span>
            </Button>
            <Button 
              variant="secondary" 
              className="h-auto py-4 flex-col gap-2"
              onClick={() => handleWatchVideo("Video Tutorials")}
            >
              <Video className="w-6 h-6 text-info" />
              <span>Video Tutorials</span>
              <span className="text-xs text-muted-foreground">Watch training videos</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-info" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Emergency Procedures */}
      <Card className="border-danger/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-danger">
            <Shield className="w-5 h-5" />
            Emergency Procedures Quick Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-danger/10 rounded-lg border border-danger/30">
              <h4 className="font-bold text-danger mb-2">🔥 Fire Emergency</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Verify fire location via CCTV</li>
                <li>Activate building alarm (if not auto-triggered)</li>
                <li>Enable sprinklers in affected zones</li>
                <li>Alert Fire Department (101)</li>
                <li>Monitor evacuation progress</li>
                <li>Coordinate rescue for stuck occupants</li>
              </ol>
            </div>
            <div className="p-4 bg-warning/10 rounded-lg border border-warning/30">
              <h4 className="font-bold text-warning mb-2">⚠️ Gas Leak</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Confirm gas sensor readings</li>
                <li>Activate smoke extraction ventilation</li>
                <li>Open emergency exits</li>
                <li>Cut power to affected zones</li>
                <li>Alert emergency services</li>
                <li>Evacuate via safe routes</li>
              </ol>
            </div>
            <div className="p-4 bg-info/10 rounded-lg border border-info/30">
              <h4 className="font-bold text-info mb-2">🏗️ Structural Damage</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Check vibration sensor data</li>
                <li>Identify affected zones on map</li>
                <li>Mark evacuation paths as blocked</li>
                <li>Prioritize rescue in affected areas</li>
                <li>Use CCTV to assess damage</li>
                <li>Alert structural engineers</li>
              </ol>
            </div>
            <div className="p-4 bg-safe/10 rounded-lg border border-safe/30">
              <h4 className="font-bold text-safe mb-2">✅ All Clear Procedure</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Verify all occupants accounted for</li>
                <li>Confirm all sensors show safe levels</li>
                <li>Deactivate emergency alarms</li>
                <li>Generate incident report</li>
                <li>Notify rescue teams of stand-down</li>
                <li>Document lessons learned</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-info" />
            Training Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="secondary" 
              className="h-auto py-4 flex-col gap-2"
              onClick={handleDownloadManual}
            >
              <FileText className="w-6 h-6 text-info" />
              <span className="text-sm font-medium">User Manual</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Download className="w-3 h-3" /> PDF Download
              </span>
            </Button>
            <Button 
              variant="secondary" 
              className="h-auto py-4 flex-col gap-2"
              onClick={() => handleWatchVideo("Basic Training")}
            >
              <PlayCircle className="w-6 h-6 text-info" />
              <span className="text-sm font-medium">Basic Training</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Video className="w-3 h-3" /> 15 min video
              </span>
            </Button>
            <Button 
              variant="secondary" 
              className="h-auto py-4 flex-col gap-2"
              onClick={handleDownloadGuide}
            >
              <Shield className="w-6 h-6 text-info" />
              <span className="text-sm font-medium">Emergency Drills</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Download className="w-3 h-3" /> PDF Guide
              </span>
            </Button>
            <Button 
              variant="secondary" 
              className="h-auto py-4 flex-col gap-2"
              onClick={handleOpenConfiguration}
            >
              <FileText className="w-6 h-6 text-info" />
              <span className="text-sm font-medium">Advanced Config</span>
              <span className="text-xs text-muted-foreground">Admin Guide</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <VideoModal
        open={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        title="SDRRS Basic Training Overview"
        videoSrc="/assets/training-video.mp4"
      />
    </div>
  );
}
