import { useEffect, useState, useCallback } from 'react';

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

// Helper for Haversine distance
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // metres
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export function useVolunteerAlert() {
  const [connected, setConnected] = useState(false);
  const [deviceCount, setDeviceCount] = useState(0);
  const [incomingAlert, setIncomingAlert] = useState<VolunteerAlertPayload | null>(null);
  const [proximityAlert, setProximityAlert] = useState<any | null>(null);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    let es: EventSource;
    let retryTimer: ReturnType<typeof setTimeout>;

    const connect = () => {
      try {
        es = new EventSource(`${SERVER}/events`);

        es.onopen = () => setConnected(true);

        es.onerror = () => {
          setConnected(false);
          es.close();
          // Retry in 3 seconds
          retryTimer = setTimeout(connect, 3000);
        };

        // Spring SseEmitter uses named events
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
            const data = JSON.parse(e.data);
            setProximityAlert(data);
            if ('vibrate' in navigator) navigator.vibrate([500, 100, 500, 100, 500]);
            if (Notification.permission === 'granted') {
              new Notification('🚨 DISASTER RADIUS ALERT', {
                body: `Emergency within 2km! Tap to see details.`,
                icon: '/favicon.ico',
              });
            }
          } catch (_) {}
        });

      } catch (_) {
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
      await fetch(`${SERVER}/broadcast-proximity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.error('Failed to broadcast proximity alert', e);
    }
  }, []);

  const dismissAlert = useCallback(() => setIncomingAlert(null), []);
  const dismissProximity = useCallback(() => setProximityAlert(null), []);

  return { connected, deviceCount, incomingAlert, proximityAlert, sendAlert, broadcastProximity, dismissAlert, dismissProximity };
}
