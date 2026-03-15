import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getAlertServerURL } from '@/config/api';

const SERVER = getAlertServerURL();

export type VolunteerAlertPayload = {
  id?: number;
  title: string;
  address: string;
  coords: string;
  contact: string;
  message: string;
  timestamp: string;
  deviceCount: number;
  adminLat?: number;
  adminLon?: number;
  radius?: number;
};

interface VolunteerAlertContextType {
  connected: boolean;
  deviceCount: number;
  incomingAlert: VolunteerAlertPayload | null;
  proximityAlert: any | null;
  sendAlert: (payload: Omit<VolunteerAlertPayload, 'timestamp' | 'deviceCount'>) => Promise<void>;
  broadcastProximity: (data: any) => Promise<any>;
  triggerProximityAlert: (data: any) => void;
  dismissAlert: () => void;
  dismissProximity: () => void;
  armBackgroundSystem: () => void;
}

const VolunteerAlertContext = createContext<VolunteerAlertContextType | undefined>(undefined);

export function VolunteerAlertProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [deviceCount, setDeviceCount] = useState(0);
  const [incomingAlert, setIncomingAlert] = useState<VolunteerAlertPayload | null>(null);
  const [proximityAlert, setProximityAlert] = useState<any | null>(null);
  const [keepAliveAudio] = useState(new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'));

  const armBackgroundSystem = useCallback(() => {
    keepAliveAudio.volume = 0.01; // Almost silent but keeps process alive
    keepAliveAudio.loop = true;
    keepAliveAudio.play().catch(e => console.log("Audio ARM failed:", e));
    console.log("OS-Level Background Listener Armed via Audio Keep-Alive");
  }, [keepAliveAudio]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    let es: EventSource;
    let retryTimer: ReturnType<typeof setTimeout>;

    const connect = () => {
      try {
        console.log("Connecting to SSE:", `${SERVER}/events`);
        es = new EventSource(`${SERVER}/events`);

        es.onopen = () => {
          console.log("SSE Connection opened");
          setConnected(true);
        };

        es.onerror = () => {
          console.log("SSE Connection error, retrying...");
          setConnected(false);
          es.close();
          retryTimer = setTimeout(connect, 3000);
        };

        es.addEventListener('count', (e: any) => {
          try {
            const data = JSON.parse(e.data);
            setDeviceCount(data.count);
          } catch (_) {}
        });

        es.addEventListener('alert', (e: any) => {
          try {
            const alertData = JSON.parse(e.data) as VolunteerAlertPayload;
            setIncomingAlert(alertData);
            if ('vibrate' in navigator) navigator.vibrate([400, 200, 400, 200, 800]);
          } catch (_) {}
        });

        es.addEventListener('proximity-alert', (e: any) => {
          try {
            console.log("Received proximity-alert:", e.data);
            const data = JSON.parse(e.data);
            setProximityAlert(data);
            
            // WAKE UP OS AUDIO
            keepAliveAudio.volume = 1.0;
            keepAliveAudio.play().catch(() => {});
            
            if ('vibrate' in navigator) navigator.vibrate([1000, 200, 1000, 200, 1000]);

            if (Notification.permission === 'granted') {
              if (document.hidden) {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.ready.then(registration => {
                    (registration as any).showNotification('🚨 DISASTER RADIUS ALERT', {
                      body: `Emergency Alert: ${data.title}`,
                      icon: '/favicon.ico',
                      vibrate: [500, 100, 500, 100, 500],
                      tag: 'emergency-proximity-alert',
                      requireInteraction: true
                    });
                  });
                }
              } else {
                new Notification('🚨 DISASTER RADIUS ALERT', {
                  body: `Emergency Alert: ${data.title}`,
                  icon: '/favicon.ico',
                });
              }
            }
          } catch (err) {
            console.error("Error parsing proximity alert:", err);
          }
        });

      } catch (err) {
        console.error("SSE Startup Error:", err);
        setConnected(false);
        retryTimer = setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      clearTimeout(retryTimer);
      es?.close();
    };
  }, []);

  const sendAlert = useCallback(async (payload: Omit<VolunteerAlertPayload, 'timestamp' | 'deviceCount'>) => {
    try {
      await fetch(`${SERVER}/send-alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...payload, 
          timestamp: new Date().toISOString() 
        }),
      });
    } catch (e) {
      console.error('Failed to send alert', e);
    }
  }, []);

  const broadcastProximity = useCallback(async (data: any) => {
    try {
      const response = await fetch(`${SERVER}/broadcast-proximity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (e) {
      console.error('Failed to broadcast proximity alert', e);
      throw e;
    }
  }, []);

  const dismissAlert = useCallback(() => setIncomingAlert(null), []);
  const dismissProximity = useCallback(() => setProximityAlert(null), []);
  const triggerProximityAlert = useCallback((data: any) => setProximityAlert(data), []);

  return (
    <VolunteerAlertContext.Provider value={{ 
      connected, deviceCount, incomingAlert, proximityAlert, 
      sendAlert, broadcastProximity, triggerProximityAlert, dismissAlert, dismissProximity,
      armBackgroundSystem
    }}>
      {children}
    </VolunteerAlertContext.Provider>
  );
}

export function useVolunteerAlert() {
  const context = useContext(VolunteerAlertContext);
  if (context === undefined) {
    throw new Error('useVolunteerAlert must be used within a VolunteerAlertProvider');
  }
  return context;
}
