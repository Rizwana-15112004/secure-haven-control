import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, AlertTriangle, HeartHandshake, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEmergencyAlerts } from "@/contexts/EmergencyAlertContext";
import { getAlertServerURL } from "@/config/api";
import { db } from "@/db"; // <-- Import your new offline database here

type Message = {
  id: string;
  from: 'bot' | 'user';
  text: string;
};

type FlowStep = 'idle' | 'ask_name' | 'ask_floor' | 'ask_injured' | 'ask_details' | 'done';

export function HelpChat() {
  const { role } = useAuth();
  const { addAlert } = useEmergencyAlerts();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<FlowStep>('idle');
  const [staffName, setStaffName] = useState('');
  const [floor, setFloor] = useState('');
  const [injured, setInjured] = useState('');

  // Initialize messages normally
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'bot',
      text: '👋 Hello! I\'m your Secure Haven safety assistant.\n\nType <b>help</b> anytime to request emergency assistance from the admin team.',
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (role !== 'staff') return null;

  const addBotMsg = (text: string, delay = 500) => {
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), from: 'bot', text }]);
    }, delay);
  };

  // Make this function async so we can use await for fetch and Dexie
  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), from: 'user', text }]);
    setInput('');

    if (step === 'idle') {
      if (text.toLowerCase().includes('help')) {
        setStep('ask_name');
        addBotMsg('🆘 I\'m here to help! First, <b>what is your name?</b>');
      } else {
        addBotMsg('Type <b>help</b> to request emergency assistance from the admin team.');
      }

    } else if (step === 'ask_name') {
      setStaffName(text);
      setStep('ask_floor');
      addBotMsg(`Hello, <b>${text}</b>! 🏢 <b>Which floor are you on right now?</b>\n\nPlease type the floor number (e.g. 1, 2, 3…)`);

    } else if (step === 'ask_floor') {
      setFloor(text);
      setStep('ask_injured');
      addBotMsg(`Got it — Floor <b>${text}</b>.\n\n⚕️ <b>Is anyone injured?</b> Type <b>yes</b> or <b>no</b>.`);

    } else if (step === 'ask_injured') {
      setInjured(text);
      setStep('ask_details');
      const isYes = text.toLowerCase().includes('yes');
      addBotMsg(isYes
        ? '🚑 Please stay calm — help is on the way!\n\n<b>Briefly describe what happened</b> (e.g. "fell from stairs", "chest pain", "fire on floor 3")'
        : '✅ Good. <b>Briefly describe what you need help with.</b>');

    } else if (step === 'ask_details') {
      setStep('done');

      const alertPayload = {
        staffName: staffName,
        floor: floor,
        injured: injured,
        details: text,
        timestamp: Date.now() // Add a timestamp for the offline queue
      };

      // 1. Keep pushing to global context so it updates the local UI immediately
      addAlert(alertPayload);

      try {
        const alertServer = getAlertServerURL();
        
        await fetch(`${alertServer}/send-alert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'staff_sos', ...alertPayload })
        });
        console.log("SOS sent securely to the Command Center!");
      } catch (error) {
        console.warn("User is offline. Saving SOS to local queue for background sync.");
        await db.sosQueue.add(alertPayload);
      }

      addBotMsg(
        `✅ <b>Your alert has been recorded!</b>\n\n` +
        `📍 <b>Floor:</b> ${floor}\n` +
        `👤 <b>Name:</b> ${staffName}\n` +
        `⚕️ <b>Injured:</b> ${injured}\n` +
        `📝 <b>Situation:</b> ${text}\n\n` +
        `---\n\n` +
        `🛡️ <b>We are near you — please do NOT panic.</b>\n\n` +
        `Our response team has been alerted and is heading to Floor <b>${floor}</b> right now. ` +
        `Stay in a safe spot, keep calm, and keep this chat open.\n\n` +
        `Type <b>help</b> again if the situation changes.`,
        600
      );

    } else if (step === 'done') {
      if (text.toLowerCase().includes('help')) {
        setStep('ask_name');
        setStaffName(''); setFloor(''); setInjured('');
        addBotMsg('🔴 Re-alerting! <b>What is your name?</b>');
      } else {
        addBotMsg('Our team is on the way. Stay calm. Type <b>help</b> if the situation changes.');
      }
    }
  };

  // ... The rest of your UI rendering code remains exactly the same below this line ...
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <div className="bg-destructive text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md animate-bounce">
          🆘 Need Help?
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.5)] bg-destructive hover:bg-destructive/90 transition-all hover:scale-110 active:scale-95"
          size="icon"
        >
          <AlertTriangle className="h-7 w-7" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-[400px] max-w-[calc(100vw-2rem)] h-[580px] shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-5 bg-card border-destructive/40 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-destructive/5">
        <CardTitle className="text-base flex items-center gap-2">
          <div className="bg-destructive/15 p-1.5 rounded-lg">
            <Shield className="h-4 w-4 text-destructive" />
          </div>
          <div className="flex flex-col">
            <span>Emergency Help</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-normal">Secure Haven Staff</span>
          </div>
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-0 flex flex-col flex-1 overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.from === 'bot' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 border border-destructive/20">
                    <HeartHandshake className="h-4 w-4 text-destructive" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2.5 max-w-[85%] text-sm leading-relaxed ${msg.from === 'user'
                    ? 'bg-primary text-white rounded-tr-sm'
                    : 'bg-muted rounded-tl-sm border border-border'
                    }`}
                  dangerouslySetInnerHTML={{
                    __html: msg.text
                      .replace(/\n---\n/g, '<hr class="my-2 border-border"/>')
                      .replace(/\n/g, '<br/>')
                  }}
                />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-card">
          <div className="flex gap-2">
            <Input
              placeholder={step === 'idle' ? 'Type "help" for emergency…' : 'Type your answer…'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="rounded-xl flex-1 bg-secondary/20 border-destructive/10 focus-visible:ring-destructive/30"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              size="icon"
              className="rounded-xl bg-destructive hover:bg-destructive/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-center mt-2 text-muted-foreground">For life-threatening emergencies, also call 911 immediately.</p>
        </div>
      </CardContent>
    </Card>
  );
}