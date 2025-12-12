import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  BookOpen, 
  Phone, 
  Mail, 
  Video,
  FileText,
  Shield,
  AlertTriangle,
  Users,
  Monitor,
  Radio,
  Zap,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function HelpPanel() {
  const modules = [
    {
      id: 'module1',
      title: 'Module 1: Offline Hardware Layer',
      icon: Zap,
      description: 'Life-Safety Guarantee - Works even during power failure',
      features: [
        'UPS-powered hardware ensuring 24/7 operation',
        'Multi-hazard sensors: Fire, Smoke, CO Gas, Overheating, Vibration/Tilt',
        'BLE Beacon Network for offline indoor geolocation',
        'Virtual ID Card Device for occupant tracking (T-UID)',
        'Local SSD for offline 24/7 CCTV storage',
        'Immediate automated alerts: Siren, Red Lights, Voice Guidance',
      ],
    },
    {
      id: 'module2',
      title: 'Module 2: Online Cloud & Admin Command Center',
      icon: Monitor,
      description: 'Centralized control and monitoring dashboard',
      features: [
        'Admin-only secure login (Role-based access)',
        'Employee details, health conditions, injury status management',
        'Dynamic triage calculation for rescue prioritization',
        'Real-time indoor map visualization with GPS coordinates (Lat/Long)',
        'Manual override controls: alarms, sprinklers, doors, ventilation',
        'Live CCTV monitoring across all floors',
      ],
    },
    {
      id: 'module3',
      title: 'Module 3: External Emergency & Volunteer Alert System',
      icon: Radio,
      description: 'Automatic alerts to government rescue teams',
      features: [
        'GSM module sends instant SMS alerts without internet',
        'Automatic notification to Fire (101), Ambulance (108), Police (100)',
        'Volunteer pop-up alerts within 2km radius',
        'Dedicated SIM for reliable SMS transmission',
        'Works even during network outages',
      ],
    },
    {
      id: 'module4',
      title: 'Module 4: Offline Footage Retrieval System',
      icon: Video,
      description: 'Continuous recording even during collapse',
      features: [
        'Cameras record 24/7 to local SSD storage',
        'Footage survives building damage due to protected storage',
        'Local Wi-Fi link between hardware and Admin App',
        'Secure retrieval of stored CCTV footage',
        'Helps identify trapped survivors and structural conditions',
      ],
    },
    {
      id: 'module5',
      title: 'Module 5: Smart Evacuation & Survival System',
      icon: Shield,
      description: 'Dynamic escape routing and survival resources',
      features: [
        'LED floor indicators guide safest route dynamically',
        'Hazard-aware path switching (green = safe, red = danger)',
        'First-aid and survival packs accessible for 10 days',
        'Emergency supplies tracking (food, water, medical)',
        'Automatic casualty assessment using T-UID logs',
      ],
    },
  ];

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
            <Button variant="secondary" className="h-auto py-4 flex-col gap-2">
              <Video className="w-6 h-6 text-info" />
              <span>Video Tutorials</span>
              <span className="text-xs text-muted-foreground">Watch training videos</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-info" />
            System Modules Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <AccordionItem key={module.id} value={module.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <div className="p-2 bg-info/10 rounded-lg">
                        <Icon className="w-5 h-5 text-info" />
                      </div>
                      <div>
                        <p className="font-medium">{module.title}</p>
                        <p className="text-xs text-muted-foreground">{module.description}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 pl-12">
                      {module.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <ChevronRight className="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
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
            <Button variant="secondary" className="h-auto py-4 flex-col gap-2">
              <FileText className="w-6 h-6 text-info" />
              <span className="text-sm">User Manual (PDF)</span>
            </Button>
            <Button variant="secondary" className="h-auto py-4 flex-col gap-2">
              <Video className="w-6 h-6 text-info" />
              <span className="text-sm">Basic Training Video</span>
            </Button>
            <Button variant="secondary" className="h-auto py-4 flex-col gap-2">
              <Shield className="w-6 h-6 text-info" />
              <span className="text-sm">Emergency Drills Guide</span>
            </Button>
            <Button variant="secondary" className="h-auto py-4 flex-col gap-2">
              <ExternalLink className="w-6 h-6 text-info" />
              <span className="text-sm">Advanced Configuration</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
