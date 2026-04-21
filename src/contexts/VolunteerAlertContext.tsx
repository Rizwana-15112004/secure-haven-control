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

export type StaffSosPayload = {
  staffName: string;
  floor: string;
  injured: string;
  details: string;
  timestamp: number;
  type?: string;
};

interface VolunteerAlertContextType {
  connected: boolean;
  deviceCount: number;
  incomingAlert: VolunteerAlertPayload | null;
  proximityAlert: any | null;
  staffSosAlert: StaffSosPayload | null;
  sendAlert: (payload: Omit<VolunteerAlertPayload, 'timestamp' | 'deviceCount'>) => Promise<void>;
  broadcastProximity: (data: any) => Promise<any>;
  triggerProximityAlert: (data: any) => void;
  dismissAlert: () => void;
  dismissProximity: () => void;
  dismissStaffSos: () => void;
  armBackgroundSystem: () => void;
}

const VolunteerAlertContext = createContext<VolunteerAlertContextType | undefined>(undefined);

export function VolunteerAlertProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [deviceCount, setDeviceCount] = useState(0);
  const [incomingAlert, setIncomingAlert] = useState<VolunteerAlertPayload | null>(null);
  const [proximityAlert, setProximityAlert] = useState<any | null>(null);
  const [staffSosAlert, setStaffSosAlert] = useState<StaffSosPayload | null>(null);
  const [lastMessageTime, setLastMessageTime] = useState<number>(Date.now());
  const [reconnectCount, setReconnectCount] = useState(0);
  const [keepAliveAudio] = useState(new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'));

  // Logic to prevent mobile OS from killing the connection
  useEffect(() => {
    const interval = setInterval(() => {
      // If we haven't heard anything for 5 minutes, the OS might have killed the network
      if (connected && Date.now() - lastMessageTime > 300000) {
        console.warn("Background Signal Lost. Attempting Hard Reconnect...");
        setReconnectCount(prev => prev + 1);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [connected, lastMessageTime]);

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
          setLastMessageTime(Date.now());
        };

        es.onerror = () => {
          console.log("SSE Connection error, retrying...");
          setConnected(false);
          es.close();
          retryTimer = setTimeout(connect, 3000);
        };

        es.onmessage = () => {
          setLastMessageTime(Date.now());
        };

        es.addEventListener('count', (e: any) => {
          setLastMessageTime(Date.now());
          try {
            const data = JSON.parse(e.data);
            setDeviceCount(data.count);
          } catch (_) {}
        });

        es.addEventListener('alert', (e: any) => {
          setLastMessageTime(Date.now());
          try {
            const alertData = JSON.parse(e.data) as VolunteerAlertPayload;
            setIncomingAlert(alertData);
            if ('vibrate' in navigator) navigator.vibrate([400, 200, 400, 200, 800]);
          } catch (_) {}
        });

        es.addEventListener('staff_sos', (e: any) => {
          setLastMessageTime(Date.now());
          try {
            const data = JSON.parse(e.data) as StaffSosPayload;
            console.log('📟 Staff SOS received:', data);
            setStaffSosAlert(data);
            if ('vibrate' in navigator) navigator.vibrate([300, 100, 300, 100, 600]);
            if (Notification.permission === 'granted') {
              new Notification('🆘 Staff Emergency Alert', {
                body: `${data.staffName} on Floor ${data.floor} needs help! Injured: ${data.injured}\n${data.details}`,
                icon: '/favicon.ico',
                requireInteraction: true,
                tag: 'staff-sos-' + Date.now(),
              } as any);
            }
          } catch (_) {}
        });

        es.addEventListener('proximity-alert', (e: any) => {
          setLastMessageTime(Date.now());
          try {
            console.log("Received proximity-alert:", e.data);
            const data = JSON.parse(e.data);
            setProximityAlert(data);
            
            // WAKE UP OS AUDIO
            keepAliveAudio.volume = 1.0;
            keepAliveAudio.currentTime = 0;
            keepAliveAudio.play().catch(() => {});
            
            // INTENSE VIBRATION
            if ('vibrate' in navigator) {
               navigator.vibrate([1000, 500, 1000, 500, 1000, 500, 2000]);
            }

            if (Notification.permission === 'granted') {
              const options = {
                body: `EMERGENCY: ${data.title}\nLOCATION: ${data.location}`,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                vibrate: [500, 100, 500, 100, 500, 100, 500],
                tag: 'emergency-' + Date.now(),
                requireInteraction: true,
                silent: false,
                renotify: true
              };

              if (document.hidden) {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.ready.then(registration => {
                    (registration as any).showNotification('🚨 DISASTER RADIUS ALERT', options);
                  });
                }
              } else {
                new Notification('🚨 DISASTER RADIUS ALERT', options as any);
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
    
    // Cross-tab Synchronization for Local Demo (BroadcastChannel)
    const channel = new BroadcastChannel('sdrrs_network_sync');
    channel.onmessage = (e) => {
      const { type, data } = e.data;
      if (type === 'VOLUNTEER_ALERT') {
        console.log('📡 Cross-tab Volunteer Alert:', data);
        setIncomingAlert(data);
        if ('vibrate' in navigator) navigator.vibrate([400, 200, 400, 200, 800]);
      } else if (type === 'PROXIMITY_ALERT') {
        console.log('📡 Cross-tab Proximity Alert:', data);
        setProximityAlert(data);
        // Intensity vibration and audio waking...
        keepAliveAudio.volume = 1.0;
        keepAliveAudio.currentTime = 0;
        keepAliveAudio.play().catch(() => {});
        if ('vibrate' in navigator) navigator.vibrate([1000, 500, 1000, 500, 2000]);
      } else if (type === 'DEVICE_PING') {
        // Mock device count increment for local demo
        setDeviceCount(prev => Math.max(prev, 1)); 
      }
    };
    
    // Periodic ping to show "connected" status in multiple tabs
    const pingInterval = setInterval(() => {
      channel.postMessage({ type: 'DEVICE_PING' });
    }, 2000);

    return () => {
      clearTimeout(retryTimer);
      clearInterval(pingInterval);
      es?.close();
      channel.close();
    };
  }, [keepAliveAudio, reconnectCount]);

  const sendAlert = useCallback(async (payload: Omit<VolunteerAlertPayload, 'timestamp' | 'deviceCount'>) => {
    const fullPayload = { 
      ...payload, 
      timestamp: new Date().toISOString(),
      deviceCount: deviceCount || 1
    };
    
    // 1. Sync across tabs immediately (Local Demo)
    const channel = new BroadcastChannel('sdrrs_network_sync');
    channel.postMessage({ type: 'VOLUNTEER_ALERT', data: fullPayload });
    channel.close();

    // 2. Try to hit the real server
    try {
      await fetch(`${SERVER}/send-alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullPayload),
      });
    } catch (e) {
      console.warn('Network server unreachable, relying on local broadcast.');
    }
  }, [deviceCount]);

  const broadcastProximity = useCallback(async (data: any) => {
    // 1. Sync across tabs immediately (Local Demo)
    const channel = new BroadcastChannel('sdrrs_network_sync');
    channel.postMessage({ type: 'PROXIMITY_ALERT', data });
    channel.close();

    // 2. Try to hit the real server
    try {
      const response = await fetch(`${SERVER}/broadcast-proximity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (e) {
      console.warn('Network server unreachable, relying on local broadcast.');
      return { ok: true, localOnly: true };
    }
  }, []);

  const dismissAlert = useCallback(() => setIncomingAlert(null), []);
  const dismissProximity = useCallback(() => setProximityAlert(null), []);
  const dismissStaffSos = useCallback(() => setStaffSosAlert(null), []);
  const triggerProximityAlert = useCallback((data: any) => setProximityAlert(data), []);

  return (
    <VolunteerAlertContext.Provider value={{ 
      connected, deviceCount, incomingAlert, proximityAlert, staffSosAlert,
      sendAlert, broadcastProximity, triggerProximityAlert, dismissAlert, dismissProximity,
      dismissStaffSos, armBackgroundSystem
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
