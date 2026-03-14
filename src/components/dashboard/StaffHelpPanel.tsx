import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  AlertTriangle,
  Phone,
  MapPin,
  HeartHandshake,
  ShieldAlert,
  LogOut,
  Flame,
  Wind,
  Activity,
  CheckCircle,
  MessageSquare,
  Info
} from "lucide-react";

export function StaffHelpPanel() {
  return (
    <div className="space-y-6">

      {/* Emergency Contacts */}
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Phone className="w-5 h-5" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Fire Department", number: "101", icon: Flame, color: "text-orange-500" },
              { label: "Ambulance", number: "102", icon: Activity, color: "text-red-500" },
              { label: "Police", number: "100", icon: ShieldAlert, color: "text-blue-500" },
              { label: "Building Safety Line", number: "1800-SAFETY-01", icon: Phone, color: "text-green-500" },
              { label: "Facility Manager", number: "Ext. 501", icon: Info, color: "text-yellow-500" },
              { label: "Security Desk", number: "Ext. 100", icon: ShieldAlert, color: "text-purple-500" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted border">
                <c.icon className={`h-5 w-5 shrink-0 ${c.color}`} />
                <div>
                  <p className="text-sm font-semibold">{c.label}</p>
                  <p className="text-xs text-muted-foreground">{c.number}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How to Request Help */}
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            How to Request Emergency Help
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Use the red <strong>🆘 "Need Help?"</strong> button at the bottom-right of your screen to send an instant alert to the admin team. Follow these steps:</p>
          <div className="space-y-2">
            {[
              { step: "1", text: 'Tap the red button and type "help"' },
              { step: "2", text: "Enter your name when asked" },
              { step: "3", text: "Tell us which floor you are on" },
              { step: "4", text: "Tell us if anyone is injured (yes/no)" },
              { step: "5", text: "Briefly describe the situation" },
              { step: "6", text: "Admin is immediately notified. Stay calm — help is on the way!" },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <Badge variant="destructive" className="mt-0.5 h-6 w-6 shrink-0 flex items-center justify-center rounded-full p-0 text-xs">{s.step}</Badge>
                <p className="text-sm">{s.text}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Procedures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Staff Emergency Procedures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
              <h4 className="font-bold text-orange-500 mb-2 flex items-center gap-2"><Flame className="h-4 w-4" /> 🔥 Fire / Smoke</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                <li>Stay low if there is smoke</li>
                <li>Do <strong>NOT</strong> use the elevator</li>
                <li>Follow the green evacuation signs</li>
                <li>Go to the nearest emergency exit</li>
                <li>Report to assembly point outside</li>
                <li>Use the Help Chat to alert admin</li>
              </ol>
            </div>
            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              <h4 className="font-bold text-yellow-500 mb-2 flex items-center gap-2"><Wind className="h-4 w-4" /> ⚠️ Gas Leak / Smell</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                <li>Do <strong>NOT</strong> switch any lights/switches</li>
                <li>Cover your nose and mouth</li>
                <li>Leave the area immediately</li>
                <li>Open windows/doors if safe to do so</li>
                <li>Call Security Desk (Ext. 100)</li>
                <li>Alert admin via Help Chat</li>
              </ol>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <h4 className="font-bold text-blue-500 mb-2 flex items-center gap-2"><Activity className="h-4 w-4" /> 🏥 Medical Emergency</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                <li>Call Ambulance (102) immediately</li>
                <li>Do not move the injured person</li>
                <li>Keep them calm and comfortable</li>
                <li>Apply first aid if trained</li>
                <li>Alert admin via Help Chat with floor</li>
                <li>Send someone to meet the ambulance</li>
              </ol>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
              <h4 className="font-bold text-green-500 mb-2 flex items-center gap-2"><LogOut className="h-4 w-4" /> ✅ Safe Evacuation</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                <li>Follow the floor warden's instructions</li>
                <li>Do NOT use the elevator</li>
                <li>Take the nearest stairway down</li>
                <li>Assist colleagues if it's safe to do so</li>
                <li>Move to the building assembly area</li>
                <li>Do not re-enter until given all-clear</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evacuation Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-info" />
            Evacuation Routes & Assembly Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              { floor: "Floors 1–3", exit: "Main Lobby – Exit A (South Gate)", assembly: "Parking Lot A" },
              { floor: "Floors 4–6", exit: "East Stairwell – Exit B", assembly: "Garden Area (East)" },
              { floor: "Floors 7–9", exit: "West Stairwell – Exit C", assembly: "Main Road (West)" },
              { floor: "Floor 10+", exit: "Central Core Stairwell – Exit D", assembly: "Visitor Car Park" },
            ].map((r) => (
              <div key={r.floor} className="p-3 rounded-lg bg-muted border flex flex-col gap-1">
                <p className="font-semibold">{r.floor}</p>
                <p className="text-muted-foreground text-xs">🚪 Exit: {r.exit}</p>
                <p className="text-muted-foreground text-xs">📍 Assembly: {r.assembly}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Staff FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-info" />
            Frequently Asked Questions (Staff)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "What should I do if I feel unsafe but there is no obvious emergency?",
                a: "Use the Help Chat button at the bottom-right and type 'help'. Describe what you see or feel — even if you're unsure, it's always better to report. Your admin team will assess the situation."
              },
              {
                q: "What do the building alarm sounds mean?",
                a: "A continuous alarm means evacuate immediately. An intermittent beep means 'alert — stay in place and await instructions'. Always follow the floor warden's guidance."
              },
              {
                q: "Can I use the elevator during an emergency?",
                a: "NO. Never use the elevator during a fire or structural emergency. Always use the designated stairwells for your floor as listed in the Evacuation Routes above."
              },
              {
                q: "What is the assembly point for my floor?",
                a: "Refer to the Evacuation Routes section above. Your floor warden will also guide you. Once outside, do not leave until you have been accounted for."
              },
              {
                q: "What if I find someone who needs help but I cannot move them?",
                a: "Alert admin immediately via the Help Chat with the floor and location. Also call 102 (Ambulance). Stay with the person, keep them calm, and do not attempt to move them unless there is immediate danger."
              },
              {
                q: "What monitoring info can I see on this dashboard?",
                a: "As staff, you can see the Building Map and Evacuation Progress to understand which zones are safe or in danger. Use this to make informed decisions about your evacuation route."
              }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Do & Don't */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Quick Do's & Don'ts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="font-semibold text-green-600 text-sm mb-2">✅ DO:</p>
              {["Stay calm and don't panic", "Follow your floor warden", "Use stairwells only", "Alert admin via Help Chat", "Help colleagues if it's safe to", "Report any suspicious activity"].map(d => (
                <p key={d} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="text-green-500">✓</span> {d}
                </p>
              ))}
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-destructive text-sm mb-2">❌ DON'T:</p>
              {["Use the elevator during emergencies", "Re-enter until all-clear", "Block emergency exits", "Ignore alarms thinking it's a drill", "Delay reporting suspicious things", "Try to fight a fire alone"].map(d => (
                <p key={d} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="text-destructive">✗</span> {d}
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
